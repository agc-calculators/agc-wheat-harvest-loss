/*! Built with http://stenciljs.com */
import { h } from '../agc-wheat-harvest-loss.core.js';

const validate = (form, name) => {
    let el = form.querySelector(`[name="${name}"]`);
    let message = form.querySelector(`[data-validates="${name}"`);
    if (!el.checkValidity()) {
        if (el.className.indexOf('invalid') === -1) {
            el.className += " invalid";
        }
        message.style.display = 'block';
        return false;
    }
    else {
        el.className = el.className.replace(" invalid", "");
        message.style.display = 'none';
    }
    return true;
};
const matches = (el, selector) => {
    return el.matches.call(el, selector);
};
const mapEnterKey = (form) => {
    return (e) => {
        let self = document.querySelector(':focus');
        let elements = Array.from(form.querySelectorAll('input, a, select, button, textarea')).map(c => c);
        if (!self || self.classList.contains('agc-wizard__actions-next')) {
            return;
        }
        const enterKey = () => {
            if (e.which === 13 && !matches(self, 'textarea')) {
                if (elements.indexOf(self) && !matches(self, 'a') && !matches(self, 'button')) {
                    e.preventDefault();
                }
                var next = elements[elements.indexOf(self) + (e.shiftKey ? -1 : 1)];
                if (next) {
                    next.focus();
                }
                else {
                    elements[0].focus();
                }
                let inp = next;
                if (inp && 'select' in inp) {
                    inp.select();
                }
                let prevInp = self;
                if (prevInp && prevInp.willValidate) {
                    validate(form, prevInp.name);
                }
            }
        };
        enterKey();
    };
};
const round = (num, places) => {
    return +(Math.round(new Number(`${num}e+${places}`).valueOf()) + "e-" + places);
};

class AgcWheatHarvestLoss {
    constructor() {
        this.socket = "";
        this.tract = "";
        this.mode = 'step';
        this.units = { lossArea: 'sq. ft', yieldLoss: 'bu/acre' };
        this.currentStep = 0;
        this.cache = {};
        this.submitted = false;
        this.results = {};
    }
    render() {
        return (h("div", null,
            h("form", { onSubmit: (e) => e.preventDefault(), ref: c => this.form = c, "data-wizard": "agc-wheat-harvest", "data-wizard-mode": this.mode, class: "agc-wizard" },
                h("slot", null),
                h("section", { "data-wizard-section": "1" },
                    h("div", { class: "agc-wizard__field" },
                        h("label", { "data-i18n": "fields.kernals-counted" }, "Kernals Counted"),
                        h("input", { name: "kernalsCounted", type: "number", required: true, min: "0", step: "1" }),
                        h("p", { class: "agc-wizard__validation-message", "data-i18n": "validation.kernals-counted.required", "data-validates": "kernalsCounted" }, "Please enter a whole number of zero or greater."),
                        h("p", { "data-i18n": `hints.kernals-counted` }, "\u2BA4 Enter the number of kernals counted on the ground within the specified area.")),
                    h("div", { class: "agc-wizard__actions" }, this.mode === 'step' && h("button", { class: "agc-wizard__actions-next", "data-i18n": "actions.next", onClick: this.nextPrev.bind(this, 1) }, "Next \uD83E\uDC16"))),
                h("section", { "data-wizard-section": "2" },
                    h("div", { class: "agc-wizard__field" },
                        h("label", { "data-i18n": "fields.loss-area" }, "Area Measured"),
                        h("input", { name: "lossArea", type: "number", min: "1", step: "1", required: true }),
                        h("p", { class: "agc-wizard__validation-message", "data-i18n": "validation.loss-area.required", "data-validates": "lossArea" }, "Please enter a whole number value of 1 or more."),
                        h("p", { "data-i18n": `hints.loss-area.${this.units['lossArea']}` },
                            "\u2BA4 Enter the area in ",
                            this.units['lossArea'],
                            " that was used to count kernals on the ground.")),
                    h("div", { class: "agc-wizard__actions" },
                        this.mode === 'step' && h("button", { class: "agc-wizard__actions-back", "data-i18n": "actions.back", onClick: this.nextPrev.bind(this, -1) }, "\uD83E\uDC14 Back"),
                        h("button", { class: "agc-wizard__actions-next", "data-i18n": "actions.finish", onClick: this.nextPrev.bind(this, this.mode === 'step' ? 1 : 3) }, "Calculate \uD83E\uDC16"))),
                h("section", { "data-wizard-results": true },
                    h("slot", { name: "results" })))));
    }
    showTab(n) {
        if (this.mode === 'step') {
            this.cache['sections'][n].style.display = "block";
        }
        if (this.socket) {
            this.agcStepChanged.emit({ socket: this.socket, tract: this.tract, step: this.currentStep });
        }
    }
    reset() {
        this.currentStep = 0;
        this.submitted = false;
        this.showTab(0);
    }
    validateForm() {
        let valid = true;
        if (this.currentStep === 0 || this.mode === 'full') {
            if (!validate(this.form, 'kernalsCounted')) {
                valid = false;
            }
        }
        if (this.currentStep === 1 || this.mode === 'full') {
            if (!validate(this.form, 'lossArea')) {
                valid = false;
            }
        }
        return valid;
    }
    nextPrev(n, e) {
        e && e.preventDefault();
        let focused = this.form.querySelector(':focus');
        if (!focused.classList.contains('agc-wizard__actions-next')) {
            return;
        }
        if (this.mode === 'full') {
            if (!this.validateForm())
                return false;
        }
        else if (n == 1 && !this.validateForm())
            return false;
        if (this.mode === 'step') {
            this.cache['sections'][this.currentStep].style.display = "none";
        }
        this.currentStep = this.currentStep + n;
        if (this.currentStep >= this.cache['sections'].length) {
            this.submitted = true;
            this.showResults.call(this);
            return false;
        }
        this.showTab.call(this, this.currentStep);
    }
    showResults() {
        let kernalsCounted = parseInt(this.form.querySelector('[name="kernalsCounted"').value);
        let lossArea = parseInt(this.form.querySelector('[name="lossArea"').value);
        let yieldLoss = round(kernalsCounted / lossArea / 20, 2);
        let results = {
            socket: this.socket,
            tract: this.tract,
            units: this.units,
            kernalsCounted,
            lossArea,
            yieldLoss,
            calculated: new Date()
        };
        if (this.socket) {
            this.agcCalculated.emit({ socket: this.socket, tract: this.tract, results: Object.assign({}, results) });
        }
        this.results = Object.assign({}, results);
        this.cache['results'].forEach(result => {
            result.style.display = 'block';
        });
    }
    handleAction(e) {
        if (e.detail['action'] === 'reset') {
            this.reset();
        }
    }
    componentDidLoad() {
        var sections = Array.from(this.form.querySelectorAll('[data-wizard-section]')).map(c => c).map(c => c);
        var results = Array.from(this.form.querySelectorAll('[data-wizard-results]')).map(c => c).map(c => c);
        this.cache = Object.assign({}, this.cache, { sections: sections, results: results });
        window.document.addEventListener('agcAction', this.handleAction.bind(this));
        this.enterKeyHandler = mapEnterKey(this.form);
        window.document.addEventListener('keydown', this.enterKeyHandler, false);
        this.showTab(0);
    }
    componentDidUnload() {
        window.document.removeEventListener('agcAction', this.handleAction);
        window.document.removeEventListener('keydown', this.enterKeyHandler);
    }
    static get is() { return "agc-wheat-harvest-loss"; }
    static get properties() { return {
        "cache": {
            "state": true
        },
        "currentStep": {
            "state": true
        },
        "mode": {
            "type": String,
            "attr": "mode"
        },
        "results": {
            "state": true
        },
        "socket": {
            "type": String,
            "attr": "socket"
        },
        "submitted": {
            "state": true
        },
        "tract": {
            "type": String,
            "attr": "tract"
        },
        "units": {
            "type": "Any",
            "attr": "units"
        }
    }; }
    static get events() { return [{
            "name": "agcCalculated",
            "method": "agcCalculated",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "agcStepChanged",
            "method": "agcStepChanged",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
}

export { AgcWheatHarvestLoss };

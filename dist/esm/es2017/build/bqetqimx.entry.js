/*! Built with http://stenciljs.com */
import { h } from '../agc-wheat-harvest-loss.core.js';

class AgcWheatHarvestLossResults {
    constructor() {
        this.socket = "";
        this.ready = false;
    }
    render() {
        return (h("section", { "data-wizard-results": true, ref: c => this.section = c },
            h("div", { style: { display: this.ready ? 'none' : 'block' } },
                h("slot", { name: "empty" })),
            h("div", { style: { display: this.ready ? 'block' : 'none' } }, this.data && (h("ul", { class: "agc-results" },
                h("li", null,
                    h("h2", { "data-i18n": "results.kernals-counted" }, "Kernals Counted"),
                    h("span", { class: "agc-results__value" }, this.data['kernalsCounted'])),
                h("li", null,
                    h("h2", { "data-i18n": "results.loss-area" }, "Area Measured"),
                    h("span", { class: "agc-results__value" }, this.data['lossArea']),
                    h("sub", { "data-i18n": `results.loss-area.${this.data['units']['lossArea']}` }, this.data['units']['lossArea'])))))));
    }
    handleResults(e) {
        if (e.detail['socket'] !== this.socket) {
            return;
        }
        this.data = Object.assign({}, e.detail['results']);
        this.ready = true;
    }
    componentDidLoad() {
        if (!this.socket) {
            return;
        }
        window.document.addEventListener('agcCalculated', this.handleResults.bind(this));
    }
    componentDidUnload() {
        window.document.removeEventListener('agcCalculated', this.handleResults);
    }
    static get is() { return "agc-wheat-harvest-loss-inputs"; }
    static get properties() { return {
        "data": {
            "state": true
        },
        "ready": {
            "state": true
        },
        "socket": {
            "type": String,
            "attr": "socket"
        }
    }; }
}

export { AgcWheatHarvestLossResults as AgcWheatHarvestLossInputs };

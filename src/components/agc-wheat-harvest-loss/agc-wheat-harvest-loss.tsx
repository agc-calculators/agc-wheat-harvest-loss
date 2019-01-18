
import { Component, State, Event, EventEmitter, Prop } from '@stencil/core';
import { validate, round, mapEnterKey } from '../../utils'

@Component({
    tag: 'agc-wheat-harvest-loss'
})
export class AgcWheatHarvestLoss {

    @Prop() socket: string = ""
    @Prop() tract: string = ""
    @Prop() mode: 'full' | 'step' = 'step'
    @Prop() units: any = { lossArea: 'sq. ft', yieldLoss: 'bu/acre'}
    @State() currentStep = 0
    @State() cache = {}
    @State() submitted = false
    @State() results = {}
    @Event({
        eventName: 'agcCalculated'
      }) agcCalculated: EventEmitter;
    @Event({
        eventName: 'agcStepChanged'
    }) agcStepChanged: EventEmitter;

    form: HTMLFormElement
    enterKeyHandler: (e:KeyboardEvent) => void

    render() {
        return (
            <div>
                <form onSubmit={(e) => e.preventDefault()} ref={c => this.form = c as HTMLFormElement} data-wizard="agc-wheat-harvest" 
                    data-wizard-mode={this.mode}
                    class="agc-wizard">
                    <slot></slot>
                    <section data-wizard-section="1">
                      <div class="agc-wizard__field">
                        <label data-i18n="fields.kernals-counted">Kernals Counted</label>
                        <input name="kernalsCounted" type="number" required min="0" step="1" />
                        <p class="agc-wizard__validation-message" data-i18n="validation.kernals-counted.required" data-validates="kernalsCounted">Please enter a whole number of zero or greater.</p>
                        <p data-i18n={`hints.kernals-counted`}>⮤ Enter the number of kernals counted on the ground within the specified area.</p>
                      </div>
                      <div class="agc-wizard__actions">
                        {this.mode === 'step' && <button class="agc-wizard__actions-next" data-i18n="actions.next" onClick={this.nextPrev.bind(this, 1)}>Next 🠖</button>}
                      </div>
                    </section>
                    <section data-wizard-section="2">
                      <div class="agc-wizard__field">
                        <label data-i18n="fields.loss-area">Area Measured</label>
                        <input name="lossArea" type="number" min="1" step="1" required />
                        <p class="agc-wizard__validation-message" data-i18n="validation.loss-area.required" data-validates="lossArea">Please enter a whole number value of 1 or more.</p>
                        <p data-i18n={`hints.loss-area.${this.units['lossArea']}`}>⮤ Enter the area in {this.units['lossArea']} that was used to count kernals on the ground.</p>
                      </div>
                      <div class="agc-wizard__actions">
                        {this.mode === 'step' && <button class="agc-wizard__actions-back" data-i18n="actions.back" onClick={this.nextPrev.bind(this, -1)}>🠔 Back</button>}
                        <button class="agc-wizard__actions-next" data-i18n="actions.finish" onClick={this.nextPrev.bind(this, this.mode === 'step' ? 1 : 3)}>Calculate 🠖</button>
                      </div>
                    </section>
                    <section data-wizard-results>                        
                        <slot name="results"></slot>                     
                    </section>
                </form>
            </div>
        );
    }

    showTab(n) {
        // This function will display the specified section of the form... 
        if (this.mode === 'step') {       
            this.cache['sections'][n].style.display = "block";
        }

        if (this.socket) {
            this.agcStepChanged.emit({socket: this.socket, tract: this.tract, step: this.currentStep})
        }
    }

    reset() {
        this.currentStep = 0
        this.submitted = false
        this.showTab(0)
    }

    validateForm () {
        let valid = true;

        if (this.currentStep === 0 || this.mode === 'full') {
            if (!validate(this.form, 'kernalsCounted')) {
                valid = false
            }
        }
        
        if (this.currentStep === 1 || this.mode === 'full') {
            if (!validate(this.form, 'lossArea')) {
                valid = false
            }
        }
        
        return valid;
    }

    nextPrev(n, e) {
        e && e.preventDefault()
        
        let focused = this.form.querySelector(':focus') as HTMLElement

        if (!focused.classList.contains('agc-wizard__actions-next')) {
            return;
        }

        if (this.mode === 'full') {
            if (!this.validateForm()) return false
        } else if (n == 1 && !this.validateForm()) return false

        // Hide the current tab:
        if (this.mode === 'step') {
            this.cache['sections'][this.currentStep].style.display = "none"
        }
        // Increase or decrease the current tab by 1:
        this.currentStep = this.currentStep + n
        // if you have reached the end of the form...
        if (this.currentStep >= this.cache['sections'].length) {
            // ... the form gets submitted:
            this.submitted = true
            this.showResults.call(this);
            return false;
        }
        // Otherwise, display the correct tab:
        this.showTab.call(this, this.currentStep);
    }

    showResults() {
        let kernalsCounted =  parseInt((this.form.querySelector('[name="kernalsCounted"') as HTMLInputElement).value);        
        let lossArea =  parseInt((this.form.querySelector('[name="lossArea"') as HTMLInputElement).value);        

        let yieldLoss = round(kernalsCounted/lossArea/20, 2)

        let results = {
            socket: this.socket,
            tract: this.tract,
            units: this.units,
            kernalsCounted,
            lossArea,
            yieldLoss,
            calculated: new Date()
        }

        if (this.socket) {
            this.agcCalculated.emit({socket: this.socket, tract: this.tract, results: {...results}})
        }

        this.results = {...results}
        
        this.cache['results'].forEach(result => {
            result.style.display = 'block'
        })
    }

    handleAction(e:CustomEvent) {
        if (e.detail['action'] === 'reset') {
            this.reset();
        }
    }

    componentDidLoad() {
        var sections = Array.from(this.form.querySelectorAll('[data-wizard-section]')).map(c => c as any).map(c => c as HTMLElement)
        var results = Array.from(this.form.querySelectorAll('[data-wizard-results]')).map(c => c as any).map(c => c as HTMLElement)
        this.cache = {...this.cache, sections: sections, results: results}

        window.document.addEventListener('agcAction', this.handleAction.bind(this));
        this.enterKeyHandler = mapEnterKey(this.form)
        window.document.addEventListener('keydown', this.enterKeyHandler, false);

        this.showTab(0)
    }

    componentDidUnload() {
        window.document.removeEventListener('agcAction', this.handleAction);
        window.document.removeEventListener('keydown', this.enterKeyHandler);
    }
}
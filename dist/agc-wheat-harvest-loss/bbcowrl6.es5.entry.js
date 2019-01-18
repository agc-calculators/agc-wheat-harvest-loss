/*! Built with http://stenciljs.com */
AgcWheatHarvestLoss.loadBundle("bbcowrl6",["exports"],function(t){var e=window.AgcWheatHarvestLoss.h,s=function(t,e){var s=t.querySelector('[name="'+e+'"]'),a=t.querySelector('[data-validates="'+e+'"');return s.checkValidity()?(s.className=s.className.replace(" invalid",""),a.style.display="none",!0):(-1===s.className.indexOf("invalid")&&(s.className+=" invalid"),a.style.display="block",!1)},a=function(t,e){return t.matches.call(t,e)},n=function(){function t(){this.socket="",this.tract="",this.mode="step",this.units={lossArea:"sq. ft",yieldLoss:"bu/acre"},this.currentStep=0,this.cache={},this.submitted=!1,this.results={}}return t.prototype.render=function(){var t=this;return e("div",null,e("form",{onSubmit:function(t){return t.preventDefault()},ref:function(e){return t.form=e},"data-wizard":"agc-wheat-harvest","data-wizard-mode":this.mode,class:"agc-wizard"},e("slot",null),e("section",{"data-wizard-section":"1"},e("div",{class:"agc-wizard__field"},e("label",{"data-i18n":"fields.kernals-counted"},"Kernals Counted"),e("input",{name:"kernalsCounted",type:"number",required:!0,min:"0",step:"1"}),e("p",{class:"agc-wizard__validation-message","data-i18n":"validation.kernals-counted.required","data-validates":"kernalsCounted"},"Please enter a whole number of zero or greater."),e("p",{"data-i18n":"hints.kernals-counted"},"⮤ Enter the number of kernals counted on the ground within the specified area.")),e("div",{class:"agc-wizard__actions"},"step"===this.mode&&e("button",{class:"agc-wizard__actions-next","data-i18n":"actions.next",onClick:this.nextPrev.bind(this,1)},"Next 🠖"))),e("section",{"data-wizard-section":"2"},e("div",{class:"agc-wizard__field"},e("label",{"data-i18n":"fields.loss-area"},"Area Measured"),e("input",{name:"lossArea",type:"number",min:"1",step:"1",required:!0}),e("p",{class:"agc-wizard__validation-message","data-i18n":"validation.loss-area.required","data-validates":"lossArea"},"Please enter a whole number value of 1 or more."),e("p",{"data-i18n":"hints.loss-area."+this.units.lossArea},"⮤ Enter the area in ",this.units.lossArea," that was used to count kernals on the ground.")),e("div",{class:"agc-wizard__actions"},"step"===this.mode&&e("button",{class:"agc-wizard__actions-back","data-i18n":"actions.back",onClick:this.nextPrev.bind(this,-1)},"🠔 Back"),e("button",{class:"agc-wizard__actions-next","data-i18n":"actions.finish",onClick:this.nextPrev.bind(this,"step"===this.mode?1:3)},"Calculate 🠖"))),e("section",{"data-wizard-results":!0},e("slot",{name:"results"}))))},t.prototype.showTab=function(t){"step"===this.mode&&(this.cache.sections[t].style.display="block"),this.socket&&this.agcStepChanged.emit({socket:this.socket,tract:this.tract,step:this.currentStep})},t.prototype.reset=function(){this.currentStep=0,this.submitted=!1,this.showTab(0)},t.prototype.validateForm=function(){var t=!0;return 0!==this.currentStep&&"full"!==this.mode||s(this.form,"kernalsCounted")||(t=!1),1!==this.currentStep&&"full"!==this.mode||s(this.form,"lossArea")||(t=!1),t},t.prototype.nextPrev=function(t,e){if(e&&e.preventDefault(),this.form.querySelector(":focus").classList.contains("agc-wizard__actions-next")){if("full"===this.mode){if(!this.validateForm())return!1}else if(1==t&&!this.validateForm())return!1;if("step"===this.mode&&(this.cache.sections[this.currentStep].style.display="none"),this.currentStep=this.currentStep+t,this.currentStep>=this.cache.sections.length)return this.submitted=!0,this.showResults.call(this),!1;this.showTab.call(this,this.currentStep)}},t.prototype.showResults=function(){var t=parseInt(this.form.querySelector('[name="kernalsCounted"').value),e=parseInt(this.form.querySelector('[name="lossArea"').value),s=(2,+(Math.round(new Number(t/e/20+"e+2").valueOf())+"e-2")),a={socket:this.socket,tract:this.tract,units:this.units,kernalsCounted:t,lossArea:e,yieldLoss:s,calculated:new Date};this.socket&&this.agcCalculated.emit({socket:this.socket,tract:this.tract,results:Object.assign({},a)}),this.results=Object.assign({},a),this.cache.results.forEach(function(t){t.style.display="block"})},t.prototype.handleAction=function(t){"reset"===t.detail.action&&this.reset()},t.prototype.componentDidLoad=function(){var t,e=Array.from(this.form.querySelectorAll("[data-wizard-section]")).map(function(t){return t}).map(function(t){return t}),n=Array.from(this.form.querySelectorAll("[data-wizard-results]")).map(function(t){return t}).map(function(t){return t});this.cache=Object.assign({},this.cache,{sections:e,results:n}),window.document.addEventListener("agcAction",this.handleAction.bind(this)),this.enterKeyHandler=(t=this.form,function(e){var n=document.querySelector(":focus"),i=Array.from(t.querySelectorAll("input, a, select, button, textarea")).map(function(t){return t});n&&!n.classList.contains("agc-wizard__actions-next")&&function(){if(13===e.which&&!a(n,"textarea")){!i.indexOf(n)||a(n,"a")||a(n,"button")||e.preventDefault();var r=i[i.indexOf(n)+(e.shiftKey?-1:1)];r?r.focus():i[0].focus(),r&&"select"in r&&r.select(),n&&n.willValidate&&s(t,n.name)}}()}),window.document.addEventListener("keydown",this.enterKeyHandler,!1),this.showTab(0)},t.prototype.componentDidUnload=function(){window.document.removeEventListener("agcAction",this.handleAction),window.document.removeEventListener("keydown",this.enterKeyHandler)},Object.defineProperty(t,"is",{get:function(){return"agc-wheat-harvest-loss"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"properties",{get:function(){return{cache:{state:!0},currentStep:{state:!0},mode:{type:String,attr:"mode"},results:{state:!0},socket:{type:String,attr:"socket"},submitted:{state:!0},tract:{type:String,attr:"tract"},units:{type:"Any",attr:"units"}}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"events",{get:function(){return[{name:"agcCalculated",method:"agcCalculated",bubbles:!0,cancelable:!0,composed:!0},{name:"agcStepChanged",method:"agcStepChanged",bubbles:!0,cancelable:!0,composed:!0}]},enumerable:!0,configurable:!0}),t}();t.AgcWheatHarvestLoss=n,Object.defineProperty(t,"__esModule",{value:!0})});
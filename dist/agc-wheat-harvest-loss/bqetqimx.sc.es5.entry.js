/*! Built with http://stenciljs.com */
AgcWheatHarvestLoss.loadBundle("bqetqimx",["exports"],function(t){var e=window.AgcWheatHarvestLoss.h,s=function(){function t(){this.socket="",this.ready=!1}return t.prototype.render=function(){var t=this;return e("section",{"data-wizard-results":!0,ref:function(e){return t.section=e}},e("div",{style:{display:this.ready?"none":"block"}},e("slot",{name:"empty"})),e("div",{style:{display:this.ready?"block":"none"}},this.data&&e("ul",{class:"agc-results"},e("li",null,e("h2",{"data-i18n":"results.kernals-counted"},"Kernals Counted"),e("span",{class:"agc-results__value"},this.data.kernalsCounted)),e("li",null,e("h2",{"data-i18n":"results.loss-area"},"Area Measured"),e("span",{class:"agc-results__value"},this.data.lossArea),e("sub",{"data-i18n":"results.loss-area."+this.data.units.lossArea},this.data.units.lossArea)))))},t.prototype.handleResults=function(t){t.detail.socket===this.socket&&(this.data=Object.assign({},t.detail.results),this.ready=!0)},t.prototype.componentDidLoad=function(){this.socket&&window.document.addEventListener("agcCalculated",this.handleResults.bind(this))},t.prototype.componentDidUnload=function(){window.document.removeEventListener("agcCalculated",this.handleResults)},Object.defineProperty(t,"is",{get:function(){return"agc-wheat-harvest-loss-inputs"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"properties",{get:function(){return{data:{state:!0},ready:{state:!0},socket:{type:String,attr:"socket"}}},enumerable:!0,configurable:!0}),t}();t.AgcWheatHarvestLossInputs=s,Object.defineProperty(t,"__esModule",{value:!0})});
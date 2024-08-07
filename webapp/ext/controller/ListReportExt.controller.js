sap.ui.define([
	"sap/ui/model/Filter",
	"sap/ui/model/FilterType",
	"sap/ui/model/FilterOperator"
	], 
	function (Filter, FilterType, FilterOperator) {
	"use strict";
	sap.ui.controller("vwks.nlp.s2p.mm.commreq.manage.ext.controller.ListReportExt", {
		/**
		 * The function is called when pressing go on before rebinding the table
		 * @param {sap.ui.base.Event} oEvent is the event triggered
		 */
		onBeforeRebindTableExtension: function(oEvent){
			//Pass * for authorization to work
			var oFilter = new Filter("CurrentUser", FilterOperator.EQ, "*");
			var oTableBindingParameters = oEvent.getParameter("bindingParams");
			oTableBindingParameters.filters.push(oFilter);
		}	
	});
});
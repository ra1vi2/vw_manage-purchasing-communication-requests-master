sap.ui.define([], function () {
	"use strict";

	return Object.freeze({
		Apps: {
			PMAT: "PMAT",
			MCPC: "MCPC",
			SourcingProject: "SourcingProject",
			SourcingProjectQuotation: "SourcingProjectQuotation",
			MPRC: "MPRC",
			MPOC: "MPOC"
		},
		
		ReferenceDocTypes: {
			MCPC: "C",
			SourcingProject: "N",
			SourcingProjectQuotation: "T",
			MPRC: "B"
		},
		
		Priorities: {
			HIGH: "HIGH",
			MEDIUM: "MEDIUM",
			LOW: "LOW"
		},

		FunctionImports: {
			CreateComment : "/xVWKSxNLP_PCF_C_COMMENTSCreate_comment",
			AddPeople: "/xVWKSxNLP_PCF_C_PEOPLEAdd_people",
			PMATIndicator: "/xVWKSxNLP_PCF_C_HEADERSet_pmat_indicator",
			DeletePeople: "/xVWKSxNLP_PCF_C_PEOPLEDelete_people",
			Send: "/xVWKSxNLP_PCF_C_HEADERPcf_send",
			Reopen: "/xVWKSxNLP_PCF_C_HEADERReopen",
			CloseConversation: "/xVWKSxNLP_PCF_C_HEADERPcf_close_conv"
		},

		Icons: {
			Delete: "sap-icon://delete"
		},

		Colors: {
			Accent1: "Accent1",
			Accent6: "Accent6",
			Accent8: "Accent8"
		},
		
		RequestIds: {
			defaultPcfRequestId: "0000000000"
		}
	});
});
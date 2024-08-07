sap.ui.define([
	"vwks/nlp/s2p/mm/commreq/manage/ext/utils/Formatter",
	"vwks/nlp/s2p/mm/commreq/manage/ext/utils/Constants",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"vwks/nlp/s2p/mm/reuse/lib/util/NavigationHelper"
], function (LocalFormatter, Constants, JSONModel, MessageBox, Fragment, NavigationHelper) {
	"use strict";
	sap.ui.controller("vwks.nlp.s2p.mm.commreq.manage.ext.controller.ObjectPageExt", {
		formatter: LocalFormatter,
		/**
		 * Event handler for Object Page controller.
		 * Attach page data loaded event listener.
		 * @public
		 */
		onInit: function () {
			this._oView = this.getView();
			this._oModel = this.getOwnerComponent().getModel();
			this._oController = this._oView.getController();
			var oi18nModel = this.getOwnerComponent().getAppComponent().getModel("i18n");
			if (oi18nModel) {
				this._oResourceBundle = oi18nModel.getResourceBundle();
			}
			this._oController.extensionAPI.attachPageDataLoaded(this.afterPageDataLoaded.bind(this));
			this.uiModel = this.getOwnerComponent().getModel("ui");
			var oPcfHeader = this.byId(
				"vwks.nlp.s2p.mm.commreq.manage::sap.suite.ui.generic.template.ObjectPage.view.Details::xVWKSxNLP_PCF_C_HEADER--template::ObjectPage::ObjectPageDynamicHeaderTitle"
			);
			oPcfHeader.bindProperty("text", {
				parts: [
					"PcfDescription",
					"PcfRequestID"
				],
				formatter: LocalFormatter._formatPcfHeader.bind(this)
			});
		},

		/**
		 * Page Data Loaded event
		 */
		afterPageDataLoaded: function () {
			this._setPmatIndicator();
			this._handleCustomButtons();
			this._bSaveandSend = false;
			this._bSaveandClose = false;
			this.getView().byId("idCommFeedInput").setValue("");
		},

		/**
		 * BeforeSaveExtension is triggered just before starting the save operations
		 * @return {Promise} Save operation promise
		 */
		beforeSaveExtension: function () {
			var fnResolve, fnReject;
			var oObject = this._oView.getBindingContext().getObject();
			var oPromise = new Promise(function (resolve, reject) {
				fnResolve = resolve;
				fnReject = reject;
			});
			if (!this._bSaveandClose) {
				if (oObject.Priority === Constants.Priorities.HIGH) {
					MessageBox.warning(this._oResourceBundle.getText("CustomSavePopupMessage"), {
						actions: [this._oResourceBundle.getText("Proceed"), this._oResourceBundle.getText("Cancel")],
						emphasizedAction: this._oResourceBundle.getText("Proceed"),
						onClose: function (sAction) {
							if (sAction === this._oResourceBundle.getText("Proceed")) {
								if (this._bSaveandSend) {
									this._triggerSendRequestFI(fnResolve, fnReject);
								} else {
									fnResolve();
								}
							} else {
								this._bSaveandSend = false;
								fnReject();
							}
						}.bind(this)
					});
				} else {
					if (this._bSaveandSend) {
						this._triggerSendRequestFI(fnResolve, fnReject);
					} else {
						fnResolve();
					}
				}
			} else {
				this._bSaveandClose = false;
				fnResolve();
			}
			return oPromise;
		},

		/**
		 * Method to handle Reference Document Link Press to navigate apps depending upon Reference Document Type
		 * @param {sap.ui.base.Event} oEvent is the event triggered
		 */
		handleRefDocNoLinkPress: function (oEvent) {
			var oSource = oEvent.getSource();
			var oBinding = oSource.getBindingContext();
			var sReferenceDocumentType = oBinding.getProperty("ReferenceDocumentType");
			var bIsRefDocHierContract = oBinding.getProperty("IsRefDocHierContract");
			var sRequiredURL, sDraftUUID, sSeletedContract, oParams;
			if (sReferenceDocumentType === Constants.ReferenceDocTypes.MCPC && bIsRefDocHierContract === false) { //Central Purchase Contract
				sSeletedContract = oBinding.getProperty("ReferenceDocumentNo");
				sDraftUUID = oBinding.getProperty("ReferenceDocumentKey");
				sRequiredURL = this.getView().getModel(Constants.Apps.MCPC).createKey("C_CentralPurchaseContractTP", {
					"CentralPurchaseContract": sSeletedContract,
					"DraftUUID": sDraftUUID,
					"IsActiveEntity": true
				});
				//Perform Navigation to MCPC
				NavigationHelper.navigateToExternalApp(this, Constants.Apps.MCPC, sRequiredURL, {}, true);
			} else if (sReferenceDocumentType === Constants.ReferenceDocTypes.MCPC && bIsRefDocHierContract === true) { //Central Purchase Contract Hierarchy
				sSeletedContract = oBinding.getProperty("ReferenceDocumentNo");
				sDraftUUID = oBinding.getProperty("ReferenceDocumentKey");
				sRequiredURL = this.getView().getModel(Constants.Apps.MCPC).createKey("C_CntrlPurContrHierHdrTP", {
					"CentralPurchaseContract": sSeletedContract,
					"DraftUUID": sDraftUUID,
					"IsActiveEntity": true
				});
				//Perform Navigation to MCPC
				NavigationHelper.navigateToExternalApp(this, Constants.Apps.MCPC, sRequiredURL, {}, true);
			} else if (sReferenceDocumentType === Constants.ReferenceDocTypes.SourcingProject) { //Sourcing Project
				var sSourcingProjectUUID = oBinding.getProperty("ReferenceDocumentKey");
				oParams = {
					"SourcingProjectUUID": sSourcingProjectUUID,
					"IsActiveEntity": true
				};
				//Perform Navigation to Sourcing Project
				NavigationHelper.navigateToOutboundTarget(this, Constants.Apps.SourcingProject, oParams, true);
			} else if (sReferenceDocumentType === Constants.ReferenceDocTypes.SourcingProjectQuotation) { //  Sourcing Project Quotation
				var sSourcingProjectQuotationUUID = oBinding.getProperty("ReferenceDocumentKey");
				oParams = {
					"SourcingProjectQuotationUUID": sSourcingProjectQuotationUUID,
					"IsActiveEntity": true
				};
				//Perform Navigation to Sourcing Project Quotation
				NavigationHelper.navigateToOutboundTarget(this, Constants.Apps.SourcingProjectQuotation, oParams, true);
			} else if (sReferenceDocumentType === Constants.ReferenceDocTypes.MPRC) { //  purchase requisition
				var sPurchaseRequisition = oBinding.getProperty("ReferenceDocumentNo");
				oParams = {
					"ProcmtHubPurchaseRequisition": sPurchaseRequisition
				};
				//Perform Navigation to purchase requisition
				NavigationHelper.navigateToOutboundTarget(this, Constants.Apps.MPRC, oParams, true);
			} else { // Purchase Order
				var sProcurementHubPO = oBinding.getProperty("ReferenceDocumentNo");
				var sExtSourceSystem = oBinding.getProperty("ExtSourceSystem");
				oParams = {
					"ProcurementHubPO": sProcurementHubPO,
					"ExtSourceSystem": sExtSourceSystem
				};
				//Perform Navigation to MPOC
				NavigationHelper.navigateToOutboundTarget(this, Constants.Apps.MPOC, oParams, true);
			}
		},

		/**
		 * @public method to handle Custom button visibility
		 */
		_handleCustomButtons: function () {
			var oCustomButtonsModel = new JSONModel({
				showEdit: false,
				showSend: false,
				showReopen: false,
				showCloseConversation: false
			});
			this._oView.setModel(oCustomButtonsModel, "customButtonsModel");
			var oObject = this._oView.getBindingContext().getObject();
			var sPurchaseruserID = oObject.PurchaseruserID;
			var sCreatedBy = oObject.CreatedBy;
			var sSessionUser = oObject.SessionUser;
			var bReopen, bCloseConversation;
			if (sSessionUser === sPurchaseruserID || sSessionUser === sCreatedBy) {
				bReopen = true;
				bCloseConversation = true;
			} else {
				bReopen = false;
				bCloseConversation = false;
			}
			var sStatus = oObject.Status;
			var bEditable = this.uiModel.getProperty("/editable");
			if (!bEditable) {
				if (sStatus === "05") {
					this.setCustomButtonsVisibility(false, false, bReopen, false);
				} else {
					this.setCustomButtonsVisibility(true, false, false, false);
				}
			} else {
				switch (sStatus) {
				case "01":
					this.setCustomButtonsVisibility(false, true, false, false);
					break;
				case "02":
					this.setCustomButtonsVisibility(false, true, false, bCloseConversation);
					break;
				case "03":
					this.setCustomButtonsVisibility(false, true, false, bCloseConversation);
					break;
				case "04":
					this.setCustomButtonsVisibility(false, true, false, bCloseConversation);
					break;
				case "06":
					this.setCustomButtonsVisibility(false, true, false, bCloseConversation);
					break;
				default:
					this.setCustomButtonsVisibility(false, false, false, false);
				}
			}
		},

		/**
		 * @public helper method for custom button visibility
		 * @param {boolean} showEdit - visibility of Edit button
		 * @param {boolean} showSend - visibility of Send button
		 * @param {boolean} showReopen - visibility of Reopen button
		 * @param {boolean} showCloseConversation - visibility of Close Conversation button
		 */
		setCustomButtonsVisibility: function (showEdit, showSend, showReopen, showCloseConversation) {
			var oCustomButtonsModel = this.getModel("customButtonsModel");
			oCustomButtonsModel.setProperty("/showEdit", showEdit);
			oCustomButtonsModel.setProperty("/showSend", showSend);
			oCustomButtonsModel.setProperty("/showReopen", showReopen);
			oCustomButtonsModel.setProperty("/showCloseConversation", showCloseConversation);
		},

		/**
		 * Method get Model Object for provided model name 
		 * @param {string} sModelName - Name of the model
		 * @return {sap.ui.Model} Model Object
		 */
		getModel: function (sModelName) {
			return this.getView().getModel(sModelName);
		},

		/**
		 * @public
		 * @param {sap.ui.base.Event} oEvent is the event object when posting any comments
		 */
		onCommunicationFeedPost: function (oEvent) {
			var oCommFeedList = this.byId("idCommFeedList");
			var sComments = oEvent.getParameter("value");
			var sPcfKey = oEvent.getSource().getBindingContext().getProperty("PcfKey");
			var bIsActiveEntity = oEvent.getSource().getBindingContext().getProperty("IsActiveEntity");
			sPcfKey = sPcfKey;

			var oCommPayload = {
				"PcfKey": sPcfKey,
				"Comments": sComments,
				"CommentsKey": sPcfKey,
				"IsActiveEntity": bIsActiveEntity
			};
			oCommFeedList.setBusy(true);
			this._oModel.callFunction(Constants.FunctionImports.CreateComment, {
				method: "POST",
				urlParameters: oCommPayload,
				success: function (oData, oResponse) {
					var oCommentsList = this.byId(
						"vwks.nlp.s2p.mm.commreq.manage::sap.suite.ui.generic.template.ObjectPage.view.Details::xVWKSxNLP_PCF_C_HEADER--idCommFeedList"
					);
					oCommentsList.setVisible(true);
					oCommFeedList.setBusy(false);
					oCommFeedList.getBinding("items").refresh(true);
				}.bind(this),
				error: function (oError) {
					oCommFeedList.setBusy(false);
					oCommFeedList.getBinding("items").refresh(true);
				}
			});
		},

		/**
		 *  Popup for Add People will be opened
		 *  @public   
		 */
		handleOpenAddpeopleDialog: function () {
			if (!this._openAddPeopleDialog) {
				this.sIdAddPeopleDialog = this.createId("AddPeople");
				this._openAddPeopleDialog = sap.ui.xmlfragment(this.sIdAddPeopleDialog,
					"vwks.nlp.s2p.mm.commreq.manage.ext.fragment.AddPeople", this);
				this.getView().addDependent(this._openAddPeopleDialog);
			}
			var oAddPeopleObject = {
				"BusinessPartner": "",
				"FullName": "",
				"Department": "",
				"EmailID": ""
			};
			this.setDataToAddPeopleDialog(oAddPeopleObject);
			this._openAddPeopleDialog.open();
		},

		/**
		 *  event handler for closing app people popup
		 *  @public
		 */
		handleCloseAddPeopleDialog: function () {
			//Close add people dialog
			this._openAddPeopleDialog.destroy();
			this._openAddPeopleDialog = "";
		},

		/**
		 *  Value help dialog for Business Partner will be opened
		 *  @public   
		 * 	@param {event} oEvent - Event triggered                                                                                               
		 */
		onValueHelpRequest: function (oEvent) {
			if (!this._oPeopleValueHelpDialog) {
				Fragment.load({
					id: "idPeopleValueHelpDialog",
					name: "vwks.nlp.s2p.mm.commreq.manage.ext.fragment.PeopleValueHelpDialog",
					controller: this
				}).then(function (oDialog) {
					this._oPeopleValueHelpDialog = oDialog;
					this._oPeopleValueHelpDialog.setModel(this.getView().getModel());
					this._oPeopleValueHelpSmartTable = Fragment.byId("idPeopleValueHelpDialog", "idPeopleValueHelpSmartTable");
					this._oPeopleValueHelpSmartTable.getTable().setMode("SingleSelectLeft");
					this._oPeopleValueHelpSmartFilterBar = Fragment.byId("idPeopleValueHelpDialog", "idPeopleValueHelpSmartFilterBar");
					this._oPeopleValueHelpSmartTable.setSmartFilterId(this._oPeopleValueHelpSmartFilterBar.getId());
					this.getView().addDependent(this._oPeopleValueHelpDialog);
					this._oPeopleValueHelpDialog.open();
				}.bind(this));
			} else {
				this._oPeopleValueHelpDialog.open();
				this.cleanVHFilters();
			}
		},

		/**
		 *  event handler on selection of Business Partner value help
		 *  @public   
		 * 	@param {event} oEvent - Event triggered                                                                                               
		 */
		onValueHelpOk: function (oEvent) {
			var oSelectedItem = this._oPeopleValueHelpSmartTable.getTable().getSelectedItem();
			if (oSelectedItem) {
				var oSelectedRow = oSelectedItem.getBindingContext().getObject();
				var oAddPeopleObject = {
					"BusinessPartner": oSelectedRow.BusinessPartner,
					"FullName": oSelectedRow.FullName,
					"Department": oSelectedRow.Department,
					"EmailID": oSelectedRow.EmailID
				};
				this.setDataToAddPeopleDialog(oAddPeopleObject);
			}
			this.onValueHelpClose();
		},

		/**
		 *  event handler for closing the vluehelp dialog
		 */
		onValueHelpClose: function () {
			this._oPeopleValueHelpSmartTable.getTable().removeSelections();
			this._oPeopleValueHelpDialog.close();
		},

		/**
		 * Method to clear existing filters for smart table in value help dialog
		 */
		cleanVHFilters: function () {
			if (this._oPeopleValueHelpSmartFilterBar && (Object.keys(this._oPeopleValueHelpSmartFilterBar.getFilterData()).length)) {
				this._oPeopleValueHelpSmartFilterBar.setFilterData({}, true);
				this._oPeopleValueHelpSmartFilterBar.fireSearch();
			}
		},

		/**
		 * For setting read only data to add people dialog on selection            
		 * @param {Object} oDataObject - selected Business Partner                                                                                              
		 * @public                                                                                                                                                                       
		 */
		setDataToAddPeopleDialog: function (oDataObject) {
			var oddPeopleModel = new JSONModel(oDataObject);
			var oAddPeopleFragment = Fragment.byId(this.sIdAddPeopleDialog, "idAddPeopleDialog");
			oAddPeopleFragment.setModel(oddPeopleModel, "peopleData");
		},

		/**
		 *  event handler called on selection of Business Partner
		 *  @public   
		 *  @param {event} oEvent - Event triggered                                                                                               
		 */
		onBusinessPartnerOk: function (oEvent) {
			var sPcfKey = oEvent.getSource().getBindingContext().getProperty("PcfKey");
			var oPeopleList = this.byId("idPeopleInvolved");
			var oBusinessPartner = Fragment.byId(this.sIdAddPeopleDialog, "idBusinessPartner").getValue();
			sPcfKey = sPcfKey;

			var oAddPeoplePayload = {
				"PcfKey": sPcfKey,
				"Partner": oBusinessPartner
			};
			this._oView.setBusy(true);
			this._oModel.callFunction(Constants.FunctionImports.AddPeople, {
				method: "POST",
				urlParameters: oAddPeoplePayload,
				success: function (oData, oResponse) {
					this._oView.setBusy(false);
					if (oResponse.headers["sap-message"]) {
						var sMessage = JSON.parse(oResponse.headers["sap-message"]).message;
						MessageBox.information(sMessage);
					} else {
						this.handleCloseAddPeopleDialog();
						oPeopleList.getBinding("items").refresh(true);
					}
				}.bind(this),
				error: function (oError) {
					this._oView.setBusy(false);
				}.bind(this)
			});

		},

		/**
		 * handler for Involved People Color Code Information button
		 * @param {event} oEvent - Event triggered 
		 */
		handleOpenColorInfo: function (oEvent) {
			var oColorInfoBtn = oEvent.getSource();
			if (!this.oinvolvedPeopleColorPopover) {
				Fragment.load({
					name: "vwks.nlp.s2p.mm.commreq.manage.ext.fragment.InvolvedPeopleColorInfo",
					controller: this
				}).then(function (oColorPopover) {
					this.getView().addDependent(oColorPopover);
					this.oinvolvedPeopleColorPopover = oColorPopover;
					this.oinvolvedPeopleColorPopover.openBy(oColorInfoBtn);
				}.bind(this));
			} else {
				this.oinvolvedPeopleColorPopover.openBy(oColorInfoBtn);
			}

		},

		/**
		 * The function is to set PMAT Indicator to true if the app is navigated from PMAT
		 * else set it to false
		 */
		_setPmatIndicator: function () {
			var bIsNavFromPmat = false;
			var bIsRefreshRequired = true;
			var oViewContextObject = this._oView.getBindingContext().getObject();
			var oStartupParameters = this.getOwnerComponent().getAppComponent().getComponentData().startupParameters;
			if (oStartupParameters.source && oStartupParameters.source[0] === Constants.Apps.PMAT) {
				bIsNavFromPmat = true;
			}
			if (!oViewContextObject.PmatIndicator) {
				if (bIsNavFromPmat) {
					bIsRefreshRequired = true;
				} else {
					bIsRefreshRequired = false;
				}
			}
			if (bIsRefreshRequired) {
				var oPmatFunctionPayload = {
					PcfKey: oViewContextObject.PcfKey,
					PmatIndicator: bIsNavFromPmat,
					IsActiveKey: oViewContextObject.IsActiveEntity
				};

				this._oModel.callFunction(Constants.FunctionImports.PMATIndicator, {
					method: "POST",
					urlParameters: oPmatFunctionPayload,
					success: function (oResponse) {
						this._oModel.refresh(true);
					}.bind(this),
					error: function (oError) {
						if (oError.responseText) {
							var oMessage = JSON.parse(oError.responseText);
							MessageBox.error(oMessage.error.message.value);
						}
					}
				});
			}
		},

		/**
		 *  this method will trigger on delete of involved people
		 *  @public   
		 *  @param {boolean} bDelInd - Delete indicator
		 *  @param {boolean} bEditable - Editing status of view
		 * 	@param {sap.ui.base.Event} oEvent - Event triggered                                                                                               
		 */
		onDeletePeople: function (bDelInd, bEditable, oEvent) {
			if (bEditable && bDelInd) {
				var oPeopleList = this.byId("idPeopleInvolved");
				var oRecipientKey = oEvent.getSource().getBindingContext().getProperty("RecipientKey");
				var oDeletePeplePayload = {
					"RecipientKey": oRecipientKey
				};
				this._oView.setBusy(true);
				this._oModel.callFunction(Constants.FunctionImports.DeletePeople, {
					method: "POST",
					urlParameters: oDeletePeplePayload,
					success: function (oData, oResponse) {
						this._oView.setBusy(false);
						oPeopleList.getBinding("items").refresh(true);
					}.bind(this),
					error: function (oError) {
						this._oView.setBusy(false);
					}.bind(this)
				});
			} else {
				this.displayUserDetails(oEvent);
			}
		},

		/**
		 * The function is to display user details in popover
		 * @param {sap.ui.base.Event} oEvent is the event triggered
		 * @param {boolean} bIsCommentsSection - comments section
		 */
		displayUserDetails: function (oEvent, bIsCommentsSection) {
			var oSource;
			if (bIsCommentsSection) {
				oSource = oEvent;
			} else {
				oSource = oEvent.getSource();
			}
			var oQuickViewModel = new JSONModel(oSource.getBindingContext().getObject());
			if (!this._quickView) {
				Fragment.load({
					name: "vwks.nlp.s2p.mm.commreq.manage.ext.fragment.UserDetailsQuickView",
					controller: this
				}).then(function (oQuickView) {
					this.getView().addDependent(oQuickView);
					this._quickView = oQuickView;
					this._quickView.setModel(oQuickViewModel, "quickViewModel");
					this._quickView.openBy(oSource);
				}.bind(this));
			} else {
				this._quickView.setModel(oQuickViewModel, "quickViewModel");
				this._quickView.openBy(oSource);
			}
		},

		/**
		 * The function is to handle the Sender name
		 * and attach the reused quick view fragment
		 * @param {sap.ui.base.Event} oEvent is the event triggered
		 */
		onSenderDetailPress: function (oEvent) {
			this.displayUserDetails(oEvent.getSource(), true);
		},

		/**
		 * @public method to perform save action
		 */
		triggerSaveAction: function () {
			var oSaveButton = this.byId(
				"vwks.nlp.s2p.mm.commreq.manage::sap.suite.ui.generic.template.ObjectPage.view.Details::xVWKSxNLP_PCF_C_HEADER--activate");
			oSaveButton.firePress();
		},

		/**
		 * @public method to get PCF Key Payload data
		 * @returns {Object} oPcfKeyPayload is the PCF Key payload data
		 */
		getPcfKeyPayload: function () {
			var oViewObject = this._oView.getBindingContext().getObject();
			var oPcfKeyPayload = {
				PcfKey: oViewObject.PcfKey
			};
			return oPcfKeyPayload;
		},

		/**
		 * @public onPress Send Request handler
		 * @param {sap.ui.base.Event} oEvent is the event triggered
		 */
		fnSendRequest: function (oEvent) {
			this._bSaveandSend = true;
			this.triggerSaveAction();
		},

		/**
		 * Method to trigger Save and Send FI
		 * @param {Object} fnResolve - promise resolve refernce
		 * @param {Object} fnReject - promise reject reference
		 */
		_triggerSendRequestFI: function (fnResolve, fnReject) {
			this._bSaveandSend = false;
			this._oView.setBusy(true);
			this._oModel.callFunction(Constants.FunctionImports.Send, {
				method: "POST",
				urlParameters: this.getPcfKeyPayload(),
				success: function (oData, oResponse) {
					this._oView.setBusy(false);
					if (oResponse.headers["sap-message"]) {
						var sMessage = JSON.parse(oResponse.headers["sap-message"]).message;
						MessageBox.error(sMessage);
						fnReject();
					} else {
						fnResolve();
					}
				}.bind(this),
				error: function (oError) {
					this._oView.setBusy(false);
					fnReject();
				}.bind(this)
			});
		},

		/**
		 * @public onPress Reopen handler
		 */
		fnReopen: function () {
			this.setCustomButtonsVisibility(true, false, false, false);
			var oEditButton = this.byId(
				"vwks.nlp.s2p.mm.commreq.manage::sap.suite.ui.generic.template.ObjectPage.view.Details::xVWKSxNLP_PCF_C_HEADER--edit");
			oEditButton.firePress();
			this._oModel.callFunction(Constants.FunctionImports.Reopen, {
				method: "POST",
				urlParameters: this.getPcfKeyPayload(),
				success: function (oData, oResponse) {},
				error: function (oError) {
					this.setCustomButtonsVisibility(false, false, true, false);
				}
			});
		},

		/**
		 * @public onPress Close Conversation handler
		 */
		fnCloseConversation: function () {
			this._oModel.callFunction(Constants.FunctionImports.CloseConversation, {
				method: "POST",
				urlParameters: this.getPcfKeyPayload(),
				success: function () {
					this._bSaveandClose = true;
					this.triggerSaveAction();
				}.bind(this),
				error: function (oError) {
					if (oError.responseText) {
						var oMessage = JSON.parse(oError.responseText);
						MessageBox.error(oMessage.error.message.value);
					}
                }
			});
		}

	});
});
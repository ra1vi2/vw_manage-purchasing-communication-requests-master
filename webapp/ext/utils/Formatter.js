sap.ui.define([
	"vwks/nlp/s2p/mm/commreq/manage/ext/utils/Constants",
	"vwks/nlp/s2p/mm/reuse/lib/util/Constants"
], function (Constants, UtilConstants) {
	"use strict";
	var formatter = {
		/**
		 * Returns Object key String
		 * @param {String} sDraftUUID Draft UUID
		 * @param {String} sActiveUUID Active UUID
		 * @returns {String} sObjectKey
		 */
		getObjectKey: function (sDraftUUID, sActiveUUID) {
			var sObjectKey = "";
			if (sActiveUUID !== undefined && sActiveUUID !== null && sActiveUUID !== "" &&
				sActiveUUID !== UtilConstants.INITIAL_GUID && typeof sActiveUUID === "string") {
				sObjectKey = sActiveUUID.toUpperCase().replace(/[^a-zA-Z0-9]/g, "");
			} else if (sDraftUUID !== undefined && sDraftUUID !== null && sDraftUUID !== "" &&
				sDraftUUID !== UtilConstants.INITIAL_GUID && typeof sDraftUUID === "string") {
				sObjectKey = sDraftUUID.toUpperCase().replace(/[^a-zA-Z0-9]/g, "");
			} else {
				//nothing to be done
			}
			return sObjectKey;
		},

		/**
		 * formatter method for Comments List visibility
		 * @param {boolean} bEditable - UI Edit/Display mode
		 * @return {boolean} visibility of Comments List
		 */
		commentsListVisibility: function (bEditable) {
			if (!bEditable) {
				return true;
			}
			if (this && this._oView && this._oView.getBindingContext()) {
				//{boolean} CommentsInd indicates whether document has any comments or not
				var bCommentsListVisibility = this._oView.getBindingContext().getProperty("CommentsInd");
				return bCommentsListVisibility;
			}
			return false;
		},

		/**
		 * This function is to format the tooltip of involved people user
		 * @param {String} sFullName - Fullname of Involved People
		 * @param {String} sEmail - Email of Involved People
		 * @returns {String} Tooltip
		 */
		formatTooltip: function (sFullName, sEmail) {
			return sFullName + "\n" + sEmail;
		},

		/**
		 *  this method is for formatting the add button
		 *  @public   
		 *  @param {String} sCurrentUser - logged in user
		 * 	@param {String} sPurchaserUserId - Business Partner userId
		 *  @param {String} sCreatedBy - created by
		 *  @param {boolean} bEditable - Editing status of view 
		 *  @returns {boolean} show Add Icon
		 */
		showAddIcon: function (sCurrentUser, sPurchaserUserId, sCreatedBy, bEditable) {
			if (bEditable && (sCurrentUser === sPurchaserUserId || sCurrentUser === sCreatedBy)) {
				return true;
			} else {
				return false;
			}
		},

		/**
		 *  this method is for formatting the delete button
		 *  @public   
		 *  @param {boolean} bEditable - Editing status of view
		 *  @param {boolean} bDelInd - indicator for delete
		 *  @return {string} badge icon
		 */
		getBadgeIcon: function (bEditable, bDelInd) {
			if (bEditable && bDelInd) {
				return Constants.Icons.Delete;
			} else {
				return "";
			}
		},

		/**
		 * formatter method for avatar background
		 * @param {String} sUserType - current session user type
		 * @return {String} background color of avatar
		 */
		avatarFormatter: function (sUserType) {
			var sColor = "";
			switch (sUserType) {
			case "01":
				sColor = Constants.Colors.Accent1;
				break;
			case "02":
				sColor = Constants.Colors.Accent8;
				break;
			default:
				sColor = Constants.Colors.Accent6;
			}
			return sColor;
		},

		/**
		 * Formatter function for the PCH Header text to be rename from <Unamed Object> to "New PCF Request"
		 * @param {string} sPcfHeader is value of PCF Description
		 * @param {string} sPcfRequestId is value of PCF Request Id
		 * @returns {string} if blank or null return "New PCF Request" else the description
		 **/
		_formatPcfHeader: function (sPcfHeader, sPcfRequestId) {
			if (sPcfRequestId === Constants.RequestIds.defaultPcfRequestId && (!sPcfHeader || sPcfHeader.length === 0)) {
				return this._oResourceBundle.getText("NEW_OBJECT");
			} else {
				return sPcfHeader;
			}
		}
	};
	return formatter;
}, true);
var custom;

(function() {

	var Dom = YAHOO.util.Dom, Event = YAHOO.util.Event, Element = YAHOO.util.Element;
	var $html = Alfresco.util.encodeHTML, $siteURL = Alfresco.util.siteURL;

	// Ensure root object exists
	if (typeof custom == "undefined" || !custom) {
		custom = {};
	}
	custom.button = custom.button || {};

	// Declare custom toolbar
	custom.button.DocListToolbar = function CustomDocListToolbar_constructor(
			htmlId) {
		custom.button.DocListToolbar.superclass.constructor.call(this, htmlId);
		return this;
	};

	// Extend Alfresco DocListToolbar
	YAHOO.extend(custom.button.DocListToolbar, Alfresco.DocListToolbar);
	YAHOO.lang.augmentProto(custom.button.DocListToolbar,
			Alfresco.doclib.Actions);

	// Extend default DocListToolbar...
	YAHOO.extend(custom.button.DocListToolbar, Alfresco.DocListToolbar, {

		onReady : function DLTB_onReady() {
			custom.button.DocListToolbar.superclass.onReady.call(this);
			// Link button to YUI and attach function "onClick"
			this.widgets.customButton = Alfresco.util.createYUIButton(this,
					"createCustomButton-button", this.onClickCustomButton, {
						disabled : false,
						value : "CreateChildren"
					});
			this.dynamicControls.push(this.widgets.customButton);
		},

		onClickCustomButton : function DLTB_onClickCustomButton(e, p_obj) {
			var destination = this.doclistMetadata.parent.nodeRef;

			// Write your own code
			alert(destination);
		}

	});

})();
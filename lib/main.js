// The main module of the _amcereijo_ Add-on.

// Modules needed are `require`d, similar to CommonJS modules.
// Import the page-mod API
var pageMod = require("sdk/page-mod");
// Import the self API
var self = require("sdk/self");


// Import the internacionalization API
var l10n = require("sdk/l10n");


var getMessages = function () {
	return [
		l10n.get("liTitle"),
		l10n.get("liText"),
		l10n.get("extName"),
		l10n.get("retweetText")];
}


// Create a page mod
// It will run a script whenever a ".org" URL is loaded
var matcher = pageMod.PageMod({
	include: "https://twitter.com*",
	contentScriptFile: [self.data.url("jquery-1.9.1.min.js"),
                      self.data.url("extern_rtc.js")],
    onAttach: function(worker) {
    	worker.port.on("getL10nMessagesPort", function () {
    		worker.port.emit("setL10MessagesPort", getMessages());
		});
    }
});

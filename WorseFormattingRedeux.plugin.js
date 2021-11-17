/**
 * @name WorseFormattingRedeux
 * @version 0.0.3
 */
/*@cc_on
@if (@_jscript)
	
	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject("WScript.Shell");
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
	var pathSelf = WScript.ScriptFullName;
	// Put the user at ease by addressing them in the first person
	shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
	if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
		shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
	} else if (!fs.FolderExists(pathPlugins)) {
		shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
	} else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
		fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
		// Show the user where to put plugins in the future
		shell.Exec("explorer " + pathPlugins);
		shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
	}
	WScript.Quit();

@else@*/

module.exports = (() => {
	const config = {
		info:{
			name:"WorseFormattingRedeux",
			authors:[{ name:"jwright159", discord_id:"432354619092631562" }],
			version:"0.0.3",
			description:"Enables different types of quirks in standard Pesterchum chat.",
			github: "",
			github_raw: ""
		},
		main:"index.js",
		defaultConfig:[
			{ type:"textbox", id:"wrapper", name:"Quirk query", note:"Regex query to search for to replace with quirks. Flagged global and dotAll.", value:"\\+\\+.*?\\+\\+" },
			{ type:"textbox", id:"query0", name:"Query", note:"A regex search query.", value:"\\+\\+" },
			{ type:"textbox", id:"repla0", name:"Replace", note:"A regex replace query.", value:"" },
			{ type:"textbox", id:"query1", name:"Query", note:"A regex search query.", value:"" },
			{ type:"textbox", id:"repla1", name:"Replace", note:"A regex replace query.", value:"" },
			{ type:"textbox", id:"query2", name:"Query", note:"A regex search query.", value:"" },
			{ type:"textbox", id:"repla2", name:"Replace", note:"A regex replace query.", value:"" },
			{ type:"textbox", id:"query3", name:"Query", note:"A regex search query.", value:"" },
			{ type:"textbox", id:"repla3", name:"Replace", note:"A regex replace query.", value:"" },
			{ type:"textbox", id:"query4", name:"Query", note:"A regex search query.", value:"" },
			{ type:"textbox", id:"repla4", name:"Replace", note:"A regex replace query.", value:"" },
			{ type:"textbox", id:"query5", name:"Query", note:"A regex search query.", value:"" },
			{ type:"textbox", id:"repla5", name:"Replace", note:"A regex replace query.", value:"" },
			{ type:"textbox", id:"query6", name:"Query", note:"A regex search query.", value:"" },
			{ type:"textbox", id:"repla6", name:"Replace", note:"A regex replace query.", value:"" },
		]
	};

	return !global.ZeresPluginLibrary ? class {
		constructor() {this._config = config;}
		getName() {return config.info.name;}
		getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
		getDescription() {return config.info.description;}
		getVersion() {return config.info.version;}
		load() {
			BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
				confirmText: "Download Now",
				cancelText: "Cancel",
				onConfirm: () => {
					require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
						if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
						await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
					});
				}
			});
		}
		start() {}
		stop() {}
	} : (([Plugin, Api]) => {
		const plugin = (Plugin, Api) => {
	const {DiscordModules, Patcher} = Api;

	return class BetterFormattingRedux extends Plugin {

		onStart() {
			Patcher.before(DiscordModules.MessageActions, "sendMessage", (_, [, msg]) => {
				let settings = this.settings;
				let queries = 0;
				while (settings['query' + queries] !== undefined) queries++;
				msg.content = msg.content.replace(new RegExp(settings.wrapper, 'gs'),
					function(match) {
						if (match === undefined)
							return ''
						for (let i = 0; i < queries; i++)
							if (settings['query' + i] || settings['repla' + i])
								match = match.replace(new RegExp(settings['query' + i], 'g'), settings['repla' + i]);
						return match
					}
				);
			});
		}

		onStop() {
			Patcher.unpatchAll();
		}

		getSettingsPanel() {
            return this.buildSettingsPanel().getElement();
        }
	};
};
		return plugin(Plugin, Api);
	})(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
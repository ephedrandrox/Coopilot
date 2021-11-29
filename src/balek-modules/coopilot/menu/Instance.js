define(['dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/topic',


        'balek-modules/coopilot/menu/Instance/menuBar',
        'balek-modules/components/syncedCommander/Instance'

    ],
    function (declare, lang, topic,
              MenuBar,
              _SyncedCommanderInstance ) {
        return declare("moduleCoopilotMenuModuleInstance", _SyncedCommanderInstance, {
            _instanceKey: null,
            _sessionKey: null,

            _menuBarInstance: null,

            _settingsDatabase: null,

            constructor: function (args) {

                declare.safeMixin(this, args);
                this._terminalInstances = [];
                //set syncedMenu commands
                this._commands={
                    "saveSettings" : lang.hitch(this, this.saveSettings),
                };
                //activate syncedMenu commands
                this.setInterfaceCommands();

                this._interfaceState.set("className", "moduleCoopilotMenuModuleInstance");

                topic.publish("getSessionUserKey", this._sessionKey, lang.hitch(this, function(userKey){

                    this._userKey = userKey;

                    this._menuBarInstance = new MenuBar({_instanceKey: this._instanceKey, _sessionKey: this._sessionKey, _userKey: this._userKey});
                    this._interfaceState.set("menuBarInstanceKeys", {instanceKey: this._menuBarInstance._instanceKey,
                        sessionKey: this._menuBarInstance._sessionKey,
                        userKey: this._menuBarInstance._userKey,
                        componentKey: this._menuBarInstance._componentKey});
                   // this._settingsDatabase = new settingsDatabase({_instanceKey: this._instanceKey, _userKey: userKey});

                    //todo make a settings database automatic using settings manager
               /*     this._settingsDatabase.getUserSettings().then(lang.hitch(this, function(userSettings){
                        userSettings.toArray().then(lang.hitch(this, function(userSettingsArray){

                            if(userSettingsArray.length>0 && userSettingsArray[0].userSettings)
                            {
                                this._userSettings = userSettingsArray[0].userSettings;
                            }else
                            {
                                this._settingsDatabase.setUserSettings(this._userSettings);
                            }
                            //Now that settings are loaded or set to default
                            this.loadComponents();

                        }));
                    })).catch(function(error){
                        console.log(error);
                    });
                */
                }));

                console.log("moduleCoopilotMenuInstance starting...", this);

            },
            loadComponents: function(){
                console.log("Loading Instance Components")
            },
            saveSettings:function(settings, remoteMenuCallback) {
                //example of setting check and save
                if(settings.consoleDockedOnLoad === true || settings.consoleDockedOnLoad === false)
                {
                    this._userSettings.consoleDockedOnLoad = settings.consoleDockedOnLoad;
                }
                this._settingsDatabase.setUserSettings(this._userSettings).then(function(Result){
                    remoteMenuCallback({message: "worked"});
                }).catch(function(errorResult){
                    remoteMenuCallback({error: errorResult});
                });
            },
            _end: function () {
                    return new Promise(lang.hitch(this, function(Resolve, Reject){
                        console.log("destroying Coopilot Menu Module Instance ");
                        Resolve({success: "Unloaded Instance"});
                    }));
            }
        });
    }
);



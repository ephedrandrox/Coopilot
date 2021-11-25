define(['dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/topic',

        "dojo/dom-construct",
        'dojo/dom-style',
        "dojo/_base/window",

        'balek-modules/coopilot/saleTagScan/Interface/main',
        'balek-modules/components/syncedCommander/Interface'
    ],
    function (declare, lang, topic,
              domConstruct, domStyle, win,
              mainInterface, _SyncedCommanderInterface) {

        return declare("moduleCoopilotSaleTagScanInterface", _SyncedCommanderInterface, {
            _instanceKey: null,
            _mainInterface: null,

            constructor: function (args) {

                declare.safeMixin(this, args);

                //this._mainInterface = new mainInterface({_instanceKey: this._instanceKey, _interface: this});

              //  topic.publish("addToMainContentLayer", this._mainInterface.domNode);

/*
                this._mainInterface.getContainerKeys().then(lang.hitch(this, function(containerKeys){
                            console.log(containerKeys, typeof containerKeys );
                    if(Array.isArray(containerKeys) && containerKeys.length === 0)
                    {
                        topic.publish("addToCurrentWorkspace",this._mainInterface );
                    }else
                    {
                        console.log(containerKeys.length);
                    }
                })).catch(lang.hitch(this, function(error){
                    console.log(error);
                }));
*/

            },
            onInterfaceStateChange: function (name, oldState, newState) {
                //this has to be here so remoteCommander works
                this.inherited(arguments);
                console.log("Instance Status:",name, oldState, newState);

                if (name === "Status" && newState === "Ready") {
                    console.log("Instance Status:", newState);
                    //we could do something based on error status here
                } else if (name === "mainInstanceKeys") {
                    console.log("mainInstanceKeys:", newState);

                    if(this._mainInterface === null){
                        this._mainInterface = new mainInterface({_instanceKey: newState.instanceKey,
                            _sessionKey: newState.sessionKey,
                            _componentKey: newState.componentKey,
                        _interface: this});



                        this._mainInterface.getContainerKeys().then(lang.hitch(this, function(containerKeys){
                            //         console.log(containerKeys, typeof containerKeys );
                            if(Array.isArray(containerKeys) && containerKeys.length === 0)
                            {
                                console.log("addToCurrentWorkspace ooooooooooooooooooooooooooooooooooooooooo");
                                topic.publish("addToCurrentWorkspace",this._mainInterface );
                            }else
                            {
                                //            console.log(containerKeys.length);
                            }
                        })).catch(lang.hitch(this, function(error){
                            console.log(error);
                        }));



                    }

                }
            },
            getWorkspaceDomNode: function () {
                return this._mainInterface.domNode;
            },
            sendDigivigilSaleTagScanEntry: function (saleTagScanEntry) {
                //todo make this use the send with callback function and return a promise
                let entryMessage = {
                    moduleMessage: {
                        instanceKey: this._instanceKey, messageData: {
                            request: "Digivigil SaleTagScan Entry",
                            saleTagScanEntry: saleTagScanEntry
                        }
                    }
                };
                console.log("sending saleTagScan entry", entryMessage);
                topic.publish("sendBalekProtocolMessage", entryMessage);

            },
            requestSaleTagScanEntries() {
                console.log("requesting saleTagScan entries");
                topic.publish("sendBalekProtocolMessage", {
                    moduleMessage: {
                        instanceKey: this._instanceKey, messageData: {
                            request: "SaleTagScan Entries",
                            searchParams: null
                        }
                    }
                });
            },
            removeEntries() {
                console.log("requesting remove entries");
                topic.publish("sendBalekProtocolMessage", {
                    moduleMessage: {
                        instanceKey: this._instanceKey, messageData: {
                            request: "Remove Entries",
                            searchParams: null
                        }
                    }
                });
            },
            receiveMessage: function (moduleMessage) {

                if (moduleMessage.instanceKey == this._instanceKey) {
                    if (moduleMessage.messageData.saleTagScanData) {
                        console.log(moduleMessage.messageData.saleTagScanData);
                        this._mainInterface.updateSaleTagScanData(moduleMessage.messageData.saleTagScanData);
                    } else if (moduleMessage.messageData.removeEntries) {
                        console.log(moduleMessage.messageData.removeEntries);
                        if(moduleMessage.messageData.removeEntries == "all")
                        {
                            this._mainInterface.removeAllEntries();
                        }
                    } else {
                        console.log("unknown message COntent")
                    }
                } else {
                    error("Module message with incorrect instanceKey sent to interface")
                }
            },
            toggleShowView: function () {
                let currentStateToggle = {"visible": "hidden", "hidden": "visible"};
                domStyle.set(this._mainInterface.domNode, {"visibility": currentStateToggle[domStyle.get(this._mainInterface.domNode, "visibility")]});
            },
            unload: function () {
                this._mainInterface.unload();
            }
        });
    }
);




define(['dojo/_base/declare',
        'balek-modules/Module',
        'balek-modules/coopilot/menu/Database/settings',

        'balek-modules/coopilot/menu/Instance'],
    function (declare, baseModule, moduleSettingsDatabase, moduleInstance) {
        return declare("coopilotMenuModule", [baseModule], {
            _displayName: "Coopilot Menu",
            _allowedSessions: [1],
            _databaseSettingsController: null,

            constructor: function (args) {

                declare.safeMixin(this, args);

                this._databaseSettingsController = new moduleSettingsDatabase();
                this._databaseSettingsController.connectToDatabase();

                console.log("coopilotMenuModule  starting...");
            },
            newInstance: function (args) {
                //must be overridden from base
                return new moduleInstance(args);
            }
        });
    }
);



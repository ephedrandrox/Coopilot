define(['dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/topic',
        'dojo/on',

        "dojo/dom-construct",
        'dojo/dom-style',
        "dojo/_base/window",

        "dojo/keys",


        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",

        'dojo/text!balek-modules/coopilot/tabImporter/resources/html/Interface.html',
        'dojo/text!balek-modules/coopilot/tabImporter/resources/css/Interface.css'
    ],
    function (declare,
              lang,
              topic,
              on,

              domConstruct,
              domStyle,
              win,

              dojoKeys,

              _WidgetBase,
              _TemplatedMixin,

              interfaceHTMLFile,
              interfaceCSSFile

              ) {

        return declare("moduleDigivigilWWWSaleTagScanInterface", [_WidgetBase,_TemplatedMixin], {


            baseClass: "coopilotTabImporterInterface",

            templateCssString: interfaceCSSFile,
            templateString: interfaceHTMLFile,

            importCompleteCallback: null,

            _textFile: null,
            _previewPane: null,
            _dropZone: null,

            values: null,
            mostValuesInLine: 0,

            constructor: function (args) {
                this.values = Array()
                declare.safeMixin(this, args);
                domConstruct.place(domConstruct.toDom("<style>" + this.templateCssString + "</style>"), win.body());

            },

            postCreate: function(){
               topic.publish("displayAsDialog", this);

                on(this._dropZone, ["dragenter, dragstart, dragend, dragleave, dragover, drag, drop"], function (e) {
                       e.preventDefault()
                    e.stopPropagation()});
            },
            _onFocus: function(){
                this.userInputValue.focus();
            },
            _onKeyUp: function (keyUpEvent) {
                switch (keyUpEvent.keyCode) {
                    case dojoKeys.ENTER:
                        keyUpEvent.preventDefault();
                        break;
                    case dojoKeys.ESCAPE:
                        keyUpEvent.preventDefault();
                        keyUpEvent.stopPropagation();
                        this.unload();
                        break;

                }
            }, _onKeyDown: function (keyUpEvent) {
                switch (keyUpEvent.keyCode) {
                    case dojoKeys.ENTER:
                        keyUpEvent.preventDefault();

                        break;
                    case dojoKeys.ESCAPE:
                        keyUpEvent.preventDefault();
                        keyUpEvent.stopPropagation();
                        this.unload();
                        break;

                }
            },
            _onFileChange: function (eventObject) {
                let file = eventObject.target.files[0];

                    if (file.type.match('text.*')) {
                        let reader = new FileReader();
                        reader.onload = lang.hitch(this, function (onLoadEvent) {

                            console.log(onLoadEvent.target.result)
                            this._previewPane.innerHTML = "";
                            this.parseTabSeperatedString( onLoadEvent.target.result)
                        });
                        // Read in the image file as a data URL.
                        reader.readAsText(file);
                    } else {
                        alert("Not a Text File!");
                    }

            },
            _onDropped: function(dropEvent){
                dropEvent.preventDefault()
                dropEvent.stopPropagation()

                let dataTransfer = dropEvent.dataTransfer
                let files = dataTransfer.files

                this._textFile.files = files
                console.log("Dropped",files)
            },
            _onDragEnter: function(dragEvent){
                dragEvent.preventDefault()
                dragEvent.stopPropagation()
                console.log("In",dragEvent)
            },
            _onDragLeave: function(dragEvent){
                dragEvent.preventDefault()
                dragEvent.stopPropagation()
                console.log("Out",dragEvent)
            },

            parseTabSeperatedString: function(stringToParse)
            {

                let lineIndex = 0;
                let valueIndex = 0;
                let linesArray = stringToParse.split("\n");
                this._previewPane.innerHTML += "\n Lines: "+ linesArray.length;

                for (const line of linesArray)
                {
                    valueIndex = 0;
                    let valuesArray = line.split("\t");
                    if (this.mostValuesInLine < valuesArray.length){
                        this.mostValuesInLine = valuesArray.length
                    }
                    for (const value of valuesArray) {
                        let valuesOfIndex = this.getValuesOfIndex(valueIndex)
                        //regex removes quotes around value
                        valuesOfIndex[lineIndex] = value.replace(/^["'](.+(?=["']$))["']$/, '$1');
                        valueIndex++
                    }
                    lineIndex++;
                }

                this._previewPane.innerHTML += "\n Most Values: "+ this.mostValuesInLine;

                this.refreshTable()
            },
            refreshTable: function(){

                let commaString = ""
                let linePosition = 0

                commaString+= this.values[0].join()

                this._previewPane.innerHTML += "\n , Values: "+ commaString;

                let table = domConstruct.create("table");

                for (const line of this.values[0])
                {
                    let valuePosition = 0;
                    let row = domConstruct.create("tr")
                    let firstTableData = domConstruct.create("td")
                    firstTableData.innerHTML = linePosition
                    domConstruct.place(firstTableData, row)
                    do{
                        let tableData = domConstruct.create("td")

                        let thisValue = this.values[valuePosition][linePosition]

                        tableData.innerHTML = thisValue;
                        domConstruct.place(tableData, row)
                        valuePosition++;
                    }while(valuePosition<this.mostValuesInLine)
                    domConstruct.place(row, table)
                    linePosition++
                }

                domConstruct.place(table, this._previewPane)


            },
            getValuesOfIndex(number){
                if(!(this.values[number] instanceof Array))
                {
                    this.values[number] = []
                }
                return this.values[number]
            },

            getWorkspaceDomNode: function () {
                return this.domNode;
            },
            unload: function () {
                this.destroy();
            }
        });
    }
);




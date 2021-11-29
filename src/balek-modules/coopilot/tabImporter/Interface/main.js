define(['dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/topic',
        'dojo/on',
        'dojo/query',

        "dojo/dom-construct",
        'dojo/dom-style',
        "dojo/dom-class",
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
              query,

              domConstruct,
              domStyle,
              domClass,
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

            _fileInfoPane: null,
            _previewPane: null,
            _outputPane: null,
            _outputPreviewPane: null,
            _dropZone: null,

           // values: null,

            lines: null,
            headerStart: 0,
            footerStart: 0,

            mostValuesInLine: 0,

            constructor: function (args) {
                this.values = Array()
                this.lines = Array()
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
            },
            _onKeyDown: function (keyUpEvent) {
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
            _onDropped: function(dropEvent){
                dropEvent.preventDefault()
                dropEvent.stopPropagation()

                let dataTransfer = dropEvent.dataTransfer
                let files = dataTransfer.files

                let file = files[0];

                if (file.type.match('text.*')) {
                    let reader = new FileReader();
                    reader.onload = lang.hitch(this, function (onLoadEvent) {
                   console.log(onLoadEvent.target.result)
                        this._previewPane.innerHTML = "";

                        this._fileInfoPane.innerHTML = ""
                        this._fileInfoPane.innerHTML += "Importing: " + file.name;
                        this._fileInfoPane.innerHTML += " size:" + file.size/1024;

                        this._fileInfoPane.innerHTML += " lastModified:" + Date(file.lastModified);



                        this.parseTabSeperatedString( onLoadEvent.target.result)
                    });
                    // Read in the image file as a data URL.
                    reader.readAsText(file);
                } else {
                    alert("Not a Text File!");
                }




              //  this._textFile.files = files
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

                this.lines = []
                let linesArray = stringToParse.split("\n");

                for (const line of linesArray)
                {

                    let valuesArray = line.split("\t");
                    let valuesToSaveArray = [];

                    if (this.mostValuesInLine < valuesArray.length){
                        this.mostValuesInLine = valuesArray.length
                        this.headerStart = this.lines.length
                    }

                    if (this.mostValuesInLine > valuesArray.length){
                       this.footerStart = this.lines.length
                    }

                    for (const value of valuesArray) {
                       let valueWithoutQuotes = value.replace(/^["'](.+(?=["']$))["']$/, '$1');
                        //regex removes quotes around value
                        valuesToSaveArray.push(valueWithoutQuotes);

                    }
                    this.lines.push(valuesToSaveArray)

                }

                this._fileInfoPane.innerHTML += "\n Lines: "+ linesArray.length;
                this._fileInfoPane.innerHTML += " Columns: "+ this.mostValuesInLine;
                this._fileInfoPane.innerHTML += " Header: "+ this.headerStart;
                this._fileInfoPane.innerHTML += " Footer: "+ this.footerStart;

                this.refreshTable()
            },
            refreshTable: function(){


                let linePosition = 0


                let table = domConstruct.create("table");
                let tableClassString = this.baseClass+"Table"
                domClass.add(table, tableClassString)

                for (const line of this.lines)
                {
                    if( linePosition >= this.headerStart && linePosition < this.footerStart)
                    {
                        let row = domConstruct.create("tr")
                        let rowClassString = this.baseClass+"TableRow"
                        let valuePosition = 0
                        let firstTableData = domConstruct.create("td")
                        let tableClassString = this.baseClass+"TableRowIdentityCell"


                        domClass.add(row, rowClassString)
                        domClass.add(firstTableData, tableClassString)

                        on(firstTableData, "mouseenter", function (mouseEvent){
                            //query(String("." + tableClassString)).style("backgroundColor", "orange");
                            let nodeList = query(String("." + tableClassString), this._previewPane);

                            for ( const node of nodeList)
                            {
                                domStyle.set(node,"backgroundColor", "green" )

                            }
                        })

                        on(firstTableData, "mouseleave", function (mouseEvent){
                            //query(String("." + tableClassString)).style("backgroundColor", "orange");
                            let nodeList = query(String("." + tableClassString), this._previewPane);
                            console.log(nodeList)

                            for ( const node of nodeList)
                            {
                                domStyle.set(node,"backgroundColor", "black" )

                            }
                        })


                        firstTableData.innerHTML = "⬆️" + linePosition + "⬇️️"
                        domConstruct.place(firstTableData, row)

                        for( const value of line)
                        {
                            let tableData = domConstruct.create("td")

                            let tableClassString = this.baseClass+"TableRowIdentityCell" + valuePosition.toString()

                            domClass.add(tableData, tableClassString)

                            on(tableData, "mouseenter", function (mouseEvent){
                                //query(String("." + tableClassString)).style("backgroundColor", "orange");
                                let nodeList = query(String("." + tableClassString), this._previewPane);

                                for ( const node of nodeList)
                                {
                                    domStyle.set(node,"backgroundColor", "green" )
                                    domStyle.set(node,"cursor", "pointer" )

                                }
                            })

                            on(tableData, "mouseleave", function (mouseEvent){
                                //query(String("." + tableClassString)).style("backgroundColor", "orange");
                                let nodeList = query(String("." + tableClassString), this._previewPane);

                                for ( const node of nodeList)
                                {
                                    domStyle.set(node,"backgroundColor", "unset" )
                                    domStyle.set(node,"cursor", "unset" )

                                }
                            })

                            let currentColumn = valuePosition.valueOf()
                            on(tableData, "dblclick", lang.hitch(this, function (mouseEvent){

                                //query(String("." + tableClassString)).style("backgroundColor", "orange");
                                let nodeList = query(String("." + tableClassString), this._previewPane);

                                let currentColumnValueArray = this.getColumnValueArray(currentColumn)

                                console.log("Get currentColumnValueArray:", currentColumnValueArray);

                                this._outputPreviewPane.innerHTML = currentColumnValueArray.join(",")
                                for ( const node of nodeList)
                                {
                                    domStyle.set(node,"backgroundColor", "unset" )
                                    domStyle.set(node,"cursor", "unset" )

                                }
                            }))




                            tableData.innerHTML = value;
                            domConstruct.place(tableData, row)
                            valuePosition++
                        }

                        domConstruct.place(row, table)
                    }

                    linePosition++
                }

                domConstruct.place(table, this._previewPane)


            },
            getColumnValueArray(columnIndex){
                let returnIndex = []
                let linePosition = 0
                for( const line of this.lines)
                {
                    if( linePosition >= this.headerStart && linePosition < this.footerStart) {

                        returnIndex.push(line[columnIndex])
                    }
                        linePosition++
                }
                return returnIndex
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




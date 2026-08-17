class KendoApi {

    public static Date(name: string, _this: any, year: number, month: number, day: number, timeAction: string): kendo.ui.DateTimePicker  {

       let time: any;
       let result =  $("." + name).kendoDateTimePicker({
           timeFormat: "HH:mm",
           format: "yyyy/MM/dd HH:mm",
           value: new Date(),
           change: function () {
               time = this.value();
               console.log(time);
               if (timeAction == "start") {
                   _this.startTime = time;
               } else {
                   _this.endTime = time;
               }
           }
       }).data("kendoDateTimePicker");

        return result;
    }

    public static dataGrid(name: string) {
    }

    public static FabGrid(className: string, cbnItem: number, fab: string, dataSource: Array<any>) {
        let headerTemplate = "<input type='checkbox' class='k-checkbox " + className + "-all'>";
        $("." + className).kendoGrid({
            dataSource: dataSource,
            columns: [{
                //selectable: true,
                width: 30,
                headerTemplate: headerTemplate,
                template: "<input type='checkbox' class='k-checkbox " + className
                    + "-check #=name#' id='#=name#' fab='" + fab + "' fabClass='#=fabClass#' cbnItem = '" + cbnItem + "'>"
            }, {
                title: "Data",
                field: "name",
                attributes: {
                    "class": className + "-name"
                }
            }],

            //selectable: 'multiple',
        });
    }

    public static VariablesSelectionGrid(className: string, type: string, dataSource: Array<any>) {
        $("." + className).kendoGrid({
            dataSource: dataSource,
            columns: [ {
                //title: "Input (X)",
                width:40,
                headerTemplate: "<input type='checkbox' class='k-checkbox " + className + "-checkAll' " +
                    "variableType='" + type + "'>",
                template: "<input type='checkbox' class='k-checkbox " + className
                    + "-checkItem' name='#=name#' variableType='" + type + "'>"
            }, {
                    title: "Variable Name",
                    field: "name",
                    attributes: { "class": "min-width-class" }
            }],
            scrollable: false
        });
        
    }

    public static DMW_Switch(_this: any) {
    _this.kendoDMWSwitch  =  $(".input-dmw-switch").kendoDropDownList({
            dataSource: {
                data: ["Without DMW", "Normal DMW", "Clustering DMW","Tune by Each Point"]
            },
            change: function () {
                var value = this.value();
                switch (value) {
                    case "Without DMW": {
                        _this.DMW_switch = 0;
                        break;
                    }
                    case "Normal DMW": {
                        _this.DMW_switch = 1;
                        break;
                    }
                    case "Clustering DMW": {
                        _this.DMW_switch = 2;
                        break;
                    }
                    case "Tune by Each Point": {
                        _this.DMW_switch = 3;
                        break;
                    }
                }
            },
            value: "Without DMW"
        }).data("kendoDropDownList");
    }

    public static KSSNumericInput(_this: any) {
        if (!$(".kss-model-expansion-size").hasClass("k-input")) {
             $(".kss-model-expansion-size").kendoNumericTextBox({
                change: function (e) {
                    var value = this.value();
                    _this.modelExpansionSize = value;
                }
            }).data("kendoNumericTextBox");

            $(".kss-model-adjusty-scale").kendoNumericTextBox({
                change: function (e) {
                    var value = this.value();
                    _this.adjustYScale = value;
                },
                step: 0.1
            }).data("kendoNumericTextBox");
        }
    }

    public static NaNChartPlotBands(indicators: Array<any>) {
        let plodBands: Array<kendo.dataviz.ui.ChartCategoryAxisItemPlotBand> = [];
        for (let i = 0; i < indicators.length; i++) {
            if (indicators[i] == "NaN") {
                plodBands.push({
                    from: i,
                    to: i + 1,
                    color: "#9D9D9D",
                    opacity: 0.5
                })
            }
        }
        return plodBands;
    }
}
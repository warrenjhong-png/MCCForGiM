class KendoApi {
    static Date(name, _this, year, month, day, timeAction) {
        let time;
        let result = $("." + name).kendoDateTimePicker({
            timeFormat: "HH:mm:ss",
            format: "yyyy/MM/dd HH:mm:ss",
            value: new Date(year, month, day, 0, 0, 0),
            change: function () {
                time = this.value();
                console.log(time);
                if (timeAction == "start") {
                    _this.startTime = time;
                }
                else {
                    _this.endTime = time;
                }
            }
        }).data("kendoDateTimePicker");
        return result;
    }
    static dataGrid(name) {
    }
    static FabGrid(className, cbnItem, fab, dataSource) {
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
    static VariablesSelectionGrid(className, type, dataSource) {
        $("." + className).kendoGrid({
            dataSource: dataSource,
            columns: [{
                    //title: "Input (X)",
                    width: 40,
                    headerTemplate: "<input type='checkbox' class='k-checkbox " + className + "-checkAll' " +
                        "variableType='" + type + "'>",
                    template: "<input type='checkbox' class='k-checkbox " + className
                        + "-checkItem' name='#=name#' variableType='" + type + "'>"
                }, {
                    title: "Variable Name",
                    field: "name",
                    attributes: { "class": "min-width-class" }
                }, {
                    title: "FieldName",
                    field: "fieldName",
                    attributes: { "class": "min-width-class" }
                }],
            scrollable: false
        });
    }
    static DMW_Switch(_this) {
        _this.kendoDMWSwitch = $(".input-dmw-switch").kendoDropDownList({
            dataSource: {
                data: ["Without DMW", "Normal DMW", "Clustering DMW", "Tune by Each Point"]
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
    static KSSNumericInput(_this) {
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
    static NaNChartPlotBands(indicators) {
        let plodBands = [];
        for (let i = 0; i < indicators.length; i++) {
            if (indicators[i] == "NaN") {
                plodBands.push({
                    from: i,
                    to: i + 1,
                    color: "#9D9D9D",
                    opacity: 0.5
                });
            }
        }
        return plodBands;
    }
}
//# sourceMappingURL=KendoApi.js.map
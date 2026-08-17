var Method;
(function (Method) {
    function Build(path) {
        let result;
        $.ajax({
            url: generateUrl() + "/Avm/BuildModel",
            async: false,
            cache: false,
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            dataType: "json",
            //method: "POST",
            type: "POST",
            data: JSON.stringify({ 'path': null }),
            success: function (data, textStatus, jqXHR) {
                result = data;
                console.log(data);
                console.log(textStatus);
                console.log(jqXHR);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("Build Error : ");
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
        return result;
    }
    Method.Build = Build;
    function bindPieceCheckboxEvents() {
        $(".piece-select-all")
            .off("change")
            .on("change", function () {
            const checked = $(this).prop("checked");
            $(".piece-select-check").prop("checked", checked);
        });
        $(".piece-select-check")
            .off("change")
            .on("change", function () {
            const totalCount = $(".piece-select-check").length;
            const checkedCount = $(".piece-select-check:checked").length;
            $(".piece-select-all").prop("checked", totalCount > 0 &&
                totalCount === checkedCount);
        });
    }
    Method.bindPieceCheckboxEvents = bindPieceCheckboxEvents;
    function generateUrl() {
        if (location.pathname != "/")
            if (location.pathname.indexOf("Avm") > -1) {
                let split = location.pathname.split("/Avm");
                return location.origin + split[0];
            }
            else {
                return location.origin + location.pathname;
            }
        else
            return location.origin;
    }
    Method.generateUrl = generateUrl;
    function getChartYScale(max, min) {
        let result;
        $.ajax({
            url: generateUrl() + "/Avm/ChartYScale",
            async: false,
            cache: false,
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            dataType: "json",
            //method: "POST",
            type: "POST",
            data: JSON.stringify({ max: max, min: min }),
            success: function (data, textStatus, jqXHR) {
                result = data;
                console.log(data);
                console.log(textStatus);
                console.log(jqXHR);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("Build Error : ");
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
        return result;
    }
    Method.getChartYScale = getChartYScale;
    function cbnRenderTime() {
        let result;
        $.ajax({
            url: generateUrl() + "/Avm/CbnTime",
            async: false,
            cache: false,
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            dataType: "json",
            //method: "POST",
            type: "POST",
            success: function (data, textStatus, jqXHR) {
                result = data;
                console.log(data);
                console.log(textStatus);
                console.log(jqXHR);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("Build Error : ");
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
        return result;
    }
    Method.cbnRenderTime = cbnRenderTime;
    function addCombinationGrid(fab, className) {
        $(".fab-grid").append("<div class='col-lg-3 " + className + "-grid" + "' style='display:none'>" +
            "<div class = 'setting-title'>" + fab + "</div>" +
            "<div class=' " + className + "' style='height:60vh'>" + "</div>" +
            "</div>");
    }
    Method.addCombinationGrid = addCombinationGrid;
    function addVariableGrid(variable) {
        let className = generateClassName(variable.Name);
        let type = generateClassName(variable.Type);
        let col = type == "process" ? "4" : "12";
        $(".variables-" + type + "-grid").append("<div class = 'col-lg-" + col + " " + className + "-grid'>"
            + "<div class='setting-title'>" + variable.Name + "</div>"
            + "<div class='" + className + "' style='height:36vh;overflow-y: auto;'></div>"
            + "</div>");
        if (variable.HasStep == 1) {
            $("." + className + "-grid").append("<div class='setting-title'>" + variable.StepID.Name + "</div>");
            $("." + className + "-grid").append("<div class='" + className
                + "-setpId color-white' style='height:20vh;padding:5px;overflow-y: auto;'></div>");
        }
    }
    Method.addVariableGrid = addVariableGrid;
    function stepListCheckBoxHtml(className, stepId) {
        $("." + className + "-setpId").append("<ul style='margin-left:-2.5em;'>" +
            "<div class= '" + className + "-stepId-open-btn stepId-open-btn' closed = 'close'>＋</div>" +
            "<input type='checkbox' class='" + className + "-stepIdAll'>" +
            stepId.Name +
            "</ul>");
        for (let i = 0; i < stepId.Data.length; i++) {
            $("." + className + "-setpId > ul").append("<li style='padding-left: 2.25em;'>" +
                "<input type='checkbox' class = '" + className + "-stepIdItem' style = 'margin-right:0.5em;'" +
                "step = '" + stepId.Data[i] + "' >" + stepId.Data[i] +
                "</li>");
        }
        $("." + className + "-setpId > ul > li").css("display", "none");
        $("." + className + "-stepId-open-btn").click(function () {
            let listOpenbtn = $("." + className + "-stepId-open-btn");
            if (listOpenbtn.attr("closed") == "close") {
                listOpenbtn.text("－");
                $("." + className + "-setpId > ul > li").css("display", "block");
                listOpenbtn.attr("closed", "open");
            }
            else {
                $("." + className + "-setpId > ul > li").css("display", "none");
                listOpenbtn.attr("closed", "close");
                listOpenbtn.text("＋");
            }
        });
        $("." + className + "-stepId-open-btn").trigger("click");
    }
    Method.stepListCheckBoxHtml = stepListCheckBoxHtml;
    function rawDataIsNull(pieceList, data, loseDataIds, step) {
        /* 比對所選擇的peceid
         * 如果目前的新增的indicator沒有某個pieceid
         * 則將該pieceid和step記錄下來
         */
        for (let i = 0; i < pieceList.length; i++) {
            let exist = false;
            data.forEach((item) => {
                if (item.Id == pieceList[i]) {
                    exist = true;
                    return;
                }
            });
            //比對load data id是否有重複的
            loseDataIds.forEach((item) => {
                if (item.pieceid == pieceList[i] && item.step == step) {
                    exist = true;
                }
            });
            if (exist == false) {
                loseDataIds.push({
                    pieceid: pieceList[i],
                    step: step
                });
            }
        }
        return loseDataIds;
    }
    Method.rawDataIsNull = rawDataIsNull;
    function generateClassName(name) {
        name = name.replace(/ /g, "-").toLocaleLowerCase();
        return name;
    }
    Method.generateClassName = generateClassName;
    function rawDataTrim(trimStart, trimEnd, rawData) {
        let _rawData = [];
        for (let j = trimStart; j < trimEnd; j++) {
            if (rawData.Data[j] != null) {
                _rawData.push(rawData.Data[j]);
            }
        }
        return _rawData;
    }
    Method.rawDataTrim = rawDataTrim;
    function replaceDot(string) {
        if (string.indexOf(".") !== -1) {
            return string.replace(/\./g, "\\.");
        }
        else {
            return string;
        }
    }
    Method.replaceDot = replaceDot;
    function indicatorRuleSpecDelete(moduleIndicatorRule, deleteId) {
        let newArr = new ModuleIndicatorRule();
        for (let i = 0; i < moduleIndicatorRule.EK.length; i++) {
            let isDeleteId = false;
            for (let j = 0; j < deleteId.length; j++) {
                if (deleteId[j] == moduleIndicatorRule.EK[i]) {
                    isDeleteId = true;
                }
            }
            if (isDeleteId == false) {
                newArr.EK.push(moduleIndicatorRule.EK[i]);
                newArr.IndicatorUSL.push(moduleIndicatorRule.IndicatorUSL[i]);
                newArr.IndicatorLSL.push(moduleIndicatorRule.IndicatorLSL[i]);
                newArr.IndicatorUCL.push(moduleIndicatorRule.IndicatorUCL[i]);
                newArr.IndicatorLCL.push(moduleIndicatorRule.IndicatorLCL[i]);
            }
        }
        return newArr;
    }
    Method.indicatorRuleSpecDelete = indicatorRuleSpecDelete;
    function mathSixRound(num) {
        if (String(num).indexOf(".")) {
            return (Math.round(num * 1000000) / 1000000).toFixed(6);
        }
        else {
            return num;
        }
    }
    Method.mathSixRound = mathSixRound;
    function mathThreeRound(num) {
        if (String(num).indexOf(".")) {
            return (Math.round(num * 1000000) / 1000000).toFixed(3);
        }
        else {
            return num;
        }
    }
    Method.mathThreeRound = mathThreeRound;
    function DateTimeFormat(dateTime) {
        const year = dateTime.getFullYear();
        // 取得月份（從 0 開始，所以需要加 1）
        const month = dateTime.getMonth() + 1;
        // 取得日期
        const day = dateTime.getDate();
        // 取得小時
        const hours = dateTime.getHours();
        // 取得分鐘
        const minutes = dateTime.getMinutes();
        // 格式化成 "YYYY-MM-DD HH:MM:SS" 格式
        const formattedDate = `${year}/${month}/${day} ${hours}:${minutes}`;
        return formattedDate;
    }
    Method.DateTimeFormat = DateTimeFormat;
    function getVariableNameById(variableId) {
        let variableName = "";
        $(".rawData-variable").each(function () {
            const currentVariableId = $(this).attr("variableId");
            if (currentVariableId === variableId) {
                variableName =
                    $(this).attr("name") || "";
                return false;
            }
        });
        return variableName || variableId;
    }
    Method.getVariableNameById = getVariableNameById;
    function buildRuleGrid(indicatorRule, onDelete) {
        const $gridElement = $(".rule-grid");
        const oldGrid = $gridElement.data("kendoGrid");
        if (oldGrid) {
            oldGrid.destroy();
            $gridElement.empty();
        }
        $gridElement.kendoGrid({
            toolbar: [
                {
                    template: "<button type='button' " +
                        "class='k-button rule-delete-btn'>" +
                        "X Delete" +
                        "</button>"
                },
                "excel"
            ],
            dataSource: {
                data: indicatorRule
            },
            columns: [
                {
                    template: "<input class='check-rule' " +
                        "data-rule-id='#=ruleId#' " +
                        "type='checkbox'>",
                    width: 30
                },
                {
                    title: "Rule ID",
                    field: "ruleId",
                    width: 80
                },
                {
                    title: "Group Name",
                    field: "groupName",
                    width: 180
                },
                {
                    title: "Indicator Name",
                    field: "indicatorName",
                    width: 450
                },
                {
                    title: "Variable",
                    field: "variable",
                    width: 300
                },
                {
                    title: "Start Time",
                    field: "startTime",
                    width: 160,
                    template: "#= startTime " +
                        "? kendo.toString(new Date(startTime), " +
                        "'yyyy-MM-dd HH:mm:ss') : '' #"
                },
                {
                    title: "End Time",
                    field: "endTime",
                    width: 160,
                    template: "#= endTime " +
                        "? kendo.toString(new Date(endTime), " +
                        "'yyyy-MM-dd HH:mm:ss') : '' #"
                },
                {
                    title: "Limit",
                    field: "limit",
                    hidden: true,
                    width: 80,
                    template: function (e) {
                        return e.limit
                            ? "<div style='color:green'>Yes</div>"
                            : "<div style='color:red'>No</div>";
                    }
                }
            ],
            resizable: true,
            selectable: true,
            dataBound: function () {
                $(".rule-delete-btn")
                    .off("click")
                    .on("click", function () {
                    const deleteRuleIds = [];
                    $(".check-rule").each(function () {
                        if (!$(this).prop("checked")) {
                            return;
                        }
                        const value = $(this).attr("data-rule-id");
                        const id = parseInt(value || "0", 10);
                        if (id > 0) {
                            deleteRuleIds.push(id);
                        }
                    });
                    if (deleteRuleIds.length > 0) {
                        onDelete(deleteRuleIds);
                    }
                });
            }
        });
    }
    Method.buildRuleGrid = buildRuleGrid;
    function rebuildRuleIds(indicatorRule, filterrulesDCP, indicatorrulesDCP) {
        indicatorRule.forEach(function (rule, index) {
            rule.ruleId = index + 1;
        });
        filterrulesDCP.forEach(function (rule, index) {
            rule.ruleid = index + 1;
        });
        indicatorrulesDCP.forEach(function (rule, index) {
            rule.ruleid = index + 1;
            rule.filterruleid = index + 1;
        });
        return indicatorRule.length + 1;
    }
    Method.rebuildRuleIds = rebuildRuleIds;
    function buildEnergyPredictionDCP(sourceRules) {
        const filterRuleList = [];
        const indicatorRuleList = [];
        for (let i = 0; i < sourceRules.length; i++) {
            const sourceRule = sourceRules[i];
            const currentRuleId = i + 1;
            const variableId = Number(sourceRule.variableId);
            if (isNaN(variableId) ||
                variableId <= 0) {
                throw new Error("Variable ID 格式錯誤：" +
                    sourceRule.variableId);
            }
            let separatorValue = "";
            if (sourceRule.stepId !== undefined &&
                sourceRule.stepId !== null) {
                // 若不慎存成陣列，取第一筆
                if (Array.isArray(sourceRule.stepId)) {
                    separatorValue =
                        sourceRule.stepId.length > 0
                            ? String(sourceRule.stepId[0])
                            : "";
                }
                else {
                    separatorValue =
                        String(sourceRule.stepId);
                }
            }
            const filterRule = new filterrules();
            filterRule.ruleid =
                currentRuleId;
            filterRule.variableid =
                variableId;
            // 後端型別是 string，不是陣列
            filterRule.separatingvalues =
                separatorValue;
            // 不再使用 RawData 裁切
            filterRule.trimbegin = 0;
            filterRule.trimend = 0;
            /*
             * 舊有 BuildModelMethod 會根據 rulename
             * 分析 Variable Group 與 Variable Name，
             * 因此保留 group_variable 格式。
             */
            filterRule.rulename =
                sourceRule.indicatorName;
            filterRuleList.push(filterRule);
            const indicatorRule = new indicatorrules();
            indicatorRule.ruleid =
                currentRuleId;
            indicatorRule.filterruleid =
                currentRuleId;
            /*
             * 能源預測不再從 RawData 計算 Mean、Std 等 Indicator，
             * 暫時使用空字串。
             */
            indicatorRule.algorithm =
                sourceRule.algorithm || "";
            indicatorRule.rulename =
                sourceRule.indicatorName;
            indicatorRuleList.push(indicatorRule);
        }
        return {
            filterrulesDCP: filterRuleList,
            indicatorrulesDCP: indicatorRuleList
        };
    }
    Method.buildEnergyPredictionDCP = buildEnergyPredictionDCP;
})(Method || (Method = {}));
//# sourceMappingURL=Method.js.map
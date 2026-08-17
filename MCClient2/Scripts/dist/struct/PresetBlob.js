var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//
var PresetBlob;
(function (PresetBlob) {
    function CombinationSelection(_this, data) {
        return __awaiter(this, void 0, void 0, function* () {
            //trigger query
            let combination = data;
            if (combination.fileType == "Combination") {
                $(".date-start").prop("value", kendo.toString(new Date(combination.startTime), "yyyy/MM/dd HH:mm"));
                $(".date-end").prop("value", kendo.toString(new Date(combination.endTime), "yyyy/MM/dd HH:mm"));
                _this.startTime = combination.startTime;
                _this.endTime = combination.endTime;
                let condition = JSON.parse(combination.fabInput.data);
                let keys = Object.keys(condition);
                let conditionItem = 0;
                $(".click-query-btn").trigger("click");
                let delayRenderTime = Method.cbnRenderTime();
                let addDelayTime = 0;
                const promises = [];
                const targetNode = document.querySelector(".fab-grid");
                const observer = new MutationObserver((mutationsList, observer) => {
                    // 在回調函式中處理 DOM 變化
                    function preset() {
                        const checkElementAvailability = new Promise((resolve) => {
                            for (let i = 0; i < condition[keys[conditionItem]].length; i++) {
                                const elementSelector = "." + Method.replaceDot(condition[keys[conditionItem]][i]);
                                const checkElement = () => {
                                    const element = document.querySelector(elementSelector);
                                    if (element) {
                                        $(element).prop("checked", true);
                                        if (i + 1 == condition[keys[conditionItem]].length) {
                                            setTimeout(function () {
                                                $("." + keys[conditionItem].toLowerCase() + "-check").trigger("change");
                                                if (conditionItem < keys.length) {
                                                    conditionItem++;
                                                    preset();
                                                }
                                            }, parseInt(delayRenderTime));
                                        }
                                    }
                                    else {
                                        setTimeout(checkElement, parseInt(delayRenderTime)); // 等待 1000 毫秒後重新檢查元素是否存在
                                    }
                                };
                                checkElement();
                            }
                            addDelayTime += parseInt(delayRenderTime);
                            resolve();
                        });
                        promises.push(checkElementAvailability);
                        if (conditionItem == keys.length - 1) {
                            Promise.all(promises).then(function () {
                                _this.pieceCount = "Searching...";
                                setTimeout(function () {
                                    _this.getPieceCount();
                                    _this.pieceSelect();
                                    $(".piece-select-check").each(function () {
                                        if (combination.pieceList.indexOf($(this).attr("pieceid")) == -1) {
                                            //$(this).prop("checked", false);
                                            $(this).trigger("click");
                                        }
                                    });
                                    setTimeout(function () {
                                        $(".piece-setting-btn").trigger("click");
                                        observer.disconnect();
                                        setTimeout(function () {
                                            alert("Loading completed.");
                                        }, 2000);
                                    }, 2000);
                                }, addDelayTime);
                            });
                        }
                    }
                    preset();
                });
                observer.observe(targetNode, { childList: true, attributes: true });
            }
            else {
                alert("The format does not match.");
            }
        });
    }
    PresetBlob.CombinationSelection = CombinationSelection;
    function LoadVariableSelection(_this, data) {
        let variables = data;
        try {
            if (variables[0].fileType == "Variables") {
                let input = 0;
                let output = 0;
                for (let i = 0; i < variables.length; i++) {
                    //select variable
                    let className = variables[i].process;
                    if (variables[i].process.length != 0) {
                        $("." + className + "-checkItem").each(function () {
                            if (variables[i].variables.indexOf($(this).attr("name")) > -1) {
                                $(this).prop("checked", true);
                                if (variables[i].type == "PROCESS") {
                                    input++;
                                }
                                else {
                                    output++;
                                }
                                ;
                            }
                        });
                        $("." + className + "-stepIdItem").each(function () {
                            if (variables[i].step.indexOf($(this).attr("step")) > -1) {
                                $(this).prop("checked", true);
                            }
                        });
                    }
                }
                _this.inputCount = input;
                _this.outputCount = output;
            }
            else {
                alert("The format does not match.");
            }
            setTimeout(function () {
                alert("Loading completed.");
            }, 1000);
        }
        catch (error) {
            alert("The format does not match.");
        }
    }
    PresetBlob.LoadVariableSelection = LoadVariableSelection;
    function LoadPreprocessing(_this, data, filterrulesDCP, indicatorrulesDCP, indicatorRule, moduleIndicatorRule, variablegroupsDCP) {
        let preprocessing = data;
        let tmpindicatorRule = [];
        //先檢查indicatorRule
        _this.temporalData = false;
        _this.preset = true;
        sessionStorage.setItem("LoadPreprocessing", "true");
        _this.specSetting();
        _this.conSetting();
        //if (_this.specManual == false && _this.conManual == false) {
        //    $(".specManual").trigger("click");
        //    $(".conManual").trigger("click");
        //}
        let i = 0;
        setTimeout(function () {
            return __awaiter(this, void 0, void 0, function* () {
                preset();
                function preset() {
                    return __awaiter(this, void 0, void 0, function* () {
                        let variableSelect = false;
                        let optionSelect = false;
                        const promises = [];
                        //inupt spec
                        if (preprocessing.indicatorRule[i].specModel == "Manual") {
                            _this.specManual = true;
                            _this.usl = preprocessing.indicatorRule[i].USL;
                            _this.lsl = preprocessing.indicatorRule[i].LSL;
                            _this.specCheck("specManual");
                        }
                        else if (preprocessing.indicatorRule[i].specModel == "Sigma") {
                            _this.specSigma = true;
                            _this.specSigmaValue = preprocessing.indicatorRule[i].specSettingValue;
                            _this.specCheck("specSigma");
                        }
                        else if (preprocessing.indicatorRule[i].specModel = "Percentage") {
                            _this.specPercentage = true;
                            _this.specPercentageValue = preprocessing.indicatorRule[i].specSettingValue;
                            _this.specCheck("specPercentage");
                        }
                        //input con
                        if (preprocessing.indicatorRule[i].conModel == "Manual") {
                            _this.conManual = true;
                            _this.ucl = preprocessing.indicatorRule[i].UCL;
                            _this.lcl = preprocessing.indicatorRule[i].LCL;
                            _this.conCheck("conManual");
                        }
                        else if (preprocessing.indicatorRule[i].conModel == "Sigma") {
                            _this.conSigma = true;
                            _this.conSigmaValue = preprocessing.indicatorRule[i].conSettingValue;
                            _this.conCheck("conSigma");
                        }
                        else if (preprocessing.indicatorRule[i].conModel = "Percentage") {
                            _this.conPercentage = true;
                            _this.conPercentageValue = preprocessing.indicatorRule[i].conSettingValue;
                            _this.conCheck("conPercentage");
                        }
                        if (i + 1 == preprocessing.indicatorRule.length) {
                            _this.temporalData = true;
                            _this.preset = false;
                        }
                        //select variable groups
                        //確定.varable-group元素已產生
                        function variableGroups() {
                            return __awaiter(this, void 0, void 0, function* () {
                                WaitDom(".variable-group");
                                $(".variable-group").each(function () {
                                    if ($(this).attr("name") == preprocessing.indicatorRule[i].groupName) {
                                        $(this).trigger("click");
                                    }
                                });
                                //return new Promise((resolve) => { 
                                //    $(".variable-group").each(function () {
                                //        if ($(this).attr("name") == preprocessing.indicatorRule[i].groupName) {
                                //            $(this).trigger("click");
                                //            return;
                                //        }
                                //    });
                                //    resolve();
                                //});
                            });
                        }
                        //select variable
                        //確定.rawData-variable元素已產生
                        function variable() {
                            return __awaiter(this, void 0, void 0, function* () {
                                WaitDom(".rawData-variable");
                                $(".rawData-variable").each(function () {
                                    if ($(this).attr("name") == preprocessing.indicatorRule[i].variable) {
                                        $(this).prop("checked", false);
                                        $(this).trigger("click");
                                        variableSelect = true;
                                    }
                                });
                                //return new Promise((resolve) => { 
                                //    $(".rawData-variable").each(function () {
                                //        if ($(this).attr("name") == preprocessing.indicatorRule[i].variable) {
                                //            $(this).prop("checked",false);
                                //            $(this).trigger("click");
                                //            variableSelect = true;
                                //            return;
                                //        }
                                //    });
                                //    resolve();
                                //});
                            });
                        }
                        //select chart option
                        //確定.separator-value已產生
                        function option() {
                            return __awaiter(this, void 0, void 0, function* () {
                                return new Promise((resolve) => {
                                    if ($(".separator-value").length == 0) {
                                        optionSelect = true;
                                    }
                                    $(".separator-value").each(function () {
                                        return __awaiter(this, void 0, void 0, function* () {
                                            if ($(this).attr("name") == preprocessing.indicatorRule[i].stepId) {
                                                $(this).prop("checked", false);
                                                $(this).trigger("click");
                                                optionSelect = true;
                                                return;
                                            }
                                        });
                                    });
                                    resolve();
                                });
                            });
                        }
                        //select alg
                        function algorithm() {
                            return __awaiter(this, void 0, void 0, function* () {
                                $(".alg-check").each(function () {
                                    $(this).prop("checked", false);
                                });
                                return new Promise((resolve) => {
                                    $(".alg-check").each(function () {
                                        //$(this).prop("checked", false);
                                        if ($(this).attr("name") == preprocessing.indicatorRule[i].algorithm) {
                                            $(this).trigger("click");
                                            return;
                                        }
                                    });
                                    resolve();
                                });
                            });
                        }
                        function delay(ms) {
                            return new Promise(resolve => setTimeout(resolve, ms));
                        }
                        yield variableGroups();
                        yield delay(2000);
                        yield variable();
                        yield delay(2000);
                        if (variableSelect) {
                            yield option();
                        }
                        if (optionSelect) {
                            yield algorithm();
                            yield delay(2000);
                        }
                        yield delay(2000);
                        if (variableSelect && optionSelect) {
                            //trim
                            _this.limitCheckBox = preprocessing.indicatorRule[i].limit;
                            _this.inputBegin = preprocessing.indicatorRule[i].trimBegin;
                            _this.trimEnd = preprocessing.indicatorRule[i].trimEnd;
                            _this.trim();
                            yield delay(2000);
                            //tigger add rule
                            _this.addRule();
                            yield delay(2000);
                        }
                        if (i < preprocessing.indicatorRule.length) {
                            i++;
                            preset();
                        }
                        else {
                            alert("Loading completed.");
                        }
                    });
                }
                sessionStorage.setItem("LoadPreprocessing", "false");
            });
        }, 1000);
    }
    PresetBlob.LoadPreprocessing = LoadPreprocessing;
    function WaitDom(dom) {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    const element = document.querySelector(dom);
                    if (element) {
                        // 你的元素已加載，執行程式碼
                        observer.disconnect(); // 停止監覽
                        return;
                    }
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
    PresetBlob.WaitDom = WaitDom;
    function LoadParameter(_this, data) {
        let parameter = data;
        if (parameter.fileType == "Parameter") {
            _this.metrologyTarget = parameter.buildModuleParameter.Measurement.Target;
            _this.metrologyUsl = parameter.buildModuleParameter.Measurement.USL;
            _this.metrologyLsl = parameter.buildModuleParameter.Measurement.LSL;
            _this.metrologyUcl = parameter.buildModuleParameter.Measurement.UCL;
            _this.metrologyLcl = parameter.buildModuleParameter.Measurement.LCL;
            _this.dqiySwitch = parameter.buildModuleParameter.Dqiy.DQIySwitch;
            _this.phaselErrorThreshold = parameter.buildModuleParameter.Dqiy.PhaseI_Error_Threshold;
            _this.lookAheadCount = parameter.buildModuleParameter.RI.LookAheadCount;
            _this.riMaxmumError = parameter.buildModuleParameter.RI.Tolerant_MaxError;
            let kssAlg = parameter.buildModuleParameter.KSS.InSelectAlgorithm;
            if (kssAlg == "SDMW") {
                $(".kss-sdmw").prop("checked", true);
            }
            else if (kssAlg == "SMW") {
                $(".kss-smw").prop("checked", true);
            }
            else if (kssAlg == "DMW") {
                $(".kss-dmw").prop("checked", true);
            }
            _this.adjustYScale = parameter.buildModuleParameter.KSS.AdjustYScale;
            _this.modelExpansionSize = parameter.buildModuleParameter.KSS.ModelExpansionSize;
            $(".kss-model-expansion-size").focus();
            $(".kss-model-adjusty-scale").focus();
            _this.modelExpansionOpen = parameter.buildModuleParameter.KSS.ModelExpansionOpen == 1 ? true : false;
            _this.modifyYOpen = parameter.buildModuleParameter.KSS.ModifyYOpen == 1 ? true : false;
            let momTerRange = parameter.buildModuleParameter.BPNN.InMomTermRange.length - 3;
            //如果大於0 代表json檔參數數量大於預設數量
            if (momTerRange > 0) {
                for (let i = 0; i < momTerRange; i++) {
                    if ($(".mom-input > input").length != parameter.buildModuleParameter.BPNN.InMomTermRange.length) {
                        _this.addMomInput();
                    }
                }
            }
            else if (momTerRange < 0) {
                for (let i = momTerRange; i < 0; i++) {
                    if ($(".mom-input > input").length != parameter.buildModuleParameter.BPNN.InMomTermRange.length) {
                        _this.deleteMomInput();
                    }
                }
            }
            let item = 0;
            $(".mom-input > input").each(function () {
                $(this).attr("value", parameter.buildModuleParameter.BPNN.InMomTermRange[item]);
                item++;
            });
            item = 0;
            let alphaRange = parameter.buildModuleParameter.BPNN.InAlphaRange.length - 2;
            if (alphaRange > 0) {
                for (let i = 0; i < alphaRange; i++) {
                    if ($(".alpha-input > input").length != parameter.buildModuleParameter.BPNN.InAlphaRange.length) {
                        _this.addAlphaInput();
                    }
                }
            }
            else if (alphaRange < 0) {
                for (let i = alphaRange; i < 0; i++) {
                    if ($(".alpha-input > input").length != parameter.buildModuleParameter.BPNN.InAlphaRange.length) {
                        _this.deleteAlphaInput();
                    }
                }
            }
            $(".alpha-input > input").each(function () {
                $(this).attr("value", parameter.buildModuleParameter.BPNN.InAlphaRange[item]);
                item++;
            });
            item = 0;
            let epochsRange = parameter.buildModuleParameter.BPNN.InEpochsRange.length - 5;
            if (epochsRange > 0) {
                for (let i = 0; i < epochsRange; i++) {
                    if ($(".epochs-input > input").length != parameter.buildModuleParameter.BPNN.InEpochsRange.length) {
                        _this.addEpochsInput();
                    }
                }
            }
            else if (epochsRange < 0) {
                for (let i = epochsRange; i < 0; i++) {
                    if ($(".epochs-input > input").length != parameter.buildModuleParameter.BPNN.InEpochsRange.length) {
                        _this.deleteEpochsInput();
                    }
                }
            }
            $(".epochs-input> input").each(function () {
                $(this).attr("value", parameter.buildModuleParameter.BPNN.InEpochsRange[item]);
                item++;
            });
            item = 0;
            let nodeRange = parameter.buildModuleParameter.BPNN.InNodesRange.length - 4;
            if (nodeRange > 0) {
                for (let i = 0; i < nodeRange; i++) {
                    if ($(".node-input > input").length != parameter.buildModuleParameter.BPNN.InNodesRange.length) {
                        _this.addNodeInput();
                    }
                }
            }
            else if (nodeRange < 0) {
                for (let i = nodeRange; i < 0; i++) {
                    if ($(".node-input > input").length != parameter.buildModuleParameter.BPNN.InNodesRange.length) {
                        _this.deleteNodeInput();
                    }
                }
            }
            $(".node-input> input").each(function () {
                $(this).attr("value", parameter.buildModuleParameter.BPNN.InNodesRange[item]);
                item++;
            });
            item = 0;
            _this.forceRefresh = parameter.buildModuleParameter.Refresh.forceRefresh;
            _this.CNNEnable = parameter.adasCNNEnable;
            _this.filters = parameter.avmAutoEncoderInfo.filters;
            _this.kernel_size = parameter.avmAutoEncoderInfo.kernel_size;
            _this.activation = parameter.avmAutoEncoderInfo.activation;
            _this.pool_size = parameter.avmAutoEncoderInfo.pool_size;
            _this.epoch = parameter.avmAutoEncoderInfo.epoch;
            _this.learningRate = parameter.avmAutoEncoderInfo.learningrate;
            _this.patience = parameter.avmAutoEncoderInfo.patience;
            _this.batch = parameter.avmAutoEncoderInfo.batch;
            _this.dropout = parameter.avmAutoEncoderInfo.dropout;
            _this.moment = parameter.avmAutoEncoderInfo.moment;
            _this.DMW_switch = parameter.avmAutoEncoderInfo.DMW_switch[0];
            _this.kendoDMWSwitch.select(_this.DMW_switch);
            _this.tune_frequency = parameter.avmAutoEncoderInfo.tune_frequency;
            _this.model_frequency = parameter.avmAutoEncoderInfo.model_frequency;
            _this.virtual_cassette = parameter.avmAutoEncoderInfo.virtual_cassette;
            _this.cnnForceRefresh = parameter.avmAutoEncoderInfo.Refresh.forceRefresh;
            setTimeout(function () {
                alert("Loading completed.");
            }, 1000);
        }
        else {
            alert("The format does not match.");
        }
    }
    PresetBlob.LoadParameter = LoadParameter;
    //檢查Load filterrule 裡面的rulename 是否有吻合目前variablegroupsDCP 的條件
    function checkFilterAndVariablegroupsDCP(ruleName, separatingvalues, variablegroupsDCP) {
        for (let i = 0; i < variablegroupsDCP.length; i++) {
            let chekcRuleName = false;
            let checkStep = false;
            for (let item in variablegroupsDCP[i].variables) {
                let name = variablegroupsDCP[i].filename + "_" + variablegroupsDCP[i].variables[item].variablename;
                if (ruleName.indexOf(name) > -1) {
                    chekcRuleName = true;
                }
                if (variablegroupsDCP[i].variables[item].separatingvalues.indexOf(separatingvalues) > -1) {
                    checkStep = true;
                }
            }
            if (checkStep == true && chekcRuleName == true) {
                return true;
            }
        }
        return false;
    }
    function moduleIndicatorRuleNew(indicatorRuleNew, moduleIndicatorRuleOld) {
        let ruleNew = new ModuleIndicatorRule();
        for (let i = 0; i < indicatorRuleNew.length; i++) {
            moduleIndicatorRuleOld.IndicatorUSL[i] = indicatorRuleNew[i].USL;
            moduleIndicatorRuleOld.IndicatorLSL[i] = indicatorRuleNew[i].LSL;
            moduleIndicatorRuleOld.IndicatorUCL[i] = indicatorRuleNew[i].UCL;
            moduleIndicatorRuleOld.IndicatorLCL[i] = indicatorRuleNew[i].LCL;
        }
        ruleNew = moduleIndicatorRuleOld;
        return ruleNew;
    }
    PresetBlob.moduleIndicatorRuleNew = moduleIndicatorRuleNew;
})(PresetBlob || (PresetBlob = {}));
var SaveBlob;
(function (SaveBlob) {
    function SaveCombinationSelectionJs(startTime, endTime, fabDetailIntput, pieceList) {
        //trigger query
        //date trigger
        let comSelection = new CombinationSelection();
        comSelection.startTime = startTime;
        comSelection.endTime = endTime;
        comSelection.fabInput = fabDetailIntput;
        comSelection.pieceList = pieceList;
        comSelection.fileType = "Combination";
        DownloadJson(comSelection, "combination");
    }
    SaveBlob.SaveCombinationSelectionJs = SaveCombinationSelectionJs;
    function SaveVariableSelectionJS(variables) {
        let variableSelections = [];
        for (let i = 0; i < variables.length; i++) {
            let className = Method.generateClassName(variables[i].Name);
            let selection = new VariableSelection();
            selection.process = className;
            selection.type = variables[i].Type;
            $("." + className + "-checkItem").each(function () {
                if ($(this).prop("checked")) {
                    selection.variables.push($(this).attr("name"));
                }
            });
            $("." + className + "-stepIdItem").each(function () {
                if ($(this).prop("checked")) {
                    selection.step.push($(this).attr("step"));
                }
            });
            selection.fileType = "Variables";
            variableSelections.push(selection);
        }
        DownloadJson(variableSelections, "variables");
    }
    SaveBlob.SaveVariableSelectionJS = SaveVariableSelectionJS;
    function SavePreprocessingJS(filterrulesDCP, indicatorrulesDCP, indicatorRule, moduleIndicatorRule) {
        let preprocessing = new Preprocessing();
        preprocessing.filterrulesDCP = filterrulesDCP;
        preprocessing.indicatorrulesDCP = indicatorrulesDCP;
        preprocessing.indicatorRule = indicatorRule;
        preprocessing.moduleIndicatorRule = moduleIndicatorRule;
        DownloadJson(preprocessing, "preprocessing");
    }
    SaveBlob.SavePreprocessingJS = SavePreprocessingJS;
    function SaveParameter(_this, buildModuleParameter, avmAutoEncoderInfo) {
        let parameter = new Parameter();
        buildModuleParameter.Measurement.Target = _this.metrologyTarget;
        buildModuleParameter.Measurement.USL = _this.metrologyUsl;
        buildModuleParameter.Measurement.LSL = _this.metrologyLsl;
        buildModuleParameter.Measurement.UCL = _this.metrologyUcl;
        buildModuleParameter.Measurement.LCL = _this.metrologyLcl;
        buildModuleParameter.Dqiy.DQIySwitch = _this.dqiySwitch;
        buildModuleParameter.Dqiy.PhaseI_Error_Threshold = _this.phaselErrorThreshold;
        //RI
        buildModuleParameter.RI.LookAheadCount = _this.lookAheadCount;
        buildModuleParameter.RI.Tolerant_MaxError = _this.riMaxmumError;
        //KSS
        let kssAlg = "";
        if ($(".kss-sdmw").prop("checked")) {
            kssAlg = "SDMW";
        }
        else if ($(".kss-smw").prop("checked")) {
            kssAlg = "SMW";
        }
        else if ($(".kss-dmw").prop("checked")) {
            kssAlg = "DMW";
        }
        buildModuleParameter.KSS.InSelectAlgorithm = kssAlg;
        buildModuleParameter.KSS.ModelExpansionOpen = _this.modelExpansionOpen == true ? 1 : 0;
        buildModuleParameter.KSS.ModifyYOpen = _this.modifyYOpen == true ? 1 : 0;
        buildModuleParameter.KSS.ModelExpansionSize = _this.modelExpansionSize;
        buildModuleParameter.KSS.AdjustYScale = _this.adjustYScale;
        //NN Range
        let alphaArray = [];
        $(".alpha-input > input").each(function () {
            alphaArray.push($(this).val());
        });
        buildModuleParameter.BPNN.InAlphaRange = [];
        buildModuleParameter.BPNN.InAlphaRange = alphaArray;
        let epochsArray = [];
        $(".epochs-input > input").each(function () {
            epochsArray.push($(this).val());
        });
        buildModuleParameter.BPNN.InEpochsRange = [];
        buildModuleParameter.BPNN.InEpochsRange = epochsArray;
        let momArray = [];
        $(".mom-input > input").each(function () {
            momArray.push($(this).val());
        });
        buildModuleParameter.BPNN.InMomTermRange = [];
        buildModuleParameter.BPNN.InMomTermRange = momArray;
        let nodeArray = [];
        $(".node-input > input").each(function () {
            nodeArray.push($(this).val());
        });
        buildModuleParameter.BPNN.InNodesRange = [];
        buildModuleParameter.BPNN.InNodesRange = nodeArray;
        buildModuleParameter.Refresh.forceRefresh = _this.forceRefresh;
        //CNN
        avmAutoEncoderInfo = new AvmAutoEncoderInfo();
        avmAutoEncoderInfo.filters = _this.filters;
        avmAutoEncoderInfo.kernel_size = _this.kernel_size;
        avmAutoEncoderInfo.activation = _this.activation;
        avmAutoEncoderInfo.pool_size = _this.pool_size;
        avmAutoEncoderInfo.epoch = _this.epoch;
        avmAutoEncoderInfo.learningrate = _this.learningRate;
        avmAutoEncoderInfo.patience = _this.patience;
        avmAutoEncoderInfo.batch = _this.batch;
        avmAutoEncoderInfo.dropout = _this.dropout;
        avmAutoEncoderInfo.moment = _this.moment;
        avmAutoEncoderInfo.model_frequency = _this.model_frequency;
        avmAutoEncoderInfo.tune_frequency = _this.tune_frequency;
        avmAutoEncoderInfo.virtual_cassette = _this.virtual_cassette;
        avmAutoEncoderInfo.DMW_switch.push(_this.DMW_switch);
        parameter.adasCNNEnable = _this.CNNEnable;
        parameter.buildModuleParameter = buildModuleParameter;
        parameter.avmAutoEncoderInfo = avmAutoEncoderInfo;
        parameter.avmAutoEncoderInfo.Refresh.forceRefresh = _this.cnnForceRefresh;
        parameter.fileType = "Parameter";
        DownloadJson(parameter, "Parameter");
    }
    SaveBlob.SaveParameter = SaveParameter;
    function DownloadJson(data, fileName) {
        kendo.prompt("FileName : ", fileName).done(function (name) {
            let json = JSON.stringify(data);
            var blob = new Blob([json], { type: "application/json" });
            // 建立下載連結
            var downloadLink = document.createElement("a");
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = name + ".json";
            // 模擬點擊下載連結
            downloadLink.click();
            // 釋放 URL 物件
            URL.revokeObjectURL(downloadLink.href);
        });
    }
    SaveBlob.DownloadJson = DownloadJson;
})(SaveBlob || (SaveBlob = {}));
var LoadElement;
(function (LoadElement) {
    function LoadCondiction(grid, checkBox) {
    }
    LoadElement.LoadCondiction = LoadCondiction;
    function CheckDomRender(dom) {
        return __awaiter(this, void 0, void 0, function* () {
            if ($(dom).length != 0) {
                return;
            }
            else {
                var checkDivRendered = setInterval(function () {
                    if ($(dom).is(":visible")) {
                        // 目標 <div> 元素已渲染完成，可以執行後續程式碼
                        clearInterval(checkDivRendered); // 停止輪詢
                        // 在此處執行你的程式碼
                        console.log("目標 <div> 元素已渲染完成");
                    }
                }, 100); // 設定輪詢的間隔時間，這裡是每 100 毫秒檢查一次
            }
        });
    }
    LoadElement.CheckDomRender = CheckDomRender;
})(LoadElement || (LoadElement = {}));
class CombinationSelection {
    constructor() {
        this.fabInput = new FabDetailInput();
        this.pieceList = [];
    }
}
class TimeAreaEvent {
}
class CombinationEvent {
}
class VariableSelection {
    constructor() {
        this.variables = [];
        this.step = [];
    }
}
class Parameter {
    constructor() {
        this.buildModuleParameter = new ModuleParameter();
        this.avmAutoEncoderInfo = new AvmAutoEncoderInfo();
    }
}
class Preprocessing {
    constructor() {
        this.filterrulesDCP = [];
        this.indicatorrulesDCP = [];
        this.indicatorRule = [];
    }
}
//# sourceMappingURL=PresetBlob.js.map
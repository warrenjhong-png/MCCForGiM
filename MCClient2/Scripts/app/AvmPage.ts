namespace AvmPage {
    let fabList: Array<string> = [];
    let fabGirdName: Array<string> = [];
    let cbn: FabDetailInput = new FabDetailInput();
    let taskId: string = null;
    let variables: Array<Variables> = new Array<Variables>();
    let rawData: RawData = new RawData();
    let pieceList: Array<any> = [];
    let rawDataVariable: Array<Variables> = new Array<Variables>();
    let selectGroupName: string;
    let selectVariableId: Array<string> = [];
    let selectStep: Array<any> = [];    
    let hasStep: boolean = false;
    let checkAlg: Array<string> = [];
    let indicatorRule: Array<IndicatorRule> = [];
    let ruleId = 1;
    let buildModuleParameter: ModuleParameter = new ModuleParameter();
    let filterrulesDCP: Array<filterrules> = [];
    let variablegroupsDCP: Array<Variablegroups> = [];
    let indicatorrulesDCP: Array<indicatorrules> = [];
    let pointrulesDCP: Array<pointrules> = [];
    let avmAutoEncoderInfo: AvmAutoEncoderInfo = new AvmAutoEncoderInfo();
    let index = [];
    let warningId: Array<Rawdata> = [];
    export function Main() {
        new Vue({
            el: "#divVue",
            data: {
                startTime: null,
                endTime: null,
                pieceCount: 0,
                cbnItem: 0,
                avmItemPage: 0,
                inputCount: 0,
                outputCount: 0,
                variablePageInitial: 0,
                rawDataPrePageInitial: 0,
                parameterPageInitial: 0,
                trimBegin: 0,
                trimEnd: 0,
                inputBegin: 1,
                usl: 0,
                lsl: 0,
                ucl: 0,
                lcl: 0,
                metrologyTarget: 68,
                metrologyUsl: 69,
                metrologyLsl: 67,
                metrologyUcl: 69,
                metrologyLcl: 67,
                dqiySwitch: 0,
                phaselErrorThreshold: 0.05,
                stdOpen: false,
                rate: 1.5,
                expochsMax: 150,
                expochsInterval: 120,
                expochsMin: 100,
                momTermMax: 0.9,
                momTermInterval: 0.2,
                momTermMin: 0.7,
                alphaMax: 0.45,
                alphaInterval: 0.10,
                alphaMin: 0.35,
                trimBeginSet: 0,
                trimEndSet: 0,
                inNodesRange: [],
                CNNEnable: false,
                adasStep: [],
                filters: 4,
                kernel_size: 7,
                activation: "selu",
                pool_size: 8,
                epoch: 10000,
                learningRate: 0.008,
                //patience: 300,
                batch: 32,
                dropout: 0.2,
                moment: 0.6,
                model_frequency: 1,
                tune_frequency: 1,
                virtual_cassette: 25,
                DMW_switch: 0,
                specManual: false,
                specPercentage: false,
                specSigma: true,
                conManual: false,
                conPercentage: false,
                conSigma: true,
                limitCheckBox: true,
                specSigmaValue: 8,
                specPercentageValue: 10,
                conSigmaValue: 8,
                conPercentageValue: 10,
                taskId: null,
                info: "",
                loopCount: 0,
                riManual: true,
                riAuto: false,
                riMaxmumError: 100,
                lookAheadCount: 5,
                modelName: String,
                inSelectAlgorithm: "SDMW",
                modelExpansionOpen: true,
                modifyYOpen: false,
                modelExpansionSize: 90,
                adjustYScale: 0.3,
                pieceWindow: false,
                forceRefresh: false,
                cnnForceRefresh: false,
                kendoDMWSwitch: null,
                warningWindow: false,
                warningIds: 0,
                warningImg: false,
                temporalData: true,
                preset: false,
                noTestingData: false,
                TestingData: false,
                testingCount: 0,
                trainingCount:0,
                isCheckedTestingData: false,

                //能源預測
                num_epoches: 300,
                patience: 50,
                scheduler_patience: 30,
                model_set_proportion: 2,
                threshold_scaler: 1,
                split: 0.2,
                seq_len: 24,
                forecasting_len: 3,

                finetune_time_max: 10,
                fine_tune_split: 0.25,
                fine_tune_len: 1440,
                fine_tune_lr_m1: 0.0005,
                fine_tune_lr_m2: 0.0005,
                fine_tune_lr_gsi: 0.0003,

                n_trials: 5,
                num_epoches_search: 100,

                param_grid_hidden_size: [2, 4, 6],
                param_grid_num_layers: [1],
                param_grid_lr: [0.001],
                param_grid_batch_size: [256],

                gsi_param_grid_hidden_size: [64, 128],
                gsi_param_grid_latend_dim: [3],
                gsi_param_grid_dropout: [0.1],
                gsi_param_grid_lr: [0.001],
                gsi_param_grid_batch_size: [64, 128],

                //生產排程
                // NSGAII
                nsga_pop: 500,
                nsga_gen: 20,
                nsga_cxpb: 0.85,
                nsga_mutpb: 0.3,
                nsga_assign_indpb: 0.12,
                nsga_perm_indpb: 0.25,
                nsga_seed: 8,

                // 排程
                schedule_batch_size: 10,
                schedule_setup: 600,
                schedule_setup_value: 200,
                schedule_intra_rule: "SPT",

                // 系統
                system_n_jobs: 25,
                system_schedule_fmt: "csv",
                system_write_outputs: true,

                //廠務調控
                selectedDevice: 'air', // 預設,
                // Air
                air_over_budget_penalty: 1000,
                air_flow_penalty: 10000,
                air_n_fixed_input: 4,
                air_n_vfd_input: 2,
                air_fixed_air_kw: 0.24,
                air_fixed_air_flow: 5.0,
                air_flow_correction: 0.9,
                air_budget_correction: 0.96,
                air_usage_correction: 0.98,
                air_swarmsize: 50,
                air_maxiter: 5,

                // ⭐ Chiller
                chiller_over_budget_penalty: 1000,
                chiller_flow_penalty: 10000,
                chiller_cop: 4.0,
                chiller_flow_correction: 0.9,
                chiller_budget_correction: 0.96,
                chiller_usage_correction: 0.98,
                chiller_swarmsize: 50,
                chiller_maxiter: 5,

                //微電網
                 // forecast
                mg_forecast_horizon: 1,

                // battery
                mg_bess_max: 330,
                mg_bess_charge_max: 100,
                mg_bess_discharge_max: 100,
                mg_soc_init: 0.1,
                mg_soc_min: 0.1,
                mg_soc_max: 1.0,

                // cost
                mg_cost_bess_ch: 0.387,
                mg_cost_bess_disch: 0.387,
                mg_mc_bess: 19.08,

                // degradation
                mg_beta0: 4901,
                mg_beta1: 1.98,
                mg_beta2: 0.016,
                mg_ccap: 1000000,

                // carbon
                mg_carbon_factor: 0.474,
                mg_carbon_price: 0.3,

                // pso
                mg_swarm_size: 50,
                mg_iterations: 50,
                mg_w: 0.49,
                mg_w_max: 0.9,
                mg_w_min: 0.4,
                mg_c1: 1.5,
                mg_c2: 1.5,
                mg_penalty_weight: 10000,

                // pv
                mg_mc_pv: 91.29,
                mg_cost_pv: 0.286,

                //JSON checkbox
                form: {
                    exportScheduling: true,
                    exportFacility: true,
                    exportMicrogrid: true
                },

                rawDataDownloadPercent: 0,
                rawDataDownloadMessage: "",
                rawDataDownloadStatus: "",
                rawDataCurrentBatch: 0,
                rawDataTotalBatch: 0,

                modelProcessVisible: false,
                modelProcessStage: "",
                modelProcessTitle: "",
                modelProcessMessage: "",
                modelProcessError: "",

                modelNameError: "",
                modelUploading: false,
                modelUploadResult: ""

            },
            beforeMount: async function () {
            },
            mounted: function () {
                this.combinationSelection();
                taskId = DataCollection.GetGuid();
                this.taskId = taskId;
                

            },
            methods: {
                combinationSelection: function () {

                    let start = KendoApi.Date("date-start", this, 2022, 0, 1, "start");
                    let end = KendoApi.Date("date-end", this, 2022, 11, 31, "end");

                    start.trigger("change");
                    end.trigger("change");

                },
                fabInfo: async function (fab: string, className: string) {
                    kendo.ui.progress($(".selection"), true);
                    this.pieceCount = 0;
                    $("." + className + "-grid").css("display", "inline");
                    let _this = this;
                    cbn.query = fab;
                    let fabOutput: FabDetailOutput = await DataCollection.GetFabDetailOutput(cbn);

                    let dataSource: Array<any> = [];
                    for (var key in fabOutput.DataCategory) {
                        dataSource.push({ name: key, fabClass: fabOutput.DataCategory[key] });
                    }

                    KendoApi.FabGrid(className, this.cbnItem, fab, dataSource);

                    let classCheckItem = "." + className + "-check";
                    let classCheckAll = "." + className + "-all";
                    let checkAllTrigger = false;
                    $(classCheckAll).change(function (e) {
                        let check = $(classCheckAll).prop("checked");

                        $(classCheckItem).each(function () {
                            if (check) {
                                $(this).prop("checked", true);

                            } else {
                                $(this).prop("checked", false);
                            }
                        });

                        $(classCheckItem).trigger("change");
                    });

                    //紀錄勾選的cbn
                    $(classCheckItem).change(function (e) {
                        //紀錄當前fabClass是什麼
                        let fab: string = $(classCheckItem).attr("fab");
                        let fabClass: string = $(classCheckItem).attr("fabClass");
                        let isMix: boolean = true;

                        if (!checkAllTrigger) {
                            $(classCheckItem).each(function () {

                                //確認是否可混
                                if ($(this).prop("checked") == true && $(this).attr("fabClass") != fabClass) {

                                    isMix = false;
                                }
                            });
                            if (isMix = false) {
                                $(classCheckItem).prop("checked", false);
                            }
                            else {

                                var object = new Object();
                                let item = 0;
                                for (let i = 0; i < fabList.length; i++) {
                                    let tmpFabClassItem: string = "." + Method.generateClassName(fabList[i]) + "-check";
                                    let tmpFabClassChecks: Array<string> = [];

                                    $(tmpFabClassItem).each(function () {
                                        if ($(this).prop("checked") == true) {
                                            tmpFabClassChecks.push($(this).attr("id"));
                                        }
                                    });

                                    object[fabList[i]] = tmpFabClassChecks;
                                    if (fab == fabList[i]) {
                                        item = i;
                                        break;
                                    }
                                }

                                cbn.query = item + 1 != fabList.length ? fabList[item + 1] : fabList[item];
                                cbn.data = JSON.stringify(object);
                                _this.fabInfo(cbn.query, fabGirdName[item + 1]);
                                if ($(this).prop("checked") == false) {
                                    for (let i = item + 1; i < fabList.length; i++) {
                                        $("." + Method.generateClassName(fabList[i]) + "-all").prop("checked", false);
                                        $("." + Method.generateClassName(fabList[i]) + "-check").each(function () {
                                            $(this).prop("checked", false);
                                        });
                                    }
                                }

                            }

                        }

                        if ($(classCheckItem + ":checked").length == $(classCheckItem).length) {
                            $(classCheckAll).prop("checked", true);
                        } else {
                            $(classCheckAll).prop("checked", false);
                        }

                        if ($(classCheckAll).prop("checked") == true) {
                            checkAllTrigger = true;
                        } else {
                            checkAllTrigger = false;
                        }
                    });
                    kendo.ui.progress($(".selection"), false);
                    this.cbnItem++;

                },
                variablesSelection: async function () {
                    kendo.ui.progress($(".selection"), true);
                    variables = await DataCollection.GetVariables();

                    let _this = this;
                    for (let i = 0; i < variables.length; i++) {
                        let className: string = Method.generateClassName(variables[i].Name);
                        Method.addVariableGrid(variables[i]);
                        let dataSource: Array<any> = [];
                        for (let j = 0; j < variables[i].VariableNames.length; j++) {
                            dataSource.push({ name: variables[i].VariableNames[j].Name })
                        }

                        KendoApi.VariablesSelectionGrid(className, variables[i].Type, dataSource);
                        let classNameCheckItem = "." + className + "-checkItem";
                        let classNameCheckAll = "." + className + "-checkAll";

                        $(classNameCheckItem).change(function () {

                            console.log($(classNameCheckItem).attr("name"));
                            let type = $(this).attr("variableType");
                            //input
                            if ($(this).prop("checked")) {

                                type == "PROCESS" ? _this.inputCount++ : _this.outputCount++;
                                if ($(classNameCheckItem + ":checked").length == variables[i].VariableNames.length) {
                                    $(classNameCheckAll).prop("checked", true);
                                }

                            } else if (!$(this).prop("checked")) {
                                type == "PROCESS" ? _this.inputCount-- : _this.outputCount--;
                                if ($(classNameCheckAll).prop("checked")) {
                                    $(classNameCheckAll).prop("checked", false);
                                }
                            }
                        });

                        $(classNameCheckAll).change(function () {

                            let type = $(this).attr("variableType");
                            if ($(this).prop("checked")) {
                                $(classNameCheckItem).each(function () {
                                    if (!$(this).prop("checked")) {
                                        type == "PROCESS" ? _this.inputCount++ : _this.outputCount++;
                                        $(this).prop("checked", true);
                                    }
                                });
                            } else if (!$(this).prop("checked")) {
                                $(classNameCheckItem).each(function () {
                                    if ($(this).prop("checked")) {
                                        type == "PROCESS" ? _this.inputCount-- : _this.outputCount--;
                                        $(this).prop("checked", false);
                                    }
                                });
                            }

                        });

                        if (variables[i].HasStep == 1) {
                            let stepIdItem = "." + className + "-stepIdItem";
                            let stepIdAll = "." + className + "-stepIdAll";
                            Method.stepListCheckBoxHtml(className, variables[i].StepID);
                            $(stepIdItem).change(function () {
                                if ($(this).prop("checked")) {
                                    if ($(stepIdItem + ":checked").length == variables[i].StepID.Data.length) {
                                        $(stepIdAll).prop("checked", true);
                                    }
                                } else if (!$(this).prop("checked")) {
                                    if ($(stepIdAll).prop("checked")) {
                                        $(stepIdAll).prop("checked", false);
                                    }
                                }
                            });

                            $(stepIdAll).change(function () {
                                if ($(this).prop("checked")) {
                                    $(stepIdItem).each(function () {
                                        if (!$(this).prop("checked")) {
                                            $(this).prop("checked", true);
                                        }
                                    });
                                } else if (!$(this).prop("checked")) {
                                    $(stepIdItem).each(function () {
                                        if ($(this).prop("checked")) {
                                            $(this).prop("checked", false);
                                        }
                                    });
                                }
                            });
                        }
                    }
                    kendo.ui.progress($(".selection"), false);
                },
                rawDataPreprocess: async function () {
                    hasStep = false;
                    let variableGroups: Array<any> = [];
                    variablegroupsDCP = [];
                    this.adasStep = [];
                    kendo.ui.progress($(".selection"), true);

                    $(".variableGroups-grid").empty();
                    $(".variablesName-grid").empty();
                    $(".stepId-grid").empty();
                    let _this = this;
                    rawDataVariable = VariablesMethod.GetVariableSelect(variables);


                    //先取得variableGrups清單
                    for (let i = 0; i < variables.length; i++) {
                        let className = Method.generateClassName(variables[i].Name);

                        if (($("." + className + "-checkItem:checked").length > 0
                            || $("." + className + "-checkAll:checked").length > 0)
                            && variables[i].Type == "PROCESS") {
                            variableGroups.push({ name: variables[i].Name });
                        }
                    }


                    //存入vaiablegroupDCP

                    for (let i = 0; i < rawDataVariable.length; i++) {
                        let _variables: Array<variables> = [];
                        for (let j = 0; j < rawDataVariable[i].VariableNames.length; j++) {

                            _variables.push({
                                isseparator: rawDataVariable[i].VariableNames[j].isStep == true ? 1 : 0,
                                variableid: rawDataVariable[i].VariableNames[j].VariableId,
                                variablename: rawDataVariable[i].VariableNames[j].Name,
                                separatingvalues: rawDataVariable[i].VariableNames[j].isStep == true ? rawDataVariable[i].StepID.Data : []
                            });
                        }
                        variablegroupsDCP.push({
                            io: rawDataVariable[i].Type == "PROCESS" ? "i" : "o",
                            metatable: rawDataVariable[i].MetaName,
                            variablegroupname: rawDataVariable[i].Name,
                            filename: rawDataVariable[i].Name,
                            variables: _variables
                        });

                        if (rawDataVariable[i].Type == "METROLOGY")
                            pointrulesDCP = [];
                        for (let j = 0; j < rawDataVariable[i].VariableNames.length; j++) {
                            pointrulesDCP.push({
                                ruleid: j + 1,
                                variableid: parseInt(rawDataVariable[i].VariableNames[j].VariableId)
                            });
                        }
                        if (rawDataVariable[i].HasStep == 1) {
                            for (let j = 0; j < rawDataVariable[i].StepID.Data.length; j++) {
                                let item = rawDataVariable[i].StepID.Data[j];
                                if (this.adasStep.indexOf(item) == -1) {
                                    this.adasStep.push(item);
                                }
                            }
                        }
                    }

                    var group = $(".variableGroups-grid").kendoGrid({
                        dataSource: variableGroups,
                        columns: [{
                            selectable: true,
                            title: "Variable Group Name",
                            field: "name",
                            template: "<span class='variable-group' name='#=name#'>#=name#</span>"
                        }],
                        change: function (e) {
                            var select = this.select();
                            console.log(select);
                            let variablesName: Array<any> = [];
                            let stepId: Array<any> = [];
                            selectVariableId = [];
                            selectStep = [];
                            for (let i = 0; i < select.length; i++) {
                                hasStep = false;
                                let selectGroup: string = select[0].outerText;
                                selectGroupName = selectGroup;

                                let selectGroupClass: string = "." + Method.generateClassName(selectGroup) + "-checkItem";
                                $(selectGroupClass).each(function () {
                                    if ($(this).prop("checked")) {
                                        let id;
                                        for (let j = 0; j < rawDataVariable.length; j++) {
                                            for (let k = 0; k < rawDataVariable[j].VariableNames.length; k++) {

                                                if ($(this).attr("name") == rawDataVariable[j].VariableNames[k].Name && rawDataVariable[j].Name == selectGroupName) {
                                                    id = rawDataVariable[j].VariableNames[k].VariableId;
                                                }
                                            }
                                        }


                                        variablesName.push({
                                            name: $(this).attr("name"),
                                            variableId: id
                                        });



                                    }
                                });
                                let index = variables.findIndex(x => x.Name == selectGroupName);
                                if (variables[index].HasStep == 1) {
                                    hasStep = true;
                                    let stepIdItem = "." + Method.generateClassName(selectGroup) + "-stepIdItem";
                                    let stepIdAll = "." + Method.generateClassName(selectGroup) + "-stepIdAll";
                                    if ($(stepIdItem + ":checked").length > 0 ||
                                        $(stepIdAll + ":checked").length > 0) {
                                        $(stepIdItem).each(function () {
                                            if ($(this).prop("checked")) {
                                                stepId.push({ step: $(this).attr("step") });

                                            }
                                        });
                                    }

                                    //let _step: Array<any> = [];

                                    //for (let i = 0; i < stepId.length; i++) {
                                    //    _step.push(stepId[i].step);
                                    //    if (_this.adasStep.indexOf(stepId[i].step) > -1) {
                                    //        _this.push(stepId[i].step);
                                    //    }
                                    //}

                                }

                                $(".rawData-checkAll").prop("checked", false);

                                $(".variablesName-grid").kendoGrid({
                                    dataSource: variablesName,
                                    scrollable: false,
                                    columns: [{
                                        headerTemplate: "<input type='checkbox' class='rawData-checkAll' >",
                                        template: "<input type='checkbox' class='rawData-variable' name='#=name#' variableId='#=variableId#'>",
                                        width: 30
                                    }, {
                                        title: "Variables Name",
                                        field: "name"
                                    }, {

                                    }],
                                });

                                $(".rawData-variable").change(async function () {
                                    selectVariableId = [];
                                    $(".rawData-variable").each(function () {
                                        if ($(this).prop("checked")) {
                                            selectVariableId.push($(this).attr("variableId"));
                                        }
                                    });
                                    if ($(this).prop("checked")) {
                                        //await _this.temporalDataChart($(this).attr("variableId"));
                                        //await _this.indicatorSpec($(this).attr("variableId"));
                                    }
                                    if ($(".rawData-variable:checked").length == variablesName.length) {
                                        $(".rawData-checkAll").prop("checked", true)
                                    } else {
                                        $(".rawData-checkAll").prop("checked", false)
                                    }
                                    console.log(selectVariableId);
                                });

                                $(".rawData-checkAll").change(function () {
                                    selectVariableId = [];
                                    if ($(this).prop("checked")) {
                                        $(".rawData-variable").each(function () {
                                            $(this).prop("checked", true);
                                            selectVariableId.push($(this).attr("variableId"));
                                        });
                                        //_this.temporalDataChart("All");
                                        //_this.indicatorSpec("All");
                                    } else {
                                        $(".rawData-variable").each(function () {
                                            $(this).prop("checked", false);
                                        });
                                    }
                                    console.log(selectVariableId);
                                });

                                $(".stepId-grid").kendoGrid({
                                    dataSource: stepId,
                                    columns: [{
                                        selectable: true,
                                        title: "Separator Value",
                                        field: "step",
                                        template: "<span class='separator-value' name='#=step#'>#=step#</span>"
                                    }],
                                    change: async function (e) {
                                        var select = this.select();
                                        if (select[0].outerText != selectStep[selectStep.length - 1]) {
                                            selectStep = [];
                                            selectStep.push(select[0].outerText);
                                            //await _this.temporalDataChart(selectVariableId[selectVariableId.length - 1]);
                                            //await _this.indicatorSpec(selectVariableId[selectVariableId.length - 1]);
                                        }
                                    },
                                    selectable: true
                                });
                            }
                        },
                        selectable: true
                    }).data("kendoGrid");




                    $(".algorithms-grid").kendoGrid({
                        dataSource: rawData.algorithms,
                        columns: [{
                            template: "<input type='checkbox' class = 'alg-check' name='#=name#'>",
                            width: 30
                        }, {
                            selectable: true,
                            title: "Algorithm",
                            field: "name"
                        }],
                    });

                    $(".alg-check").change(function () {
                        checkAlg = [];
                        $(".alg-check").each(async function () {
                            if ($(this).prop("checked")) {
                                checkAlg.push($(this).attr("name"));
                                await _this.indicatorSpec("All");
                            }
                        });
                    });

                    group.select("tr:eq(0)");
                    kendo.ui.progress($(".selection"), false);
                },
                indicatorSpec: async function (variableId: string) {
                    let arrIndicator = [];
                    if (checkAlg.length != 0) {
                        kendo.ui.progress($(".selection"), true);

                        let rawData: Array<RawDataSeries> = await DataCollection.GetRawData(taskId, selectGroupName, variableId == "All"
                            ? selectVariableId[selectVariableId.length - 1] : variableId, selectStep[0]);
                        let _rawData: Array<any> = [];
                        //Method.rawDataTrim(this.trimBegin, this.trimEnd, rawData);
                        for (let i = 0; i < rawData.length; i++) {
                            let tmp = rawData[i].Data.slice(this.trimBegin, this.trimEnd + 1);
                            if (tmp.length != 0) {
                                if (this.trimBegin == this.trimEnd) {
                                    _rawData.push(rawData[this.trimBegin].Data);
                                } else if (this.trimBegin <= this.trimEnd - 1) {
                                    _rawData.push(Method.rawDataTrim(this.trimBegin, this.trimEnd, rawData[i]));

                                } else if (this.trimBegin > this.trimEnd - 1) {
                                    break;
                                }
                            }
                        }

                        arrIndicator = await DataCollection.GetIndicators(checkAlg[checkAlg.length - 1], _rawData);

                        //for (let i = 0; i < _rawData.length; i++) {
                        //    let lastIndicator = await DataCollection.GetIndicator(checkAlg[checkAlg.length - 1], _rawData[i]);
                        //    arrIndicator.push(lastIndicator);
                        //}

                        let spec = await RawDataMethod.spec(this.specManual, this.specSigma, this.specPercentage, arrIndicator, this);
                        let con = await RawDataMethod.con(this.conManual, this.conSigma, this.conPercentage, arrIndicator, this);

                        this.usl = spec.USL;
                        this.lsl = spec.LSL;
                        this.ucl = con.UCL;
                        this.lcl = con.LCL;
                        kendo.ui.progress($(".selection"), false);
                    }
                },
                temporalDataChart: async function (variableId: string) {
                    $(".temporaldata-chart").empty();
                    kendo.ui.progress($(".selection"), true);

                    if (selectGroupName == "" || selectVariableId.length == 0) {
                        if (selectVariableId.length == 0) {
                            alert("Variables is not checked.");
                            kendo.ui.progress($(".selection"), false);
                            return;
                        }
                        if (selectStep.length == 0) {
                            alert("Separator is not value.");
                            kendo.ui.progress($(".selection"), false);
                            return;
                        }
                    }
                    if (selectGroupName != "" && selectVariableId.length != 0) {
                        let series: Array<any> = [];
                        index = [];
                        //要勾選的條件
                        let max = 0;
                        let min = 0;
                        let timetag = [];
                        let lastData: Array<RawDataSeries> = [];
                        let axisCrossingValue = 0;
                        //temporl data: i:0 = > 全秀 i:len-1只秀最後一個

                        for (let i = selectVariableId.length - 1; i < selectVariableId.length; i++) {
                            let data: Array<RawDataSeries> = await DataCollection.GetRawData(taskId, selectGroupName,
                                variableId == "All" ? selectVariableId[i] : variableId, selectStep[0]);
                            if (i + 1 == selectVariableId.length) {
                                lastData = data;
                            }
                            for (let j = 0; j < data.length; j++) {
                                if (data[j].Data.length > index.length) {
                                    index = [];
                                    if (max < Math.max(...data[j].Data)) {
                                        max = Math.max(...data[j].Data)
                                    }
                                    if (min > Math.min(...data[j].Data)) {
                                        min = Math.min(...data[j].Data)
                                    }

                                    for (let k = 1; k <= data[j].Data.length; k++) {
                                        index.push(k);
                                    }
                                }
                                let name: string = data[j].Id;

                                if (timetag.length === 0) {
                                    timetag = data[j].Timetag;
                                }
                                series.push({
                                    data: data[j].Data,
                                    name: name,
                                    markers: {
                                        visible: data[j].Data.length != 1 ? false : true,
                                    }
                                });

                            }
                        }


                        console.log("timetag" + timetag);
                        let yScale = await DataCollection.chartYScale(max, min);
                        let num = index.length;
                        var step = Math.ceil(timetag.length / 20);
                        //if (num >= 1500) {
                        //    step = 80;
                        //}
                        //else if (num <= 1500 && num >= 1000) {
                        //    step = 15;
                        //}
                        //else if (num < 1000 && num >= 500) {
                        //    step = 10
                        //}
                        //else if (num < 500 && num > 100) {
                        //    step = 5
                        //}
                        //else if (num < 100 && num >= 50) {
                        //    step = 2
                        //}
                        //if (num < 50) {
                        //    step = 1
                        //}


                        let _this = this;
                        $(".temporaldata-toolbar").css("visibility", "visible");
                        this.trimBegin = 0;
                        this.trimEnd = index.length;
                        if (!this.preset) {
                            var chart = $(".temporaldata-chart").kendoChart({
                                seriesDefaults: {
                                    type: "line",
                                },
                                series: series,
                                categoryAxis: [{
                                    categories: timetag,
                                    majorGridLines: {
                                        visible: false
                                    },
                                    labels: {
                                        rotation: -45,
                                        step: step,
                                        template: "#= kendo.toString(new Date(value), 'MM-dd HH:mm') #"
                                    }
                                }],
                                valueAxis: [{
                                    max: yScale.max,
                                    min: yScale.min,
                                    axisCrossingValue: yScale.min,
                                    crosshair: {
                                        visible: true
                                    }
                                }],
                                legend: {
                                    visible: false
                                },
                                tooltip: {
                                    visible: true
                                },
                                transitions: false
                            }).data("kendoChart");
                        }

                        $(".limit").click(function () {
                            if (_this.limitCheckBox == false) {
                                $(".trimBegin").prop("disabled", "disabled");
                                $(".trimEnd").prop("disabled", "disabled");
                                _this.inputBegin = 1;
                                _this.trimBegin = 0;
                                _this.trimEnd = index.length;
                                //delete chart.options.categoryAxis["select"];
                                //chart.refresh();

                            } else {
                                $(".trimBegin").prop("disabled", "");
                                $(".trimEnd").prop("disabled", "");
                                //chart.options.categoryAxis["select"] = {
                                //    from: 0,
                                //    to: index.length,
                                //    mousewheel: {
                                //        reverse: true
                                //    }
                                //}
                                //
                                //chart.refresh();
                            }
                        });
                    }
                    kendo.ui.progress($(".selection"), false);

                },
                addRuleForEnergyPrediction: async function () {
                    const vm = this;
                    const $loadingTarget = $(".selection");

                    try {
                        kendo.ui.progress(
                            $loadingTarget,
                            true
                        );

                        await new Promise<void>(
                            function (resolve) {
                                window.setTimeout(
                                    resolve,
                                    50
                                );
                            }
                        );

                        if (
                            !selectVariableId ||
                            selectVariableId.length === 0
                        ) {
                            alert("Please select variable.");
                            return;
                        }

                        if (!selectGroupName) {
                            alert("Please select group.");
                            return;
                        }

                        if (!vm.startTime || !vm.endTime) {
                            alert(
                                "Start Time or End Time is empty."
                            );
                            return;
                        }

                        for (
                            let i = 0;
                            i < selectVariableId.length;
                            i++
                        ) {
                            const currentVariableId =
                                selectVariableId[i];

                            /*
                             * Step Grid 是單選時，
                             * 所有目前加入的變數使用同一個 Step。
                             */
                            const currentStepId =
                                selectStep &&
                                    selectStep.length > 0
                                    ? selectStep[0]
                                    : "";

                            const variableName =
                                Method.getVariableNameById(
                                    currentVariableId
                                );

                            const indicatorName =
                                selectGroupName +
                                "_" +
                                variableName;

                            const exists =
                                indicatorRule.some(
                                    function (
                                        rule: IndicatorRule
                                    ) {
                                        return (
                                            rule.indicatorName ===
                                            indicatorName &&
                                            String(
                                                rule.stepId || ""
                                            ) ===
                                            String(
                                                currentStepId || ""
                                            )
                                        );
                                    }
                                );

                            if (exists) {
                                continue;
                            }

                            const currentRuleId =
                                indicatorRule.length + 1;

                            indicatorRule.push({
                                ruleId:
                                    currentRuleId,

                                groupName:
                                    selectGroupName,

                                indicatorName:
                                    indicatorName,

                                indicatorNameFiliter:
                                    "",

                                variable:
                                    variableName,

                                variableId:
                                    currentVariableId,

                                stepId:
                                    currentStepId,

                                startTime:
                                    vm.startTime,

                                endTime:
                                    vm.endTime,

                                /*
                                 * RawData Indicator 流程已移除
                                 */
                                limit: false,
                                trimBegin: "",
                                trimEnd: "",
                                algorithm: "",
                                arrIndicator: undefined,

                                USL: 0,
                                LSL: 0,
                                UCL: 0,
                                LCL: 0,

                                conModel: "",
                                conSettingValue: 0,

                                specModel: "",
                                specSettingValue: 0
                            });
                        }

                        const deleteRuleHandler =
                            function (
                                deleteRuleIds: Array<number>
                            ) {
                                indicatorRule =
                                    indicatorRule.filter(
                                        function (
                                            rule: IndicatorRule
                                        ) {
                                            return (
                                                deleteRuleIds.indexOf(
                                                    Number(
                                                        rule.ruleId
                                                    )
                                                ) === -1
                                            );
                                        }
                                    );

                                indicatorRule.forEach(
                                    function (
                                        rule: IndicatorRule,
                                        index: number
                                    ) {
                                        rule.ruleId =
                                            index + 1;
                                    }
                                );

                                ruleId =
                                    indicatorRule.length + 1;

                                Method.buildRuleGrid(
                                    indicatorRule,
                                    deleteRuleHandler
                                );
                            };

                        Method.buildRuleGrid(
                            indicatorRule,
                            deleteRuleHandler
                        );
                    }
                    catch (error) {
                        console.error(
                            "Add Rule Error：",
                            error
                        );

                        const message =
                            error instanceof Error
                                ? error.message
                                : "Add Rule Failed.";

                        alert(message);
                    }
                    finally {
                        kendo.ui.progress(
                            $loadingTarget,
                            false
                        );
                    }

                },
                addRule: async function () {
                    //variableGroup
                    // buildModuleParameter = new ModuleParameter();

                    //if (selectStep.length == 0 && hasStep == true && this.preset == false) {
                    //    alert("Step is not chosen.");
                    //    return;
                    //}


                    kendo.ui.progress($(".selection"), true);
                    let addCount = 0;
                    let filter = 0;

                    let _this = this;
                    if (this.preset == false) {
                        let variable: string = "";
                        $(".rawData-variable").each(function () {
                            if ($(this).attr("variableId") == selectVariableId[0]) {
                                variable = $(this).attr("name");
                                return;
                            }
                        });
                        let indicatorName = selectGroupName + "_" + variable;

                        if (addCount == 0 && sessionStorage.getItem("LoadPreprocessing") == "false") {
                            //alert("This name already exists.");
                            alert("Not add any rules.");
                        } else if (addCount == -1 && sessionStorage.getItem("LoadPreprocessing") == "false") {
                            alert("Rule is change.");
                        }

                        if (warningId.length != 0) {
                            this.warningImg = true;
                        } else {
                            this.warningImg = false;
                        }

                    }
                    $(".rule-grid").empty();
                    var ruleGrid = function () {
                        $(".rule-grid").empty();
                        var grid = $(".rule-grid").kendoGrid({
                            toolbar: [{
                                template: "<button class='k-button rule-delete-btn'>X Delete</button>"
                            }, "excel"],
                            dataSource: indicatorRule,
                            columns: [{
                                template: "<input class='check-rule' ruleId='#=ruleId#' type='checkbox'>",
                                width: 30
                            }, {
                                title: "Rule ID",
                                field: "ruleId",
                                width: 80
                            }, {
                                title: "Indicator Name",
                                field: "indicatorName",
                                width: 450
                            }, {
                                title: "Variable",
                                field: "variable",
                                width: 300
                            }, {
                                title: "Limit",
                                field: "limit",
                                width: 80,
                                template: function (e) {
                                    if (e.limit) {
                                        return "<div style='color:green'>Yes</div>"
                                    } else {
                                        return "<div style='color:red'>No</div>"
                                    }
                                }
                            }, {
                                title: "Trim Begin",
                                field: "trimBegin",
                                width: 100
                            }, {
                                title: "Trim End",
                                field: "trimEnd",
                                width: 100
                            }],
                            change: function (e) {
                                console.log(e);
                                var selectedRows = this.select();
                                var selectedDataItems = [];
                                for (var i = 0; i < selectedRows.length; i++) {
                                    var dataItem = this.dataItem(selectedRows[i]);
                                    selectedDataItems.push(dataItem);
                                }
                                _this.ruleChart(selectedDataItems);

                            },
                            resizable: true,
                            selectable: true
                        }).data("kendoGrid");
                        grid.refresh();
                        $(".rule-delete-btn").click(() => {
                            let deleteRuleId = [];
                            $(".check-rule").each(function () {
                                if ($(this).prop("checked") == true) {
                                    deleteRuleId.push($(this).attr("ruleid"));
                                }
                            });

                            for (let i = 0; i < deleteRuleId.length; i++) {
                                filterrulesDCP = filterrulesDCP.filter(r => r.ruleid != deleteRuleId[i]);
                                indicatorrulesDCP = indicatorrulesDCP.filter(r => r.ruleid != deleteRuleId[i]);
                                indicatorRule = indicatorRule.filter(r => r.ruleId != deleteRuleId[i]);
                                //let index = buildModuleParameter.ModuleIndicatorRule.EK.indexOf(checkRuleId[i]);
                                //buildModuleParameter.ModuleIndicatorRule.EK.splice(index, 1);
                                //buildModuleParameter.ModuleIndicatorRule.IndicatorUSL.splice(index, 1);
                                //buildModuleParameter.ModuleIndicatorRule.IndicatorLSL.splice(index, 1);
                                //buildModuleParameter.ModuleIndicatorRule.IndicatorUCL.splice(index, 1);
                                //buildModuleParameter.ModuleIndicatorRule.IndicatorLCL.splice(index, 1);
                                ruleId--;
                                //ruleGrid.removeRow("tr:eq(" + i + ")");
                            }

                            buildModuleParameter.ModuleIndicatorRule = Method.indicatorRuleSpecDelete(buildModuleParameter.ModuleIndicatorRule, deleteRuleId);
                            for (let j = 0; j < ruleId - 1; j++) {
                                filterrulesDCP[j].ruleid = j + 1;
                                indicatorRule[j].ruleId = j + 1;
                                indicatorrulesDCP[j].ruleid = j + 1;
                                indicatorrulesDCP[j].filterruleid = j + 1;
                                buildModuleParameter.ModuleIndicatorRule.EK[j] = j + 1;
                            }
                            ruleGrid();
                        });
                    }
                    ruleGrid();

                    let top = $(".indicator-rule-grid").offset().top;
                    let left = $(".indicator-rule-grid").offset().left;
                    $(".indicator-rule-grid").offset({
                        top: top,
                        left: left
                    });

                    //this.warningIds = warningId.length;

                    kendo.ui.progress($(".selection"), false);

                    if (this.preset) {
                        sessionStorage.setItem("LoadPreprocessing", "false");
                        this.preset = false;
                        alert("Loading completed.");
                    }

                },
                warningId: async function () {
                    let _this = this;
                    var window = $(".warning-id-window").kendoWindow({
                        title: "Warning ID",
                        actions: ["close"],
                        close: function () {
                            _this.warningWindow = false
                        },
                        width: 800,
                        height: 600
                    }).data("kendoWindow");
                    window.center().open();
                    _this.warningWindow = true;
                    let no = 0;
                    $(".warning-grid").kendoGrid({
                        dataSource: warningId,
                        columns: [{
                            title: "No",
                            width: 80,
                            template: function (e) {
                                no++;
                                return no;
                            },
                        }
                            , {
                            field: "pieceid",
                            template: function (e) {
                                return "<div style='color:red'>" + e.pieceid + "</div>"
                            }
                        }, {
                            field: "step"
                        }]
                    }).data("kendoGrid");
                },
                ruleChart: async function (selectedDataItems: any) {
                    //
                    kendo.ui.progress($(".selection"), true);
                    let rawData: Array<any> = await DataCollection.GetRawData(taskId, selectedDataItems[0].groupName,
                        selectedDataItems[0].variableId, selectedDataItems[0].stepId);
                    let arrRawData: Array<any> = [];
                    //let indicator: Array<any> = [];
                    let usl: Array<any> = [];
                    let lsl: Array<any> = [];
                    let ucl: Array<any> = [];
                    let lcl: Array<any> = [];
                    let index: Array<any> = [];
                    for (let i = 0; i < selectedDataItems[0].arrIndicator.length; i++) {

                        //arrRawData.push(Method.rawDataTrim(this.trimBegin, this.trimEnd, rawData[i]));
                        usl.push(selectedDataItems[0].USL);
                        lsl.push(selectedDataItems[0].LSL);
                        ucl.push(selectedDataItems[0].UCL);
                        lcl.push(selectedDataItems[0].LCL);
                        index.push(i + 1);
                    }
                    //indicator = await DataCollection.GetIndicators(selectedDataItems[0].algorithm, arrRawData);
                    let yScale: any = await Method.getChartYScale(selectedDataItems[0].USL, selectedDataItems[0].LSL);
                    let max = yScale.Max;
                    let min = yScale.Min;
                    let num = index.length;
                    let step: number = 10;
                    if (num >= 1000) {
                        step = Math.round(num / 10 / 2)
                    }
                    if (num < 100 && num >= 50) {
                        step = 2
                    }
                    if (num < 50) {
                        step = 1
                    }

                    var chart = $(".rule-chart").kendoChart({
                        title: {
                            text: selectedDataItems[0].indicatorName,
                            color: "green",
                        },
                        seriesDefaults: {
                            type: "line"
                        },
                        series: [{
                            data: selectedDataItems[0].arrIndicator,
                            color: "#46A3FF",
                            markers: {
                                background: "#46A3FF"
                            }
                        }, {
                            data: usl,
                            color: "#AE0000",
                            markers: {
                                visible: false
                            }
                        }, {
                            data: lsl,
                            color: "#AE0000",
                            markers: {
                                visible: false
                            }
                        }, {
                            data: ucl,
                            visible: false,
                            color: "#FFAF60",
                            markers: {
                                visible: false
                            }
                        }, {
                            data: lcl,
                            visible: false,
                            color: "#FFAF60",
                            markers: {
                                visible: false
                            }
                        }],
                        categoryAxis: {
                            categories: index,
                            plotBands: KendoApi.NaNChartPlotBands(selectedDataItems[0].arrIndicator),
                            majorGridLines: {
                                visible: false
                            },

                            majorTicks: {
                                step: step,
                            },
                            labels: {
                                step: step,
                                rotation: "auto",
                                position: "bottom"
                            },

                        },
                        tooltip: {
                            visible: true,
                            template: function (e) {

                                let tip = "<div>Value : " + Method.mathSixRound(e.value) + "</div>";
                                return tip;
                            }
                        },
                        zoomable: true,
                        pannable: true,
                        valueAxis: {
                            min: min,
                            max: max,
                            labels: {
                                template: function (e) {
                                    let value: number = e.value;
                                    return Method.mathThreeRound(value);
                                }

                            },
                            axisCrossingValue: min
                        }

                    }).data("kendoChart");

                    $(window).resize(function () {
                        chart.redraw();
                    });
                    kendo.ui.progress($(".selection"), false);
                },
                buildAvmModel: async function () {
                    const vm = this;
                    const $loadingTarget = $(".selection");

                    try {
                        kendo.ui.progress(
                            $loadingTarget,
                            true
                        );

                        // ==========================================
                        // 基本檢查
                        // ==========================================

                        if (
                            !indicatorRule ||
                            indicatorRule.length === 0
                        ) {
                            alert("尚未建立任何 Rule。");
                            return;
                        }

                        if (
                            !variablegroupsDCP ||
                            variablegroupsDCP.length === 0
                        ) {
                            alert("Variable Group 資料不存在。");
                            return;
                        }

                        // ==========================================
                        // Module Parameter
                        // ==========================================

                        buildModuleParameter.Measurement.Target =
                            this.metrologyTarget;

                        buildModuleParameter.Measurement.USL =
                            this.metrologyUsl;

                        buildModuleParameter.Measurement.LSL =
                            this.metrologyLsl;

                        buildModuleParameter.Measurement.UCL =
                            this.metrologyUcl;

                        buildModuleParameter.Measurement.LCL =
                            this.metrologyLcl;

                        buildModuleParameter.Dqiy.DQIySwitch =
                            this.dqiySwitch;

                        buildModuleParameter.Dqiy.PhaseI_Error_Threshold =
                            this.phaselErrorThreshold;

                        // RI
                        buildModuleParameter.RI.LookAheadCount =
                            this.lookAheadCount;

                        buildModuleParameter.RI.Tolerant_MaxError =
                            this.riMaxmumError;

                        // KSS
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

                        buildModuleParameter.KSS.ModelExpansionOpen = this.modelExpansionOpen === true ? 1 : 0;

                        buildModuleParameter.KSS.ModifyYOpen = this.modifyYOpen === true ? 1 : 0;

                        buildModuleParameter.KSS.ModelExpansionSize = this.modelExpansionSize;

                        buildModuleParameter.KSS.AdjustYScale = this.adjustYScale;

                        buildModuleParameter.Refresh.forceRefresh = this.forceRefresh === true ? 1 : 0;

                        // ==========================================
                        // BPNN Range
                        // ==========================================

                        const alphaArray: Array<any> = [];

                        $(".alpha-input > input").each(
                            function () {
                                alphaArray.push(
                                    $(this).val()
                                );
                            }
                        );

                        buildModuleParameter.BPNN.InAlphaRange =
                            alphaArray;

                        const epochsArray: Array<any> = [];

                        $(".epochs-input > input").each(
                            function () {
                                epochsArray.push(
                                    $(this).val()
                                );
                            }
                        );

                        buildModuleParameter.BPNN.InEpochsRange =
                            epochsArray;

                        const momArray: Array<any> = [];

                        $(".mom-input > input").each(
                            function () {
                                momArray.push(
                                    $(this).val()
                                );
                            }
                        );

                        buildModuleParameter.BPNN.InMomTermRange =
                            momArray;

                        const nodeArray: Array<any> = [];

                        $(".node-input > input").each(
                            function () {
                                nodeArray.push(
                                    $(this).val()
                                );
                            }
                        );

                        buildModuleParameter.BPNN.InNodesRange = nodeArray;

                        // ==========================================
                        // DCP
                        // 最後才由畫面的 indicatorRule 產生
                        // ==========================================

                        const energyDCP = Method.buildEnergyPredictionDCP(indicatorRule);

                        filterrulesDCP = energyDCP.filterrulesDCP;

                        indicatorrulesDCP =
                            energyDCP.indicatorrulesDCP;

                        console.log(
                            "variablegroupsDCP：",
                            variablegroupsDCP
                        );

                        console.log(
                            "filterrulesDCP：",
                            filterrulesDCP
                        );

                        console.log(
                            "indicatorrulesDCP：",
                            indicatorrulesDCP
                        );

                        console.log(
                            "pointrulesDCP：",
                            pointrulesDCP
                        );

                        if (
                            filterrulesDCP.length !==
                            indicatorrulesDCP.length
                        ) {
                            throw new Error(
                                "Filter Rule 與 Indicator Rule 數量不一致。"
                            );
                        }

                        // ==========================================
                        // AVM III Feature
                        // ==========================================

                        const featurePayload =
                            this.featurePayload();

                        featurePayload.AvmIIIFeature.taskId =
                            taskId;

                        await BuildModel.SaveFeatureTxt(
                            featurePayload.AvmIIIFeature
                        );

                        // ==========================================
                        // Model Config
                        // ==========================================

                        const payload =
                            this.buildPayload();

                        payload.taskId =
                            taskId;

                        payload.exportScheduling =
                            this.form.exportScheduling;

                        payload.exportFacility =
                            this.form.exportFacility;

                        payload.exportMicrogrid =
                            this.form.exportMicrogrid;

                        await BuildModel.SaveModelConfig(
                            payload
                        );

                        // ==========================================
                        // 儲存 DCP
                        // ==========================================

                        const dcpResult =
                            await BuildModel.DCP(
                                taskId,
                                variablegroupsDCP,
                                filterrulesDCP,
                                indicatorrulesDCP,
                                pointrulesDCP,
                                this.testingCount
                            );

                        console.log(
                            "DCP Result：",
                            dcpResult
                        );

                        if (dcpResult !== "OK") {
                            throw new Error(
                                "DCP 儲存失敗：" +
                                String(dcpResult)
                            );
                        }

                        kendo.ui.progress(
                            $loadingTarget,
                            false
                        );

                        await this.waitForRawDataDownload();
                        // ==========================================
                        // 建立建模需要的 TrainingData
                        // ==========================================

                        vm.modelProcessStage = "Preparing";

                        vm.modelProcessTitle = "Preparing Training Data";

                        vm.modelProcessMessage = "正在準備模型訓練資料...";

                        const trainingDataResult: any =
                            await BuildModel.PrepareTrainingData(taskId);

                        if (!trainingDataResult || trainingDataResult.success !== true
                        ) {
                            throw new Error(
                                trainingDataResult &&
                                    trainingDataResult.message
                                    ? trainingDataResult.message
                                    : "TrainingData 建立失敗"
                            );
                        }
                        kendo.ui.progress($loadingTarget,true);
                        // ==========================================
                        // AutoEncoder 資料
                        // 目前只有建立，API 仍註解
                        // ==========================================

                        avmAutoEncoderInfo =
                            new AvmAutoEncoderInfo();

                        avmAutoEncoderInfo.filters.push(
                            this.filters
                        );

                        avmAutoEncoderInfo.kernel_size.push(
                            this.kernel_size
                        );

                        avmAutoEncoderInfo.activation =
                            this.activation;

                        avmAutoEncoderInfo.pool_size.push(
                            this.pool_size
                        );

                        avmAutoEncoderInfo.epoch.push(
                            this.epoch
                        );

                        avmAutoEncoderInfo.learningrate.push(
                            this.learningRate
                        );

                        avmAutoEncoderInfo.patience.push(
                            this.patience
                        );

                        avmAutoEncoderInfo.batch.push(
                            this.batch
                        );

                        avmAutoEncoderInfo.dropout.push(
                            this.dropout
                        );

                        avmAutoEncoderInfo.moment.push(
                            this.moment
                        );

                        avmAutoEncoderInfo.model_frequency.push(
                            this.model_frequency
                        );

                        avmAutoEncoderInfo.tune_frequency.push(
                            this.tune_frequency
                        );

                        avmAutoEncoderInfo.virtual_cassette.push(
                            this.virtual_cassette
                        );

                        avmAutoEncoderInfo.DMW_switch.push(
                            this.DMW_switch
                        );


                        // ==========================================
                        // Build Model
                        // ==========================================
                        vm.modelProcessStage ="Model";

                        vm.modelProcessTitle ="Building Model";

                        vm.modelProcessMessage ="模型建立中，請稍候...";

                        vm.info ="Starting...";

                        const result = await BuildModel.BuildModel(taskId);

                        console.log("Build Model Result：", result);

                        if (!result || result.success === false) {
                            throw new Error(
                                result && result.msg
                                    ? result.msg
                                    : "Build Model 啟動失敗。"
                            );
                        }

                        $(".modelProcessInfo")
                            .css("display", "inline");

                        // ==========================================
                        // 輪詢模型狀態
                        // ==========================================

                        const checkFile =
                            window.setInterval(
                                async function () {
                                    try {
                                        vm.info =
                                            await BuildModel
                                                .ModelProcessInfo(
                                                    taskId
                                                );

                                        if (vm.info === "OK!") { window.clearInterval(
                                                checkFile);

                                            vm.info = "";

                                            vm.modelProcessStage ="Completed";

                                            vm.modelProcessTitle ="Model Completed";

                                            vm.modelProcessMessage ="模型建立完成，請輸入 Model Name";

                                            vm.modelName ="";

                                            vm.modelNameError ="";

                                            vm.modelUploading =false;

                                            vm.modelUploadResult ="";

                                            if (vm.isCheckedTestingData && vm.TestingData) {
                                                await DataCollection.DownloadPPT(taskId);
                                            }
                                            return;
                                        }
                                        else if (vm.info === "Error") {
                                            window.clearInterval(
                                                checkFile
                                            );

                                            const errorInfo =
                                                await BuildModel
                                                    .ReadErrorInfo(
                                                        taskId
                                                    );

                                            alert(errorInfo);
                                        }
                                    }
                                    catch (pollError) {
                                        window.clearInterval(
                                            checkFile
                                        );

                                        console.error(
                                            "Model Process Check Error：",
                                            pollError
                                        );

                                        alert(
                                            "取得模型處理狀態失敗。"
                                        );
                                    }
                                },
                                1000
                            );
                    }
                    catch (error) {
                        console.error(
                            "Build AVM Model Error：",
                            error
                        );

                        alert(
                            error instanceof Error
                                ? error.message
                                : "Build Model Failed."
                        );
                    }
                    finally {
                        /*
                         * 這裡只代表送出 Build 請求完成，
                         * 模型本身仍可能在背景執行。
                         */
                        kendo.ui.progress(
                            $loadingTarget,
                            false
                        );
                    }
                },
                featurePayload() {
                    let numerical: Array<string> = [];
                    let target: Array<string> = [];
                    for (let i = 0; i < variablegroupsDCP.length; i++) {

                        if (variablegroupsDCP[i].variablegroupname.includes("PROCESS")) {
                            for (let j = 0; j < variablegroupsDCP[i].variables.length; j++) {
                                numerical.push(variablegroupsDCP[i].variables[j].variablename);
                            }
                        }
                        if (variablegroupsDCP[i].variablegroupname.includes("METROLOGY")) {
                            for (let j = 0; j < variablegroupsDCP[i].variables.length; j++) {
                                target.push(variablegroupsDCP[i].variables[j].variablename);
                            }
                        }
                    }
                    return {
                        AvmIIIFeature: {
                            numerical: numerical,
                            target: target
                        }
                    }
                },
                buildPayload() {
                    return {
                        energy: {
                            finetune_time_max: this.finetune_time_max,
                            threshold_scaler: this.threshold_scaler,
                            split: this.split,
                            fine_tune_split: this.fine_tune_split,
                            model_set_proportion: this.model_set_proportion,
                            fine_tune_lr_m1: this.fine_tune_lr_m1,
                            fine_tune_lr_m2: this.fine_tune_lr_m2,
                            fine_tune_lr_gsi: this.fine_tune_lr_gsi,
                            fine_tune_len: this.fine_tune_len,
                            seq_len: this.seq_len,
                            forecasting_len: this.forecasting_len,
                            n_trials: this.n_trials,
                            patience: this.patience,
                            scheduler_patience: this.scheduler_patience,
                            num_epoches_search: this.num_epoches_search,
                            num_epoches: this.num_epoches,

                            param_grid: {
                                hidden_size: this.param_grid_hidden_size,
                                num_layers: this.param_grid_num_layers,
                                lr: this.param_grid_lr,
                                batch_size: this.param_grid_batch_size
                            },

                            gsi_param_grid: {
                                hidden_size: this.gsi_param_grid_hidden_size,
                                latent_dim: this.gsi_param_grid_latend_dim,
                                dropout: this.gsi_param_grid_dropout,
                                lr: this.gsi_param_grid_lr,
                                BATCH_SIZE: this.gsi_param_grid_batch_size
                            }
                        },

                        scheduling: {
                            ga_parameters: {
                                pop: this.nsga_pop,
                                gen: this.nsga_gen,
                                cxpb: this.nsga_cxpb,
                                mutpb: this.nsga_mutpb,
                                assign_indpb: this.nsga_assign_indpb,
                                perm_indpb: this.nsga_perm_indpb,
                                seed: this.nsga_seed
                            },
                            scheduling_parameters: {
                                batch_size: this.schedule_batch_size,
                                setup: this.schedule_setup,
                                setup_value_per_hour: this.schedule_setup_value,
                                intra_rule: this.schedule_intra_rule
                            },
                            system_parameters: {
                                n_jobs: this.system_n_jobs,
                                schedule_fmt: this.system_schedule_fmt,
                                write_outputs: this.system_write_outputs
                            }
                        },

                        facility: this.selectedDevice === "air"
                            ? {
                                facility_type: "air",
                                air: {
                                    OVER_BUDGET_PENALTY: this.air_over_budget_penalty,
                                    FLOW_PENALTY: this.air_flow_penalty,
                                    n_fixed_input: this.air_n_fixed_input,
                                    n_vfd_input: this.air_n_vfd_input,
                                    FIXED_AIR_KW: this.air_fixed_air_kw,
                                    FIXED_AIR_FLOW: this.air_fixed_air_flow,
                                    FLOW_CORRECTION: this.air_flow_correction,
                                    BUDJECT_CORRECTION: this.air_budget_correction,
                                    USAGE_CORRECTION: this.air_usage_correction,
                                    SWARMSIZE: this.air_swarmsize,
                                    MAXITER: this.air_maxiter
                                },
                                chiller: null
                            }
                            : {
                                facility_type: "chiller",
                                air: null,
                                chiller: {
                                    OVER_BUDGET_PENALTY: this.chiller_over_budget_penalty,
                                    FLOW_PENALTY: this.chiller_flow_penalty,
                                    CHILLER_COP: this.chiller_cop,
                                    FLOW_CORRECTION: this.chiller_flow_correction,
                                    BUDJECT_CORRECTION: this.chiller_budget_correction,
                                    USAGE_CORRECTION: this.chiller_usage_correction,
                                    SWARMSIZE: this.chiller_swarmsize,
                                    MAXITER: this.chiller_maxiter
                                }
                            },

                        microgrid: {
                            forecast: {
                                horizon: this.mg_forecast_horizon
                            },
                            battery: {
                                BESS_MAX: this.mg_bess_max,
                                BESS_charge_MAX: this.mg_bess_charge_max,
                                BESS_discharge_MAX: this.mg_bess_discharge_max,
                                SoC_init: this.mg_soc_init,
                                SoC_min: this.mg_soc_min,
                                SoC_max: this.mg_soc_max
                            },
                            battery_cost: {
                                cost_BESS_ch: this.mg_cost_bess_ch,
                                cost_BESS_disch: this.mg_cost_bess_disch,
                                MC_bess: this.mg_mc_bess
                            },
                            battery_degradation: {
                                beta0: this.mg_beta0,
                                beta1: this.mg_beta1,
                                beta2: this.mg_beta2,
                                ccap: this.mg_ccap
                            },
                            carbon_cost: {
                                carbon_emission_factor_of_grid: this.mg_carbon_factor,
                                carbon_price_per_kg: this.mg_carbon_price,
                                cec_ele: this.mg_carbon_factor,
                                carbon_price: this.mg_carbon_price
                            },
                            PSO_parameters: {
                                swarm_size: this.mg_swarm_size,
                                iterations: this.mg_iterations,
                                w: this.mg_w,
                                w_max: this.mg_w_max,
                                w_min: this.mg_w_min,
                                c1: this.mg_c1,
                                c2: this.mg_c2,
                                penalty_weight: this.mg_penalty_weight
                            },
                            PV_cost: {
                                MC_PV: this.mg_mc_pv,
                                cost_PV: this.mg_cost_pv
                            }
                        }
                    };
                },
                loopBuildModel: async function (e) {
                    while (true) {
                        if (e == "break") {
                            break;
                        }
                        taskId = DataCollection.GetGuid();
                        this.taskId = taskId;
                        //await DataCollection.DownLoadRawData(taskId, pieceList, rawDataVariable);
                        await this.buildAvmModel();
                        this.loopCount++;
                    }
                },
                deleteEpochsInput: function () {
                    $(".epochs-input > input:last-child").remove();
                },
                addEpochsInput: function () {
                    $(".epochs-input").append("<input>");
                },
                deleteAlphaInput: function () {
                    $(".alpha-input > input:last-child").remove();
                },
                addAlphaInput: function () {
                    $(".alpha-input").append("<input>");
                },
                deleteMomInput: function () {
                    $(".mom-input > input:last-child").remove();
                },
                addMomInput: function () {
                    $(".mom-input").append("<input>");
                },
                deleteNodeInput: function () {
                    $(".node-input > input:last-child").remove();
                },
                addNodeInput: function () {
                    $(".node-input").append("<input>");
                },
                getPieceCount: async function () {
                    const vm = this;

                    const $loadingTarget = $(".selection-work");

                    const $button = $(".get-piece-btn");

                    try {

                        $button.prop("disabled", true);

                        kendo.ui.progress($loadingTarget, true);

                        // 讓 Loading 先畫出來
                        await new Promise<void>(resolve => {
                            setTimeout(resolve, 50);
                        });

                        let result: any = await DataCollection.GetPieceCount(cbn);

                        console.log(result);

                        // MVC 有些版本會包一層 d
                        if (result.d != undefined)
                            result = result.d;

                        // 如果 Controller 直接 Json(count)
                        if (typeof result === "number") {
                            vm.pieceCount = result;
                        }
                        // 如果 Controller 回傳 { PieceCount: xxx }
                        else if (result.PieceCount != undefined) {
                            vm.pieceCount = result.PieceCount;
                        }
                        // 如果 Controller 回傳 { pieceCount: xxx }
                        else if (result.pieceCount != undefined) {
                            vm.pieceCount = result.pieceCount;
                        }
                        else {
                            vm.pieceCount = 0;
                        }

                    }
                    catch (ex) {

                        console.log(ex);

                        alert("Get Piece Count Failed");

                    }
                    finally {

                        kendo.ui.progress($loadingTarget, false);

                        $button.prop("disabled", false);

                    }
                },
                pieceSelect: function () {

                    let _this = this;
                    var window = $(".piece-select-window").kendoWindow({
                        title: "Piece ID",
                        actions: [],
                        height: 800,
                        width: 600,
                        close: function () {
                            _this.pieceWindow = false;
                        }
                    }).data("kendoWindow").center().open();
                    this.pieceWindow = true;
                    $(".piece-close-btn").click(function () {
                        $(".piece-select-check").each(function () {
                            pieceList.forEach((value, item) => {
                                if (value == $(this).attr("pieceId")) {
                                    $(this).prop("checked", "checked");
                                }
                            });
                        });

                        let checks = $(".piece-select-check:checked").length;
                        if (checks == $(".piece-select-check").length) {
                            $(".piece-select-all").prop("checked", "checked");
                        }
                        window.close();
                    });

                    $(".piece-setting-btn").click(function () {
                        window.close();
                    });
                },
                pieceSetting: function () {
                    let deletePieceIds: Array<number> = [];
                    $(".piece-select-check:not(:checked)").each(function () {
                        let pieceId = $(this).attr("pieceId");
                        pieceList.forEach((value, item) => {
                            if (value == pieceId) {
                                deletePieceIds.push(value);
                            }
                        });
                    });
                    deletePieceIds.forEach((value) => {
                        let index = 0;
                        pieceList.forEach((_value, item) => {
                            if (value == _value) {
                                index = item;
                                return;
                            }
                        });
                        pieceList.splice(index, 1);
                    });

                    $(".piece-select-check:checked").each(function () {
                        let pieceId = $(this).attr("pieceId");
                        let hasPieceId: boolean = false;
                        pieceList.forEach((value, item) => {
                            if (value == pieceId) {
                                hasPieceId = true;
                                return;
                            }
                        });

                        if (hasPieceId == false) {
                            pieceList.push(pieceId);
                        }
                    });
                    this.pieceCount = pieceList.length;
                },
                specSetting: function () {
                    if ($(".spec-setting > ul").css("display") == "none") {
                        $(".spec-setting > ul").css("display", "inline");
                    } else {
                        $(".spec-setting > ul").css("display", "none")
                    }
                },
                conSetting: function () {
                    if ($(".con-setting > ul").css("display") == "none") {
                        $(".con-setting > ul").css("display", "inline");
                    } else {
                        $(".con-setting > ul").css("display", "none")
                    }
                },
                specCheck: function (check) {


                    if (check == "specManual") {
                        this.specPercentage = false;
                        this.specSigma = false;
                        $(".usl").prop("disabled", false);
                        $(".lsl").prop("disabled", false);
                    }
                    if (check == "specPercentage") {
                        this.specSigma = false;
                        this.specManual = false;
                        $(".usl").prop("disabled", true);
                        $(".lsl").prop("disabled", true);
                    }
                    if (check == "specSigma") {
                        this.specPercentage = false;
                        this.specManual = false;
                        $(".usl").prop("disabled", true);
                        $(".lsl").prop("disabled", true);
                    }
                },
                conCheck: function (check) {
                    if (check == "conManual") {
                        this.conPercentage = false;
                        this.conSigma = false;
                        $(".ucl").prop("disabled", false);
                        $(".lcl").prop("disabled", false);
                    }
                    if (check == "conPercentage") {
                        this.conSigma = false;
                        this.conManual = false;
                        $(".ucl").prop("disabled", true);
                        $(".lcl").prop("disabled", true);
                    }
                    if (check == "conSigma") {
                        this.conPercentage = false;
                        this.conManual = false;
                        $(".ucl").prop("disabled", true);
                        $(".lcl").prop("disabled", true);
                    }
                },
                riCheck: function (check) {
                    if (check == "Manual") {
                        this.riManual = true;
                        this.riAuto = false;
                    }

                    if (check == "Auto") {
                        this.riManual = false;
                        this.riAuto = true;
                    }
                },
                trim: function () {
                    this.trimBegin = this.inputBegin;
                    this.trimBeginSet = this.inputBegin;
                    this.trimEndSet = this.trimEnd;
                    this.indicatorSpec("All");
                },
                clickQuery: async function () {
                    kendo.ui.progress($(".selection"), true);
                    $(".fab-grid").empty();
                    fabList = [];
                    fabGirdName = [];
                    fabList = await DataCollection.GetFabInfo();
                    this.cbnItem = 0;
                    for (let i = 0; i < fabList.length; i++) {
                        let className = Method.generateClassName(fabList[i]);
                        fabGirdName.push(className);
                        Method.addCombinationGrid(fabList[i], className);
                        if (i == 0) {
                            $("." + className + "-grid").css("display", "inline");
                        }
                    }
                    cbn.startTime = this.startTime;
                    cbn.endTime = this.endTime;
                    var object = new Object();
                    object[fabList[0]] = []
                    cbn.data = null;
                    this.fabInfo(fabList[0], fabGirdName[0]);
                    kendo.ui.progress($(".selection"), false);
                },
                nextBtn: async function () {

                    $(".preset-file").val("");

                    // 還沒取得 Piece Count，不允許下一步
                    if (this.pieceCount == 0) {
                        alert("Not Get Piece!");
                        return;
                    }

                    if (this.avmItemPage >= 3) {
                        return;
                    }

                    this.avmItemPage++;

                    $(".guide > ul > li")
                        .eq(this.avmItemPage)
                        .addClass("setp-working");

                    $(".guide > ul > li")
                        .eq(this.avmItemPage - 1)
                        .removeClass("setp-working");


                    // Step 2：Variable Selection
                    if (
                        this.avmItemPage == 1 &&
                        this.variablePageInitial == 0
                    ) {
                        this.variablePageInitial = 1;
                        this.variablesSelection();
                    }

                    // Step 3：Raw Data Preprocessing
                    else if (this.avmItemPage == 2) {

                        warningId = [];

                        // 驗證 Input / Output 數量
                        if (
                            this.inputCount == 0 ||
                            this.outputCount == 0 ||
                            this.outputCount > 1
                        ) {
                            if (
                                this.inputCount == 0 ||
                                this.outputCount == 0
                            ) {
                                alert("Input or Output is 0.");
                            }
                            else if (this.outputCount > 1) {
                                alert("Output only choose 1.");
                            }

                            // 回到上一頁
                            this.avmItemPage--;

                            $(".guide > ul > li")
                                .eq(this.avmItemPage)
                                .addClass("setp-working");

                            $(".guide > ul > li")
                                .eq(this.avmItemPage + 1)
                                .removeClass("setp-working");

                            return;
                        }

                        try {
                            kendo.ui.progress(
                                $(".rawdata-prerocessing"),
                                true
                            );

                            // 取得選取的變數
                            rawDataVariable =
                                VariablesMethod.GetVariableSelect(
                                    variables
                                );

                            /*
                             * 不再下載 RawData。
                             * 不再使用：
                             *
                             * pieceList
                             * DataCollection.DownLoadRawData(...)
                             */

                            // 直接初始化 Raw Data Preprocessing 畫面
                            this.rawDataPreprocess();

                            filterrulesDCP =
                                DCPCheck.variableIdCheck(
                                    variablegroupsDCP,
                                    filterrulesDCP
                                );

                            $(".temporaldata-chart").empty();
                        }
                        catch (error) {
                            console.error(
                                "Raw Data Preprocessing 初始化失敗：",
                                error
                            );

                            alert(
                                "Raw Data Preprocessing Failed."
                            );

                            // 發生錯誤，退回上一頁
                            this.avmItemPage--;

                            $(".guide > ul > li")
                                .eq(this.avmItemPage)
                                .addClass("setp-working");

                            $(".guide > ul > li")
                                .eq(this.avmItemPage + 1)
                                .removeClass("setp-working");
                        }
                        finally {
                            kendo.ui.progress(
                                $(".rawdata-prerocessing"),
                                false
                            );
                        }
                    }

                    // Step 4：Parameter Setting
                    else if (this.avmItemPage == 3) {

                        if (indicatorRule.length <= 1) {

                            this.avmItemPage--;

                            $(".guide > ul > li")
                                .eq(this.avmItemPage)
                                .addClass("setp-working");

                            $(".guide > ul > li")
                                .eq(this.avmItemPage + 1)
                                .removeClass("setp-working");

                            alert("Rule數量不可為1。");

                            return;
                        }

                        $(".next").css("display", "none");
                        $(".build").css("display", "inline");

                        KendoApi.DMW_Switch(this);
                        KendoApi.KSSNumericInput(this);
                    }
                },
                previousBtn: function () {



                    if (this.avmItemPage > 0) {
                        this.avmItemPage--;
                        //FLAG:測試Preset
                        //if (this.avmItemPage == 2) {
                        //    $(".preset-grid").css("display", "none");
                        //} else {
                        //    $(".preset-grid").css("display", "inline");
                        //}
                        $(".guide > ul > li").eq(this.avmItemPage).addClass("setp-working");
                        $(".guide > ul > li").eq(this.avmItemPage + 1).removeClass("setp-working");


                        if (this.avmItemPage == 2) {
                            $(".next").css("display", "inline");
                            $(".build").css("display", "none");
                        }
                        if (this.avmItemPage == 1) {
                            $(".temporaldata-toolbar").css("visibility", "hidden");
                        }
                        this.isCheckedTestingData = false;
                        this.noTestingData = false;
                        this.TestingData = false;
                        this.testingCount = 0;
                    }
                },
                saveRecord: function () {
                    if (this.avmItemPage == 0) {
                        SaveBlob.SaveCombinationSelectionJs(this.startTime, this.endTime, cbn, pieceList);
                    } else if (this.avmItemPage == 1) {
                        SaveBlob.SaveVariableSelectionJS(variables);
                    } else if (this.avmItemPage == 2) {
                        SaveBlob.SavePreprocessingJS(filterrulesDCP, indicatorrulesDCP, indicatorRule, buildModuleParameter.ModuleIndicatorRule);
                    } else if (this.avmItemPage == 3) {
                        SaveBlob.SaveParameter(this, buildModuleParameter, avmAutoEncoderInfo);
                    }
                },
                loadRecord: function () {
                    let file = $(".preset-file").prop("files")[0];
                    let reader = new FileReader();
                    var data: any;
                    let _this = this;
                    reader.onload = async function () {
                        let json = reader.result;
                        data = JSON.parse(json.toString());
                        if (_this.avmItemPage == 0) {
                            PresetBlob.CombinationSelection(_this, data);
                        } else if (_this.avmItemPage == 1) {
                            PresetBlob.LoadVariableSelection(_this, data);
                        } else if (_this.avmItemPage == 2) {
                            kendo.ui.progress($(".selection"), true);
                            filterrulesDCP = DCPCheck.variableIdCheck(variablegroupsDCP, data.filterrulesDCP);
                            indicatorrulesDCP = data.indicatorrulesDCP;
                            indicatorRule = await DataCollection.GetProcessIndicatorRule(taskId, data.indicatorRule);

                            buildModuleParameter.ModuleIndicatorRule = PresetBlob.moduleIndicatorRuleNew(indicatorRule, data.moduleIndicatorRule);

                            ruleId = indicatorRule.length + 1;

                            sessionStorage.setItem("LoadPreprocessing", "true");

                            _this.preset = true;
                            _this.addRule();
                            kendo.ui.progress($(".selection"), false);
                        } else if (_this.avmItemPage == 3) {
                            PresetBlob.LoadParameter(_this, data);
                        }
                    }
                    reader.readAsText(file);

                },
                checkValidation: function () {
                    if (this.isCheckedTestingData == false) {
                        this.testingCount = 0;
                        this.noTestingData = false;
                        this.TestingData = false;
                    } else {
                        let pieceCount = this.pieceCount;
                        let indicatorCount = indicatorRule.length;


                        if (pieceCount * 0.75 <= indicatorCount * 3) {
                            this.noTestingData = true;
                            this.testingCount = 0;
                            this.trainingCount = pieceCount
                        } else {
                            this.TestingData = true;
                            this.trainingCount = Math.floor(pieceCount * 0.75)
                            this.testingCount = pieceCount - this.trainingCount;
                        }

                    }

                },
                waitForRawDataDownload:
                    async function (): Promise<void> {

                        const vm = this;

                        // ==========================================
                        // 取得目前勾選的 RawData Variable
                        // ==========================================

                        rawDataVariable =
                            VariablesMethod.GetVariableSelect(
                                variables
                            );

                        if (
                            !rawDataVariable ||
                            rawDataVariable.length === 0
                        ) {
                            throw new Error(
                                "沒有選取任何 RawData Variable"
                            );
                        }

                        // ==========================================
                        // 顯示中央進度視窗
                        // ==========================================

                        vm.modelProcessVisible =
                            true;

                        vm.modelProcessStage =
                            "RawData";

                        vm.modelProcessTitle =
                            "Downloading RawData";

                        vm.modelProcessMessage =
                            "正在啟動 RawData 下載工作...";

                        vm.modelProcessError =
                            "";

                        vm.rawDataDownloadStatus =
                            "Starting";

                        vm.rawDataDownloadPercent =
                            0;

                        vm.rawDataDownloadMessage =
                            "";

                        vm.rawDataCurrentBatch =
                            0;

                        vm.rawDataTotalBatch =
                            0;

                        // 讓 Vue 先把中央彈窗畫出來
                        await vm.$nextTick();

                        // ==========================================
                        // 啟動後端背景下載工作
                        // ==========================================

                        const startResult: any =
                            await DataCollection
                                .StartDownloadRawData(
                                    taskId,
                                    vm.startTime,
                                    vm.endTime,
                                    cbn.data,
                                    rawDataVariable
                                );

                        if (
                            !startResult ||
                            startResult.success !== true
                        ) {
                            vm.modelProcessStage =
                                "Failed";

                            vm.modelProcessTitle =
                                "RawData Download Failed";

                            vm.modelProcessMessage =
                                "RawData 工作啟動失敗";

                            vm.modelProcessError =
                                startResult &&
                                    startResult.message
                                    ? startResult.message
                                    : "RawData 工作啟動失敗";

                            throw new Error(
                                vm.modelProcessError
                            );
                        }

                        vm.rawDataDownloadStatus =
                            "Running";

                        vm.modelProcessMessage =
                            "背景工作已啟動，正在查詢 Piece...";

                        // ==========================================
                        // 每秒查詢下載進度
                        // ==========================================

                        await new Promise<void>(
                            function (
                                resolve,
                                reject
                            ) {
                                let polling =
                                    false;

                                const timer =
                                    window.setInterval(
                                        async function () {

                                            /*
                                             * 避免上一個 AJAX 還沒結束，
                                             * 下一個輪詢又送出去。
                                             */
                                            if (polling) {
                                                return;
                                            }

                                            polling =
                                                true;

                                            try {
                                                const result: any =
                                                    await DataCollection
                                                        .GetRawDataDownloadProgress(
                                                            taskId
                                                        );

                                                if (
                                                    !result ||
                                                    result.success !== true
                                                ) {
                                                    vm.modelProcessMessage =
                                                        result &&
                                                            result.message
                                                            ? result.message
                                                            : "暫時無法取得下載進度";

                                                    return;
                                                }

                                                const job =
                                                    result.job;

                                                if (!job) {
                                                    vm.modelProcessMessage =
                                                        "尚未取得下載工作狀態";

                                                    return;
                                                }

                                                /*
                                                 * 同時支援：
                                                 * C# 預設 PascalCase
                                                 * 或 camelCase JSON
                                                 */
                                                const percent =
                                                    job.Percent ??
                                                    job.percent ??
                                                    0;

                                                const message =
                                                    job.Message ??
                                                    job.message ??
                                                    "";

                                                const status =
                                                    job.Status ??
                                                    job.status ??
                                                    "";

                                                const currentBatch =
                                                    job.CurrentBatch ??
                                                    job.currentBatch ??
                                                    0;

                                                const totalBatch =
                                                    job.TotalBatch ??
                                                    job.totalBatch ??
                                                    0;

                                                const errorMessage =
                                                    job.Error ??
                                                    job.error ??
                                                    "";

                                                // ==================================
                                                // 更新中央彈窗
                                                // ==================================

                                                vm.rawDataDownloadPercent =
                                                    Number(percent);

                                                vm.rawDataDownloadMessage =
                                                    String(message);

                                                vm.rawDataDownloadStatus =
                                                    String(status);

                                                vm.rawDataCurrentBatch =
                                                    Number(currentBatch);

                                                vm.rawDataTotalBatch =
                                                    Number(totalBatch);

                                                vm.modelProcessStage =
                                                    "RawData";

                                                vm.modelProcessTitle =
                                                    "Downloading RawData";

                                                vm.modelProcessMessage =
                                                    String(
                                                        message ||
                                                        "正在下載 RawData..."
                                                    );

                                                // ==================================
                                                // 下載完成
                                                // ==================================

                                                if (
                                                    String(status)
                                                        .toLowerCase() ===
                                                    "completed"
                                                ) {
                                                    window.clearInterval(
                                                        timer
                                                    );

                                                    vm.rawDataDownloadPercent =
                                                        100;

                                                    vm.rawDataDownloadStatus =
                                                        "Completed";

                                                    vm.modelProcessMessage =
                                                        "RawData 下載完成，準備建立模型...";

                                                    resolve();

                                                    return;
                                                }

                                                // ==================================
                                                // 下載失敗
                                                // ==================================

                                                if (
                                                    String(status)
                                                        .toLowerCase() ===
                                                    "failed"
                                                ) {
                                                    window.clearInterval(
                                                        timer
                                                    );

                                                    vm.rawDataDownloadStatus =
                                                        "Failed";

                                                    vm.modelProcessStage =
                                                        "Failed";

                                                    vm.modelProcessTitle =
                                                        "RawData Download Failed";

                                                    vm.modelProcessMessage =
                                                        "RawData 下載失敗";

                                                    vm.modelProcessError =
                                                        String(
                                                            errorMessage ||
                                                            message ||
                                                            "RawData 下載失敗"
                                                        );

                                                    reject(
                                                        new Error(
                                                            vm.modelProcessError
                                                        )
                                                    );

                                                    return;
                                                }
                                            }
                                            catch (error) {
                                                window.clearInterval(
                                                    timer
                                                );

                                                vm.rawDataDownloadStatus =
                                                    "Failed";

                                                vm.modelProcessStage =
                                                    "Failed";

                                                vm.modelProcessTitle =
                                                    "RawData Download Failed";

                                                vm.modelProcessMessage =
                                                    "取得 RawData 進度失敗";

                                                vm.modelProcessError =
                                                    error instanceof Error
                                                        ? error.message
                                                        : "取得 RawData 進度失敗";

                                                reject(error);
                                            }
                                            finally {
                                                polling =
                                                    false;
                                            }
                                        },
                                        1000
                                    );
                            }
                        );
                    },
                uploadCompletedModel:
                    async function (): Promise<void> {

                        const vm = this;

                        vm.modelNameError =
                            "";

                        const modelName =
                            String(
                                vm.modelName || ""
                            ).trim();

                        if (!modelName) {
                            vm.modelNameError =
                                "請輸入 Model Name";

                            return;
                        }

                        if (vm.modelUploading) {
                            return;
                        }

                        try {
                            vm.modelUploading =
                                true;

                            vm.modelProcessStage =
                                "Uploading";

                            vm.modelProcessTitle =
                                "Uploading Model";

                            vm.modelProcessMessage =
                                "正在上傳模型，請稍候...";

                            const resultMsg =
                                await BuildModel.UploadModel(
                                    taskId,
                                    modelName,
                                    indicatorRule
                                );

                            vm.modelUploadResult =
                                String(
                                    resultMsg ||
                                    "模型上傳完成"
                                );

                            vm.modelProcessStage =
                                "Uploaded";

                            vm.modelProcessTitle =
                                "Model Uploaded";

                            vm.modelProcessMessage =
                                "模型已完成上傳";
                        }
                        catch (error) {
                            vm.modelProcessStage =
                                "Failed";

                            vm.modelProcessTitle =
                                "Upload Failed";

                            vm.modelProcessMessage =
                                "模型上傳失敗";

                            vm.modelProcessError =
                                error && error.responseJSON &&
                                error.responseJSON.message
                                    ? String(
                                        error.responseJSON.message
                                      )
                                    : error instanceof Error
                                        ? error.message
                                        : "模型上傳失敗";
                        }
                        finally {
                            vm.modelUploading =
                                false;
                        }
                    },
                closeModelProgress:
                    function (): void {

                        if (this.modelUploading) {
                            return;
                        }

                        this.modelProcessVisible =
                            false;

                        this.modelProcessStage =
                            "";

                        this.modelProcessTitle =
                            "";

                        this.modelProcessMessage =
                            "";

                        this.modelProcessError =
                            "";

                        this.modelName =
                            "";

                        this.modelNameError =
                            "";

                        this.modelUploadResult =
                            "";
                    },
            }
        });
    }
}

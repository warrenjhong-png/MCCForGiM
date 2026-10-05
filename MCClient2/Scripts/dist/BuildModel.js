var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var BuildModel;
(function (BuildModel_1) {
    function BuildModuleParameter(taskId, buildModuleParameter) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = [];
            yield $.ajax({
                url: Method.generateUrl() + "/Avm/BuildModuleParameter",
                cache: false,
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                //method: "POST",
                data: JSON.stringify({
                    taskId: taskId,
                    moduleIndicatorRule: buildModuleParameter.ModuleIndicatorRule,
                    kss: buildModuleParameter.KSS,
                    dqiy: buildModuleParameter.Dqiy,
                    bpnn: buildModuleParameter.BPNN,
                    ri: buildModuleParameter.RI,
                    measurement: buildModuleParameter.Measurement,
                    refresh: buildModuleParameter.Refresh
                }),
                type: "POST",
                success: function (data, textStatus, jqXHR) {
                    result = data;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("GetIndicator Error : ");
                }
            });
            return result;
        });
    }
    BuildModel_1.BuildModuleParameter = BuildModuleParameter;
    function DCP(taskId, variablegroups, filterrules, indicatorrules, pointrules, testingCount) {
        return __awaiter(this, void 0, void 0, function* () {
            variablegroups = JSON.stringify(variablegroups);
            filterrules = JSON.stringify(filterrules);
            indicatorrules = JSON.stringify(indicatorrules);
            pointrules = JSON.stringify(pointrules);
            let result = [];
            yield $.ajax({
                url: Method.generateUrl() + "/Avm/DCP",
                cache: false,
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                //method: "POST",
                data: JSON.stringify({
                    taskId: taskId,
                    variablegroups: variablegroups,
                    filterrules: filterrules,
                    indicatorrules: indicatorrules,
                    pointrules: pointrules,
                    testingCount: testingCount
                }),
                type: "POST",
                success: function (data, textStatus, jqXHR) {
                    result = data;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("GetIndicator Error : ");
                }
            });
            return result;
        });
    }
    BuildModel_1.DCP = DCP;
    function MCS_ADAS(taskId, CNNEnable, step, cnnForceRefresh) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = [];
            yield $.ajax({
                url: Method.generateUrl() + "/Avm/MCS_ADAS",
                cache: false,
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                //method: "POST",
                data: JSON.stringify({
                    taskId: taskId,
                    CNNEnable: CNNEnable,
                    step: step,
                    cnnForceRefresh: cnnForceRefresh
                }),
                type: "POST",
                success: function (data, textStatus, jqXHR) {
                    result = data;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("GetIndicator Error : ");
                }
            });
            return result;
        });
    }
    BuildModel_1.MCS_ADAS = MCS_ADAS;
    function MCS_AutoEncoder_CNN(taskId, avmAutoEncoderInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = [];
            yield $.ajax({
                url: Method.generateUrl() + "/Avm/MCS_AutoEncoder_CNN",
                cache: false,
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                //method: "POST",
                data: JSON.stringify({
                    taskId: taskId,
                    avmAutoEncoderInfo: avmAutoEncoderInfo
                }),
                type: "POST",
                success: function (data, textStatus, jqXHR) {
                    result = data;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("GetIndicator Error : ");
                }
            });
            return result;
        });
    }
    BuildModel_1.MCS_AutoEncoder_CNN = MCS_AutoEncoder_CNN;
    function ReadModuleParameter() {
        return __awaiter(this, void 0, void 0, function* () {
            let result = [];
            yield $.ajax({
                url: Method.generateUrl() + "/Avm/ReadModuleParameter",
                cache: false,
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                //method: "POST",
                type: "POST",
                success: function (data, textStatus, jqXHR) {
                    result = data;
                    console.log("bulid : " + result);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("BuildModel Error : ");
                }
            });
            return result;
        });
    }
    BuildModel_1.ReadModuleParameter = ReadModuleParameter;
    function BuildModel(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = [];
            yield $.ajax({
                url: Method.generateUrl() + "/Avm/BuildModel",
                cache: false,
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                //method: "POST",
                data: JSON.stringify({ taskId: taskId }),
                type: "POST",
                success: function (data, textStatus, jqXHR) {
                    result = data;
                    console.log("bulid : " + result);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("BuildModel Error : ");
                }
            });
            return result;
        });
    }
    BuildModel_1.BuildModel = BuildModel;
    function ModelProcessInfo(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = [];
            yield $.ajax({
                url: Method.generateUrl() + "/Avm/ModelProcessInfo",
                cache: false,
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                //method: "POST",
                data: JSON.stringify({
                    taskId: taskId,
                }),
                type: "POST",
                success: function (data, textStatus, jqXHR) {
                    result = data;
                    console.log("bulid : " + result);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("BuildModel Error : ");
                }
            });
            return result;
        });
    }
    BuildModel_1.ModelProcessInfo = ModelProcessInfo;
    function UploadModel(taskId, modelName, indicatorRule) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield $.ajax({
                url: Method.generateUrl() + "/Avm/UploadModel",
                cache: false,
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                //method: "POST",
                data: JSON.stringify({
                    taskId: taskId,
                    modelName: modelName,
                    indicatorRule: indicatorRule,
                }),
                type: "POST",
                error: function (jqXHR, textStatus, errorThrown) {
                    const message = jqXHR.responseJSON && jqXHR.responseJSON.message
                        ? jqXHR.responseJSON.message
                        : (errorThrown || textStatus || "Upload model failed.");
                    console.error("UploadModel Error: " + message);
                }
            });
            if (!response || response.success !== true) {
                throw new Error(response && response.message
                    ? response.message
                    : "Upload model failed.");
            }
            return response.message;
        });
    }
    BuildModel_1.UploadModel = UploadModel;
    function ReadErrorInfo(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = [];
            yield $.ajax({
                url: Method.generateUrl() + "/Avm/ReadErrorInfo",
                cache: false,
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                //method: "POST",
                data: JSON.stringify({
                    taskId: taskId,
                }),
                type: "POST",
                success: function (data, textStatus, jqXHR) {
                    result = data;
                    console.log("error : " + result);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("Build Model Error : ");
                }
            });
            return result;
        });
    }
    BuildModel_1.ReadErrorInfo = ReadErrorInfo;
    function SaveHtml(taskId, html) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = [];
            yield $.ajax({
                url: Method.generateUrl() + "/Avm/SaveHtml",
                cache: false,
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                //method: "POST",
                data: JSON.stringify({
                    taskId: taskId,
                    html: html
                }),
                type: "POST",
                success: function (data, textStatus, jqXHR) {
                    result = data;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("Build Model Error : ");
                }
            });
            return result;
        });
    }
    BuildModel_1.SaveHtml = SaveHtml;
    function DownloadPPT(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = [];
            yield $.ajax({
                url: Method.generateUrl() + "/Avm/DownloadPPT",
                cache: false,
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                //method: "POST",
                data: JSON.stringify({
                    taskId: taskId,
                }),
                type: "POST",
                success: function (data, textStatus, jqXHR) {
                    result = data;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("Build Model Error : ");
                }
            });
            return result;
        });
    }
    BuildModel_1.DownloadPPT = DownloadPPT;
    function SaveModelConfig(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = [];
            yield $.ajax({
                url: Method.generateUrl() + "/Avm/SaveModelConfig",
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(payload),
                success: function (data, textStatus, jqXHR) {
                    result = data;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("SaveModelConfig Error : ");
                }
            });
        });
    }
    BuildModel_1.SaveModelConfig = SaveModelConfig;
    function LoadDefaultModelConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield $.ajax({
                    url: Method.generateUrl() + "/Avm/LoadDefaultModelConfig",
                    type: "POST",
                    cache: false,
                    dataType: "json"
                });
            }
            catch (error) {
                console.warn("LoadDefaultModelConfig failed; using built-in defaults.", error);
                return null;
            }
        });
    }
    BuildModel_1.LoadDefaultModelConfig = LoadDefaultModelConfig;
    function SaveFeatureTxt(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = [];
            yield $.ajax({
                url: Method.generateUrl() + "/Avm/SaveFeatureTxt",
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(payload),
                success: function (data, textStatus, jqXHR) {
                    result = data;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("SaveFeatureTxt Error : ");
                }
            });
        });
    }
    BuildModel_1.SaveFeatureTxt = SaveFeatureTxt;
    function PrepareTrainingData(taskId) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: Method.generateUrl() +
                    "/Avm/PrepareTrainingData",
                type: "POST",
                dataType: "json",
                data: {
                    taskId: taskId
                },
                success: function (result) {
                    resolve(result);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    reject(new Error(jqXHR.responseText ||
                        errorThrown ||
                        textStatus ||
                        "建立 TrainingData 失敗"));
                }
            });
        });
    }
    BuildModel_1.PrepareTrainingData = PrepareTrainingData;
})(BuildModel || (BuildModel = {}));
var BuildModelMethod;
(function (BuildModelMethod) {
    function moduleIndicatorRuleReset(moduleIndicatorRule, variablegroupsDCP, filterrulesDCP) {
        //重新編輯Rule
        let removeItem = [];
        for (let v = 0; v < variablegroupsDCP.length; v++) {
            for (let i = 0; i < filterrulesDCP.length; i++) {
                let tmp = filterrulesDCP[i].rulename.split(variablegroupsDCP[v].filename + "_");
                if (tmp.length == 1) {
                    continue;
                }
                let tmp2 = tmp[1].split("_");
                let sensor = tmp2[0];
                let exists = false;
                for (let j = 0; j < variablegroupsDCP.length; j++) {
                    if (exists) {
                        break;
                    }
                    for (let k = 0; k < variablegroupsDCP[j].variables.length; k++) {
                        sensor = tmp2[0];
                        for (let l = 1; l < tmp2.length; l++) {
                            if (variablegroupsDCP[j].variables[k].variablename == sensor) {
                                exists = true;
                                break;
                            }
                            sensor = sensor + "_" + tmp2[l];
                        }
                        if (exists) {
                            break;
                        }
                    }
                }
                if (exists == false) {
                    let tmp3 = sensor.split("_");
                    let splitError = false;
                    for (let f = 0; f < variablegroupsDCP.length; f++) {
                        let filename = variablegroupsDCP[v].filename;
                        for (let c = 0; c < tmp3.length; c++) {
                            filename += "_" + tmp3[c];
                            if (variablegroupsDCP[f].filename == filename) {
                                splitError = true;
                                break;
                            }
                        }
                        if (splitError) {
                            break;
                        }
                    }
                    if (!splitError) {
                        removeItem.push(i);
                    }
                }
            }
        }
        if (removeItem.length != 0) {
            for (let i = 0; i < removeItem.length; i++) {
                moduleIndicatorRule.EK.splice(removeItem[i], 1);
                moduleIndicatorRule.IndicatorLCL.splice(removeItem[i], 1);
                moduleIndicatorRule.IndicatorUCL.splice(removeItem[i], 1);
                moduleIndicatorRule.IndicatorLSL.splice(removeItem[i], 1);
                moduleIndicatorRule.IndicatorUSL.splice(removeItem[i], 1);
            }
            for (let i = 0; i < moduleIndicatorRule.EK.length; i++) {
                moduleIndicatorRule.EK[i] = i + 1;
            }
        }
        return moduleIndicatorRule;
    }
    BuildModelMethod.moduleIndicatorRuleReset = moduleIndicatorRuleReset;
    function checkFilterrulesDCP(variablegroupsDCP, filterrulesDCP) {
        let removeItem = [];
        for (let v = 0; v < variablegroupsDCP.length; v++) {
            for (let i = 0; i < filterrulesDCP.length; i++) {
                let tmp = filterrulesDCP[i].rulename.split(variablegroupsDCP[v].filename + "_");
                if (tmp.length == 1) {
                    continue;
                }
                let tmp2 = tmp[1].split("_");
                let sensor = tmp2[0];
                let exists = false;
                for (let j = 0; j < variablegroupsDCP.length; j++) {
                    if (exists) {
                        break;
                    }
                    for (let k = 0; k < variablegroupsDCP[j].variables.length; k++) {
                        sensor = tmp2[0];
                        for (let l = 1; l < tmp2.length; l++) {
                            if (variablegroupsDCP[j].variables[k].variablename == sensor) {
                                exists = true;
                                break;
                            }
                            sensor = sensor + "_" + tmp2[l];
                        }
                        if (exists) {
                            break;
                        }
                    }
                }
                if (exists == false) {
                    //如果 exists是false 先檢查sensor的名稱是否含切割的位置有誤
                    let tmp3 = sensor.split("_");
                    let splitError = false;
                    for (let f = 0; f < variablegroupsDCP.length; f++) {
                        let filename = variablegroupsDCP[v].filename;
                        for (let c = 0; c < tmp3.length; c++) {
                            filename += "_" + tmp3[c];
                            if (variablegroupsDCP[f].filename == filename) {
                                splitError = true;
                                break;
                            }
                        }
                        if (splitError) {
                            break;
                        }
                    }
                    if (!splitError) {
                        removeItem.push(i);
                    }
                }
            }
        }
        if (removeItem.length != 0) {
            for (let i = 0; i < removeItem.length; i++) {
                filterrulesDCP.splice(removeItem[i], 1);
            }
            let ruleId = 1;
            for (let i = 0; i < filterrulesDCP.length; i++) {
                let sensor = filterrulesDCP[i].rulename;
                filterrulesDCP[i].ruleid = ruleId;
                filterrulesDCP[i].variableid = getVariablegroupsDCPId(variablegroupsDCP, sensor);
                ruleId++;
            }
        }
        return filterrulesDCP;
    }
    BuildModelMethod.checkFilterrulesDCP = checkFilterrulesDCP;
    function getVariablegroupsDCPId(variablegroupsDCP, sensor) {
        for (let i = 0; i < variablegroupsDCP.length; i++) {
            let tmp = sensor.split(variablegroupsDCP[i].filename);
            if (tmp.length == 1) {
                continue;
            }
            let tmp2 = tmp[1].split("_");
            let _sensor = tmp2[1];
            for (let j = 0; j < variablegroupsDCP[i].variables.length; j++) {
                _sensor = tmp2[1];
                for (let l = 2; l < sensor.length; l++) {
                    if (variablegroupsDCP[i].variables[j].variablename == _sensor) {
                        return variablegroupsDCP[i].variables[j].variableid;
                    }
                    _sensor = _sensor + "_" + tmp2[l];
                }
            }
        }
    }
    BuildModelMethod.getVariablegroupsDCPId = getVariablegroupsDCPId;
    function checkIndicatorrulesDCP(filterrulesDCP, indicatorrulesDCP) {
        let removeItem = [];
        if (filterrulesDCP.length == indicatorrulesDCP.length) {
            return indicatorrulesDCP;
        }
        for (let i = 0; i < indicatorrulesDCP.length; i++) {
            let tmp = indicatorrulesDCP[i].rulename.split("_" + indicatorrulesDCP[i].algorithm);
            let filiter = tmp[0];
            let exists = false;
            for (let j = 0; j < filterrulesDCP.length; j++) {
                if (filiter == filterrulesDCP[j].rulename) {
                    exists = true;
                    break;
                }
            }
            if (exists == false) {
                removeItem.push(i);
            }
        }
        if (removeItem.length != 0) {
            for (let i = 0; i < removeItem.length; i++) {
                indicatorrulesDCP.splice(removeItem[i], 1);
            }
            for (let i = 0; i < indicatorrulesDCP.length; i++) {
                indicatorrulesDCP[i].ruleid = filterrulesDCP[i].ruleid;
                indicatorrulesDCP[i].filterruleid = filterrulesDCP[i].ruleid;
            }
            return indicatorrulesDCP;
        }
    }
    BuildModelMethod.checkIndicatorrulesDCP = checkIndicatorrulesDCP;
})(BuildModelMethod || (BuildModelMethod = {}));
//# sourceMappingURL=BuildModel.js.map
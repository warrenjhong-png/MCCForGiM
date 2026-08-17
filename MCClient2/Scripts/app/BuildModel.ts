namespace BuildModel {
    export async function BuildModuleParameter(taskId: string, buildModuleParameter: ModuleParameter) {
   
        let result: any = [];
        await $.ajax({
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
        
    }

    export async function DCP(taskId: string, variablegroups: any, filterrules: any,
        indicatorrules: any, pointrules: any, testingCount: any) {
        variablegroups = JSON.stringify(variablegroups);
        filterrules = JSON.stringify(filterrules);
        indicatorrules = JSON.stringify(indicatorrules);
        pointrules = JSON.stringify(pointrules);
        let result: any = [];
        await $.ajax({
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

    }

    export async function MCS_ADAS(taskId: string, CNNEnable: boolean, step: any, cnnForceRefresh: number) {

        let result: any = [];
        await $.ajax({
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

    }

    export async function MCS_AutoEncoder_CNN(taskId: string, avmAutoEncoderInfo: AvmAutoEncoderInfo) {

        let result: any = [];
        await $.ajax({
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

    }

    export async function ReadModuleParameter() {

        let result: any = [];
        await $.ajax({
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

    }

    export async function BuildModel(taskId: string) {

        let result: any = [];
        await $.ajax({
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
                console.log("bulid : "+ result);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("BuildModel Error : ");
            }
        });

        return result;

    }

    export async function ModelProcessInfo(taskId: string) {

        let result: any = [];
        await $.ajax({
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

    }

    export async function UploadModel(taskId: string, modelName: string, indicatorRule) {
        const response: any = await $.ajax({
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
            error: function (jqXHR: any, textStatus, errorThrown) {
                const message =
                    jqXHR.responseJSON && jqXHR.responseJSON.message
                        ? jqXHR.responseJSON.message
                        : (errorThrown || textStatus || "Upload model failed.");

                console.error("UploadModel Error: " + message);
            }
        });

        if (!response || response.success !== true) {
            throw new Error(
                response && response.message
                    ? response.message
                    : "Upload model failed."
            );
        }

        return response.message;

    }

    export async function ReadErrorInfo(taskId: string) {

        let result: any = [];
        await $.ajax({
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

    }
    export async function SaveHtml(taskId: string, html: string) {

        let result: any = [];
        await $.ajax({
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

    }

    export async function DownloadPPT(taskId: string) {

        let result: any = [];
        await $.ajax({
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

    }


    export async function SaveModelConfig(payload) {
        let result: any = [];
        await $.ajax({
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
    }

    export async function SaveFeatureTxt(payload) {
        let result: any = [];
        await $.ajax({
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
    }

    export function PrepareTrainingData(taskId: string): Promise<any> { 

        return new Promise(
            (resolve, reject) => {

                $.ajax({
                    url:
                        Method.generateUrl() +
                        "/Avm/PrepareTrainingData",

                    type: "POST",

                    dataType: "json",

                    data: {
                        taskId: taskId
                    },

                    success: function (
                        result: any
                    ) {
                        resolve(result);
                    },

                    error: function (
                        jqXHR: any,
                        textStatus: string,
                        errorThrown: string
                    ) {
                        reject(
                            new Error(
                                jqXHR.responseText ||
                                errorThrown ||
                                textStatus ||
                                "建立 TrainingData 失敗"
                            )
                        );
                    }
                });
            }
        );
    }
}



namespace BuildModelMethod { 

    export function moduleIndicatorRuleReset(moduleIndicatorRule: ModuleIndicatorRule,
        variablegroupsDCP: Array<Variablegroups>, filterrulesDCP: Array<filterrules>) {
        //重新編輯Rule
        let removeItem: Array<number> = [];
        for (let v = 0; v < variablegroupsDCP.length; v++) {
            for (let i = 0; i < filterrulesDCP.length; i++) {
                let tmp: Array<any> = filterrulesDCP[i].rulename.split(variablegroupsDCP[v].filename + "_");
                if (tmp.length == 1) { continue; }
                let tmp2: Array<any> = tmp[1].split("_");
                let sensor = tmp2[0];
                let exists = false;
                for (let j = 0; j < variablegroupsDCP.length; j++) {
                    if (exists) { break; }
                    for (let k = 0; k < variablegroupsDCP[j].variables.length; k++) {
                        sensor = tmp2[0];
                        for (let l = 1; l < tmp2.length; l++) {
                            if (variablegroupsDCP[j].variables[k].variablename == sensor) {
                                exists = true;
                                break;
                            }
                            sensor = sensor + "_" + tmp2[l];
                        }
                        if (exists) { break; }
                    }
                }
                if (exists == false) {
                    let tmp3: Array<any> = sensor.split("_");
                    let splitError: boolean = false;
                    for (let f = 0; f < variablegroupsDCP.length; f++) {
                        let filename: string = variablegroupsDCP[v].filename;
                        for (let c = 0; c < tmp3.length; c++) {
                            filename += "_" + tmp3[c];
                            if (variablegroupsDCP[f].filename == filename) {
                                splitError = true;
                                break;
                            }
                        }
                        if (splitError) { break; }
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

    export function checkFilterrulesDCP(variablegroupsDCP: Array<Variablegroups>, filterrulesDCP: Array<filterrules>) {
        let removeItem: Array<number> = [];
        for (let v = 0; v < variablegroupsDCP.length; v++) {
            
            for (let i = 0; i < filterrulesDCP.length; i++) {
                let tmp: Array<any> = filterrulesDCP[i].rulename.split(variablegroupsDCP[v].filename + "_");
                if (tmp.length == 1) { continue; }
                let tmp2: Array<any> = tmp[1].split("_");
                let sensor: string = tmp2[0];
                let exists = false;
                for (let j = 0; j < variablegroupsDCP.length; j++) {
                    if (exists) { break; }
                    for (let k = 0; k < variablegroupsDCP[j].variables.length; k++) {
                        sensor = tmp2[0];
                        for (let l = 1; l < tmp2.length; l++) {
                            if (variablegroupsDCP[j].variables[k].variablename == sensor) {
                                exists = true;
                                break;
                            }
                            sensor = sensor + "_" + tmp2[l];
                        }
                        if (exists) { break; }
                    }
                }
                if (exists == false) {
                    //如果 exists是false 先檢查sensor的名稱是否含切割的位置有誤
                    let tmp3: Array<any> = sensor.split("_");
                    let splitError: boolean =  false;
                    for (let f = 0; f < variablegroupsDCP.length; f++) {
                        let filename: string = variablegroupsDCP[v].filename;
                        for (let c = 0; c < tmp3.length; c++) {
                            filename += "_" + tmp3[c];
                            if (variablegroupsDCP[f].filename == filename) {
                                splitError = true;
                                break;
                            }
                        }
                        if (splitError) { break; }
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
                let sensor: string = filterrulesDCP[i].rulename;

                filterrulesDCP[i].ruleid = ruleId;
                filterrulesDCP[i].variableid = getVariablegroupsDCPId(variablegroupsDCP, sensor)
                ruleId++;
            }
        }
        return filterrulesDCP;
    }


    export function getVariablegroupsDCPId(variablegroupsDCP: Array<Variablegroups>, sensor: string) {
        for (let i = 0; i < variablegroupsDCP.length; i++) {
            let tmp: Array<any> = sensor.split(variablegroupsDCP[i].filename);
            if (tmp.length == 1) { continue; }
            let tmp2: Array<any> = tmp[1].split("_");
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

    export function checkIndicatorrulesDCP(filterrulesDCP: Array<filterrules>, indicatorrulesDCP: Array<indicatorrules>) {

        let removeItem: Array<any> = [];
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
}

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var DataCollection;
(function (DataCollection) {
    function GetFabInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            yield $.ajax({
                url: Method.generateUrl() + "/Avm/GetFabInfo",
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
        });
    }
    DataCollection.GetFabInfo = GetFabInfo;
    function GetFabDetailOutput(fabDetailInput) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = [];
            yield $.ajax({
                url: Method.generateUrl() + "/Avm/GetFabDetailOutput",
                cache: false,
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                //method: "POST",
                type: "POST",
                data: JSON.stringify({
                    startTime: fabDetailInput.startTime,
                    endTime: fabDetailInput.endTime,
                    data: fabDetailInput.data,
                    query: fabDetailInput.query
                }),
                success: function (data, textStatus, jqXHR) {
                    result = data;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("GetFabDetailOutput Error : ");
                    kendo.ui.progress($(".selection"), false);
                    return null;
                }
            });
            return result;
        });
    }
    DataCollection.GetFabDetailOutput = GetFabDetailOutput;
    function GetPieceList(fabDetailInput) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = [];
            $.ajax({
                url: Method.generateUrl() + "/Avm/GetPieceList",
                async: false,
                cache: false,
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                //method: "POST",
                type: "POST",
                data: JSON.stringify({
                    startTime: fabDetailInput.startTime,
                    endTime: fabDetailInput.endTime,
                    data: fabDetailInput.data,
                }),
                success: function (data, textStatus, jqXHR) {
                    result = data;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("GetPieceCount Error : ");
                }
            });
            return result;
        });
    }
    DataCollection.GetPieceList = GetPieceList;
    function GetPieceCount(fabDetailInput) {
        let conditionData = fabDetailInput.data;
        // fabDetailInput.data 原本可能就是 JSON 字串
        if (typeof conditionData === "string") {
            try {
                conditionData = JSON.parse(conditionData);
            }
            catch (error) {
                console.error("GetPieceCount data JSON 格式錯誤：", conditionData, error);
                return Promise.reject(new Error("查詢條件格式錯誤"));
            }
        }
        const requestData = {
            StartTime: fabDetailInput.startTime,
            EndTime: fabDetailInput.endTime,
            // 把條件單獨轉成 JSON 字串
            DataJson: JSON.stringify(conditionData)
        };
        console.log("GetPieceCount Request Object：", requestData);
        console.log("GetPieceCount Request JSON：", JSON.stringify(requestData));
        return new Promise((resolve, reject) => {
            $.ajax({
                url: Method.generateUrl() +
                    "/Avm/GetPieceCount",
                type: "POST",
                async: true,
                cache: false,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(requestData),
                success: function (result) {
                    resolve(result);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error("GetPieceCount Error：", jqXHR.responseText, textStatus, errorThrown);
                    reject(new Error(jqXHR.responseText ||
                        errorThrown ||
                        textStatus ||
                        "取得 Piece Count 失敗"));
                }
            });
        });
    }
    DataCollection.GetPieceCount = GetPieceCount;
    function GetGuid() {
        let result = [];
        $.ajax({
            url: Method.generateUrl() + "/Avm/GetGuid",
            async: false,
            cache: false,
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            dataType: "json",
            //method: "POST",
            type: "POST",
            success: function (data, textStatus, jqXHR) {
                result = data;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("GetPieceCount Error : ");
            }
        });
        return result;
    }
    DataCollection.GetGuid = GetGuid;
    function GetVariables() {
        return __awaiter(this, void 0, void 0, function* () {
            let result = [];
            yield $.ajax({
                url: Method.generateUrl() + "/Avm/GetVariables",
                cache: false,
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                //method: "POST",
                type: "POST",
                success: function (data, textStatus, jqXHR) {
                    result = data;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("GetPieceCount Error : ");
                }
            });
            return result;
        });
    }
    DataCollection.GetVariables = GetVariables;
    function DownloadRawData(taskId, startTime, endTime, data, variables) {
        let conditionData = data;
        if (typeof conditionData === "string") {
            conditionData =
                JSON.parse(conditionData);
        }
        const requestData = {
            TaskId: taskId,
            StartTime: startTime,
            EndTime: endTime,
            DataJson: JSON.stringify(conditionData || {}),
            Variables: variables
        };
        return new Promise((resolve, reject) => {
            $.ajax({
                url: Method.generateUrl() +
                    "/Avm/DownloadRawData",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(requestData),
                success: function (result) {
                    resolve(result);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    reject(new Error(jqXHR.responseText ||
                        errorThrown ||
                        textStatus ||
                        "下載 RawData 失敗"));
                }
            });
        });
    }
    DataCollection.DownloadRawData = DownloadRawData;
    function GetRawData(taskId, variableGroup, variableId, steps) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = [];
            yield $.ajax({
                url: Method.generateUrl() + "/Avm/GetRawData",
                cache: false,
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                data: JSON.stringify({
                    taskId: taskId,
                    variableGroup: variableGroup,
                    variableId: variableId,
                    steps: steps
                }),
                //method: "POST",
                type: "POST",
                success: function (data, textStatus, jqXHR) {
                    result = data;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("GetRawData Error : ");
                    kendo.ui.progress($(".selection"), false);
                }
            });
            return result;
        });
    }
    DataCollection.GetRawData = GetRawData;
    function GetIndicator(algorithm, rawData) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = [];
            yield $.ajax({
                url: Method.generateUrl() + "/Avm/GetIndicator",
                cache: false,
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                data: JSON.stringify({
                    algorithm: algorithm,
                    rawData: rawData,
                }),
                //method: "POST",
                type: "POST",
                success: function (data, textStatus, jqXHR) {
                    result = data;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("GetIndicator Error : ");
                    kendo.ui.progress($(".selection"), false);
                }
            });
            return result;
        });
    }
    DataCollection.GetIndicator = GetIndicator;
    function GetIndicators(algorithm, rawData) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = [];
            yield $.ajax({
                url: Method.generateUrl() + "/Avm/GetIndicators",
                cache: false,
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                data: JSON.stringify({
                    algorithm: algorithm,
                    rawData: JSON.stringify(rawData),
                }),
                //method: "POST",
                type: "POST",
                success: function (data, textStatus, jqXHR) {
                    result = data;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("GetIndicator Error : ");
                    kendo.ui.progress($(".selection"), false);
                }
            });
            return result;
        });
    }
    DataCollection.GetIndicators = GetIndicators;
    function GetProcessIndicatorRule(taskId, indicatorRules) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = [];
            yield $.ajax({
                url: Method.generateUrl() + "/Avm/GetProcessIndicatorRule",
                cache: false,
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                data: JSON.stringify({
                    taskId: taskId,
                    indicatorRules: JSON.stringify(indicatorRules),
                }),
                //method: "POST",
                type: "POST",
                success: function (data, textStatus, jqXHR) {
                    result = data;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("GetProcessIndicatorRule Error : ");
                    kendo.ui.progress($(".selection"), false);
                }
            });
            return result;
        });
    }
    DataCollection.GetProcessIndicatorRule = GetProcessIndicatorRule;
    function DownloadPPT(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            //let result: any;
            //await $.ajax({
            //    url: Method.generateUrl() + "/Avm/DownloadPPT?taskId=" + taskId,
            //    type: "GET",
            //    success: function (data, textStatus, jqXHR) {
            //        console.log(data);
            //        setTimeout(function () {
            //            $(".k-dialog .k-content").append("<br/><a class='report-url' href='" + data.downloadUrl + "' download>Model Report</a>");
            //        }, 1000);
            //    },
            //    error: function (jqXHR, textStatus, errorThrown) {
            //        console.log("DownloadPPT Error : ");
            //        kendo.ui.progress($(".selection"), false);
            //    }
            //});
            //return result;
            const downloadUrl = Method.generateUrl() + "/Avm/DownloadPPT?taskId=" + taskId;
            setTimeout(function () {
                $(".k-dialog .k-content").append("<br/><a class='report-url' href='" + downloadUrl + "' download>Model Report</a>");
            }, 1000);
        });
    }
    DataCollection.DownloadPPT = DownloadPPT;
    function chartYScale(max, min) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            yield $.ajax({
                //url: generateUrl() + "/Result/getStdDevTwo?values=" + JSON.stringify(values),
                url: Method.generateUrl() + "/Avm/ChartYScale",
                cache: false,
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                data: JSON.stringify({
                    max: max,
                    min: min
                }),
                type: "POST",
                success: function (data, textStatus, jqXHR) {
                    result = data;
                    console.log(result);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("chartYScale Error : ");
                }
            });
            return result;
        });
    }
    DataCollection.chartYScale = chartYScale;
    function StartDownloadRawData(taskId, startTime, endTime, conditionData, variables) {
        let conditions = conditionData;
        if (typeof conditions === "string") {
            conditions =
                JSON.parse(conditions);
        }
        return new Promise((resolve, reject) => {
            $.ajax({
                url: Method.generateUrl() +
                    "/Avm/StartDownloadRawData",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({
                    TaskId: taskId,
                    StartTime: startTime,
                    EndTime: endTime,
                    DataJson: JSON.stringify(conditions || {}),
                    VariablesJson: JSON.stringify(variables || [])
                }),
                success: function (result) {
                    resolve(result);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    reject(new Error(jqXHR.responseText ||
                        errorThrown ||
                        textStatus ||
                        "啟動 RawData 下載失敗"));
                }
            });
        });
    }
    DataCollection.StartDownloadRawData = StartDownloadRawData;
    function GetRawDataDownloadProgress(taskId) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: Method.generateUrl() +
                    "/Avm/GetRawDataDownloadProgress",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                /*
                 * This only times out the lightweight progress request.
                 * It never cancels the background RawData batch.
                 */
                timeout: 30000,
                data: JSON.stringify({
                    taskId: taskId
                }),
                success: function (result) {
                    resolve(result);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    reject(new Error(errorThrown ||
                        textStatus));
                }
            });
        });
    }
    DataCollection.GetRawDataDownloadProgress = GetRawDataDownloadProgress;
    function RequestStopRawDataDownload(taskId) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: Method.generateUrl() +
                    "/Avm/RequestStopRawDataDownload",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({
                    taskId: taskId
                }),
                success: function (result) {
                    resolve(result);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    reject(new Error(jqXHR.responseText ||
                        errorThrown ||
                        textStatus ||
                        "送出 RawData 停止要求失敗"));
                }
            });
        });
    }
    DataCollection.RequestStopRawDataDownload = RequestStopRawDataDownload;
})(DataCollection || (DataCollection = {}));
//# sourceMappingURL=DataCollection.js.map
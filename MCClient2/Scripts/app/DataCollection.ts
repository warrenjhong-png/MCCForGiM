namespace DataCollection {
    export async function GetFabInfo() {
        let result: any;
        await $.ajax({
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
    }
    export async function GetFabDetailOutput(fabDetailInput: FabDetailInput) {
        let result: any = [];
        await $.ajax({
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
    }

    export async function GetPieceList(fabDetailInput: FabDetailInput) {
        let result: any = [];
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
    }

    export function GetPieceCount(
        fabDetailInput: FabDetailInput
    ): Promise<any> {

        let conditionData: any = fabDetailInput.data;

        // fabDetailInput.data 原本可能就是 JSON 字串
        if (typeof conditionData === "string") {
            try {
                conditionData = JSON.parse(conditionData);
            }
            catch (error) {
                console.error(
                    "GetPieceCount data JSON 格式錯誤：",
                    conditionData,
                    error
                );

                return Promise.reject(
                    new Error("查詢條件格式錯誤")
                );
            }
        }

        const requestData = {
            StartTime: fabDetailInput.startTime,
            EndTime: fabDetailInput.endTime,

            // 把條件單獨轉成 JSON 字串
            DataJson: JSON.stringify(conditionData)
        };

        console.log(
            "GetPieceCount Request Object：",
            requestData
        );

        console.log(
            "GetPieceCount Request JSON：",
            JSON.stringify(requestData)
        );

        return new Promise((resolve, reject) => {
            $.ajax({
                url:
                    Method.generateUrl() +
                    "/Avm/GetPieceCount",

                type: "POST",

                async: true,

                cache: false,

                contentType:
                    "application/json; charset=utf-8",

                dataType: "json",

                data: JSON.stringify(requestData),

                success: function (result: any) {
                    resolve(result);
                },

                error: function (
                    jqXHR: any,
                    textStatus: string,
                    errorThrown: string
                ) {
                    console.error(
                        "GetPieceCount Error：",
                        jqXHR.responseText,
                        textStatus,
                        errorThrown
                    );

                    reject(
                        new Error(
                            jqXHR.responseText ||
                            errorThrown ||
                            textStatus ||
                            "取得 Piece Count 失敗"
                        )
                    );
                }
            });
        });
    }

    export function GetGuid() {
        let result: any = [];
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

    export async function GetVariables() {
        let result: any = [];
        await $.ajax({
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
    }

    export function DownloadRawData(
        taskId: string,
        startTime: Date,
        endTime: Date,
        data: any,
        variables: Array<Variables>
    ): Promise<any> {

        let conditionData: any = data;

        if (
            typeof conditionData === "string"
        ) {
            conditionData =
                JSON.parse(conditionData);
        }

        const requestData = {
            TaskId:
                taskId,

            StartTime:
                startTime,

            EndTime:
                endTime,

            DataJson:
                JSON.stringify(
                    conditionData || {}
                ),

            Variables:
                variables
        };

        return new Promise(
            (resolve, reject) => {

                $.ajax({
                    url:
                        Method.generateUrl() +
                        "/Avm/DownloadRawData",

                    type:
                        "POST",

                    contentType:
                        "application/json; charset=utf-8",

                    dataType:
                        "json",

                    data:
                        JSON.stringify(
                            requestData
                        ),

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
                                "下載 RawData 失敗"
                            )
                        );
                    }
                });
            }
        );
    }

    export async function GetRawData(taskId: string, variableGroup: string, variableId: string, steps: Array<any>) {
        let result: any = [];
        await $.ajax({
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
    }

    export async function GetIndicator(algorithm: string, rawData: any) {
        let result: any = [];
        await $.ajax({
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
    }

    export async function GetIndicators(algorithm: string, rawData: any) {
        let result: any = [];
        await $.ajax({
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
    }

    export async function GetProcessIndicatorRule(taskId: string, indicatorRules: Array<IndicatorRule>) {
        let result: any = [];
        await $.ajax({
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
    }


    export async function DownloadPPT(taskId: string) {
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
    }


    export async function chartYScale(max: number, min: number) {
        let result;
        await $.ajax({
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
    }

    export function StartDownloadRawData(
        taskId: string,
        startTime: Date,
        endTime: Date,
        conditionData: any,
        variables: Array<Variables>
    ): Promise<any> {

        let conditions: any =
            conditionData;

        if (typeof conditions === "string") {
            conditions =
                JSON.parse(conditions);
        }

        return new Promise(
            (resolve, reject) => {
                $.ajax({
                    url:
                        Method.generateUrl() +
                        "/Avm/StartDownloadRawData",

                    type: "POST",

                    contentType:
                        "application/json; charset=utf-8",

                    dataType: "json",

                    data: JSON.stringify({
                        TaskId:
                            taskId,

                        StartTime:
                            startTime,

                        EndTime:
                            endTime,

                        DataJson:
                            JSON.stringify(
                                conditions || {}
                            ),

                        VariablesJson:
                            JSON.stringify(
                                variables || []
                            )
                    }),

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
                                "啟動 RawData 下載失敗"
                            )
                        );
                    }
                });
            }
        );
    }

    export function GetRawDataDownloadProgress(
        taskId: string
    ): Promise<any> {

        return new Promise(
            (resolve, reject) => {
                $.ajax({
                    url:
                        Method.generateUrl() +
                        "/Avm/GetRawDataDownloadProgress",

                    type: "POST",

                    contentType:
                        "application/json; charset=utf-8",

                    dataType: "json",

                    /*
                     * This only times out the lightweight progress request.
                     * It never cancels the background RawData batch.
                     */
                    timeout: 30000,

                    data: JSON.stringify({
                        taskId: taskId
                    }),

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
                                errorThrown ||
                                textStatus
                            )
                        );
                    }
                });
            }
        );
    }

    export function RequestStopRawDataDownload(
        taskId: string
    ): Promise<any> {

        return new Promise(
            (resolve, reject) => {
                $.ajax({
                    url:
                        Method.generateUrl() +
                        "/Avm/RequestStopRawDataDownload",

                    type: "POST",

                    contentType:
                        "application/json; charset=utf-8",

                    dataType: "json",

                    data: JSON.stringify({
                        taskId: taskId
                    }),

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
                                "送出 RawData 停止要求失敗"
                            )
                        );
                    }
                });
            }
        );
    }

}

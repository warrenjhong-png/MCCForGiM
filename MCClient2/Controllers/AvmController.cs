using fst.Toolkit;
using fst.Toolkit.SicService;
using MCClient2.Models;
using MCClient2.Models.Managers;
using MCClient2.Models.Structures;
using Microsoft.Ajax.Utilities;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NLog.Targets;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Hosting;
using System.Web.Mvc;
using System.Web.SessionState;
using System.Web.Services.Description;
using ActionResult = System.Web.Mvc.ActionResult;
using ControllerContext = System.Web.Mvc.ControllerContext;
using HttpPostAttribute = System.Web.Mvc.HttpPostAttribute;
using Variables = MCClient2.Models.Variables;

namespace MCClient2.Controllers
{
    [SessionState(SessionStateBehavior.Disabled)]
    public class AvmController : JsonNetController
    {
        private readonly IApiClient _http;


        internal AvmController(IApiClient http)
        {
            _http = http;
        }

        MCCImporter importer = new MCCImporter();
        JsonFileManager jsonFile = new JsonFileManager();
        // GET: ModelBuild
        public ActionResult AvmPage()
        {
            return View();
        }

        public JsonResult GetGuid()
        {

            string taskId = PathHelper.GetGuid();
            PathHelper.CreateModelFolder(taskId);
            return Json(taskId);
        }

        public JsonResult GetPath(string taskId)
        {
            string path = PathHelper.GetDirPath(taskId);
            PathHelper.CreateModelFolder(taskId);
            return Json(path);
        }

        public JsonResult GetFabInfo()
        {
            List<string> fabInfo = importer.GetFabInfo();

            return Json(fabInfo);
        }

        public JsonResult GetFabDetailOutput(DateTime startTime, DateTime endTime, string data, string query)
        {
            Dictionary<string, List<string>> _data = data is null ? null : JsonConvert.DeserializeObject<Dictionary<string, List<string>>>(data);

            FabDetailIntput input = new FabDetailIntput(startTime, endTime, _data, query);

            return Json(importer.GetFabDetail(input));
        }

        [HttpPost]
        public JsonResult GetPieceList(DateTime startTime, DateTime endTime, string data)
        {
            var _data = JsonConvert.DeserializeObject<Dictionary<string, List<string>>>(data);

            return Json(importer.GetPieceList(startTime, endTime, _data));
        }

        [HttpPost]
        public JsonResult GetPieceCount(GetPieceCountInput input)
        {
            try
            {
                if (input == null)
                {
                    return Json(new
                    {
                        Success = false,
                        PieceCount = 0,
                        Message = "後端沒有收到輸入資料"
                    });
                }

                if (input.EndTime <= input.StartTime)
                {
                    return Json(new
                    {
                        Success = false,
                        PieceCount = 0,
                        Message = "結束時間必須晚於開始時間"
                    });
                }

                Dictionary<string, List<string>> conditions;

                if (string.IsNullOrWhiteSpace(input.DataJson))
                {
                    conditions =
                        new Dictionary<string, List<string>>();
                }
                else
                {
                    conditions =
                        JsonConvert.DeserializeObject<
                            Dictionary<string, List<string>>
                        >(input.DataJson);
                }

                if (conditions == null)
                {
                    conditions =
                        new Dictionary<string, List<string>>();
                }

                AppConstant.Logger.Info(
                    $"StartTime：{input.StartTime:yyyy-MM-dd HH:mm:ss}");

                AppConstant.Logger.Info(
                    $"EndTime：{input.EndTime:yyyy-MM-dd HH:mm:ss}");

                AppConstant.Logger.Info(
                    $"Data Count：{conditions.Count}");

                foreach (var condition in conditions)
                {
                    string values =
                        condition.Value == null
                            ? string.Empty
                            : string.Join(
                                ",",
                                condition.Value);

                    AppConstant.Logger.Info(
                        $"{condition.Key}：{values}");
                }

                long count = importer.GetPieceCount(
                    input.StartTime,
                    input.EndTime,
                    conditions
                );

                return Json(new
                {
                    Success = true,
                    PieceCount = count,
                    Message = string.Empty
                });
            }
            catch (JsonException ex)
            {
                AppConstant.Logger.Error(
                    $"GetPieceCount JSON 格式錯誤：{ex}");

                return Json(new
                {
                    Success = false,
                    PieceCount = 0,
                    Message = "查詢條件 JSON 格式錯誤"
                });
            }
            catch (Exception ex)
            {
                AppConstant.Logger.Error(
                    $"GetPieceCount Error：{ex}");

                return Json(new
                {
                    Success = false,
                    PieceCount = 0,
                    Message = ex.Message
                });
            }
        }

        [HttpPost]
        public JsonResult GetVariables()
        {
            return Json(importer.GetVariables());
        }

        [HttpPost]
        public JsonResult DownloadRawData(DownloadRawDataInput input)
        {
            try
            {
                if (input == null)
                {
                    return Json(new
                    {
                        success = false,
                        message = "未收到下載條件"
                    });
                }

                if (input.EndTime <= input.StartTime)
                {
                    return Json(new
                    {
                        success = false,
                        message = "結束時間必須晚於開始時間"
                    });
                }

                var conditions =
                    string.IsNullOrWhiteSpace(
                        input.DataJson
                    )
                    ? new Dictionary<
                        string,
                        List<string>
                      >()
                    : JsonConvert.DeserializeObject<
                        Dictionary<
                            string,
                            List<string>
                        >
                      >(input.DataJson);

                string path =
                    PathHelper.GetDirPath(
                        input.TaskId
                    );

                /*
                 * 後端先查 Piece，
                 * 不再由前端傳 60 萬筆 ID。
                 */
                List<string> pieceIds =
                    importer.GetPieceList(
                        input.StartTime,
                        input.EndTime,
                        conditions
                    );

                if (
                    pieceIds == null ||
                    pieceIds.Count == 0
                )
                {
                    return Json(new
                    {
                        success = false,
                        message = "查無 Piece"
                    });
                }

                string result =
                    importer.DownloadRawData(
                        input.TaskId,
                        path,
                        pieceIds,
                        input.Variables
                    );

                return Json(new
                {
                    success = true,
                    message = result,
                    pieceCount = pieceIds.Count
                });
            }
            catch (Exception ex)
            {
                AppConstant.Logger.Error(
                    $"DownloadRawData Error：{ex}"
                );

                return Json(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        [HttpPost]
        public JsonResult StartDownloadRawData( StartRawDataDownloadInput input)
        {
            try
            {
                if (input == null)
                {
                    return Json(new
                    {
                        success = false,
                        message = "未收到下載條件"
                    });
                }

                if (string.IsNullOrWhiteSpace(
                    input.TaskId))
                {
                    return Json(new
                    {
                        success = false,
                        message = "TaskId 不可為空"
                    });
                }

                string taskDirectory;

                if (!RawDataDownloadControlManager
                    .TryGetTaskDirectory(
                        input.TaskId,
                        out taskDirectory))
                {
                    return Json(new
                    {
                        success = false,
                        message = "TaskId 無效"
                    });
                }

                if (input.EndTime <= input.StartTime)
                {
                    return Json(new
                    {
                        success = false,
                        message =
                            "結束時間必須晚於開始時間"
                    });
                }

                var conditions =
                    string.IsNullOrWhiteSpace(
                        input.DataJson)
                    ? new Dictionary<
                        string,
                        List<string>>()
                    : JsonConvert.DeserializeObject<
                        Dictionary<
                            string,
                            List<string>>>
                      (input.DataJson);

                var selectedVariables =
                    string.IsNullOrWhiteSpace(
                        input.VariablesJson)
                    ? new List<Variables>()
                    : JsonConvert.DeserializeObject<
                        List<Variables>>
                      (input.VariablesJson);

                if (
                    selectedVariables == null ||
                    selectedVariables.Count == 0
                )
                {
                    return Json(new
                    {
                        success = false,
                        message = "沒有選取 Variable"
                    });
                }

                var existingJob =
                    RawDataDownloadStatusManager
                        .Read(input.TaskId);

                if (existingJob != null &&
                    !RawDataDownloadControlManager
                        .IsTerminalStatus(existingJob.Status))
                {
                    return Json(new
                    {
                        success = true,
                        jobId = existingJob.JobId,
                        taskId = input.TaskId,
                        status = existingJob.Status,
                        message = "既有 RawData 下載工作仍在執行"
                    });
                }

                RawDataDownloadControlManager
                    .ClearForNewTask(input.TaskId);

                string jobId =
                    Guid.NewGuid().ToString();

                var job =
                    new RawDataDownloadJob
                    {
                        JobId = jobId,
                        TaskId = input.TaskId,
                        Status = "Queued",
                        Phase = "Waiting",
                        Message = "等待下載",
                        Percent = 0,
                        StartTime = DateTime.Now,
                        LastProgressAtUtc = DateTime.UtcNow
                    };

                RawDataDownloadStatusManager.Save(job);

                /*
                 * 不要讓 HTTP Request 等到下載完成。
                 * 交給 ASP.NET 背景工作執行。
                 */
                HostingEnvironment.QueueBackgroundWorkItem(
                    cancellationToken =>
                    {
                        try
                        {
                            var backgroundImporter =
                                new MCCImporter();

                            backgroundImporter
                                .DownloadRawDataInBatches(
                                    jobId,
                                    input.TaskId,
                                    input.StartTime,
                                    input.EndTime,
                                    conditions,
                                    selectedVariables,
                                    progress =>
                                    {
                                        if (RawDataDownloadControlManager
                                            .IsStopRequested(
                                                progress.TaskId) &&
                                            !RawDataDownloadControlManager
                                                .IsTerminalStatus(
                                                    progress.Status))
                                        {
                                            progress.StopRequested = true;
                                            progress.Status = "StopRequested";
                                            progress.Phase =
                                                "FinishingCurrentBatch";
                                        }

                                        RawDataDownloadStatusManager
                                            .Save(progress);
                                    },
                                    cancellationToken
                                );
                        }
                        catch (Exception ex)
                        {
                            var failedJob =
                                RawDataDownloadStatusManager
                                    .Read(input.TaskId) ?? job;

                            failedJob.Status = "Failed";
                            failedJob.Phase = "Error";
                            failedJob.Message = "下載失敗";
                            failedJob.Error =
                                "RawData 背景下載失敗，請查看伺服器日誌";
                            failedJob.StopRequested =
                                RawDataDownloadControlManager
                                    .IsStopRequested(input.TaskId);
                            failedJob.FinishTime = DateTime.Now;

                            RawDataDownloadStatusManager
                                .Save(failedJob);

                            AppConstant.Logger.Error(
                                $"RawData 背景下載失敗：{ex}"
                            );
                        }
                    }
                );

                return Json(new
                {
                    success = true,
                    jobId = jobId,
                    taskId = input.TaskId
                });
            }
            catch (Exception ex)
            {
                AppConstant.Logger.Error(
                    $"StartDownloadRawData Error：{ex}"
                );

                return Json(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        [HttpPost]
        public JsonResult GetRawDataDownloadProgress(string taskId)
        {
            try
            {
                string taskDirectory;

                if (!RawDataDownloadControlManager
                    .TryGetTaskDirectory(
                        taskId,
                        out taskDirectory))
                {
                    return Json(new
                    {
                        success = false,
                        status = "InvalidTaskId",
                        message = "TaskId 無效"
                    });
                }

                var job =
                    RawDataDownloadStatusManager
                        .Read(taskId);

                if (job == null)
                {
                    return Json(new
                    {
                        success = false,
                        message = "找不到下載工作"
                    });
                }

                if (RawDataDownloadControlManager
                    .IsStopRequested(taskId) &&
                    !RawDataDownloadControlManager
                        .IsTerminalStatus(job.Status))
                {
                    job.StopRequested = true;
                    job.Status = "StopRequested";
                    job.Phase = "FinishingCurrentBatch";
                }

                return Json(new
                {
                    success = true,
                    taskId = job.TaskId,
                    status = job.Status,
                    completedBatches = job.CompletedBatches,
                    totalBatches = job.TotalBatches,
                    currentBatch = job.CurrentBatch,
                    progressPercent = job.Percent,
                    lastProgressAtUtc = job.LastProgressAtUtc,
                    stopRequested = job.StopRequested,
                    partialResult = job.PartialResult,
                    message = job.Message,
                    errorDetail = job.Error,
                    job = job
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        [HttpPost]
        public JsonResult RequestStopRawDataDownload(string taskId)
        {
            try
            {
                var result =
                    RawDataDownloadControlManager
                        .RequestStop(taskId);

                return Json(new
                {
                    success = result.Success,
                    status = result.Status,
                    message = result.Message
                });
            }
            catch (Exception ex)
            {
                AppConstant.Logger.Error(
                    "RequestStopRawDataDownload Error：" + ex);

                return Json(new
                {
                    success = false,
                    status = "Failed",
                    message = "停止要求送出失敗，請稍後再試"
                });
            }
        }

        [HttpPost]
        public JsonResult GetRawData(string taskId, string variableGroup,string variableId,params string[] steps)
        {
            try
            {
                string path = Path.Combine(
                    PathHelper.GetDirPath(taskId),
                    variableGroup + ".csv"
                );

                DataTable rawData = importer.GetRawData(
                    taskId,
                    path,
                    variableGroup,
                    variableId,
                    steps
                );

                if (rawData == null || rawData.Rows.Count == 0)
                    return Json(null);

                if (!rawData.Columns.Contains("ID"))
                    return Json("CSV 缺少 ID 欄位");

                if (!rawData.Columns.Contains("Date"))
                    return Json("CSV 缺少 Date 欄位");

                if (!rawData.Columns.Contains("Step"))
                    return Json("CSV 缺少 Step 欄位");

                // 優先使用 variableId 當資料欄位
                string dataColumn = variableId;

                // 如果 variableId 找不到，才退回第 4 欄
                if (!rawData.Columns.Contains(dataColumn))
                {
                    if (rawData.Columns.Count > 3)
                    {
                        dataColumn = rawData.Columns[3].ColumnName;
                    }
                    else
                    {
                        return Json("CSV 找不到可用的資料欄位");
                    }
                }

                if (!rawData.Columns.Contains(dataColumn))
                    return Json($"找不到資料欄位: {dataColumn}");

                var stepSet = steps?
                    .Where(x => !string.IsNullOrWhiteSpace(x))
                    .Select(x => x.Trim())
                    .ToHashSet(StringComparer.OrdinalIgnoreCase);

                var filteredRows = rawData.AsEnumerable()
                    .Where(r =>
                    {
                        if (stepSet == null || stepSet.Count == 0)
                            return true;

                        string stepValue = r["Step"] == DBNull.Value
                            ? ""
                            : r["Step"].ToString().Trim();

                        return stepSet.Contains(stepValue);
                    });

                var seriesInfos = new List<SerieInfo>
                {
                    new SerieInfo
                    {
                        Id = variableId,
                        Step = filteredRows.FirstOrDefault()?["Step"]?.ToString(),

                        Timetag = filteredRows
                            .Select(r =>
                            {
                                DateTime dt;
                                return DateTime.TryParse(r["Date"]?.ToString(), out dt)
                                    ? dt
                                    : DateTime.MinValue;
                            })
                            .ToList(),

                        Data = filteredRows
                            .Select(r =>
                            {
                                double val;
                                return double.TryParse(r[dataColumn]?.ToString(), out val)
                                    ? val
                                    : 0;
                            })
                            .ToList()
                    }
                };

                return Json(seriesInfos);
            }
            catch (Exception e)
            {
                return Json("錯誤：" + e.Message);
            }
        }

        #region Indicator

        [HttpPost]
        public JsonResult GetIndicators(string algorithm, string rawData)
        {
            // Note:於 20230329 移除 RidiculousValue (-9999999999) 保護，並刪除相關程式碼，如有需要回覆，請透過 SolutionHistory 查找
            List<object> list = JsonConvert.DeserializeObject<List<object>>(rawData);
            List<double> result = new List<double>();

            foreach (object item in list)
            {
                List<double> values = JsonConvert.DeserializeObject<List<double>>(item.ToString());

                double indicatorValue = CalculateIndicatorValue(algorithm, values);

                result.Add(indicatorValue);
            }
            return Json(result);
        }

        [HttpPost]
        public JsonResult GetIndicator(string algorithm, List<double> rawData)
        {
            // Note:於 20230329 移除 RidiculousValue (-9999999999) 保護，並刪除相關程式碼，如有需要回覆，請透過 SolutionHistory 查找
            double result = CalculateIndicatorValue(algorithm, rawData);

            return Json(result);
        }

        [HttpPost]
        public JsonResult GetProcessIndicatorRule(string taskId,object indicatorRules)
        {
                List<ProcessIndicatorRule> list = new List<ProcessIndicatorRule>();
                list = JsonConvert.DeserializeObject<List<ProcessIndicatorRule>>(indicatorRules.ToString());
                foreach (ProcessIndicatorRule rule in list)
                {
                    //先取得rawdata
                    PresetMethod method = new PresetMethod();

                    List<SerieInfo> rawdata = method.GetRawData(taskId, rule.groupName, rule.variableId, rule.stepId);

                    //整理rawdata區間

                    List<List<double>> rawdatas = rawdata.Select(item =>
                    {
                        if (rule.limit)
                        {
                            // 确保索引在范围内
                            int start = Math.Max(0, Math.Min(item.Data.Count - 1, rule.trimBegin - 1));
                            // 计算结束索引，并确保它不超出范围
                            int end = Math.Max(start, Math.Min(item.Data.Count - 1, rule.trimEnd - 1));
                            // 计算长度
                            int length = end - start + 1;

                            // 获取子范围
                            return item.Data.GetRange(start, length);
                        }
                        else
                        {
                            return item.Data;
                        }
                    }).ToList();

                    //計算indicator
                    List<double> indicators = method.GetIndicators(rule.algorithm, JsonConvert.SerializeObject(rawdatas));
                    //計算上下界
                    //spec
                    Spec spec = new Spec();
                    spec = method.GetIndicatorSpec(rule.specModel, indicators, rule.specSettingValue, rule.USL, rule.LSL);
                    Con con = new Con();
                    con = method.GetIndicatorCon(rule.conModel, indicators, rule.specSettingValue, rule.UCL, rule.LSL);
                    //置換上下界
                    rule.USL = spec.usl;
                    rule.LSL = spec.lsl;
                    rule.UCL = con.ucl;
                    rule.LCL = con.lcl;
                }
                return Json(list);

        }
        private double CalculateIndicatorValue(string algorithm, List<double> values)
        {
            IndicatorAlgorithmCalculator indicator = new IndicatorAlgorithmCalculator();

            switch (algorithm)
            {
                case "Mean":
                    return indicator.Average(values);

                case "Min":
                    return indicator.Min(values);

                case "Max":
                    return indicator.Max(values);

                case "Range":
                    return indicator.Range(values);

                case "Std":
                    return indicator.StdDev(values);

                case "Slope":
                    return indicator.Slope(values);

                case "Counter":
                    return indicator.Count(values);

                default:
                    return double.NaN;
            }
        }

        #endregion

        [HttpPost]
        public JsonResult DCP(string taskId, string variablegroups, string filterrules,string indicatorrules, string pointrules,int testingCount)
        {
            AvmVariableGroup[] avmVariableGroup = JsonConvert.DeserializeObject<AvmVariableGroup[]>(variablegroups);
            AvmFilterRule[] avmFilterRules = JsonConvert.DeserializeObject<AvmFilterRule[]>(filterrules);
            AvmIndicatorRule[] avmIndicatorRules = JsonConvert.DeserializeObject<AvmIndicatorRule[]>(indicatorrules);
            AvmPointRule[] avmPointRules = JsonConvert.DeserializeObject<AvmPointRule[]>(pointrules);

            foreach (AvmVariableGroup variableGroup in avmVariableGroup)
            {
                foreach (AvmVariable variable in variableGroup.variables)
                {
                    variable.fieldname = importer.GetDefField(
                        variableGroup.metatable,
                        variable.variablename
                    );
                }
            }

            // 建模 API 使用的特徵名稱必須與前處理合併後的 CSV 欄名一致：
            // {DEFFIELD}__{VARIABLEGROUPNAME}。fieldname 是在上方查詢 DEF 後才取得，
            // 因此由此處統一產生 feature txt，避免前端用 variablename 組出錯誤名稱。
            List<string> numericalColumns = avmVariableGroup
                .Where(group => string.Equals(group.io, "i", StringComparison.OrdinalIgnoreCase))
                .SelectMany(group => (group.variables ?? new AvmVariable[0])
                    .Select(variable => BuildQualifiedFeatureName(group, variable)))
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();

            List<string> targetColumns = avmVariableGroup
                .Where(group => string.Equals(group.io, "o", StringComparison.OrdinalIgnoreCase))
                .SelectMany(group => (group.variables ?? new AvmVariable[0])
                    .Select(variable => BuildQualifiedFeatureName(group, variable)))
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();

            if (numericalColumns.Count == 0)
            {
                throw new InvalidOperationException("DCP 沒有可供建模使用的輸入欄位。");
            }

            if (targetColumns.Count == 0)
            {
                throw new InvalidOperationException("DCP 沒有可供建模使用的輸出欄位。");
            }

            AvmTaskInfo avmTaskInfo = new AvmTaskInfo();

            AvmModelInfo avmModelInfo = new AvmModelInfo();
            avmModelInfo.model_name = taskId;
            avmModelInfo.model_id = 8;
            avmModelInfo.model_path = PathHelper.GetDirPath(taskId + "\\model");
            

            AvmDataSource dataSource = new AvmDataSource();
            dataSource.variablegroups = avmVariableGroup;

            AvmFeature avmFeature = new AvmFeature();

            avmFeature.filterrules = avmFilterRules;
            avmFeature.indicatorrules = avmIndicatorRules;
            avmFeature.pointrules = avmPointRules;
            AvmParameters avmParameters = new AvmParameters();

            AvmDataCollectionPlan avmDataCollectionPlan = new AvmDataCollectionPlan();

            avmDataCollectionPlan.datasource = dataSource;
            avmDataCollectionPlan.feature = avmFeature;
           
            avmParameters.rawdata_path = PathHelper.GetDirPath(taskId);
            avmParameters.phase_id = 4;
            avmParameters.datacollectionplan = avmDataCollectionPlan;
            avmParameters.testingCount = testingCount;
            avmTaskInfo.task_id = taskId;
            avmTaskInfo.module = "IN_FLOW_FORECAST";
            avmTaskInfo.model = avmModelInfo;
            avmTaskInfo.parameters = avmParameters;
            jsonFile.Write(taskId,AvmConfigs.TaskInfo,avmTaskInfo);

            // 建模 API 會從 model\feature_name\dcp.json 讀取相同的 DCP。
            string featureNameDir = Path.Combine(
                PathHelper.GetDirPath(taskId),
                "model",
                "feature_name"
            );
            Directory.CreateDirectory(featureNameDir);
            System.IO.File.WriteAllText(
                Path.Combine(featureNameDir, "dcp.json"),
                JsonConvert.SerializeObject(avmTaskInfo),
                new UTF8Encoding(false)
            );
            System.IO.File.WriteAllText(
                Path.Combine(featureNameDir, "numerical_cols.txt"),
                string.Join(",", numericalColumns),
                new UTF8Encoding(false)
            );
            System.IO.File.WriteAllText(
                Path.Combine(featureNameDir, "target_col.txt"),
                string.Join(",", targetColumns),
                new UTF8Encoding(false)
            );

            return Json("OK");
        }

        private static string BuildQualifiedFeatureName(
            AvmVariableGroup variableGroup,
            AvmVariable variable)
        {
            if (variableGroup == null ||
                string.IsNullOrWhiteSpace(variableGroup.variablegroupname) ||
                variable == null ||
                string.IsNullOrWhiteSpace(variable.fieldname))
            {
                throw new InvalidOperationException(
                    "DCP 特徵缺少 variablegroupname 或 fieldname，無法產生建模欄位名稱。"
                );
            }

            return variable.fieldname.Trim() + "__" +
                variableGroup.variablegroupname.Trim();
        }

        [HttpPost]
        public JsonResult ReadModuleParameter()
        {
            AvmModuleInfo avmModelInfo = new AvmModuleInfo();
            avmModelInfo = jsonFile.ReadAvmModuleInfo();
            return Json(avmModelInfo);
        }

        [HttpPost]
        public JsonResult BuildModuleParameter(string taskId, IndicatorRule moduleIndicatorRule, KSS kss, DQIy dqiy, 
            BPNN bpnn, RI ri, Measurement measurement,Refresh refresh)
        {
            ModuleParameter moduleParameter = new ModuleParameter();
            AvmModuleInfo avmModelInfo = new AvmModuleInfo();
            // read default value
            avmModelInfo = jsonFile.ReadAvmModuleInfo();

            var setDqiy = new DQIy
            {
                DQIySwitch = dqiy.DQIySwitch,
                PhaseI_Error_Threshold = dqiy.PhaseI_Error_Threshold,
                SimDriftVolume = dqiy.PhaseI_Error_Threshold
            };
            var setMeasurement = new Measurement
            {
                IndicatorSize = 20,
                USL = measurement.USL,
                LSL = measurement.LSL,
                UCL = measurement.UCL,
                LCL = measurement.LCL,
                Target = measurement.Target,
            };
            var setBPNN = new BPNN
            {
                InMomTermRange = bpnn.InMomTermRange,
                InNodesRange = bpnn.InNodesRange,
                InAlphaRange = bpnn.InAlphaRange,
                InEpochsRange = bpnn.InEpochsRange
            };

            var setKss = new KSS
            {
                InSelectAlgorithm = kss.InSelectAlgorithm,
                ModelExpansionOpen = kss.ModelExpansionOpen,
                ModelExpansionSize = kss.ModelExpansionSize,
                ModelSizeExtension = 1,
                AdjustYScale = kss.AdjustYScale,
                ModifyYOpen = kss.ModifyYOpen
            };

            var setRi = new RI
            {
                Tolerant_MaxError = ri.Tolerant_MaxError,
                LookAheadCount = ri.LookAheadCount
            };

            var setModuleIndicatorRule = new IndicatorRule
            {
                EK = moduleIndicatorRule.EK,
                IndicatorUSL = moduleIndicatorRule.IndicatorUSL,
                IndicatorUCL = moduleIndicatorRule.IndicatorUCL,
                IndicatorLCL = moduleIndicatorRule.IndicatorLCL,
                IndicatorLSL = moduleIndicatorRule.IndicatorLSL
            };

            var setRefresh = new Refresh { 
                ForceRefresh = refresh.ForceRefresh 
            };

            // update the value
            avmModelInfo.Set(setModuleIndicatorRule);
            avmModelInfo.Set(setDqiy);
            avmModelInfo.Set(setRi);
            avmModelInfo.Set(setBPNN);
            avmModelInfo.Set(setKss);
            avmModelInfo.Set(setRefresh);
            avmModelInfo.Set(setMeasurement);

            jsonFile.Write(taskId, AvmConfigs.ModuleInfo, avmModelInfo);

            return Json("OK");
        }

        [HttpPost]
        public ActionResult SaveFeatureTxt([FromBody] AvmIIIFeature payload)
        {
            try
            {
                var basePath = PathHelper.GetDirPath(payload.taskId);
                var modelDir = Path.Combine(basePath, "model");
                Directory.CreateDirectory(modelDir);

                var featureNameDir = Path.Combine(modelDir, "feature_name");
                Directory.CreateDirectory(featureNameDir);

                var numericalPath = Path.Combine(featureNameDir, "numerical_cols.txt");
                var targetPath = Path.Combine(featureNameDir, "target_col.txt");

                System.IO.File.WriteAllText(
                    numericalPath,
                    string.Join(",", payload.numerical ?? new List<string>()),
                    Encoding.UTF8
                );

                System.IO.File.WriteAllText(
                    targetPath,
                    string.Join(",", payload.target ?? new List<string>()),
                    Encoding.UTF8
                );

                return Json(new { success = true });
            }catch(Exception e)
            {
                return Json(new { success = false, message = e.Message });
            }
        }

        [HttpPost]
        public ActionResult SaveModelConfig([FromBody] AvmIIIModule payload)
        {
            try
            {
                var basePath =PathHelper.GetDirPath(
                        payload.taskId);

                var modelDir =Path.Combine(basePath,"model");

                var hyperParametersDir =Path.Combine(modelDir,"hyper_parameters");

                Directory.CreateDirectory(modelDir);

                Directory.CreateDirectory(hyperParametersDir);

                // ================= ENERGY =================

                System.IO.File.WriteAllText(
                    Path.Combine(
                        hyperParametersDir,
                        "model_config.json"
                    ),
                    JsonConvert.SerializeObject(
                        payload.energy,
                        Formatting.Indented
                    )
                );

                // ================= SCHEDULING =================

                if (
                    payload.exportScheduling &&
                    payload.scheduling != null
                )
                {
                    System.IO.File.WriteAllText(
                        Path.Combine(
                            modelDir,
                            "scheduling.json"
                        ),
                        JsonConvert.SerializeObject(
                            payload.scheduling,
                            Formatting.Indented
                        )
                    );
                }

                // ================= FACILITY =================

                if (
                    payload.exportFacility &&
                    payload.facility != null
                )
                {
                    if (payload.facility.facility_type =="air" &&payload.facility.air != null)
                    {
                        var airConfigJson = JsonConvert.SerializeObject(
                            payload.facility.air,
                            Formatting.Indented
                        );

                        System.IO.File.WriteAllText(
                            Path.Combine(
                                modelDir,
                                "air_compressor.json"
                            ),
                            airConfigJson
                        );

                        // 建模模組使用的標準位置；保留根目錄舊檔以維持相容性。
                        System.IO.File.WriteAllText(
                            Path.Combine(
                                hyperParametersDir,
                                "air_compressor_config.json"
                            ),
                            airConfigJson
                        );
                    }
                    else if (
                        payload.facility.facility_type ==
                        "chiller" &&
                        payload.facility.chiller != null
                    )
                    {
                        var chillerConfigJson = JsonConvert.SerializeObject(
                            payload.facility.chiller,
                            Formatting.Indented
                        );

                        System.IO.File.WriteAllText(
                            Path.Combine(
                                modelDir,
                                "chiller.json"
                            ),
                            chillerConfigJson
                        );

                        System.IO.File.WriteAllText(
                            Path.Combine(
                                hyperParametersDir,
                                "chiller_config.json"
                            ),
                            chillerConfigJson
                        );
                    }
                }

                // ================= MICROGRID =================

                if (
                    payload.exportMicrogrid &&
                    payload.microgrid != null
                )
                {
                    System.IO.File.WriteAllText(
                        Path.Combine(
                            modelDir,
                            "microgrid.json"
                        ),
                        JsonConvert.SerializeObject(
                            payload.microgrid,
                            Formatting.Indented
                        )
                    );
                }

                return Json(
                    new
                    {
                        success = true
                    }
                );
            }
            catch (Exception e)
            {
                return Json(
                    new
                    {
                        success = false,
                        message = e.Message
                    }
                );
            }
        }
        [HttpPost]
        public ActionResult PrepareTrainingData(string taskId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(taskId))
                {
                    return Json(new
                    {
                        success = false,
                        message = "TaskId 不可為空"
                    });
                }

                importer.PrepareTrainingData(taskId);

                return Json(new
                {
                    success = true,
                    message ="TrainingData 建立完成"
                });
            }
            catch (Exception ex)
            {
                AppConstant.Logger.Error(
                    $"PrepareTrainingData 發生錯誤：{ex}"
                );

                return Json(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }


        [HttpPost] 
        public JsonResult MCS_ADAS(string taskId, bool CNNEnable, int[] step, int cnnForceRefresh)
        {
            AvmMcsAdasInfo adas = new AvmMcsAdasInfo();
            adas.num_step = step;
            adas.cnn_enable = CNNEnable;
            adas.refresh_enable = cnnForceRefresh;
            jsonFile.Write(taskId, AvmConfigs.McsAdasInfo, adas);
            return Json("OK");
        }

        [HttpPost]
        public JsonResult MCS_AutoEncoder_CNN(string taskId, AvmAutoEncoderInfo avmAutoEncoderInfo)
        {
            jsonFile.Write(taskId, AvmConfigs.AutoEncoderInfo, avmAutoEncoderInfo);
            return Json("OK");
        }

        [HttpPost]
        public JsonResult BuildModel(string taskId)
        {
            try
            {
                // === 舊版 request 格式（保留備查） ===
                // AvmIIITaksInfo info = new AvmIIITaksInfo();
                // info.task_number = taskId;
                // info.model_path = Server.MapPath("~/App_Data/AvmModels");
                // info.config = "energy_model";
                // info.task_type = "PredictPhaseI";
                // string json = JsonConvert.SerializeObject(info);

                // === 建模 API request：使用 DCP 完整格式 ===
                string taskPath = PathHelper.GetDirPath(taskId);
                string modelPath = Path.Combine(taskPath, "model");
                Directory.CreateDirectory(modelPath);

                string baseVmsConfigPath = Path.Combine(
                    AppConstant.AvmModelDirPath,
                    "base",
                    "model",
                    "vms_config.json"
                );
                if (!System.IO.File.Exists(baseVmsConfigPath))
                {
                    throw new FileNotFoundException(
                        "找不到建模用 vms_config.json",
                        baseVmsConfigPath
                    );
                }

                string taskVmsConfigPath = Path.Combine(
                    modelPath,
                    "vms_config.json"
                );
                System.IO.File.Copy(
                    baseVmsConfigPath,
                    taskVmsConfigPath,
                    true
                );

                AppConstant.Logger.Info(
                    $"vms_config.json 已輸出至 Task model 根目錄，" +
                    $"TaskId：{taskId}，路徑：{taskVmsConfigPath}"
                );

                string dcpPath = Path.Combine(modelPath, "DCP.json");
                if (!System.IO.File.Exists(dcpPath))
                {
                    throw new FileNotFoundException("找不到建模用 DCP.json", dcpPath);
                }

                JObject request = JObject.Parse(
                    System.IO.File.ReadAllText(dcpPath));
                request["module"] = "IN_FLOW_FORECAST";
                string json = request.ToString(Formatting.None);

                // === 2. 建 log 目錄 ===
                string logDirPath = PathHelper.GetDirPath("Log");
                System.IO.Directory.CreateDirectory(logDirPath);

                // request log
                string requestPath = Path.Combine(logDirPath, "api_request.txt");
                System.IO.File.WriteAllText(requestPath, json);

                // === 3. 設定 API ===
                var iniEditor = new FstIniEditor();
                _http.BaseUrl = iniEditor.ReadValue("BuildAPI", "URL");
                // ex: http://127.0.0.1:5500/api/

                // === 4. 呼叫 API ===
                var response = _http.PostData("model/build/", json);


                // response log
                string responsePath = Path.Combine(logDirPath, "api_response.txt");
                System.IO.File.WriteAllText(responsePath, response ?? "NULL");

                // === 5. 判斷結果 ===
                if (string.IsNullOrEmpty(response))
                {
                    return Json(new { success = false, msg = "API 無回應" });
                }

                if (response.ToLower().Contains("error") || response.ToLower().Contains("fail"))
                {
                    return Json(new { success = false, msg = response });
                }

                return Json(new { success = true, msg = response });
            }
            catch (Exception e)
            {
                // error log
                string logDirPath = PathHelper.GetDirPath("Log");
                System.IO.File.WriteAllText(Path.Combine(logDirPath, "api_error.txt"), e.ToString());

                return Json(new
                {
                    success = false,
                    msg = "API 無回應",
                    detail = e.Message
                });
            }
        }

        [HttpPost]
        public JsonResult ModelProcessInfo(string taskId)
        {
            try
            {
                string modelDirPath = GetModelDirPath(taskId);
                string logDirPath = Path.Combine(modelDirPath, "log");

                if (System.IO.File.Exists(Path.Combine(modelDirPath, "Finish.txt")))
                {
                    return Json(new
                    {
                        status = "Completed",
                        stage = "Completed",
                        message = "模型建立完成。",
                        epoch = (int?)null
                    });
                }

                if (System.IO.File.Exists(Path.Combine(modelDirPath, "Error.txt")))
                {
                    return Json(new
                    {
                        status = "Error",
                        stage = "Failed",
                        message = "模型建立失敗。",
                        epoch = (int?)null
                    });
                }

                string stage = "Preparing";
                string message = "建模 API 已送出，等待資料前處理...";
                int? epoch = null;

                string gsiLossPath = Path.Combine(logDirPath, "loss_gsi.csv");
                string m2LossPath = Path.Combine(logDirPath, "loss_m2.csv");
                string m1LossPath = Path.Combine(logDirPath, "loss_m1.csv");

                if (System.IO.File.Exists(Path.Combine(logDirPath, "retrain_GSI_done.txt")))
                {
                    stage = "Finalizing";
                    message = "GSI 訓練完成，正在整理模型輸出...";
                }
                else if (System.IO.File.Exists(gsiLossPath) ||
                         System.IO.File.Exists(Path.Combine(logDirPath, "retrain_m2_done.txt")))
                {
                    stage = "GSI";
                    epoch = TryReadLastEpoch(gsiLossPath);
                    message = epoch.HasValue
                        ? $"正在訓練 GSI，目前 Epoch {epoch.Value}。"
                        : "M2 已完成，正在啟動 GSI 訓練...";
                }
                else if (System.IO.File.Exists(m2LossPath) ||
                         System.IO.File.Exists(Path.Combine(logDirPath, "retrain_m1_done.txt")))
                {
                    stage = "M2";
                    epoch = TryReadLastEpoch(m2LossPath);
                    message = epoch.HasValue
                        ? $"正在訓練 M2，目前 Epoch {epoch.Value}。"
                        : "M1 已完成，正在啟動 M2 訓練...";
                }
                else if (System.IO.File.Exists(m1LossPath))
                {
                    stage = "M1";
                    epoch = TryReadLastEpoch(m1LossPath);
                    message = epoch.HasValue
                        ? $"正在訓練 M1，目前 Epoch {epoch.Value}。"
                        : "正在啟動 M1 訓練...";
                }
                else if (System.IO.File.Exists(Path.Combine(
                    modelDirPath, "TrainingData", "training_data.csv")))
                {
                    stage = "Preprocessing";
                    message = "訓練資料已產生，正在進行模型前處理...";
                }
                else if (Directory.Exists(Path.Combine(modelDirPath, "TrainingData")))
                {
                    stage = "Preprocessing";
                    message = "正在合併與清理訓練資料...";
                }

                return Json(new
                {
                    status = "Processing",
                    stage,
                    message,
                    epoch
                });
            }
            catch (Exception ex)
            {
                return Json(ex);
            }
        }

        private int? TryReadLastEpoch(string filePath)
        {
            if (!System.IO.File.Exists(filePath))
            {
                return null;
            }

            try
            {
                string lastLine = null;
                using (var stream = new FileStream(
                    filePath,
                    FileMode.Open,
                    FileAccess.Read,
                    FileShare.ReadWrite))
                using (var reader = new StreamReader(stream))
                {
                    string line;
                    while ((line = reader.ReadLine()) != null)
                    {
                        if (!string.IsNullOrWhiteSpace(line))
                        {
                            lastLine = line;
                        }
                    }
                }

                if (string.IsNullOrWhiteSpace(lastLine) ||
                    lastLine.StartsWith("epoch", StringComparison.OrdinalIgnoreCase))
                {
                    return null;
                }

                int epoch;
                return int.TryParse(lastLine.Split(',')[0], out epoch)
                    ? epoch
                    : (int?)null;
            }
            catch (IOException)
            {
                // 訓練程序可能正在寫入檔案；下一次輪詢再讀即可。
                return null;
            }
        }

		private string GetModelDirPath(string taskId)
		{
            return Path.Combine(PathHelper.GetDirPath(taskId), "model");
        }

        public JsonResult UploadModel(string taskId, string modelName, List<AvmIIIIndicatorRule> indicatorRule)
        {
            try
            {
                string modelId = GetModelId(taskId);
                List<AvmIIIModelDetail> modelDetails = GetModelDetails(indicatorRule,modelId);
                string modelPath = GetModelDirPath(taskId);
                string message = importer.UploadModel(modelId, modelName, modelPath, modelDetails, taskId);
                return Json(new
                {
                    success = true,
                    message
                });
            }
            catch (Exception ex)
            {
                AppConstant.Logger.Error($"UploadModel Error: {ex}");

                Response.StatusCode = 500;
                Response.TrySkipIisCustomErrors = true;

                return Json(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }



   //     public JsonResult UploadModel(string taskId, string modelName, string filterrules,
   //         string indicatorrules, string variablegroups, Measurement measurement, IndicatorRule moduleIndicatorRule)
   //     {
   //         try
			//{
			//	string modelId = GetModelId(taskId);

			//	List<ModelDetail> modelDetails = GetModelDetails(filterrules, indicatorrules, variablegroups, moduleIndicatorRule, modelId);
   //             var modelMetadata = GetModelMetadata(modelName, modelId);

   //             jsonFile.Write(taskId, AvmConfigs.ModelDetail, modelDetails);
			//	jsonFile.Write(taskId, AvmConfigs.ModelMetadata, modelMetadata);

   //             string modelPath = GetModelDirPath(taskId);
			//	string message = importer.UploadModel(modelId, modelName, modelPath, modelDetails, taskId);

			//	return Json(message);
			//}
			//catch (Exception ex)
   //         {
   //             return Json(ex.Message);
   //         }
   //     }

		private Models.Structures.ModelMetadata GetModelMetadata(string modelName, string modelId)
		{
			Models.Structures.ModelMetadata modelMetadata = new Models.Structures.ModelMetadata();

			modelMetadata.RootModelName = modelName;
			modelMetadata.RootModelId = modelId; ;

			return modelMetadata;
		}

		private string GetModelId(string taskId)
		{
            var modelId = $"MODEL_{taskId}";

            bool isExist = importer.IsExistModelId(modelId);

            return (isExist ? $"MODEL_{Guid.NewGuid().ToString()}" : modelId);
		}

        private List<AvmIIIModelDetail> GetModelDetails(List<AvmIIIIndicatorRule> indicatorRule,string modelId)
        {
            List<AvmIIIModelDetail> details = new List<AvmIIIModelDetail>();
            
            foreach (var item in indicatorRule)
            {
                details.Add(new AvmIIIModelDetail{
                    rootModelId = modelId,
                    indicatorId = item.ruleId,
                    indicatorName = item.indicatorName,
                    variableGroup = item.groupName,
                    variableName = item.variable,
                    startTime = item.startTime,
                    endTime = item.endTime,
                    metaTable = MCCImporter.MapMetaTable(item.groupName)
                });
            }

            return details;
        }


        private static List<ModelDetail> GetModelDetails(string filterrules, string indicatorrules, string variablegroups, IndicatorRule indicatorRuleSpecs, string modelId)
		{
			List<ModelDetail> details = new List<ModelDetail>();

			AvmFilterRule[] avmFilterRules = JsonConvert.DeserializeObject<AvmFilterRule[]>(filterrules);
			AvmIndicatorRule[] avmIndicatorRules = JsonConvert.DeserializeObject<AvmIndicatorRule[]>(indicatorrules);
			AvmVariableGroup[] avmVariableGroups = JsonConvert.DeserializeObject<AvmVariableGroup[]>(variablegroups);

			// 比對用物件：Dict<variableid, AvmVariable>
			Dictionary<int, AvmVariable> variableIdToVariable = avmVariableGroups
				.SelectMany(group => group.variables, (group, variable) => new { group, variable })
				.ToDictionary(x => x.variable.variableid, x => x.variable);

			// 比對用物件：Dict<variableid, AvmVariableGroup>
			Dictionary<int, AvmVariableGroup> variableIdToGroup = avmVariableGroups
				.SelectMany(group => group.variables, (group, variable) => new { group, variable })
				.ToDictionary(x => x.variable.variableid, x => x.group);

			int indicatorRuleIndex = 0;
			foreach (var indicatorRule in avmIndicatorRules)
			{
				var filterRule = avmFilterRules.ElementAtOrDefault(indicatorRule.filterruleid - 1);
				if (filterRule == null)
				{
					throw new Exception($"Invaild FilterRuleID:'{indicatorRule.filterruleid}'");
				}

				// 查找對應的 Group、Variable 等資訊
				var variableGroup = variableIdToGroup[filterRule.variableid];
				var variable = variableIdToVariable[filterRule.variableid];

				// 查找該 Group 中的 Separator
				var separatorVariable = variableGroup.variables.Where(v => v.isseparator != 0).FirstOrDefault();


				// 彙整 Indicator 資訊
				details.Add(new ModelDetail
				{
					rootModelId = modelId,

					indicatorId = indicatorRule.ruleid,
					indicatorName = indicatorRule.rulename,

					metaTable = variableGroup.metatable,
					variableGroup = variableGroup.variablegroupname,

					variableName = variable.variablename,
					separatorValue = filterRule.separatingvalues,
					separator = (separatorVariable is null ? string.Empty : separatorVariable.variablename),

					usl = indicatorRuleSpecs.IndicatorUSL[indicatorRuleIndex],
					lsl = indicatorRuleSpecs.IndicatorLSL[indicatorRuleIndex],
					ucl = indicatorRuleSpecs.IndicatorUCL[indicatorRuleIndex],
					lcl = indicatorRuleSpecs.IndicatorLCL[indicatorRuleIndex],
					target = double.NaN
				});

				++indicatorRuleIndex;
			}

			return details;
		}

		[HttpPost]
        public JsonResult ReadErrorInfo(string taskId)
        {
            string modelDirPath = GetModelDirPath(taskId);

            var errorFilePath = Path.Combine(modelDirPath, "Error.txt");

            if (System.IO.File.Exists(errorFilePath))
            {
                string text = System.IO.File.ReadAllText(errorFilePath, System.Text.Encoding.UTF8);

                return Json(text);
            }

            return Json("null");
        }

        [HttpPost]
        public JsonResult SaveHtml(string taskId,string html)
        {
            string path = PathHelper.GetDirPath(taskId);
            System.IO.File.WriteAllText(path + "\\html.txt", html.Replace("\\",""));
            return Json("save html...");
        }

        [HttpPost]
        public JsonResult ChartYScale(double max,double min,int maxStepCount = 8)
        {
            if (max == min)
            {
                max += 0.1;
                min -= 0.1;
            }

            var limit = UIUtility.CalculateYAxisLimit(max, min, maxStepCount);
            return Json(limit);
        }

        public JsonResult CbnTime()
        {
            var iniEditor = new FstIniEditor();
            var time = iniEditor.ReadValue("DelayTime", "CBNRenderTime");
            if (time == "")
            {
                return Json(1000);
            }
            return Json(time);
        }

        public ActionResult DownloadPPT(string taskId)
        {
            string virtualFilePath = Url.Content("~/App_Data/AvmModels/" + taskId + "/ModelValidation.pptx");
            string filePath = Server.MapPath(virtualFilePath);

            if (!System.IO.File.Exists(filePath))
            {
                return HttpNotFound("錯誤: 無生成ModelValidation.pptx。");
            }

            byte[] fileBytes = System.IO.File.ReadAllBytes(filePath);
            string fileName = "ModelValidation.pptx";

            // 使用文件流方式返回文件
            return File(fileBytes, "application/vnd.openxmlformats-officedocument.presentationml.presentation", fileName);
        }
    }

    #region JSON 序列化：以 Json.Net 取代內建 JSON 元件

    // http://www.cnblogs.com/studyzy/p/mvc_and_json_dot_net.html
    // http://kirkchen.logdown.com/posts/146604-using-aspnet-mvc-to-create-web-api-13-use-jsonnet-parse-json
    public class JsonNetResult : JsonResult
    {
        public JsonSerializerSettings SerializerSettings { get; set; }

        public Formatting Formatting { get; set; }

        public JsonNetResult()
        {
            SerializerSettings = new JsonSerializerSettings();
        }

        public override void ExecuteResult(ControllerContext context)
        {
            if (context == null)
                throw new ArgumentNullException("context");
            HttpResponseBase response = context.HttpContext.Response;
            response.ContentType =
            !string.IsNullOrEmpty(ContentType) ? ContentType : "application/json ";
            if (ContentEncoding != null)
                response.ContentEncoding = ContentEncoding;
            if (Data != null)
            {
                JsonTextWriter writer = new JsonTextWriter(response.Output)
                {
                    Formatting = Formatting
                };
                JsonSerializer serializer = JsonSerializer.Create(SerializerSettings);
                serializer.Serialize(writer, Data); writer.Flush();
            }
        }
    }

    public class JsonNetController : Controller
    {
        protected override JsonResult Json(object data, string contentType,
        Encoding contentEncoding, JsonRequestBehavior behavior)
        {
            if (behavior == JsonRequestBehavior.DenyGet &&
            string.Equals(this.Request.HttpMethod, "GET", StringComparison.OrdinalIgnoreCase))
            {
                //Call JsonResult to throw the same exception as JsonResult
                return new JsonResult();
            }

            return new JsonNetResult()
            {
                Data = data,
                ContentType = contentType,
                ContentEncoding = contentEncoding
            };
        }


    }



    #endregion
}

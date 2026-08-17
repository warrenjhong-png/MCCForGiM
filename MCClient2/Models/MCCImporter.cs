using fst.Toolkit;
using Imrc.CommonLib.Components.Storage;
using Imrc.CommonLib.Structures;
using MCClient2.Models.Managers;
using MCClient2.Models.Structures;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;
using System.Threading;
using System.Web;
using System.Web.Caching;
using System.Web.Mvc;

namespace MCClient2.Models
{
    public class MCCImporter
    {
        private readonly string _Step = "Step";
        private readonly string _Path = "//Path";

        string uploadModelUrl = "";
        private List<string> Buckets { get; }
        public DbAgent StdbAgent { get; }
        public DbAgent CdbAgent { get; }
        public DatabaseInformation Database { get; }
        private Dictionary<string, Dictionary<string, string>> DefFields { get; }
        public MCCImporter()
        {
            var iniEditor = new FstIniEditor();

            StdbAgent = iniEditor.GetDbAgent("STDB");
            CdbAgent = iniEditor.GetDbAgent("CDB");
            var currentDb = StdbAgent.Driver.ExecuteList<string>("SELECT DB_NAME()");
            DefFields = DBInfo.GetStdbDefFields(StdbAgent);
            Buckets = DBInfo.GetBuckets(StdbAgent);
            //_httpAdapter.BaseUrl = iniEditor.ReadValue("ModelAPI", "URL");
            uploadModelUrl = iniEditor.ReadValue("FileStorage", "URL");
        }
        #region Interface
        public List<string> GetFabInfo()
        {
            return Buckets;
        }
        public FabDetailOutput GetFabDetail(FabDetailIntput input)
        {
            try
            {
                if (input == null)
                    throw new ArgumentNullException(nameof(input));

                if (string.IsNullOrWhiteSpace(input.Query))
                    throw new ArgumentException("Query 不可為空。", nameof(input));

                DbAgent dbAgent = StdbAgent;
                var deviceDef = GetDeviceDef("SYSDEF");

                // 防止查詢不存在的欄位
                if (!deviceDef.TryGetValue(input.Query, out string queryColumn))
                    throw new ArgumentException($"找不到 Query 對應欄位：{input.Query}");

                var sql = new StringBuilder();

                sql.Append("SELECT DISTINCT ST.")
                   .Append(queryColumn)
                   .Append(" FROM SYSSETTING ST")
                   .Append(" WHERE 1 = 1");

                if (input.Data != null)
                {
                    foreach (var kvp in input.Data)
                    {
                        if (!deviceDef.TryGetValue(kvp.Key, out string conditionColumn))
                        {
                            throw new ArgumentException(
                                $"找不到條件對應欄位：{kvp.Key}");
                        }

                        if (kvp.Value == null || !kvp.Value.Any())
                            continue;

                        sql.Append(" AND ST.")
                           .Append(conditionColumn)
                           .Append(" IN ")
                           .Append(string.Join(
                               ",",
                               dbAgent.SqlMaker.ToConditionValue(kvp.Value)));
                    }
                }

                sql.Append(" AND ST.TIMETAG >= ")
                   .Append(dbAgent.SqlMaker.ToConditionValue(input.StartTime))
                   .Append(" AND ST.TIMETAG < ")
                   .Append(dbAgent.SqlMaker.ToConditionValue(input.EndTime))
                   .Append(" ORDER BY ST.")
                   .Append(queryColumn);

                string querySql = sql.ToString();

                AppConstant.Logger.Info("Get FabDetail: " + querySql);

                var list = dbAgent.Driver.ExecuteList<string>(querySql);

                if (list == null || list.Count == 0)
                {
                    AppConstant.Logger.Info("Get FabDetail：查無資料。");
                    return null;
                }

                var output = new FabDetailOutput
                {
                    Name = input.Query,
                    DataCategory = GetCategoryName(
                        dbAgent,
                        list,
                        input.Query),
                    IsMix = GetIsMix(
                        dbAgent,
                        input.Query)
                };

                AppConstant.Logger.Info("Get FabDetail 完成。");

                return output;
            }
            catch (Exception e)
            {
                AppConstant.Logger.Error(
                    $"GetFabDetail 發生錯誤：{e}");

                return null;
            }
        }

        public List<string> GetPieceList(DateTime startTime,DateTime endTime,Dictionary<string, List<string>> data)
        {
            try
            {
                DbAgent dbAgent = StdbAgent;
                var deviceDef = GetDeviceDef("SYSDEF");

                var sql = new StringBuilder();

                sql.AppendLine("SELECT ST.CONTEXTID");
                sql.AppendLine("FROM SYSSETTING ST");
                sql.AppendLine("WHERE 1 = 1");

                if (data != null)
                {
                    foreach (var kvp in data)
                    {
                        if (!deviceDef.TryGetValue(kvp.Key, out string columnName))
                        {
                            throw new ArgumentException(
                                $"找不到條件欄位對應：{kvp.Key}");
                        }

                        if (kvp.Value == null || kvp.Value.Count == 0)
                            continue;

                        sql.Append("  AND ST.")
                           .Append(columnName)
                           .Append(" IN ")
                           .AppendLine(
                               string.Join(
                                   ",",
                                   dbAgent.SqlMaker.ToConditionValue(kvp.Value)));
                    }
                }

                sql.Append("  AND ST.TIMETAG >= ")
                   .AppendLine(dbAgent.SqlMaker.ToConditionValue(startTime));

                sql.Append("  AND ST.TIMETAG < ")
                   .AppendLine(dbAgent.SqlMaker.ToConditionValue(endTime));

                sql.AppendLine("GROUP BY ST.CONTEXTID");
                sql.AppendLine("ORDER BY MIN(ST.TIMETAG)");

                string querySql = sql.ToString();

                AppConstant.Logger.Info("Get PieceList: " + querySql);

                var result = dbAgent.Driver.ExecuteDataTable(querySql);

                return result.AsEnumerable()
                    .Select(row => row.Field<string>("CONTEXTID"))
                    .Where(id => !string.IsNullOrWhiteSpace(id))
                    .ToList();
            }
            catch (Exception ex)
            {
                AppConstant.Logger.Error(
                    $"GetPieceList 發生錯誤：{ex}");

                return new List<string>();
            }
        }

        public long GetPieceCount(DateTime startTime,DateTime endTime,Dictionary<string, List<string>> data)
        {
            try
            {
                DbAgent dbAgent = StdbAgent;
                var deviceDef = GetDeviceDef("SYSDEF");

                var sql = new StringBuilder();

                sql.AppendLine("SELECT COUNT_BIG(*) AS PIECE_COUNT");
                sql.AppendLine("FROM SYSSETTING ST");
                sql.AppendLine("WHERE 1 = 1");

                if (data != null)
                {
                    foreach (var kvp in data)
                    {
                        if (!deviceDef.TryGetValue(kvp.Key, out string columnName))
                        {
                            throw new ArgumentException(
                                $"找不到條件欄位對應：{kvp.Key}");
                        }

                        if (kvp.Value == null || kvp.Value.Count == 0)
                        {
                            continue;
                        }

                        sql.Append("  AND ST.")
                           .Append(columnName)
                           .Append(" IN ")
                           .AppendLine(
                               string.Join(
                                   ",",
                                   dbAgent.SqlMaker.ToConditionValue(kvp.Value)));
                    }
                }

                sql.Append("  AND ST.TIMETAG >= ")
                   .AppendLine(
                       dbAgent.SqlMaker.ToConditionValue(startTime));

                sql.Append("  AND ST.TIMETAG < ")
                   .AppendLine(
                       dbAgent.SqlMaker.ToConditionValue(endTime));

                string querySql = sql.ToString();

                AppConstant.Logger.Info(
                    "GetPieceCount SQL: " + querySql);

                var result = dbAgent.Driver.ExecuteDataTable(querySql);

                if (result == null || result.Rows.Count == 0)
                {
                    return 0;
                }

                object countValue = result.Rows[0]["PIECE_COUNT"];

                if (countValue == null || countValue == DBNull.Value)
                {
                    return 0;
                }

                return Convert.ToInt64(countValue);
            }
            catch (Exception ex)
            {
                AppConstant.Logger.Error(
                    $"GetPieceCount 發生錯誤：{ex}");

                throw;
            }
        }

        public List<Variables> GetVariables()
        {
            try
            {
                DbAgent dbAgent = StdbAgent;
                List<Variables> variables = new List<Variables>();
                //Get VARIABLE ALL
                string sql = "SELECT * FROM VARDEF ORDER BY ORDERNUMBER";
                AppConstant.Logger.Info("Get Variables: " + sql);
                var dt = dbAgent.Driver.ExecuteDataTable(sql);
                //Transfer table to object
                var result = dt.AsEnumerable()
                            .ToDictionary(row => row.Field<string>("TABLENAME"),
                                          row => row.Field<string>("TYPE"));
                foreach (var kvp in result)
                {
                    Variables variable = new Variables();
                    variable.MetaName = kvp.Key;//V_PROCESSDEF_RDA/PROCESSDEF_RDA
                    variable.Type = kvp.Value;
                    variable.Name = GetVariableTableName(dbAgent, variable.MetaName);//V_PROCESS_RDA/PROCESS_RDA
                    var names = GetDeviceDef(variable.MetaName).Keys.ToList().NaturalSort(); //自然排序
                    foreach (var name in names)
                    {
                        variable.VariableNames.Add(new VariableName() { Name = name });
                    }
                    if (variable.Type.Contains("METROLOGY")) //判斷type有無step
                        variable.HasStep = false;
                    else
                        variable.HasStep = Hasstep(dbAgent, ref variable);
                    variables.Add(variable);
                }
                AppConstant.Logger.Info("Variables 已取得.");
                variables = variables.OrderByDescending(o => o.Type).ToList();
                return variables;
            }
            catch (Exception e)
            {
                Logger.Error(e);
                return null;
            }
        }

        private string GetVariableTableName(DbAgent dbAgent, string tableName)
        {
            string sql = $"SELECT DISTINCT TOP 1 DEFTABLE FROM {tableName}";
            AppConstant.Logger.Info("Get VariableTableName: " + sql);
            return dbAgent.Driver.ExecuteScalar(sql).ToString();
        }

        public string DownloadRawData(string taskId, string path, List<string> pieceIds, List<Variables> variables)
        {
            try
            {
                if (pieceIds.Count == 0 || variables.Count == 0) return "No DataInput to Download!";
                DbAgent dbAgent = StdbAgent;
                foreach (Variables vars in variables)
                {
                    //Get Rawdata
                    DataTable dt = GetRawdataTable(dbAgent, vars, pieceIds);
                    if (dt.Rows.Count == 0) return (vars.Name + " No RawData Exist!");
                    //判斷欄位是否要加step
                    if (vars.HasStep)//若有step
                    {
                        //更名step
                        var oId = vars.VariableNames.Where(v => v.Name == vars.StepID.Name).Select(v => v.VariableId).FirstOrDefault();
                        if (oId == null) return (vars.StepID.Name + " Is Not Chosen!");
                        dt.Columns[oId].ColumnName = _Step;
                    }
                    else//無step固定給1
                    {
                        //加入step欄位
                        dt.Columns.Add(_Step);
                        //每一row增加step = 1
                        foreach (DataRow dr in dt.Rows)
                        {
                            dr[_Step] = "1";
                        }
                    }
                    //調整step位置至ID後
                    dt.Columns[_Step].SetOrdinal(1);//ID,Step,1,2,3...
                                                    //Export CSV
                    ConvertTableCsv(taskId, dt, path, vars.Name);
                }
                return "Download Success!";
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        public void DownloadRawDataInBatches(string taskId,DateTime startTime,DateTime endTime,Dictionary<string, List<string>> conditions,List<Variables> variables,
            Action<RawDataDownloadJob> reportProgress,CancellationToken cancellationToken)
        {
            const int batchSize = 5000;

            var job =
                new RawDataDownloadJob
                {
                    JobId = Guid.NewGuid().ToString(),
                    TaskId = taskId,
                    Status = "Running",
                    Phase = "QueryPiece",
                    Message = "正在查詢 Piece",
                    Percent = 1,
                    StartTime = DateTime.Now
                };

            reportProgress(job);

            // 第一階段：取得 Piece ID
            List<string> pieceIds =
                GetPieceList(
                    startTime,
                    endTime,
                    conditions
                );

            if (
                pieceIds == null ||
                pieceIds.Count == 0
            )
            {
                throw new Exception(
                    "查無符合條件的 Piece"
                );
            }

            job.TotalCount = pieceIds.Count;
            job.Message =
                $"共取得 {pieceIds.Count:N0} 個 Piece";
            job.Percent = 5;

            reportProgress(job);

            string outputPath =
                PathHelper.GetDirPath(taskId);

            int batchCount =
                (int)Math.Ceiling(
                    pieceIds.Count /
                    (double)batchSize
                );

            int totalWork =
                variables.Count * batchCount;

            int completedWork = 0;

            foreach (Variables vars in variables)
            {
                cancellationToken
                    .ThrowIfCancellationRequested();

                string csvPath =
                    Path.Combine(
                        outputPath,
                        vars.Name + ".csv"
                    );

                if (File.Exists(csvPath))
                {
                    File.Delete(csvPath);
                }

                bool headerWritten = false;

                for (
                    int batchIndex = 0;
                    batchIndex < batchCount;
                    batchIndex++
                )
                {
                    cancellationToken
                        .ThrowIfCancellationRequested();

                    List<string> batchPieceIds =
                        pieceIds
                            .Skip(
                                batchIndex * batchSize
                            )
                            .Take(batchSize)
                            .ToList();

                    job.Status = "Running";
                    job.Phase = "DownloadRawData";
                    job.CurrentBatch =
                        batchIndex + 1;
                    job.TotalBatch =
                        batchCount;

                    job.Message =
                        $"{vars.Name}：" +
                        $"第 {batchIndex + 1:N0} / " +
                        $"{batchCount:N0} 批";

                    reportProgress(job);

                    DataTable batchTable =
                        GetRawdataTable(
                            StdbAgent,
                            vars,
                            batchPieceIds
                        );

                    if (
                        batchTable != null &&
                        batchTable.Rows.Count > 0
                    )
                    {
                        PrepareRawDataTable(
                            batchTable,
                            vars
                        );

                        AppendTableToCsv(
                            batchTable,
                            csvPath,
                            !headerWritten
                        );

                        headerWritten = true;

                        job.ProcessedCount +=
                            batchPieceIds.Count;
                    }

                    completedWork++;

                    /*
                     * 5%：查 Piece
                     * 90%：分批下載
                     * 最後 5%：完成處理
                     */
                    job.Percent =
                        5 +
                        (int)Math.Floor(
                            completedWork /
                            (double)totalWork *
                            90
                        );

                    reportProgress(job);
                }

                if (!headerWritten)
                {
                    throw new Exception(
                        vars.Name +
                        " No RawData Exist!"
                    );
                }
            }

            job.Status = "Completed";
            job.Phase = "Completed";
            job.Message = "RawData 下載完成";
            job.Percent = 100;
            job.FinishTime = DateTime.Now;

            reportProgress(job);
        }

        public void PrepareTrainingData(string taskId)
        {
            if (string.IsNullOrWhiteSpace(taskId))
            {
                throw new ArgumentException(
                    "taskId 不可為空。",
                    nameof(taskId)
                );
            }

            string taskPath = PathHelper.GetDirPath(taskId);

            if (!Directory.Exists(taskPath))
            {
                throw new DirectoryNotFoundException(
                    $"找不到 Task 資料夾：{taskPath}"
                );
            }

            string modelPath =
                Path.Combine(
                    taskPath,
                    "model"
                );

            string trainingDataPath =
                Path.Combine(
                    modelPath,
                    "TrainingData"
                );

            Directory.CreateDirectory(
                modelPath
            );

            /*
             * 如果同一個 taskId 重新執行，
             * 先清掉上一輪的 TrainingData。
             */
            if (Directory.Exists(trainingDataPath))
            {
                Directory.Delete(
                    trainingDataPath,
                    true
                );
            }

            Directory.CreateDirectory(
                trainingDataPath
            );

            string[] csvFiles =
                Directory.GetFiles(
                    taskPath,
                    "*.csv",
                    SearchOption.TopDirectoryOnly
                );

            if (csvFiles.Length == 0)
            {
                throw new FileNotFoundException(
                    $"找不到訓練用 CSV：{taskPath}"
                );
            }

            foreach (string sourcePath in csvFiles)
            {
                string fileName =
                    Path.GetFileName(sourcePath);

                string destinationPath =
                    Path.Combine(
                        trainingDataPath,
                        fileName
                    );

                File.Copy(
                    sourcePath,
                    destinationPath,
                    true
                );
            }

            AppConstant.Logger.Info(
                $"TrainingData 建立完成，" +
                $"TaskId：{taskId}，" +
                $"CSV 數量：{csvFiles.Length}，" +
                $"路徑：{trainingDataPath}"
            );
        }
        private void PrepareRawDataTable(DataTable dt,Variables vars)
        {
            if (dt == null)
                return;

            if (vars.HasStep)
            {
                string stepVariableId =
                    vars.VariableNames
                        .Where(v =>
                            v.Name ==
                            vars.StepID.Name)
                        .Select(v =>
                            v.VariableId)
                        .FirstOrDefault();

                if (
                    string.IsNullOrWhiteSpace(
                        stepVariableId)
                )
                {
                    throw new Exception(
                        vars.StepID.Name +
                        " Is Not Chosen!"
                    );
                }

                if (
                    dt.Columns.Contains(
                        stepVariableId)
                )
                {
                    dt.Columns[
                        stepVariableId
                    ].ColumnName = _Step;
                }
            }
            else
            {
                if (!dt.Columns.Contains(_Step))
                {
                    dt.Columns.Add(_Step);

                    foreach (DataRow row in dt.Rows)
                    {
                        row[_Step] = "1";
                    }
                }
            }

            if (dt.Columns.Contains(_Step))
            {
                dt.Columns[_Step]
                    .SetOrdinal(1);
            }
        }

        private void AppendTableToCsv(DataTable table,string fullPath,bool writeHeader)
        {
            if (
                table == null ||
                table.Rows.Count == 0
            )
            {
                return;
            }

            using (
                var writer =
                    new StreamWriter(
                        fullPath,
                        true,
                        new UTF8Encoding(
                            writeHeader
                        )
                    )
            )
            {
                if (writeHeader)
                {
                    var headers =
                        table.Columns
                            .Cast<DataColumn>()
                            .Select(column =>
                                EscapeCsv(
                                    column.ColumnName
                                )
                            );

                    writer.WriteLine(
                        string.Join(
                            ",",
                            headers
                        )
                    );
                }

                foreach (DataRow row in table.Rows)
                {
                    var fields =
                        row.ItemArray.Select(
                            value =>
                            {
                                if (
                                    value == null ||
                                    value == DBNull.Value
                                )
                                {
                                    return "";
                                }

                                if (value is DateTime date)
                                {
                                    return EscapeCsv(
                                        date.ToString(
                                            "yyyy-MM-dd HH:mm:ss"
                                        )
                                    );
                                }

                                return EscapeCsv(
                                    value.ToString()
                                );
                            }
                        );

                    writer.WriteLine(
                        string.Join(
                            ",",
                            fields
                        )
                    );
                }
            }
        }

        /// <summary>
        /// 從檔案取Rawdata資料
        /// </summary>
        /// <param name="taskId"></param>
        /// <param name="path"></param>
        /// <param name="variableGroupName"></param>
        /// <param name="variableId"></param>
        /// <param name="steps"></param>
        /// <returns></returns>
        /// 
        public DataTable GetRawData(string taskId, string path, string variableGroupName, string variableId, params string[] steps)
        {
            DataTable filterTable = new DataTable();

            try
            {
                DbAgent dbAgent = StdbAgent;

                // 取得 CSV 檔案
                var dir = GetOutPutFileDir(taskId, path, variableGroupName);

                DataTable sourceTable = ConvertCSVtoDataTable(dir);

                // 找到 Date 欄位 index
                int dateIndex = sourceTable.Columns["Date"].Ordinal;

                // variableId = Date 後第 N 個欄位
                int targetIndex = dateIndex + int.Parse(variableId);

                if (targetIndex >= sourceTable.Columns.Count)
                    throw new Exception("variableId 超出欄位範圍");

                // 取得欄位名稱
                string columnName = sourceTable.Columns[targetIndex].ColumnName;

                // 建立只包含需要欄位的 table
                filterTable = new DataView(sourceTable)
                                .ToTable(false, "ID", "Step", "Date", columnName);

                // 如果有指定 step 就篩選
                if (steps != null && steps.Length > 0)
                {
                    string stepFilter = string.Join(",", steps.Select(s => $"'{s}'"));

                    DataRow[] rows = filterTable.Select($"Step IN ({stepFilter})");

                    if (rows.Length > 0)
                        filterTable = rows.CopyToDataTable();
                }

                return filterTable;
            }
            catch (Exception)
            {
                return filterTable;
            }
        }
        //public DataTable GetRawData(string taskId, string path, string variableGroupName, string variableId, params string[] steps)
        //{
        //    DataTable filterTable = new DataTable();
        //    try
        //    {
        //        DbAgent dbAgent = StdbAgent;
        //        //取csv檔案
        //        var dir = GetOutPutFileDir(taskId, path, variableGroupName);
        //        DataTable sourceTable = ConvertCSVtoDataTable(dir);
        //        //取特定欄位
        //        filterTable = new DataView(sourceTable).ToTable(false, "ID", "Step", variableId);
        //        if (steps != null)
        //        {
        //            //取過濾資料存表
        //            string expression = "Step IN " + dbAgent.SqlMaker.ToConditionValue(steps);
        //            var result = filterTable.Select(expression).CopyToDataTable();
        //            return result;
        //        }
        //        else return filterTable;
        //    }
        //   catch(Exception e){

        //        return filterTable;
        //    }
        //}
        #region ModelApi using

        /// <summary>
        /// 打包上傳模型
        /// </summary>
        /// <param name="modelId"></param>
        /// <param name="modelname"></param>
        /// <param name="modelPath"></param>
        /// <param name="modelDetails"></param>
        /// <param name="taskId"></param>
        /// <returns></returns>
        public string UploadModel(string modelId, string modelname, string modelPath, List<AvmIIIModelDetail> modelDetails, string taskId)
        {
			// 壓縮 Model
			string zipFilePath = CreateModelZip(taskId, modelPath, modelId);

            // 上傳 Model zip
			UploadModelZipToFileStorage(modelId, zipFilePath);

            // 先登記 Model 主檔，再登記具有 ROOT_MODEL_ID 的明細。
            UploadModelInfo(CdbAgent, modelname, modelId);
            UploadModelDetail(CdbAgent, modelDetails);

            return "Upload model is success.";
        }

		private static string CreateModelZip(string taskId, string modelPath, string modelId)
		{
			string zipPath = Path.Combine(AppConstant.AvmModelDirPath, taskId);
			string zipfile = Path.Combine(zipPath, modelId + ".zip");

            //刪檔
            if (File.Exists(zipfile))
            {
                File.Delete(zipfile); 
            }

			//建資料夾
			if (!Directory.Exists(zipPath))
			{
				Directory.CreateDirectory(zipPath);
			}

			ZipFile.CreateFromDirectory(modelPath, zipfile); //壓縮資料夾到zippath下(需與來源檔不同資料夾避免出錯)

			return zipfile;
		}

		private void UploadModelInfo(DbAgent dbAgent, string modelname, string modelId)
		{
			string sql = 
                "INSERT INTO MODEL(CREATE_TIME, MODEL_ID, MODEL_NAME, ROOT, ROOT_MODEL_ID) " +
			    $"VALUES (GETDATE(), {dbAgent.SqlMaker.ToConditionValue(modelId)}, {dbAgent.SqlMaker.ToConditionValue(modelname)}, 1, {dbAgent.SqlMaker.ToConditionValue(modelId)})";
            AppConstant.Logger.Info("Upload Model Info: " + sql);
            dbAgent.Driver.ExecuteNonQuery(sql);
		}

        private void UploadModelZipToFileStorage(string modelId, string zipfilePath)
        {
            var storage = new ApiFileStorage();
            storage.SetConnectionInfo(new WebApiStorage() { Uri = uploadModelUrl });
            storage.UploadModel(modelId, zipfilePath);
        }

        public void RunPythonScripts(string basePath)
        {
            string py1 = Path.Combine(basePath, "prediction_m1.py");
            string py2 = Path.Combine(basePath, "prediction_m2.py");

            RunPython(py1);
            RunPython(py2);
        }

        private void RunPython(string scriptPath)
        {
            var psi = new ProcessStartInfo
            {
                FileName = "C:\\Users\\warre\\anaconda3\\python.exe", // 或填完整路徑 C:\\Python39\\python.exe
                Arguments = $"\"{scriptPath}\"",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using (var process = new Process())
            {
                process.StartInfo = psi;
                process.Start();

                string output = process.StandardOutput.ReadToEnd();
                string error = process.StandardError.ReadToEnd();

                process.WaitForExit();

                // 👉 建議你 log
                Console.WriteLine(output);

                if (!string.IsNullOrEmpty(error))
                {
                    Console.WriteLine("Python Error: " + error);
                }
            }
        }

        #endregion
        #endregion
        #region CDB
        private DataTable GetEmptyTable(DbAgent dbAgent, string tableName)
        {
            string sql = $"SELECT * FROM {tableName} WHERE 1=0";
            AppConstant.Logger.Info("Get Empty Table: " + sql);
            return dbAgent.Driver.ExecuteDataTable(sql);
        }
        private void UploadModelDetail(DbAgent dbAgent, List<AvmIIIModelDetail> details)
        {
            string tableName = "MODEL_DETAIL";
            var dataTable = GetEmptyTable(dbAgent, tableName);
            if (dataTable.Columns.Contains("TARGET")) dataTable.Columns.Remove("TARGET"); //v1.0.5.4 未來需刪除MODEL_DETAIL的TARGET欄位，故相容新舊版本先判斷有無該資料欄位移除不寫入
            dataTable.Columns.Remove("DATA_NO"); //Remove Auto increment for Insert
                foreach (AvmIIIModelDetail detail in details)
                {
                    dataTable.Rows.Add(
                        detail.rootModelId,
                        detail.indicatorId,
                        detail.indicatorName,
                        detail.metaTable,
                        detail.variableGroup,
                        detail.variableName,
                        detail.startTime,
                        detail.endTime
                );
            }

            try
            {
                dbAgent.Driver.Insert(dataTable, tableName);
            }
            catch (Exception e)
            {
                throw new Exception(e.ToString());
            }

        }
        #endregion
        #region STDB
        private Dictionary<string, string> GetDeviceDef(string table)
        {
            return DefFields[table];
        }
        /// <summary>
        /// 取得CategoryName
        /// </summary>
        /// <param name="dbAgent">使用之CDB</param>
        /// <param name="realValues">隸屬某桶子之資料，如:["A1","B1"]</param>
        /// <param name="belong">Combination桶子名稱，如:"PROCESS"</param>
        /// <returns></returns>
        private Dictionary<string, string> GetCategoryName(DbAgent dbAgent, List<string> realValues, string belong)
        {
            string sql = $"SELECT CATEGORYNAME,REALVALUE FROM CATEGORYDEF WHERE BELONG = {dbAgent.SqlMaker.ToConditionValue(belong)} AND REALVALUE IN " + dbAgent.SqlMaker.ToConditionValue(realValues); //取得 CategoryName 時需限定 BELONG
            AppConstant.Logger.Info("Get Category Name: " + sql);
            var dt = dbAgent.Driver.ExecuteDataTable(sql);
            var dic = new Dictionary<string, string>(); //Transision
            var dic2 = new Dictionary<string, string>(); //Sort

            foreach (DataRow row in dt.Rows)
            {
                var realValue = FstConvert.ToString(row["REALVALUE"].ToString());
                var categoryName = FstConvert.ToString(row["CATEGORYNAME"].ToString());

                if (!string.IsNullOrEmpty(realValue)) //倘若 RealValue 缺值，則排除，不回報至前端
                {
                    dic.Add(realValue, categoryName);
                }
            }
            foreach (var str in realValues.NaturalSort().Where(s => !string.IsNullOrEmpty(s))) //RealValues 非空才會顯示，避免有無法點選資料出現
            {
                if (dic.ContainsKey(str))
                {
                    dic2.Add(str, dic[str]);
                }
                else
                {
                    dic2.Add(str, "Unknown"); //倘若 CategoryName 缺值，則 CategoryName 為 『Unknown』
                }
            }
            return dic2;
        }
        private string GetIsMix(DbAgent dbAgent, string query)
        {
            string sql = $"SELECT ISMIX FROM SYSDEF WHERE AVMNAME = " + dbAgent.SqlMaker.ToConditionValue(query);
            AppConstant.Logger.Info("Get Is Mix: " + sql);
            return dbAgent.Driver.ExecuteScalar(sql).ToString();
        }

        private bool Hasstep(DbAgent dbAgent, ref Variables variable)
        {
            string sql = "SELECT TOP 1 VARIABLENAME FROM " + variable.MetaName + " WHERE COLLAPSABLE = '1'";
            var result = dbAgent.Driver.ExecuteScalar(sql);
            string hasStep = (result == null) ? "" : result.ToString(); //stepNumber
            if (string.IsNullOrEmpty(hasStep))
            {
                variable.HasStep = false;
            }
            else
            {
                variable.HasStep = true;
                variable.StepID = new StepID() { Name = hasStep, Data = GetStepID(dbAgent, DefFields[variable.MetaName][hasStep], variable.Name) };
            }
            return variable.HasStep;
        }

        private List<string> GetStepID(DbAgent dbAgent, string stepField, string tableName)
        {
            string sql = "SELECT DISTINCT " + stepField + " FROM " + tableName;
            return dbAgent.Driver.ExecuteList<string>(sql);
        }
        private DataTable GetRawdataTable(DbAgent dbAgent, Variables vars, List<string> pieceIds)
        {
            try
            {
                var deviceDef = GetDeviceDef(vars.MetaName);

                var dataLinkId = CacheManager.GetCachableData(vars.MetaName,
                    () =>
                    {
                        return DBInfo.GetDataLinkField(StdbAgent, vars.MetaName);
                    }, TimeSpan.FromMinutes(10));

                string sql = "SELECT ST.CONTEXTID AS ID, ST.TIMETAG AS Date";

                foreach (VariableName vn in vars.VariableNames)
                {
                    sql += ", XT." + deviceDef[vn.Name] + " AS [" + vn.Name + "]";
                }

                sql += $" FROM SYSSETTING ST JOIN {vars.Name} XT ON ST.{dataLinkId} = XT.CONTEXTID " +
                       $"WHERE ST.CONTEXTID IN " + dbAgent.SqlMaker.ToConditionValue(pieceIds);

                if (vars.HasStep && vars.StepID.Data != null)
                {
                    sql += " AND XT." + deviceDef[vars.StepID.Name] + " IN " +
                           dbAgent.SqlMaker.ToConditionValue(vars.StepID.Data);
                }

                sql += " ORDER BY ST.TIMETAG, ST.CONTEXTID, XT.TIMETAG";

                DataTable dt = dbAgent.Driver.ExecuteDataTable(sql);

                // ================================
                // PROCESS
                // ================================
                if (vars.Type == "PROCESS")
                {
                    if (dt.Rows.Count == 0)
                        return dt;

                    var lastRow = dt.Rows[dt.Rows.Count - 1];

                    DateTime lastTime = Convert.ToDateTime(lastRow["Date"]);

                    DataRow newRow = dt.NewRow();

                    // ⭐ 改這裡
                    newRow["ID"] = "Process";

                    newRow["Date"] = lastTime.AddHours(1);

                    foreach (VariableName vn in vars.VariableNames)
                    {
                        newRow[vn.Name] = DBNull.Value;
                    }

                    dt.Rows.Add(newRow);

                    return dt;
                }

                // ================================
                // METROLOGY
                // ================================
                else if (vars.Type == "METROLOGY")
                {
                    if (dt.Rows.Count == 0)
                        return dt;

                    DataRow lastRow = dt.Rows[dt.Rows.Count - 1];

                    DateTime nextHour = lastRow.Field<DateTime>("Date").AddHours(1);

                    var vn = vars.VariableNames.First();

                    string nextSql =
                        $"SELECT ST.CONTEXTID AS ID, ST.TIMETAG AS Date, XT.{deviceDef[vn.Name]} AS metrology " +
                        $"FROM SYSSETTING ST JOIN {vars.Name} XT ON ST.{dataLinkId} = XT.CONTEXTID " +
                        $"WHERE ST.CONTEXTID = '{lastRow["ID"]}' " +
                        $"AND ST.TIMETAG = '{nextHour:yyyy-MM-dd HH:mm:ss}'";

                    DataTable nextDt = dbAgent.Driver.ExecuteDataTable(nextSql);

                    DataTable output = new DataTable();

                    output.Columns.Add("ID", typeof(string));
                    output.Columns.Add("Date", typeof(DateTime));
                    output.Columns.Add("Metrology", typeof(double));

                    if (nextDt.Rows.Count > 0)
                    {
                        output.Rows.Add(
                            "Prediction", // ⭐ 改這裡
                            nextDt.Rows[0]["Date"],
                            nextDt.Rows[0]["Metrology"]
                        );
                    }
                    else
                    {
                        output.Rows.Add(
                            "Prediction", // ⭐ 改這裡
                            lastRow["Date"],
                            lastRow[2]
                        );
                    }

                    return output;
                }
                else
                {
                    return new DataTable();
                }
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }
        //private DataTable GetRawdataTable(DbAgent dbAgent, Variables vars, List<string> pieceIds) //TODO: IN Limitation for 1000 count may cause lost,需修改分頁寫入csv
        //{
        //    var deviceDef = GetDeviceDef(vars.MetaName);
        //    //Get DataLinkFIeld for specific table
        //    //var cacheKey = vars.MetaName;
        //    var dataLinkId = CacheManager.GetCachableData(vars.MetaName,
        //        () =>
        //        {
        //            return DBInfo.GetDataLinkField(StdbAgent, vars.MetaName);
        //        }, TimeSpan.FromMinutes(10));
        //     string sql = "SELECT ST.CONTEXTID AS ID ,ST.TIMETAG AS 'Date'";
        //    //Get Rawdata(sensor)
        //    foreach (VariableName vn in vars.VariableNames)
        //    {
        //        //if (vn.VariableId == null) continue;//測試有null時用
        //        sql += ", XT." + deviceDef[vn.Name] + " AS " + dbAgent.SqlMaker.ToConditionValue(vn.VariableId);
        //    }

        //    sql += " FROM SYSSETTING ST," + vars.Name + $" XT WHERE ST.{dataLinkId} = XT.CONTEXTID AND ST.CONTEXTID IN " + dbAgent.SqlMaker.ToConditionValue(pieceIds);
        //    //step
        //    if (vars.HasStep && vars.StepID.Data != null)
        //    {
        //        sql += " AND XT." + deviceDef[vars.StepID.Name] + " IN " + dbAgent.SqlMaker.ToConditionValue(vars.StepID.Data);
        //    }
        //    sql += " ORDER BY ST.TIMETAG, ST.CONTEXTID, XT.TIMETAG ";
        //    AppConstant.Logger.Info("Get Rawdata Table: " + sql);
        //    DataTable dt = dbAgent.Driver.ExecuteDataTable(sql);
        //    //Y Remove duplicate pieceId
        //    if (vars.Type == "PROCESS")
        //    {
        //        return dt;
        //    }
        //    else if (vars.Type == "METROLOGY")
        //    {
        //        var result = from p in dt.AsEnumerable().GroupBy(x => x.Field<string>("ID")).Select(xx => xx.LastOrDefault()) select p; //取重複ID之最新一筆 datarow
        //        return result.Any()? result.CopyToDataTable():new DataTable(); //datarow to datatable
        //    }
        //    else //error parameter
        //    {
        //        return new DataTable();
        //    }
        //}

        internal bool IsExistModelId(string modelId)
		{
            var dbAgent = CdbAgent;

            string sql =
                "  SELECT MODEL_ID" +
                $" FROM {dbAgent.GetValidTableName("MODEL")}" +
                $" WHERE MODEL_ID = {dbAgent.SqlMaker.ToConditionValue(modelId)}";
            AppConstant.Logger.Info("Is Exist ModelId: " + sql);
            var id = dbAgent.Driver.ExecuteScalar(sql) as string;

            return !string.IsNullOrEmpty(id);
        }

        public static string MapMetaTable(string metaTable)
        {
            if (string.IsNullOrEmpty(metaTable))
                return metaTable;

            if (metaTable.StartsWith("PROCESS_"))
                return "PROCESSDEF_" + metaTable.Substring(8);

            return metaTable;
        }

        public void InsertModelDetail(List<AvmIIIModelDetail> modelDetails)
        {
            var dbAgent = CdbAgent;
            if (modelDetails == null || modelDetails.Count == 0)
                return;

            var values = new List<string>();

            foreach (var item in modelDetails)
            {
                values.Add($@"(
            {dbAgent.SqlMaker.ToConditionValue(item.rootModelId)},
            {dbAgent.SqlMaker.ToConditionValue(item.indicatorId)},
            {dbAgent.SqlMaker.ToConditionValue(item.indicatorName)},
            {dbAgent.SqlMaker.ToConditionValue(item.metaTable)},
            {dbAgent.SqlMaker.ToConditionValue(item.variableGroup)},
            {dbAgent.SqlMaker.ToConditionValue(item.variableName)},
            {dbAgent.SqlMaker.ToConditionValue(item.startTime)},
            {dbAgent.SqlMaker.ToConditionValue(item.endTime)}
        )");
            }

            string sql = $@"
            INSERT INTO MODEL_DETAIL
            (
                ROOT_MODEL_ID,
                INDICATOR_ID,
                INDICATOR_NAME,
                META_TABLE,
                VARIABLE_GROUP,
                VARIABLE_NAME,
                STARTTIME,
                ENDTIME
            )
            VALUES
            {string.Join(",", values)}";

                    dbAgent.Driver.ExecuteNonQuery(sql);
                }

                #endregion
        #region CSV Info
        private void ExportFile(string taskId, string path, string data, string fileName)
        {
            var dir = GetOutPutFileDir(taskId, path, fileName);
            File.WriteAllText(dir, data);
        }
        private string GetOutPutFileDir(string taskId, string path, string fileName)
        {
            var dir = PathHelper.CreateModelFolder(taskId);
            return Path.Combine(dir, fileName + ".csv");
        }
        private void ConvertTableCsv(string taskId, DataTable dtCSV, string outputPath, string fileName)
        {
            try
            {
                if (dtCSV == null || dtCSV.Rows.Count == 0)
                    return;

                string fullPath = Path.Combine(outputPath, Path.ChangeExtension(fileName, ".csv"));

                using (var writer = new StreamWriter(fullPath, false, new UTF8Encoding(true))) // UTF8 BOM
                {
                    // ===== Header =====
                    var columnNames = dtCSV.Columns
                        .Cast<DataColumn>()
                        .Select(c => EscapeCsv(c.ColumnName));

                    writer.WriteLine(string.Join(",", columnNames));

                    // ===== Rows =====
                    foreach (DataRow row in dtCSV.Rows)
                    {
                        var fields = row.ItemArray.Select(field =>
                        {
                            if (field == DBNull.Value)
                                return "";

                            if (field is DateTime dt)
                                return EscapeCsv(dt.ToString("yyyy-MM-dd HH:mm:ss"));

                            return EscapeCsv(field.ToString());
                        });

                        writer.WriteLine(string.Join(",", fields));
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }


        private string EscapeCsv(string value)
        {
            if (string.IsNullOrEmpty(value))
                return "";

            bool mustQuote = value.Contains(",") || value.Contains("\"") || value.Contains("\n") || value.Contains("\r");

            value = value.Replace("\"", "\"\"");

            return mustQuote ? $"\"{value}\"" : value;
        }
        private DataTable ConvertCSVtoDataTable(string strFilePath)
        {
            DataTable dt = new DataTable();
            using (StreamReader sr = new StreamReader(strFilePath))
            {
                string[] headers = sr.ReadLine().Split(',');
                foreach (string header in headers)
                {
                    dt.Columns.Add(header);
                }
                while (!sr.EndOfStream)
                {
                    string[] rows = sr.ReadLine().Split(',');
                    DataRow dr = dt.NewRow();
                    for (int i = 0; i < headers.Length; i++)
                    {
                        dr[i] = rows[i];
                    }
                    dt.Rows.Add(dr);
                }
            }
            return dt;
        }
        #endregion



    }
}

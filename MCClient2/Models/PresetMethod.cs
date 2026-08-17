using fst.Toolkit;
using MCClient2.Models.Managers;
using MCClient2.Models.Structures;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Services.Description;


namespace MCClient2.Models
{
    public class Spec
    {
         public double usl { get; set; }
         public double lsl { get; set; }
    }

    public class Con
    {
         public double ucl { get; set; }
         public double lcl { get; set; }
    }
    public class PresetMethod
    {
        MCCImporter importer = new MCCImporter();

        public List<SerieInfo> GetRawData(string taskId, string variableGroup, string variableId, params string[] steps)
        {
            var step = (steps is null ? null : steps.FirstOrDefault());  // 待修正參數：Step 不知為何只使用 index 0 element

            // 取得 RawData
            string path = Path.Combine(PathHelper.GetDirPath(taskId), variableGroup + ".csv");
            DataTable rawData = importer.GetRawData(taskId, path, variableGroup, variableId, steps);

            // 將 RawData 依照 PieceID 分類，並且順便過濾 Step
            Dictionary<string, List<DataRow>> pieceRawDatas = rawData.AsEnumerable()
                .Where(x => string.IsNullOrEmpty(step) || x.Field<string>("Step") == step)  // 依照 Step 過濾
                .GroupBy(dr => dr.Field<string>("ID"))                                      // 依照 PieceID 分類
                .ToDictionary(g => g.Key, g => g.ToList());                                 // 各自轉成 <pieceId, List<DataRow>>

            // 取出對應的 Temporal Data 並整理成輸出格式
            var seriesInfos = pieceRawDatas.Select(kvp => new SerieInfo
            {
                Id = kvp.Key,
                Data = kvp.Value
                    .Select(x => FstConvert.ToDouble(x.Field<string>(variableId)))
                    .ToList(),
                Step = (string.IsNullOrEmpty(step) ? "null" : step)
            }).ToList();
            return seriesInfos;
        }

        public List<double> GetIndicators(string algorithm, string rawData)
        {
            // Note:於 20230329 移除 RidiculousValue (-9999999999) 保護，並刪除相關程式碼，如有需要回覆，請透過 SolutionHistory 查找
            List<object> list = JsonConvert.DeserializeObject<List<object>>(rawData);
            List<double> result = new List<double>();

            foreach (object item in list)
            {
                List<double> values = JsonConvert.DeserializeObject<List<double>>(item.ToString());

                double indicatorValue =  CalculateIndicatorValue(algorithm, values);

                result.Add(indicatorValue);
            }
            return result;
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

        public Spec GetIndicatorSpec(string specModel,List<double> indicators,double specSettingValue,double presetUSL,double presetLSL)
        {
            Spec spec = new Spec();
            if (specModel == "Manual")
            {
                spec.usl = presetUSL;
                spec.lsl = presetLSL;
            }
            else if (specModel == "Sigma")
            {
                var arrStdMean = CalculateIndicatorValue("Mean", indicators);
                var std = CalculateIndicatorValue("Std", indicators);
                spec.usl = arrStdMean != double.NaN ? arrStdMean + specSettingValue * std : double.NaN;
                spec.lsl = arrStdMean != double.NaN ? arrStdMean - specSettingValue * std : double.NaN;
            }
            else if (specModel == "Percentage")
            {
                var arrStdMean = CalculateIndicatorValue("Mean", indicators);
                spec.usl = arrStdMean + specSettingValue / 100 * arrStdMean;
                spec.lsl = arrStdMean - specSettingValue / 100 * arrStdMean;
            }
            return spec;
        }

        public Con GetIndicatorCon(string conModel, List<double> indicators, double conSettingValue, double presetUCL, double presetLCL)
        {
            Con con = new Con();
            if (conModel == "Manual")
            {
                con.ucl = presetUCL;
                con.lcl = presetLCL;
            }
            else if (conModel == "Sigma")
            {
                var arrStdMean = CalculateIndicatorValue("Mean", indicators);
                var std = CalculateIndicatorValue("Std", indicators);
                con.ucl = arrStdMean != double.NaN ? arrStdMean + conSettingValue * std : double.NaN;
                con.lcl = arrStdMean != double.NaN ? arrStdMean - conSettingValue * std : double.NaN;
            }
            else if (conModel == "Percentage")
            {
                var arrStdMean = CalculateIndicatorValue("Mean", indicators);
                con.ucl = arrStdMean + conSettingValue / 100 * arrStdMean;
                con.lcl = arrStdMean - conSettingValue / 100 * arrStdMean;
            }
            return con;
        }

    }
}
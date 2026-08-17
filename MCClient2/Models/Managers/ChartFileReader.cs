using MCClient2.Models.Structures;
using System;
using System.Collections.Generic;
using System.IO;

namespace MCClient2.Models.Managers
{
    internal class ChartFileReader
    {
        public SeriesInfo Read(string filePath)
        {
            var series = new SeriesInfo();

            if (File.Exists(filePath) == false)
            {
                return series;
            }

            using (var sr = File.OpenText(filePath))
            {
                string id = null;
                string step = null;
                SerieInfo serie = null;

                string line = null;
                sr.ReadLine();  // 省略第一列的標題
                while ((line = sr.ReadLine()) != null)
                {
                    // 空白的情形
                    if (string.IsNullOrWhiteSpace(line))
                    {
                        continue;
                    }

                    // 切字串
                    string[] tokens = line.Split(',');
                    if (string.Equals(id, tokens[0], StringComparison.Ordinal) == false ||
                        string.Equals(step, tokens[1], StringComparison.Ordinal) == false)
                    {
                        id = tokens[0];
                        step = tokens[1];

                        serie = new SerieInfo();
                        serie.Id = tokens[0];
                        serie.Step = tokens[1];
                        serie.Data = new List<double>();

                        series.Add(serie);
                    }

                    // 轉型為數值
                    double value = double.NaN;
                    if (double.TryParse(tokens[2], out value) == false)
                    {
                        throw new InvalidCastException($"{tokens[2]} can not parse to double.");
                    }

                    serie.Data.Add(value);
                }
            }

            return series;
        }
    }
}
using ClosedXML.Excel;
using MCClient2.Models.Structures;
using Newtonsoft.Json;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace MCClient2.Tests
{
    [TestFixture]
    [Category("BuildModuleParameter")]
    public class BuildModuleParameterJsonTests
    {
        [Test]
        [TestCase("Files")]
        //[TestCase("k1")]
        //[TestCase("k2")]
        //[TestCase("k3")]
        //[TestCase("k4")]
        //[TestCase("k5")]
        //[TestCase("w1")]
        //[TestCase("w2")]
        //[TestCase("w3")]
        //[TestCase("w4")]
        //[TestCase("w5")]
        public void Verfy_IndicatorCount(string dirPath)
        {
            // Arrange
            var jsonReader = new AvmModuleInfoReader();
            var moduleInfo = jsonReader.Read(dirPath);
            var expected = moduleInfo.Get<IndicatorRule>();

            // Act
            var actual = GuiReader.Read(dirPath);

            // Assert
            Assert.AreEqual(expected.EK.Length, actual.Count);
        }

        [Test]
        [TestCase("Files")]
        //[TestCase("k1")]
        //[TestCase("k2")]
        //[TestCase("k3")]
        //[TestCase("k4")]
        //[TestCase("k5")]
        //[TestCase("w1")]
        //[TestCase("w2")]
        //[TestCase("w3")]
        //[TestCase("w4")]
        //[TestCase("w5")]
        public void Verfy_IndicatorUsl(string dirPath)
        {
            // Arrange
            var jsonReader = new AvmModuleInfoReader();
            var moduleInfo = jsonReader.Read(dirPath);
            var expected = moduleInfo.Get<IndicatorRule>();

            // Act
            var actual = GuiReader.Read(dirPath);

            // Assert
            CollectionAssert.AreEqual(expected.IndicatorUSL.GetRoundNums(), actual.Select(x => x.USL).GetRoundNums());
        }

        //[Test]
        //[TestCase(1, 1)]
        //[TestCase(2, 2)]
        //public void Verfy_IndicatorUsl(int a, int b)
        //{

        //    // Assert
        //    Assert.AreEqual(a, b);
        //}

        [Test]
        [TestCase("Files")]
        //[TestCase("k1")]
        //[TestCase("k2")]
        //[TestCase("k3")]
        //[TestCase("k4")]
        //[TestCase("k5")]
        //[TestCase("w1")]
        //[TestCase("w2")]
        //[TestCase("w3")]
        //[TestCase("w4")]
        //[TestCase("w5")]
        public void Verfy_IndicatorUcl(string dirPath)
        {
            // Arrange
            var jsonReader = new AvmModuleInfoReader();
            var moduleInfo = jsonReader.Read(dirPath);
            var expected = moduleInfo.Get<IndicatorRule>();

            // Act
            var actual = GuiReader.Read(dirPath);

            // Assert
            CollectionAssert.AreEqual(expected.IndicatorUCL.GetRoundNums(), actual.Select(x => x.UCL).GetRoundNums());
        }

        [Test]
        [TestCase("Files")]
        //[TestCase("k1")]
        //[TestCase("k2")]
        //[TestCase("k3")]
        //[TestCase("k4")]
        //[TestCase("k5")]
        //[TestCase("w1")]
        //[TestCase("w2")]
        //[TestCase("w3")]
        //[TestCase("w4")]
        //[TestCase("w5")]
        public void Verfy_IndicatorLsl(string dirPath)
        {
            // Arrange
            var jsonReader = new AvmModuleInfoReader();
            var moduleInfo = jsonReader.Read(dirPath);
            var expected = moduleInfo.Get<IndicatorRule>();

            // Act
            var actual = GuiReader.Read(dirPath);

            // Assert
            CollectionAssert.AreEqual(expected.IndicatorLSL.GetRoundNums(), actual.Select(x => x.LSL).GetRoundNums());
        }

        [Test]
        [TestCase("Files")]
        //[TestCase("k1")]
        //[TestCase("k2")]
        //[TestCase("k3")]
        //[TestCase("k4")]
        //[TestCase("k5")]
        //[TestCase("w1")]
        //[TestCase("w2")]
        //[TestCase("w3")]
        //[TestCase("w4")]
        //[TestCase("w5")]
        public void Verfy_IndicatorLcl(string dirPath)
        {
            // Arrange
            var jsonReader = new AvmModuleInfoReader();
            var moduleInfo = jsonReader.Read(dirPath);
            var expected = moduleInfo.Get<IndicatorRule>();

            // Act
            var actual = GuiReader.Read(dirPath);

            // Assert
            CollectionAssert.AreEqual(expected.IndicatorLCL.GetRoundNums(), actual.Select(x => x.LCL).GetRoundNums());
        }

        [Test]
        [TestCase("Files")]
        public void Verfy_IndicatorTrimBegin(string dirPath)
        {
            // Arrange
            var jsonReader = new TaskInfoReader();
            var moduleInfo = jsonReader.Read(dirPath);
            var expected = moduleInfo.parameters.datacollectionplan.feature.filterrules;

            // Act
            var actual = GuiReader.Read(dirPath);

            // Assert
            CollectionAssert.AreEqual(expected.Select(x => x.trimbegin), actual.Select(x => x.TrimBegin));
        }

        [Test]
        [TestCase("Files")]
        public void Verfy_IndicatorTrimEnd(string dirPath)
        {
            // Arrange
            var jsonReader = new TaskInfoReader();
            var moduleInfo = jsonReader.Read(dirPath);
            var expected = moduleInfo.parameters.datacollectionplan.feature.filterrules;

            // Act
            var actual = GuiReader.Read(dirPath);

            // Assert
            CollectionAssert.AreEqual(expected.Select(x => x.trimend), actual.Select(x => x.TrimEnd));
        }
    }

    internal static class Ext
    {
        internal static IEnumerable<double> GetRoundNums(this IEnumerable<double> values)
        {
            return values.Select(x => Math.Round(x, 6, MidpointRounding.AwayFromZero));
        }
    }

    internal class AvmModuleInfoReader : JsonReader
    {
        protected override string FileName => "BuildModuleParameter.json";

        public AvmModuleInfo Read(string dirPath)
        {
            return Read<AvmModuleInfo>(dirPath);
        }
    }

    internal class TaskInfoReader : JsonReader
    {
        protected override string FileName => "DCP.json";

        public AvmTaskInfo Read(string dirPath)
        {
            return Read<AvmTaskInfo>(dirPath);
        }
    }

    internal abstract class JsonReader
    {
        protected abstract string FileName { get; }

        protected T Read<T>(string dirPath)
        {
            string filePath = Path.Combine(dirPath, FileName);
            if (File.Exists(filePath) == false)
            {
                throw new FileNotFoundException();
            }

            string json = File.ReadAllText(filePath);
            return JsonConvert.DeserializeObject<T>(json);
        }
    }

    internal enum GuiReaderType { Excel, Text }
    internal static class GuiReader
    {
        internal static List<RuleInfo> Read(string dirPath, bool isExcelEnabled = true)
        {
            GuiReaderType type = GuiReaderType.Excel;
            if (isExcelEnabled && Directory.EnumerateFiles(dirPath, "*.xlsx").Any())
            {
                type = GuiReaderType.Excel;
            }

            IReader reader = null;
            switch (type)
            {
                case GuiReaderType.Excel:
                    reader = new ExcelReader();
                    break;
                case GuiReaderType.Text:
                default:
                    reader = new TextReader();
                    break;
            }
            return reader.Read(dirPath);
        }
    }

    internal interface IReader
    {
        List<RuleInfo> Read(string dirPath);
    }

    internal class TextReader : IReader
    {
        public List<RuleInfo> Read(string dirPath)
        {
            string filePath = Path.Combine(dirPath, "indicatorRule.txt");
            if (File.Exists(filePath) == false)
            {
                throw new FileNotFoundException();
            }

            var splitChars = new char[] { '\t' };
            var items = new List<RuleInfo>();
            using (var sr = File.OpenText(filePath))
            {
                string s = "";
                while ((s = sr.ReadLine()) != null)
                {
                    if (string.IsNullOrWhiteSpace(s))
                    {
                        break;
                    }

                    string[] tokens = s.Trim('\t').Split(splitChars, StringSplitOptions.None);
                    var info = new RuleInfo(
                        Convert.ToInt32(tokens[0]),
                        tokens[1],
                        tokens[2],
                        tokens[3],
                        tokens[4],
                        tokens[5],
                        Convert.ToInt32(tokens[6]),
                        Convert.ToInt32(tokens[7]),
                        Convert.ToDouble(tokens[8]),
                        Convert.ToDouble(tokens[9]),
                        Convert.ToDouble(tokens[10]),
                        Convert.ToDouble(tokens[11]));
                    items.Add(info);
                }
            }

            return items;
        }
    }

    internal class ExcelReader : IReader
    {
        public List<RuleInfo> Read(string dirPath)
        {
            string filePath = Path.Combine(dirPath, "indicatorRule.xlsx");
            if (File.Exists(filePath) == false)
            {
                throw new FileNotFoundException();
            }

            var items = new List<RuleInfo>();
            using (var wb = new XLWorkbook(filePath))
            using (var ws = wb.Worksheets.Worksheet(1))
            using (var range = ws.Range("A2", "K99"))
            {
                foreach (var row in range.Rows())
                {
                    if(row.Cell(1).IsEmpty())
                    {
                        break;
                    }

                    var info = new RuleInfo(
                        row.Cell(1).GetValue<int>(),
                        row.Cell(2).GetValue<string>(),
                        row.Cell(3).GetValue<string>(),
                        row.Cell(4).GetValue<string>(),
                        row.Cell(5).GetValue<string>(),
                        row.Cell(6).GetValue<string>(),
                        row.Cell(7).GetValue<int>(),
                        row.Cell(8).GetValue<int>(),
                        row.Cell(9).GetValue<double>(),
                        row.Cell(10).GetValue<double>(),
                        row.Cell(11).GetValue<double>(),
                        row.Cell(12).GetValue<double>());
                    items.Add(info);
                }
            }

            return items;
        }
    }

    internal struct RuleInfo
    {
        public int RuleId { get; private set; }
        public string IndicatorName { get; private set; }
        public string Variable { get; private set; }
        public string StepID { get; private set; }
        public string Algorithm { get; private set; }
        public string Limit { get; private set; }
        public int TrimBegin { get; private set; }
        public int TrimEnd { get; private set; }

        public double USL { get; private set; }
        public double LSL { get; private set; }
        public double UCL { get; private set; }
        public double LCL { get; private set; }

        public RuleInfo(int ruleId, string indicatorName, string variable, string stepID, string algorithm,string limit,
            int trimBegin, int trimEnd, double usl, double lsl, double ucl, double lcl)
        {
            RuleId = ruleId;
            IndicatorName = indicatorName;
            Variable = variable;
            StepID = stepID;
            Algorithm = algorithm;
            Limit = limit;
            TrimBegin = trimBegin;
            TrimEnd = trimEnd;
            USL = usl;
            LSL = lsl;
            UCL = ucl;
            LCL = lcl;
        }
        public override string ToString()
        {
            return TrimBegin.ToString();
        }
    }
}

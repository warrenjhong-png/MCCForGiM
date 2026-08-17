using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MCClient2.Models.Structures
{
    public class ModelDetail
    {
        public string rootModelId { get; set; }
        public int indicatorId { get; set; }
        public string indicatorName { get; set; }
        public string metaTable { get; set; }
        public string variableGroup { get; set; }
        public string variableName { get; set; }
        public string separator { get; set; }
        public string separatorValue { get; set; }
        public double usl { get; set; }
        public double lsl { get; set; }
        public double target { get; set; }
        public double ucl { get; set; }
        public double lcl { get; set; }
    }

    public class AvmIIIModelDetail {
        public string rootModelId { get; set; }
        public int indicatorId { get; set; }
        public string indicatorName { get; set; }
        public string metaTable { get; set; }
        public string variableGroup { get; set; }
        public string variableName { get; set; }

        public DateTime startTime { get; set; }
        public DateTime endTime { get; set; }
    }

}
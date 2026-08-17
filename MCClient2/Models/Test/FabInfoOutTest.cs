using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MCClient2.Models.Test
{
    public class FabInfoOutTest
    {
        public string Name { get; set; }
        public Dictionary<string, string> DataCategory { get; set; }
        public string IsMix { get; set; }

    }

    public class Variables
    {
        public string Name { get; set; }
        public string MetaName { get; set; }
        public string Type { get; set; }
        public List<string> VariableName { get; set; }
        public int HasStep { get; set; }
        public StepID StepID { get; set; }
    }

    public class StepID
    {
        public string Name { get; set; }
        public List<string> Data { get; set; }

    }
}
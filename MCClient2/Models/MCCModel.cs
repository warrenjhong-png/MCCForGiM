using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MCClient2.Models
{
    public class FabDetailIntput
    {
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public Dictionary<string, List<string>> Data { get; set; }
        public string Query { get; set; }
        public FabDetailIntput(DateTime startTime, DateTime endTime, Dictionary<string, List<string>> data, string query)
        {
            this.StartTime = startTime;
            this.EndTime = endTime;
            this.Data = data ?? new Dictionary<string, List<string>>();
            this.Query = query;
        }
    }
    public class FabDetailOutput
    {
        public string Name { get; set; }
        public Dictionary<string, string> DataCategory { get; set; }
        public string IsMix { get; set; }
        public FabDetailOutput()
        {
            this.DataCategory = new Dictionary<string, string>();
        }
    }
    public class Variables
    {
        public string Name { get; set; }
        public string MetaName { get; set; }
        public string Type { get; set; }
        public List<VariableName> VariableNames { get; set; }
        public bool HasStep { get; set; }
        public StepID StepID { get; set; }
        public Variables()
        {
            VariableNames = new List<VariableName>();
            StepID = new StepID();
        }
    }

    public class VariableName
    {
        public string Name { get; set; }
        public string VariableId { get; set; }
        //Todo: initial variableId to -1
        //public VariableName()
        //{
        //    Name = "";
        //    VariableId = "-1";
        //}
    }

    public class StepID
    {
        public string Name { get; set; }
        public List<string> Data { get; set; }
    }

}
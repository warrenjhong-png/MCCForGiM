using System.Collections.Generic;

namespace MCClient2.Models.Structures
{
    public class AvmTaskInfo
    {
        public string task_id { get; set; }
        public string module { get; set; }
        public AvmModelInfo model { get; set; }
        public AvmParameters parameters { get; set; }
    }

    public class AvmIIITaksInfo
    {
        public string task_number { get; set; }
        public string model_path { get; set; }
        public string task_type { get; set; }
        public string config { get; set; }
    }

    public class AvmModelInfo
    {
        public string model_name { get; set; }
        public int model_id { get; set; }
        public string model_path { get; set; }
    }

    public class AvmParameters
    {
        public int phase_id { get; set; }
        public string rawdata_path { get; set; }
        public int testingCount { get; set; }
        public AvmDataCollectionPlan datacollectionplan { get; set; }
    }

    public class AvmDataCollectionPlan
    {
        public AvmDataSource datasource { get; set; }
        public AvmFeature feature { get; set; }
    }

    public class AvmDataSource
    {
        public AvmVariableGroup[] variablegroups { get; set; }
    }

    public class AvmVariableGroup
    {
        public string io { get; set; }
        public string variablegroupname { get; set; }
        public string metatable { get; set; }
        public string filename { get; set; }
        public AvmVariable[] variables { get; set; }
    }

    public class AvmVariable
    {
        public int variableid { get; set; }
        public string variablename { get; set; }
        public string fieldname { get; set; }
        public int isseparator { get; set; }
        public string[] separatingvalues { get; set; }
    }

    public class AvmIIIFeature 
    {
        public string taskId { get; set; }
        public List<string> numerical { get; set; }
        public List<string> target { get; set; }
    }


    public class AvmFeature
    {
        public AvmFilterRule[] filterrules { get; set; }
        public AvmIndicatorRule[] indicatorrules { get; set; }
        public AvmPointRule[] pointrules { get; set; }
    }

    public class AvmFilterRule
    {
        public int ruleid { get; set; }
        public int variableid { get; set; }
        public string separatingvalues { get; set; }
        public int trimbegin { get; set; }
        public int trimend { get; set; }
        public string rulename { get; set; }

        public override string ToString()
        {
            return trimbegin.ToString();
        }
    }

    public class AvmIndicatorRule
    {
        public int ruleid { get; set; }
        public int filterruleid { get; set; }
        public string algorithm { get; set; }
        public string rulename { get; set; }
    }

    public class AvmPointRule
    {
        public int ruleid { get; set; }
        public int variableid { get; set; }
    }
}

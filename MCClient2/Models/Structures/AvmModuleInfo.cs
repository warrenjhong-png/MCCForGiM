using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Drawing.Printing;
using System.Linq;

namespace MCClient2.Models.Structures
{
    public class AvmModuleInfo : List<ModuleParameter>
    {
        internal T Get<T>()
        {
            string name = typeof(T).Name;
            var moduleParameter = this.FirstOrDefault(x => x.ContainsKey(name));
            if (moduleParameter == null)
            {
                throw new ArgumentOutOfRangeException($"The {name} can not find the type.");
            }

            if (moduleParameter.Count == 0)
            {
                throw new NullReferenceException($"The {name} is empty");
            }

            var itemParameters = moduleParameter.ElementAt(0).Value;
            if (itemParameters == null)
            {
                throw new InvalidCastException($"The value can not cast to ICollection<{name}>.");
            }

            if (itemParameters.Count == 0)
            {
                throw new NullReferenceException($"The value is empty in ICollection<{name}>.");
            }

            var target = itemParameters.FirstOrDefault();
            if (target == null)
            {
                throw new InvalidCastException($"The first value is empty in ICollection<{name}>.");
            }

            var json = JsonConvert.SerializeObject(target);
            return JsonConvert.DeserializeObject<T>(json);
        }

        internal void Set(IndicatorRule moduleIndicatorRule) { SetObj(moduleIndicatorRule); }
        internal void Set(KSS kss) { SetObj(kss); }
        internal void Set(KVS kvs) { SetObj(kvs); }
        internal void Set(DQIy dqix) { SetObj(dqix); }
        internal void Set(DQIx dqiy) { SetObj(dqiy); }
        internal void Set(MR mr) { SetObj(mr); }
        internal void Set(BPNN bpnn) { SetObj(bpnn); }
        internal void Set(RI ri) { SetObj(ri); }
        internal void Set(GSI gsi) { SetObj(gsi); }
        internal void Set(Refresh refresh) { SetObj(refresh); }
        internal void Set(Measurement measurement) { SetObj(measurement); }

        private void SetObj<T>(T obj) where T : class, new()
        {
            string name = typeof(T).Name;
            var moduleParameter = this.FirstOrDefault(x => x.ContainsKey(name));
            if (moduleParameter == null)
            {
                moduleParameter = new ModuleParameter();
                moduleParameter[name] = new List<object>();
                this.Add(moduleParameter);
            }

            var itemParameters = moduleParameter[name];
            itemParameters.Clear();
            itemParameters.Add(obj);
        }
    }

    //public class ModuleParameter
    ////public class AvmModuleInfo
    //{
    //    public ModuleIndicatorRule[] IndicatorRule { get; set; }
    //    public KSS[] KSS { get; set; }
    //    public KV[] KVS { get; set; }
    //    public Dqix[] DQIx { get; set; }
    //    public Dqiy[] DQIy { get; set; }
    //    public MR[] MR { get; set; }
    //    public BPNN[] BPNN { get; set; }
    //    public RI[] RI { get; set; }
    //    public GSI[] GSI { get; set; }
    //    public Measurement[] Measurement { get; set; }
    //}
    public class ModuleParameter : Dictionary<string, List<object>>
    {
    }

    public class IndicatorRule
    {
        public int[] EK { get; set; }
        public double[] IndicatorUSL { get; set; }
        public double[] IndicatorUCL { get; set; }
        public double[] IndicatorLCL { get; set; }
        public double[] IndicatorLSL { get; set; }
    }

    public class ProcessIndicatorRule {

        public string groupName { get; set; }
        public string ruleId { get; set; }
        public string indicatorNameFiliter { get; set; }
        public string variable { get; set; }
        public string indicatorName { get; set; }
        public bool limit { get; set; }
        public List<double> arrIndicator { get; set; }
        public string stepId { get; set; }
        public int trimBegin { get; set; }
        public int trimEnd { get; set; }
        public string algorithm { get; set; }
        public string variableId { get; set; }
        public double USL { get; set; }
        public double LSL { get; set; }
        public double UCL { get; set; }
        public double LCL { get; set; }
        public string conModel { get; set; }
        public double conSettingValue { get; set; }
        public string specModel { get; set; }
        public double specSettingValue { get; set; }
    }


    public class KSS
    {
        public string InSelectAlgorithm { get; set; }
        public double ClusterNumber { get; set; }
        public double ModelSizeExtension { get; set; }
        public double ModelExpansionOpen { get; set; }
        public double ModelExpansionSize { get; set; }
        public double ModifyYOpen { get; set; }
        public double AdjustYScale { get; set; }
    }

    public class KVS
    {
        public string Fin_apha { get; set; }
        public string Fout_apha { get; set; }
        public string InOneByOneChoose { get; set; }
        public string InSelectAlgorithm { get; set; }
        public string InSS_PLS_ComponentRate { get; set; }
    }

    public class DQIx
    {
        public int InLambda { get; set; }
        public int InConstant { get; set; }
        public float DQIxFilterPercentage { get; set; }
        public int IsPCA_OPEN { get; set; }
        public int IsForcedNormal_OPEN { get; set; }
    }

    public class DQIy
    {
        public double corralpha { get => 0.0001; set { } }
        public int IsMixedModel { get => 1; set { } }
        public int DQIyMultipleValue { get => 1; set { } }
        public double Ewmalamda { get => 0.05; set { } }
        public int EwmaWindow { get => 30; set { } }
        public double EwmaTolerance { get => 0.99; set { } }
        public double VarConfidence { get => 0.7; set { } }
        public int baseSampleNum { get => 30; set { } }
        public double RangeMultipleValue { get => 3.5; set { } }
        public int AutoSearch_Alpha_Lambda { get => 0; set { } }
        public int AlphaStricMode { get => 1; set { } }
        public int SampleLackingMode { get => 0; set { } }
        public int OpenMDFR { get => 1; set { } }
        public int CloseSPEC { get => 1; set { } }
        public int SizeMDFR { get => 30; set { } }
        public int UseBaseModelSamples { get => 1; set { } }
        public int AutoSearchTestSize { get => 8; set { } }
        public int SimDriftSamplePercentage { get => 50; set { } }
        public int DQIy_VMI_Err_StdOpen { get => 0; set { } }
        public double DQIy_VMI_Err_StdRate { get => 2.5; set { } }
        public int IsForcedNormal_OPEN { get => 0; set { } }
        public int DQIySwitch { get; set; }
        public double Ewmalamda_Group { get => 0.05; set { } }
        public double VarConfidence_Group { get => 0.70; set { } }
        public int SearchMode_Alpha_Lambda { get => 1; set { } }
        public double AlphaStricVolumem { get => 0.1; set { } }
        public int AdaptiveVMIErrTSwitch { get => 1; set { } }
        public double AdaptiveVMIErrTWeight { get => 0.7; set { } }
        public int RefreshWidenSizeRate { get => 1; set { } }
        public int RefreshWidenValueRate { get => 1; set { } }
        public double PhaseI_Error_Threshold { get; set; }
        public double SimDriftVolume { get; set; }
        public int InVigilance { get => -1; set{ } }
        public int InRmax { get => 0; set { } }
        public int iIsSmartMode { get => 1; set { } }
        public int CreateModelMethod { get => 1; set { } }
        public int InIsNewART2 { get => 1; set { } }
        public int IsFirstFanout { get => 1; set { } }
        public int AlphaStricCount { get => 0; set { } }
        public int Threshold_Adaptive_Count { get => 0; set { } }
        public int realYCount { get => 0; set { } }
        public int isSC { get => 0; set { } }
        public double PhaseI_Error_Threshold_Default { get => 0.05; set { } }
        public double DQIyThreshold { get => 0.05; set { } }
    }

    public class MR
    {
        public string InSelectAlgorithm { get; set; }
        public string InMR_TSVD_Condition_Number_Criteria { get; set; }
        public string InMR_TSVD_Energy_Ratio_Criteria { get; set; }
        public string MRRefreshCounter { get; set; }
        public string Q_SqrFlag { get; set; }
    }

    public class BPNN
    {
        public int[] InEpochsRange { get; set; }
        public float[] InMomTermRange { get; set; }
        public float[] InAlphaRange { get; set; }
        public int[] InNodesRange { get; set; }
        public int Target { get; set; }
        public string MeasureUnit { get => "MAE"; set { } }
        public int iniStage2_ConjectureSTD { get => 999999999; set { } }
        public int ModelNum { get => 1; set { } }
        public string iKernel { get => "Linear"; set { } }
        public int IsExist { get => 1; set { } }
        public string InInputLayerTransferFunction { get => "Linear"; set { } }
        public int InInputLayerTransferCoefficient { get => 1; set { } }
        public string InOutputLayerTransferFunction { get => "NonLinear"; set { } }
        public int InOutputLayerTransferCoefficient { get => 1; set { } }
        public int InOutputLayerTransferCurve { get => 1; set { } }
        public int BPNNRefreshCounter { get => 3; set { } }
    }

    public class RI
    {
        public string InFirstAlgoName { get => "MRConjectureHistory"; set { } }
        public string InSecondAlgoName { get => "BPNNConjectureHistory"; set { } }
        public string InSelectCalculator { get => "ThresholdUserSetting"; set { } }
        public string TolerableMaxErr_StdOpen { get => "0"; set { } }
        public string TolerableMaxErr_StdRate { get => "1.5"; set { } }
        public string Tolerant_MaxError { get; set; }
        public string LookAheadCount { get; set; }
    }

    public class GSI
    {
        public string InSelectAlgorithm { get; set; }
        public string RefreshCounter { get; set; }
        public string InGSI_TSVD_Condition_Number_Criteria { get; set; }
        public string InGSI_TSVD_Energy_Ratio_Criteria { get; set; }
        public string InGSI_KSS { get; set; }
        public string GSI_RT { get; set; }
        public string GSI_Threshold { get; set; }
        public string InGSI_ChangeSTD { get; set; }
        public string GSIB_Mode { get; set; }
        public string GSIB_VarableMagnification { get; set; }
        public string InGSIB_Mode { get; set; }
        public string InGSI_SamplingCount { get; set; }
        public string InGSI_WindowsSize { get; set; }
        public string GSI_IndicatorUIL { get; set; }
        public string GSI_IndicatorLIL { get; set; }
    }

    public class Measurement
    {
        public int IndicatorSize { get => 20; set { } }
        public double USL { get; set; }
        public double LSL { get; set; }
        public double UCL { get; set; }
        public double LCL { get; set; }
        public double Target { get; set; }
    }

    public class Refresh {
        public int ForceRefresh { get; set; }
        
    }

   
}
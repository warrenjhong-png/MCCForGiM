using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MCClient2.Models.Structures
{
    public class GetPieceCountRequest
    {
        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        public Dictionary<string, List<string>> Data { get; set; }
            = new Dictionary<string, List<string>>();
    }

    public class GetPieceCountResponse
    {
        public bool Success { get; set; }

        public long PieceCount { get; set; }

        public string Message { get; set; }
    }

    public class GetPieceCountInput
    {
        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        public string DataJson { get; set; }
    }

    public class AvmIIIModule
    {
        public string taskId { get; set; }

        public EnergyModel energy { get; set; }
        public SchedulingModel scheduling { get; set; }
        public FacilityModel facility { get; set; }
        public MicrogridModel microgrid { get; set; }

        public bool exportScheduling { get; set; }
        public bool exportFacility { get; set; }
        public bool exportMicrogrid { get; set; }
    }

    // ================= ENERGY =================
    public class EnergyModel
    {
        public int finetune_time_max { get; set; }
        public double threshold_scaler { get; set; }
        public double split { get; set; }
        public double fine_tune_split { get; set; }
        public int model_set_proportion { get; set; }

        public double fine_tune_lr_m1 { get; set; }
        public double fine_tune_lr_m2 { get; set; }
        public double fine_tune_lr_gsi { get; set; }

        public int fine_tune_len { get; set; }
        public int seq_len { get; set; }
        public int forecasting_len { get; set; }

        public int n_trials { get; set; }
        public int patience { get; set; }
        public int scheduler_patience { get; set; }
        public int num_epoches_search { get; set; }
        public int num_epoches { get; set; }

        public ParamGrid param_grid { get; set; }
        public GsiParamGrid gsi_param_grid { get; set; }
    }

    public class ParamGrid
    {
        public List<int> hidden_size { get; set; }
        public List<int> num_layers { get; set; }
        public List<double> lr { get; set; }
        public List<int> batch_size { get; set; }
    }

    public class GsiParamGrid
    {
        public List<int> hidden_size { get; set; }
        public List<int> latent_dim { get; set; }
        public List<double> dropout { get; set; }
        public List<double> lr { get; set; }
        public List<int> BATCH_SIZE { get; set; }
    }

    // ================= SCHEDULING =================
    public class SchedulingModel
    {
        public GaParameters ga_parameters { get; set; }
        public SchedulingParameters scheduling_parameters { get; set; }
        public SystemParameters system_parameters { get; set; }
    }

    public class GaParameters
    {
        public int pop { get; set; }
        public int gen { get; set; }
        public double cxpb { get; set; }
        public double mutpb { get; set; }
        public double assign_indpb { get; set; }
        public double perm_indpb { get; set; }
        public int seed { get; set; }
    }

    public class SchedulingParameters
    {
        public int batch_size { get; set; }
        public int setup { get; set; }
        public double setup_value_per_hour { get; set; }
        public string intra_rule { get; set; }
    }

    public class SystemParameters
    {
        public int n_jobs { get; set; }
        public string schedule_fmt { get; set; }
        public bool write_outputs { get; set; }
    }

    // ================= FACILITY =================
    public class FacilityModel
    {
        public string facility_type { get; set; } // "air" or "chiller"

        public AirCompressorConfig air { get; set; }
        public ChillerConfig chiller { get; set; }
    }

    public class AirCompressorConfig
    {
        public double OVER_BUDGET_PENALTY { get; set; }
        public double FLOW_PENALTY { get; set; }

        public int n_fixed_input { get; set; }
        public int n_vfd_input { get; set; }

        public double FIXED_AIR_KW { get; set; }
        public double FIXED_AIR_FLOW { get; set; }

        public double FLOW_CORRECTION { get; set; }
        public double BUDJECT_CORRECTION { get; set; }
        public double USAGE_CORRECTION { get; set; }

        public int SWARMSIZE { get; set; }
        public int MAXITER { get; set; }
    }

    public class ChillerConfig
    {
        public double OVER_BUDGET_PENALTY { get; set; }
        public double FLOW_PENALTY { get; set; }

        public double CHILLER_COP { get; set; }

        public double FLOW_CORRECTION { get; set; }
        public double BUDJECT_CORRECTION { get; set; }
        public double USAGE_CORRECTION { get; set; }

        public int SWARMSIZE { get; set; }
        public int MAXITER { get; set; }
    }

    // ================= MICROGRID =================
    public class MicrogridModel
    {
        public Forecast forecast { get; set; }
        public Battery battery { get; set; }
        public BatteryCost battery_cost { get; set; }
        public BatteryDegradation battery_degradation { get; set; }
        public CarbonCost carbon_cost { get; set; }
        public PsoParameters PSO_parameters { get; set; }
        public PvCost PV_cost { get; set; }
    }

    public class Forecast
    {
        public int horizon { get; set; }
    }

    public class Battery
    {
        public double BESS_MAX { get; set; }
        public double BESS_charge_MAX { get; set; }
        public double BESS_discharge_MAX { get; set; }
        public double SoC_init { get; set; }
        public double SoC_min { get; set; }
        public double SoC_max { get; set; }
    }

    public class BatteryCost
    {
        public double cost_BESS_ch { get; set; }
        public double cost_BESS_disch { get; set; }
        public double MC_bess { get; set; }
    }

    public class BatteryDegradation
    {
        public double beta0 { get; set; }
        public double beta1 { get; set; }
        public double beta2 { get; set; }
        public double ccap { get; set; }
    }

    public class CarbonCost
    {
        public double carbon_emission_factor_of_grid { get; set; }
        public double carbon_price_per_kg { get; set; }
        public double cec_ele { get; set; }
        public double carbon_price { get; set; }
    }

    public class PsoParameters
    {
        public int swarm_size { get; set; }
        public int iterations { get; set; }
        public double w { get; set; }
        public double w_max { get; set; }
        public double w_min { get; set; }
        public double c1 { get; set; }
        public double c2 { get; set; }
        public double penalty_weight { get; set; }
    }

    public class PvCost
    {
        public string comment { get; set; }
        public double MC_PV { get; set; }
        public double cost_PV { get; set; }
    }


    public class AvmIIIIndicatorRule
    {
        public int ruleId { get; set; }

        public string indicatorName { get; set; }
        public string groupName { get; set; }
        public string indicatorNameFiliter { get; set; }

        public string variable { get; set; }

        public bool limit { get; set; }

        public List<string> arrIndicator { get; set; }  // 前端是 undefined → 用 List

        public string stepId { get; set; }

        public double trimBegin { get; set; }
        public double trimEnd { get; set; }

        public string algorithm { get; set; }

        public string variableId { get; set; }

        public DateTime startTime { get; set; }
        public DateTime endTime { get; set; }

        public double USL { get; set; }
        public double LSL { get; set; }
        public double UCL { get; set; }
        public double LCL { get; set; }

        public string conModel { get; set; }
        public double conSettingValue { get; set; }

        public string specModel { get; set; }
        public double specSettingValue { get; set; }
    }

}
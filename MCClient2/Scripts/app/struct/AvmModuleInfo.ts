


class ModuleParameter {
    ModuleIndicatorRule: ModuleIndicatorRule = new ModuleIndicatorRule();
    Dqiy: DQIy = new DQIy();
    BPNN: BPNN = new BPNN();
    RI: RI = new RI();
    Measurement: Measurement = new Measurement();
    KSS: KSS = new KSS();
    Refresh: Refresh = new Refresh();
}

class ModuleIndicatorRule {
    EK: Array<number> = [];
    IndicatorUSL: Array<number> = [];
    IndicatorUCL: Array<number> = [];
    IndicatorLCL: Array<number> = [];
    IndicatorLSL: Array<number> = [];
}

class Measurement {
    Target: string;
    USL: string;
    LSL: string;
    UCL: string;
    LCL: string;
}

class DQIy {
    DQIySwitch: number;
    PhaseI_Error_Threshold: number;
}

class RI {
    Tolerant_MaxError: string;
    TolerableMaxErr_StdOpen: string;
    TolerableMaxErr_StdRate: string;
    LookAheadCount: string;
}

class KSS {
    InSelectAlgorithm: string;
    ModelExpansionOpen: number;
    ModelExpansionSize: number;
    ModifyYOpen: number;
    AdjustYScale: number;
}

class BPNN {
    InEpochsRange: Array<number> = [];
    InMomTermRange: Array<number> = [];
    InAlphaRange: Array<number> = [];
    InNodesRange: Array<number> = []; 

}
//DCP
/*-----------------------------------------------*/

class DCP {
    taskId: string;
    Variablegroups: Variablegroups = new Variablegroups();
}

class Variablegroups {
    io: string;
    metatable: string;
    variablegroupname: string;
    filename: string;
    variables: Array<variables> = new Array<variables>();
}

class variables {
    variableid: string;
    variablename: string;
    isseparator: number;
    separatingvalues: Array<any> = [];
}

class Feature {
    filterrules: filterrules = new filterrules();
    indicatorrules: indicatorrules = new indicatorrules();
}

class filterrules {
    ruleid: number;
    variableid: number | string;
    separatingvalues: string;
    trimbegin: number;
    trimend: number;
    rulename: string;
}

class indicatorrules {
    ruleid: number;
    filterruleid: number;
    algorithm: string;
    rulename: string;
}

class pointrules {
    ruleid: number;
    variableid: number;
}


//CNN
class AvmAutoEncoderInfo {
    filters: Array<any> = [];
    kernel_size: Array<any> = [];
    activation: string;
    pool_size: Array<any> = [];
    epoch: Array<any> = [];
    learningrate: Array<any> = [];
    patience: Array<any> = [];
    batch: Array<any> = [];
    dropout: Array<any> = [];
    moment: Array<any> = [];
    tune_frequency: Array<any> = [];
    model_frequency: Array<any> = [];
    virtual_cassette: Array<any> = [];
    DMW_switch: Array<any> = [];
    Refresh: Refresh = new Refresh();
}

class Refresh {
    forceRefresh: number;
}

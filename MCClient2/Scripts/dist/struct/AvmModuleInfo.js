class ModuleParameter {
    constructor() {
        this.ModuleIndicatorRule = new ModuleIndicatorRule();
        this.Dqiy = new DQIy();
        this.BPNN = new BPNN();
        this.RI = new RI();
        this.Measurement = new Measurement();
        this.KSS = new KSS();
        this.Refresh = new Refresh();
    }
}
class ModuleIndicatorRule {
    constructor() {
        this.EK = [];
        this.IndicatorUSL = [];
        this.IndicatorUCL = [];
        this.IndicatorLCL = [];
        this.IndicatorLSL = [];
    }
}
class Measurement {
}
class DQIy {
}
class RI {
}
class KSS {
}
class BPNN {
    constructor() {
        this.InEpochsRange = [];
        this.InMomTermRange = [];
        this.InAlphaRange = [];
        this.InNodesRange = [];
    }
}
//DCP
/*-----------------------------------------------*/
class DCP {
    constructor() {
        this.Variablegroups = new Variablegroups();
    }
}
class Variablegroups {
    constructor() {
        this.variables = new Array();
    }
}
class variables {
    constructor() {
        this.separatingvalues = [];
    }
}
class Feature {
    constructor() {
        this.filterrules = new filterrules();
        this.indicatorrules = new indicatorrules();
    }
}
class filterrules {
}
class indicatorrules {
}
class pointrules {
}
//CNN
class AvmAutoEncoderInfo {
    constructor() {
        this.filters = [];
        this.kernel_size = [];
        this.pool_size = [];
        this.epoch = [];
        this.learningrate = [];
        this.patience = [];
        this.batch = [];
        this.dropout = [];
        this.moment = [];
        this.tune_frequency = [];
        this.model_frequency = [];
        this.virtual_cassette = [];
        this.DMW_switch = [];
        this.Refresh = new Refresh();
    }
}
class Refresh {
}
//# sourceMappingURL=AvmModuleInfo.js.map
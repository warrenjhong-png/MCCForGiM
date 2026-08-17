var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class RawData {
    constructor() {
        this.algorithms = [{ name: "Mean" },
            { name: "Min" },
            { name: "Max" },
            { name: "Range" },
            { name: "Std" },
            { name: "Slope" },
            { name: "Counter" }];
    }
}
class RawDataSeries {
}
class IndicatorRule {
}
class Spec {
}
class Con {
}
class Rawdata {
}
var RawDataMethod;
(function (RawDataMethod) {
    function spec(specManual, specSigma, specPercentage, arrIndicator, _this) {
        return __awaiter(this, void 0, void 0, function* () {
            let spec = new Spec();
            if (specManual) {
                spec.USL = _this.usl;
                spec.LSL = _this.lsl;
            }
            if (specSigma) {
                let arrStdMean = yield DataCollection.GetIndicator("Mean", arrIndicator);
                let _std = yield DataCollection.GetIndicator("Std", arrIndicator);
                spec.USL = arrStdMean != "NaN" ? arrStdMean + _this.specSigmaValue * _std : NaN;
                spec.LSL = arrStdMean != "NaN" ? arrStdMean - _this.specSigmaValue * _std : NaN;
            }
            if (specPercentage) {
                let arrStdMean = yield DataCollection.GetIndicator("Mean", arrIndicator);
                spec.USL = arrStdMean + _this.specPercentageValue / 100 * arrStdMean;
                spec.LSL = arrStdMean - _this.specPercentageValue / 100 * arrStdMean;
            }
            return spec;
        });
    }
    RawDataMethod.spec = spec;
    function con(conManual, conSigma, conPercentage, arrIndicator, _this) {
        return __awaiter(this, void 0, void 0, function* () {
            let con = new Con();
            if (conManual) {
                con.UCL = _this.ucl;
                con.LCL = _this.lcl;
            }
            if (conSigma) {
                let arrStdMean = yield DataCollection.GetIndicator("Mean", arrIndicator);
                let _std = yield DataCollection.GetIndicator("Std", arrIndicator);
                con.UCL = arrStdMean != "NaN" ? arrStdMean + _this.conSigmaValue * _std : NaN;
                con.LCL = arrStdMean != "NaN" ? arrStdMean - _this.conSigmaValue * _std : NaN;
            }
            if (conPercentage) {
                let arrStdMean = yield DataCollection.GetIndicator("Mean", arrIndicator);
                con.UCL = arrStdMean + _this.conPercentageValue / 100 * arrStdMean;
                con.LCL = arrStdMean - _this.conPercentageValue / 100 * arrStdMean;
            }
            return con;
        });
    }
    RawDataMethod.con = con;
})(RawDataMethod || (RawDataMethod = {}));
var DCPCheck;
(function (DCPCheck) {
    function variableIdCheck(variablegroupsDCP, filterrulesDCP) {
        for (let rule = 0; rule < filterrulesDCP.length; rule++) {
            //find variable id
            let id = filterrulesDCP[rule].variableid;
            for (let variable = 0; variable < variablegroupsDCP.length; variable++) {
                variablegroupsDCP[variable].variables.filter((f) => {
                    if (filterrulesDCP[rule].rulename.indexOf(f.variablename) > -1 && id != f.variableid && f.isseparator == 0) {
                        filterrulesDCP[rule].variableid = f.variableid;
                        return;
                    }
                });
            }
        }
        return filterrulesDCP;
    }
    DCPCheck.variableIdCheck = variableIdCheck;
})(DCPCheck || (DCPCheck = {}));
//# sourceMappingURL=RawDataPreprocess.js.map
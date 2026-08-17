class RawData {
    variableGroups: Array<string>;
    variables: Array<string>;
    chartOption: Array<string>;
    algorithms: Array<any> =
        [{ name: "Mean" },
        { name: "Min" },
        { name: "Max" },
        { name: "Range" },
        { name: "Std" },
        { name: "Slope" },
        { name: "Counter" }];
}

class RawDataSeries {
    Data: Array<any>;
    Id: string;
    Step: string;
    Timetag: Date[];
}

class IndicatorRule {
    groupName: string;
    ruleId: number;
    indicatorNameFiliter: string;
    variable: string;
    indicatorName: string;
    limit: boolean;
    arrIndicator: any;
    stepId: string;
    trimBegin: string;
    trimEnd: string;
    algorithm: string;
    variableId: any;
    startTime: Date;
    endTime: Date;
    USL: number;
    LSL: number;
    UCL: number;
    LCL: number;
    conModel: string;
    conSettingValue: number;
    specModel: string;
    specSettingValue: number;
}

class Spec {
    USL: number;
    LSL: number;
}

class Con {
    UCL: number;
    LCL: number;
}

class Rawdata {
    pieceid: string;
    step: string;
}

namespace RawDataMethod {
    export async function spec(specManual: boolean, specSigma: boolean, specPercentage: boolean,
        arrIndicator: Array<any>, _this: any) {
        let spec: Spec = new Spec();
            if (specManual) {
                spec.USL = _this.usl;
                spec.LSL = _this.lsl;
            }
        if (specSigma) {
            let arrStdMean = await DataCollection.GetIndicator("Mean", arrIndicator);
            let _std: any = await DataCollection.GetIndicator("Std", arrIndicator);
                spec.USL = arrStdMean != "NaN" ? arrStdMean + _this.specSigmaValue * _std : NaN;
                spec.LSL = arrStdMean != "NaN" ? arrStdMean - _this.specSigmaValue * _std : NaN;
            }
        if (specPercentage) {
            let arrStdMean = await DataCollection.GetIndicator("Mean", arrIndicator);
                spec.USL =  arrStdMean + _this.specPercentageValue / 100 * arrStdMean;
                spec.LSL =  arrStdMean - _this.specPercentageValue / 100 * arrStdMean;
            }            
        return spec;

    }
    export async function con(conManual: boolean, conSigma: boolean, conPercentage: boolean,
        arrIndicator: Array<any>, _this: any) {
        let con: Con = new Con();
        if (conManual) {
            con.UCL = _this.ucl;
            con.LCL = _this.lcl;
        }
        if (conSigma) {
            let arrStdMean = await DataCollection.GetIndicator("Mean", arrIndicator);
            let _std: any = await DataCollection.GetIndicator("Std", arrIndicator);
            con.UCL = arrStdMean != "NaN" ? arrStdMean + _this.conSigmaValue * _std : NaN;
            con.LCL = arrStdMean != "NaN" ? arrStdMean - _this.conSigmaValue * _std : NaN;
        }
        if (conPercentage) {
            let arrStdMean = await DataCollection.GetIndicator("Mean", arrIndicator);
            con.UCL = arrStdMean + _this.conPercentageValue / 100 * arrStdMean;
            con.LCL = arrStdMean - _this.conPercentageValue / 100 * arrStdMean;
        }
        return con;

    } 

}

namespace DCPCheck{
    export function variableIdCheck(variablegroupsDCP: Array<Variablegroups>, filterrulesDCP: Array<filterrules>) {

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
}
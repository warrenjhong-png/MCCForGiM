class Variables {
    Name: string;
    MetaName: string;
    Type: string;
    VariableNames: Array<VariableName> = new Array<VariableName>();
    HasStep: number;
    StepID: StepID = new StepID();
}

class StepID {
    Name: string;
    Data: Array<string> = [];
}

class VariableName{
    isStep: boolean = false;
    Name: string = null;
    FieldName: string = null;
    VariableId: string = null;
}

namespace VariablesMethod {
    export function GetVariableSelect(variables: Array<Variables>) {
        let result: Array<Variables> = [];
        let index = 1;
        for (let i = 0; i < variables.length; i++) {         
            let variable: Variables = new Variables();
            
            let className = Method.generateClassName(variables[i].Name);
            let classNameItem = "." + className + "-checkItem";

            if ($(classNameItem + ":checked").length > 0) {
                variable.HasStep = variables[i].HasStep;
                variable.MetaName = variables[i].MetaName;
                variable.Name = variables[i].Name;
                variable.Type = variables[i].Type;
                $(classNameItem).each(function () {
                    if ($(this).prop("checked")) {
                        let variableName: VariableName = new VariableName();
                        variableName.Name = $(this).attr("name");
                        variableName.VariableId = index.toString();
                        variable.VariableNames.push(variableName);
                        index++;
                    }
                });

                if (variables[i].HasStep) {
                    let stepIdItem = "." + className + "-stepIdItem";
                    let stepIdAll = "." + className + "-stepIdAll";
                    let step: StepID = new StepID();
                    if ($(stepIdItem + ":checked").length > 0) {
                        $(stepIdItem + ":checked").each(function () {
                            if ($(this).prop("checked")) {
                                step.Name = variables[i].StepID.Name;
                                step.Data.push($(this).attr("step"));
                            }
                        });
                        let variableName: VariableName = new VariableName();
                        variableName.isStep = true;
                        variableName.Name = variables[i].StepID.Name;
                        variableName.VariableId = index.toString();
                        variable.VariableNames.push(variableName);
                        index++;
                        variable.StepID = step;
                    }
                }
                result.push(variable);
               
            }         
        }
        return result;
    }
}

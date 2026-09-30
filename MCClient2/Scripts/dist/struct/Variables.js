class Variables {
    constructor() {
        this.VariableNames = new Array();
        this.StepID = new StepID();
    }
}
class StepID {
    constructor() {
        this.Data = [];
    }
}
class VariableName {
    constructor() {
        this.isStep = false;
        this.Name = null;
        this.FieldName = null;
        this.VariableId = null;
    }
}
var VariablesMethod;
(function (VariablesMethod) {
    function GetVariableSelect(variables) {
        let result = [];
        let index = 1;
        for (let i = 0; i < variables.length; i++) {
            let variable = new Variables();
            let className = Method.generateClassName(variables[i].Name);
            let classNameItem = "." + className + "-checkItem";
            if ($(classNameItem + ":checked").length > 0) {
                variable.HasStep = variables[i].HasStep;
                variable.MetaName = variables[i].MetaName;
                variable.Name = variables[i].Name;
                variable.Type = variables[i].Type;
                $(classNameItem).each(function () {
                    if ($(this).prop("checked")) {
                        let variableName = new VariableName();
                        variableName.Name = $(this).attr("name");
                        variableName.VariableId = index.toString();
                        variable.VariableNames.push(variableName);
                        index++;
                    }
                });
                if (variables[i].HasStep) {
                    let stepIdItem = "." + className + "-stepIdItem";
                    let stepIdAll = "." + className + "-stepIdAll";
                    let step = new StepID();
                    if ($(stepIdItem + ":checked").length > 0) {
                        $(stepIdItem + ":checked").each(function () {
                            if ($(this).prop("checked")) {
                                step.Name = variables[i].StepID.Name;
                                step.Data.push($(this).attr("step"));
                            }
                        });
                        let variableName = new VariableName();
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
    VariablesMethod.GetVariableSelect = GetVariableSelect;
})(VariablesMethod || (VariablesMethod = {}));
//# sourceMappingURL=Variables.js.map
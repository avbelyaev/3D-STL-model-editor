/**
 * Created by anthony on 31.05.2018.
 */


class GuiRenderer {
    constructor() {
        // empty
    }

    static renderAxis() {
        const parentalControlElem = document.getElementById(H2JS_CONTROL_ADJUSTMENT);
        const controlElem = parentalControlElem.getElementsByClassName(H2JS_CONTROL_ELEMENT)[0];

        const axisGroupName = "axe";
        GuiRenderer.axis().reverse().forEach(axis => {
            const axisItem = GuiRenderer.createAxisItem(axis.label, axis.id, axisGroupName);
            controlElem.prepend(axisItem);
        })
    }

    static renderOperations() {
        const controlOperationElem = document.getElementById(H2JS_CONTROL_OPERATION);
        const operationListElement = controlOperationElem.getElementsByClassName(H2JS_CONTROL_ELEMENT)[0];

        const operationsGroupName = "operations";
        const operations = ModelSubmitter.operations();
        operations.reverse().forEach(op => {
            const opItem = GuiRenderer.createOperationItem(op.label, op.id, operationsGroupName);
            operationListElement.prepend(opItem);
        })
    }

    static createOperationItem(opLabel, opId, operationGroupName) {
        let selectedOperationButton = document.createElement('input');
        selectedOperationButton.type = 'radio';
        selectedOperationButton.name = operationGroupName;
        selectedOperationButton.setAttribute('checked', 'checked');

        const operationLabel = document.createElement('label');
        operationLabel.setAttribute('class', H2JS_CONTROL_OPERATION_ITEM_TITLE);
        operationLabel.innerHTML += opLabel;

        let operationItem = document.createElement('div');
        operationItem.setAttribute('class', H2JS_CONTROL_OPERATION_ITEM);
        // operationItem.setAttribute('onclick', 'updateFigure()');
        operationItem.appendChild(selectedOperationButton);
        operationItem.appendChild(operationLabel);
        operationItem.setAttribute('val', opId);

        return operationItem;
    }

    static createAxisItem(axisLabel, axisId, axisGroupName) {
        return axisLabel;
    }

    static axis() {
        return [
            {
                id: "x",
                label: "X"
            },
            {
                id: "y",
                label: "Y"
            },
            {
                id: "z",
                label: "Z"
            }
        ];
    }
}

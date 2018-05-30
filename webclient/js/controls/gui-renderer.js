/**
 * Created by anthony on 31.05.2018.
 */



class GuiRenderer {
    constructor() {
        // empty
    }

    static renderOperations() {
        const controlOperationElem = document.getElementById(H2JS_CONTROL_OPERATION);
        const operationListElement = controlOperationElem.getElementsByClassName(H2JS_CONTROL_ELEMENT)[0];

        const operationsGroupName = "operations";
        const operations = ModelSubmitter.operations();
        operations.forEach(op => {
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
        operationLabel.innerHTML += opLabel;

        let operationItem = document.createElement('div');
        operationItem.setAttribute('class', H2JS_CONTROL_OPERATION_ITEM);
        // operationItem.setAttribute('onclick', 'updateFigure()');
        operationItem.appendChild(selectedOperationButton);
        operationItem.appendChild(operationLabel);
        operationItem.setAttribute('val', opId);

        return operationItem;
    }
}

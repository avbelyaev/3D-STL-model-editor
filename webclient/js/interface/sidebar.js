/**
 * Created by anthony on 31.05.2018.
 */


class Sidebar {
    constructor() {
        // empty
    }

    static renderAxis() {
        const parentalControlElem = document.getElementById(H2JS_CONTROL_ADJUSTMENT);
        const controlElem = parentalControlElem.getElementsByClassName(H2JS_CONTROL_ELEMENT)[0];

        // reverse array since items need to be prepended (not appended)
        Sidebar.axis().reverse().forEach(axis => {
            const axisItem = Sidebar.createAxisItem(axis.label, axis.id, "axe");
            controlElem.prepend(axisItem);
        })
    }

    static renderOperations() {
        const controlOperationElem = document.getElementById(H2JS_CONTROL_OPERATION);
        const operationListElement = controlOperationElem.getElementsByClassName(H2JS_CONTROL_ELEMENT)[0];

        Operations.operations().reverse().forEach(op => {
            const opItem = Sidebar.createOperationItem(op.label, op.id, "operations");
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

    static initLogger() {
        const logElement = document.getElementsByClassName(H2JS_LOG)[0];
        const logContentHolder = logElement.getElementsByClassName(H2JS_LOG_CONTENT)[0];

        // make logger resizable
        const logElementClass = '.' + H2JS_LOG;
        interact(logElementClass)
            .resizable({
                edges: {
                    top: true,
                    bottom: false
                },
                restrictEdges: {
                    outer: 'parent',
                    endOnly: true,
                },
                restrictSize: {
                    min: {
                        height: 170
                    },
                    max: {
                        height: 728
                    }
                }
            })
            .on('resizemove', function (event) {
                const target = event.target;
                let y = (parseFloat(target.getAttribute('data-y')) || 0);

                // update the element's style
                target.style.height = event.rect.height + 'px';

                // translate when resizing from top or left edges
                y += event.deltaRect.top;

                target.style.webkitTransform = target.style.transform =
                    'translate(' + 0 + 'px,' + y + 'px)';

                target.setAttribute('data-y', y);
            });

        return logContentHolder;
    };
}

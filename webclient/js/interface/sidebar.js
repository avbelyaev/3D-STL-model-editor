/**
 * Created by anthony on 02.06.2018.
 */

const AXIS = Object.freeze({
    X: 0,
    Y: 1,
    Z: 2
});

class Sidebar {
    constructor() {
        this.axis = [false, false, false];
        this.emptyPlaceholderAlreadyRemoved = false;
    }

    // ===================================
    // ----------- Adjustment ------------
    // ===================================
    toggleAxis(axis) {
        this.axis[axis] = !this.axis[axis];
    }

    toggleScale() {
        const scaleElem = document.getElementById(H2JS_CONTROL_ADJUSTMENT_SCALE);
        figureController.selectedFigure.scaleBy(scaleElem.value);
    }

    toggleAngle() {
        const angleElem = document.getElementById(H2JS_CONTROL_ADJUSTMENT_ANGLE);
        const figureAngleDeg = angleElem.value;

        const rotationVec = [
            sidebar.axis[0] ? figureAngleDeg : 0,
            sidebar.axis[1] ? figureAngleDeg : 0,
            sidebar.axis[2] ? figureAngleDeg : 0
        ];
        figureController.selectedFigure.rotateBy(rotationVec, null);
    }

    toggleVisibility() {
        figureController.selectedFigure.visible = !figureController.selectedFigure.visible;
    }

    // this function is used in figure-controller. its a handle for models-list item
    updateOperationAndSelectedModel() {
        const modelAElem = document.getElementsByClassName(H2JS_CONTROL_OPERATION_MODEL_A)[0];
        modelAElem.innerText = 0 !== figureController.processedFigures.length
            ? `Модель 'A': ${figureController.processedFigures[0]}`
            : 'Модель \'A\' не выбрана';
        const modelBElem = document.getElementsByClassName(H2JS_CONTROL_OPERATION_MODEL_B)[0];
        modelBElem.innerText = 1 < figureController.processedFigures.length
            ? `Модель 'B': ${figureController.processedFigures[1]}`
            : 'Модель \'B\' не выбрана';
        const selectedModelElem = document.getElementsByClassName(H2JS_CONTROL_ADJUSTMENT_CURRENT_MODEL)[0];
        selectedModelElem.innerText = null !== figureController.selectedFigure
            ? `Модель: ${figureController.selectedFigure.id}`
            : 'Нет активной модели';
    }

    removePlaceholderOnEmptyList() {
        if (!this.emptyPlaceholderAlreadyRemoved) {
            const elem = document.getElementsByClassName(H2JS_CONTROL_SELECTION_EMPTY)[0];
            elem.innerText = "";
        }
    }
}

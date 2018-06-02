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
    }

    // ===================================
    // ----------- Adjustment ------------
    // ===================================
    toggleAxis(axis) {
        this.axis[axis] = !this.axis[axis];
    }

    toggleScale() {
        const scaleElem = document.getElementById(H2JS_CONTROL_ADJUSTMENT_SCALE);
        figureScale = scaleElem.value;

        figureController.selectedFigure.scaleBy(figureScale);
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
}

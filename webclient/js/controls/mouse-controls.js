/**
 * Created by anthony on 06.02.2018.
 */

const MOUSE_BTN_LEFT = 0;
const MOUSE_BTN_RIGHT_CHROME = 2;

class MouseControls {
    constructor(canvas) {
        // when this class'es functions are used as event handlers,
        // 'this' in these some functions start pointing to document, some to canvas
        // so mouse control's vars are static for encapsulation purpose
        MouseControls.mouseDown = false;
        MouseControls.lastMouseX = 0;
        MouseControls.lastMouseY = 0;

        MouseControls.__updateEventListeners(canvas);
    }

    static handleMouseDown(event) {
//        console.log("mouse down");

        MouseControls.mouseDown = true;
        MouseControls.lastMouseX = parseInt(event.clientX);
        MouseControls.lastMouseY = parseInt(event.clientY);

//        console.log("lastX: " + MouseControls.lastMouseX + " lastY: " + MouseControls.lastMouseY);
    };

    static handleMouseUp(event) {
//        console.log("mouse up");
        MouseControls.mouseDown = false;
//        console.log("lastX: " + MouseControls.lastMouseX + " lastY: " + MouseControls.lastMouseY);
    };

    static handleMouseMove(event) {
        if (!MouseControls.mouseDown) {
            return;
        }
        const newX = parseInt(event.clientX);
        const newY = parseInt(event.clientY);

        const deltaX = newX - MouseControls.lastMouseX;
        const deltaY = newY - MouseControls.lastMouseY;

        if (MOUSE_BTN_LEFT === event.button) {
            if (event.shiftKey) {
                // apply to figure
                figureController.selectedFigure.translateByX(deltaX);
                figureController.selectedFigure.translateByZ(deltaY);

            } else {
                // apply to camera
                cam.updateHorizontalAngleDeg(Camera.incValueFunction(-1 * deltaX / CAM_HORIZONTAL_ROTATION_DECELERATION));
                cam.updateVerticalAngleDeg(Camera.incValueFunction( -1 * deltaY / CAM_VERT_ROTATION_DECELERATION));
            }

        } else if (MOUSE_BTN_RIGHT_CHROME === event.button) {
            console.log('right button move');
        }

        MouseControls.lastMouseX = newX;
        MouseControls.lastMouseY = newY;
    };

    static handleMouseWheel(event) {
        // only handle mouseWheel events inside canvas
        if (H2JS_CANVAS === event.target.id) {
            let delta = event.wheelDelta ? event.wheelDelta : -event.detail;

            if (event.shiftKey) {
                // apply to figure
                figureController.selectedFigure.translateByY(-1 * parseInt(delta));

            } else {
                // apply to camera
                cam.updateDistance(Camera.incValueFunction(delta / CAM_DIST_CHANGE_DECELERATION));
            }
        }
    };

    static __updateEventListeners(canvas) {
        canvas.onmousedown = MouseControls.handleMouseDown;
        document.onmouseup = MouseControls.handleMouseUp;
        document.onmousemove = MouseControls.handleMouseMove;
        document.addEventListener('mousewheel', MouseControls.handleMouseWheel);
        // disable context menu pop up
        document.addEventListener('contextmenu', function (e) {
            return false;
        });
    };
}

/**
 * Created by anthony on 06.02.2018.
 */

class MouseControls {
    constructor(canvas) {
        // when this class'es functions are used as event handlers,
        // 'this' in these some functions start pointing to document, some to canvas
        // so mouse control's vars are static for encapsulation purpose
        MouseControls.mouseDown = false;
        MouseControls.lastMouseX = 0;
        MouseControls.lastMouseY = 0;

        MouseControls.setEventListeners(canvas);
    }

    static handleMouseDown(event) {
        console.log("mouse down");

        MouseControls.mouseDown = true;
        MouseControls.lastMouseX = parseInt(event.clientX);
        MouseControls.lastMouseY = parseInt(event.clientY);
        console.log("lastX: " + MouseControls.lastMouseX + " lastY: " + MouseControls.lastMouseY);
    };

    static handleMouseUp(event) {
        console.log("mouse up");
        MouseControls.mouseDown = false;
        console.log("lastX: " + MouseControls.lastMouseX + " lastY: " + MouseControls.lastMouseY);
    };

    static handleMouseMove(event) {
        if (!MouseControls.mouseDown) {
            return;
        }
        const newX = parseInt(event.clientX);
        const newY = parseInt(event.clientY);

        const deltaX = newX - MouseControls.lastMouseX;
        const deltaY = newY - MouseControls.lastMouseY;

        if (MouseControls.BTN_LEFT === event.button) {
            if (event.shiftKey) {
                figureTranslation[0] += deltaX;
                figureTranslation[2] += deltaY;

            } else {
                camAngleDeg -= deltaX / 5;

                camHeight += deltaY;
                if (camHeight > 600) {
                    camHeight = 600;
                }
                if (camHeight < -600) {
                    camHeight = -600;
                }
            }

        } else if (MouseControls.BTN_RIGHT === event.button) {
            console.log('right button move');
        }

        MouseControls.lastMouseX = newX;
        MouseControls.lastMouseY = newY;
    };

    static handleMouseWheel(event) {
        let delta = event.wheelDelta ? event.wheelDelta : -event.detail;
        camDistance += parseInt(delta) / 10;
        if (camDistance > 500) {
            camDistance = 500;
        }
        if (camDistance < 50) {
            camDistance = 50;
        }
    };

    static setEventListeners(canvas) {
        canvas.onmousedown = MouseControls.handleMouseDown;
        document.onmouseup = MouseControls.handleMouseUp;
        document.onmousemove = MouseControls.handleMouseMove;
        document.addEventListener('mousewheel', MouseControls.handleMouseWheel);
        // disable context menu pop up
        document.addEventListener('contextmenu', function (e) {
            return false;
        });
    };

    static get BTN_LEFT() {
        return 0;
    }

    static get BTN_RIGHT() {
        // chrome's right button id
        // other browsers can have different id
        return 2;
    }
}

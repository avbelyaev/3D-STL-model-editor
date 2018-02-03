/**
 * Created by anthony on 14.01.2018.
 */

const initGL = () => {
    const canvas = document.getElementById("glCanvas");
    canvas.width = 1000;
    canvas.height = 700;

    const gl = canvas.getContext("webgl");
    if (!gl) {
        throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
    }

    canvas.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    document.onmousemove = handleMouseMove;
    document.addEventListener('mousewheel', handleMouseWheel);
    document.addEventListener('click', handleKeyboard);
    document.oncontextmenu = function (e) {
        //prevent context menu pop up
        return false;
    };

    return gl;
};

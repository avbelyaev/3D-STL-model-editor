/**
 * Created by anthony on 14.01.2018.
 */

const initGL = () => {
    const canvas = document.getElementById("glCanvas");
    canvas.width = 1000;
    canvas.height = 700;

    const gl = canvas.getContext("webgl");

    canvas.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    document.onmousemove = handleMouseMove;

    if (!gl) {
        throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");

    } else {
        return gl;
    }
};

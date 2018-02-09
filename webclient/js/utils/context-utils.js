/**
 * Created by anthony on 14.01.2018.
 */

const initGLControls = () => {
    const canvas = document.getElementById("glCanvas");
    canvas.width = 1000;
    canvas.height = 700;

    const gl = canvas.getContext("webgl");
    if (!gl) {
        throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
    }

    const controls = new MouseControls(canvas);
    controls.enabled = true;

    return gl;
};

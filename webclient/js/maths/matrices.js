/**
 * Created by anthony on 21.01.2018.
 */

/**
 * moves everything from model space (coordinates relative to model) into world space
 * @returns model matrix
 */
const makeModelMatrix = (isMovable, scaleVec, translationVec, rotationVec) => {
    const modelMatrix = mat4.create();

    // scale
    mat4.scale(modelMatrix, modelMatrix, scaleVec);

    // move
    const figureMove = isMovable ? translationVec : [0, 0, 0];
    mat4.translate(modelMatrix, modelMatrix, figureMove);

    // rotate
    const angleRadiansVec = isMovable ? rotationVec : 0;
    mat4.rotateX(modelMatrix, modelMatrix, angleRadiansVec[0]);
    mat4.rotateY(modelMatrix, modelMatrix, -angleRadiansVec[1]);
    mat4.rotateZ(modelMatrix, modelMatrix, angleRadiansVec[2]);

    return modelMatrix;
};

/**
 * generates human-like POV. moves everything from world space into camera space where camera is in the center
 * and all objects lay in [0, -inf] by Z
 * @returns view matrix
 */
const makeViewMatrix = () => {
    let viewMatrix;
    let eye = cam.positionVec;
    let lookAtPosition = cam.lookAtPos;
    viewMatrix = mat4.lookAtPos(mat4.create(), eye, lookAtPosition, cam.top);

    return viewMatrix;
};

/**
 * generates matrix to move everything from world space into clip space.
 * think of it as about transforming the whole scene into cube ([-1,-1,-1]..[1,1,1])
 * which is later rendered into 2D pane
 * @returns projection matrix
 */
const makeProjectionMatrix = () => {
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 1;
    const zFar = 2500;
    const fieldOfViewRadians = Math.PI / 3;

    const perspective = mat4.create();
    mat4.perspective(perspective, fieldOfViewRadians, aspect, zNear, zFar);

    return perspective;
};


const makeMVPMatrix = (scaleVec, translationVec, rotationVec) => {
    let model = makeModelMatrix(true, scaleVec, translationVec, rotationVec);
    let view = makeViewMatrix();
    let projection = makeProjectionMatrix();

    const mvp = mat4.create();
    mat4.multiply(mvp, view, model); // modelView
    mat4.multiply(mvp, projection, mvp); // modelViewProjection

    return mvp;
};


const multiplyMat4ByVec4 = (m4, v4) => {
    const c = vec4.create();
    let j = 0;
    for (let i = 0; i < 4; i++) {
        j = i;
        c[i] = m4[j]*v4[0] + m4[j+=4]*v4[1] + m4[j+=4]*v4[2] + m4[j+=4]*v4[3];
    }
    return c;
};

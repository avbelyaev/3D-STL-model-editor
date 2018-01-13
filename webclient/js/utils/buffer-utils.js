/**
 * Created by anthony on 14.01.2018.
 */

const countElem = (arrLength, numComponents) => {
    let numElem = arrLength / numComponents;

    if (Math.floor(numElem) !== Math.ceil(numElem)) {
        throw new Error('Error occurred while evaluating element num');

    } else {
        numElem = Math.round(numElem);
    }
    return numElem;
};


const bindBuffer = (vertexAttribInfo, bufferInfo) => {
    gl.enableVertexAttribArray(vertexAttribInfo);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.buffer);

    const numComponents = bufferInfo.numComponents;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;

    gl.vertexAttribPointer(
        vertexAttribInfo,
        numComponents,
        type,
        normalize,
        stride,
        offset);
};

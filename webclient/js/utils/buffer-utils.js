/**
 * Created by anthony on 14.01.2018.
 */

const countNumElem = (positionsArray, numComponents) => {
    let numElem = positionsArray.length / numComponents;

    if (Math.floor(numElem) !== Math.ceil(numElem)) {
        throw new Error('Error occurred while evaluating element num');

    } else {
        numElem = Math.round(numElem);
    }
    return numElem;
};


const checkAgainstColors = (numElementsByPositions, colorsArray) => {
    const colorNumComponents = 3;
    let numElemByColors = countNumElem(colorsArray, colorNumComponents);

    if (numElementsByPositions !== numElemByColors) {
        throw new Error('Not all vertices have colors (vec3)!');
    }
};


const bindBufferToAttribute = (attribArray, bufferInfo) => {
    gl.enableVertexAttribArray(attribArray);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.buffer);

    const numComponents = bufferInfo.numComponents;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;

    // binds current ARRAY_BUFFER (nearest one) to attribute
    gl.vertexAttribPointer(
        attribArray,
        numComponents,
        type,
        normalize,
        stride,
        offset);
};


const createBufferInfo = (gl, array, numComponents) => {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), gl.STATIC_DRAW);

    return {
        buffer,
        numComponents
    }
};

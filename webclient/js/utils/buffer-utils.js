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
    const type = bufferInfo.componentType;
    const normalize = bufferInfo.normalize;
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

const enableAndBindBuffer = (attribArray, bufferInfo) => {
    gl.enableVertexAttribArray(attribArray);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.buffer);
};


//TODO shitcode!!!!
const createBufferInfo = (gl, array, numComponents, componentType) => {
    const arr = 'float' === componentType
        ? new Float32Array(array)
        : new Uint8Array(array);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW);

    return {
        buffer,
        numComponents,
        componentType: 'float' === componentType ? gl.FLOAT : gl.UNSIGNED_BYTE,
        normalize: 'float' !== componentType
    }
};

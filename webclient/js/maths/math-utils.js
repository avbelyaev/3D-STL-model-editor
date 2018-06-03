/**
 * Created by anthony on 14.01.2018.
 */

function getRandom() {
    return Math.random();
}

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const degToRad = (x) => x * Math.PI / 180;


const reduceArrayToTriples = (arr) => {
    if (!arr) {
        throw Error('array is null!');
    }

    const triples = new Array(Math.round(arr.length / 3));
    let j = 0;
    for (let i = 0; i <= arr.length - 3; i += 3) {
        triples[j++] = [arr[i], arr[i + 1], arr[i + 2]];
    }
    return triples;
};

const countNormal = (p1, p2, p3) => {
    const ax = p2[0] - p1[0];
    const ay = p2[1] - p1[1];
    const az = p2[2] - p1[2];

    const bx = p3[0] - p1[0];
    const by = p3[1] - p1[1];
    const bz = p3[2] - p1[2];

    let nx = (ay * bz) - (az * by);
    let ny = (az * bx) - (ax * bz);
    let nz = (ax * by) - (ay * bx);

    // Normalize (divide by root of dot product)
    const l = Math.sqrt(nx*nx + ny*ny + nz*nz);
    nx /= l;
    ny /= l;
    nz /= l;

    return [nx, ny, nz];
};
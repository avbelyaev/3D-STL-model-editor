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

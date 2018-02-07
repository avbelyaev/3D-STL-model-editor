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

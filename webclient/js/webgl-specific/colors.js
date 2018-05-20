/**
 * Created by anthony on 17.02.2018.
 */

const COLORS = Object.freeze({
    BLACK: [0, 0, 0],
    WHITE: [255, 255, 255],

    RED: [255, 0, 0],
    GREEN: [0, 255, 0],
    BLUE: [0, 0, 255],

    YELLOW: [255, 255, 0],

    RANDOM: function () {
        return [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)];
    }
});

/**
 * creates an array of colors for each vertex in positionsArray based on colorsArray
 * @param colorsArray
 * @param positionsArray
 * @returns {Array}
 */
const extendColorsToVertices = (colorsArray, positionsArray) => {
    const colorsExtended = [];
    let i = 0;
    const figureVertexNum = positionsArray.length / 3;
    while (i < figureVertexNum) {
        colorsExtended.push(...colorsArray);
        i++;
    }
    return colorsExtended;
};

/**
 * determines if there is a tricolor vector for each vertex (in other words: if each vertex has its color)
 * @param colorsArray
 * @param positionsArray
 * @returns {boolean}
 */
const isOneColored = (colorsArray, positionsArray) => {
    return 3 === colorsArray.length && positionsArray.length !== colorsArray.length;
};

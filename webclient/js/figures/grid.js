/**
 * Created by anthony on 20.05.2018.
 */

class Grid extends Drawable {
    constructor(cellWidth, gridElements, colors, gl, vsSource, fsSource, id) {

        let positions = Grid.__count_grid_positions(cellWidth, gridElements);
        let colorsExtended = extendColorsToVertices(colors, positions);

        super(positions, colorsExtended, gl, vsSource, fsSource, id, DRAWABLES.GRID);
        log(`constructing Grid ${this.id}. Cell w: ${cellWidth}, elements: ${gridElements}`);

        // draw mode
        this.drawMode = gl.LINES;
    }

    draw() {
        if (this.visible) {
            this.gl.useProgram(this.program);

            // vertices
            bindBufferToAttribute(this.attribLocations.vertexPosition, this.positionBufferInfo);

            // colors
            bindBufferToAttribute(this.attribLocations.vertexColor, this.colorBufferInfo);

            // uniforms
            this.__updateMatrices();
            this.gl.uniformMatrix4fv(this.uniformLocations.uModel, false, this.mModel);
            this.gl.uniformMatrix4fv(this.uniformLocations.uView, false, this.mView);
            this.gl.uniformMatrix4fv(this.uniformLocations.uProjection, false, this.mProj);

            // draw
            this.gl.drawArrays(this.drawMode, 0, this.numElements);
        }
    }

    static __count_grid_positions(cellWidth, elementsNum) {
        const positions = [];

        let y = 0;
        const lineLen = cellWidth * elementsNum;

        let i = 0;
        let x = 0;
        while (i < elementsNum + 1) {
            positions.push(x, y, 0);
            positions.push(x, y, lineLen);
            x += cellWidth;
            i++;
        }

        i = 0;
        let z = 0;
        while (i < elementsNum + 1) {
            positions.push(0, y, z);
            positions.push(lineLen, y, z);
            z += cellWidth;
            i++;
        }

        // move center of grid to world center
        const offset = -(cellWidth * elementsNum) / 2;
        i = 0;
        while (i < positions.length - 2) {
            positions[i] += offset;     // x
            // y stays same
            positions[i + 2] += offset; // z

            i += 3;
        }

        return positions;
    }
}

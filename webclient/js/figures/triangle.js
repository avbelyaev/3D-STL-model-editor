/**
 * Created by anthony on 16.02.2018.
 */


class Triangle extends Drawable {
    constructor(gl, vsSource, fsSource, positions, colors) {
        const colorsExtended = 3 === colors.length && positions.length !== colors.length
            ? Triangle.extendColorsToVertices(colors, positions)
            : colors;
        super(gl, vsSource, fsSource, positions, colorsExtended);
        log('constructing Triangle');

        this.drawMode = gl.TRIANGLES;
    }

    static extendColorsToVertices(colors, positions) {
        const colorsExtended = [];
        let i = 0;
        const figureVertexNum = positions.length / 3;
        while (i < figureVertexNum) {
            colorsExtended.push(...colors);
            i++;
        }
        return colorsExtended;
    }

    draw() {
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

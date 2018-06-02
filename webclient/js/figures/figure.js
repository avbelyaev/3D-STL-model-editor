/**
 * Created by anthony on 16.02.2018.
 */


class Figure extends Drawable {
    constructor(positions, colors, gl, vsSource, fsSource, id, type) {
        const colorsExtended = isOneColored(colors, positions)
            ? extendColorsToVertices(colors, positions)
            : colors;

        super(positions, colorsExtended, gl, vsSource, fsSource, id, type);
        log(`constructing Figure ${this.id}`);

        this.drawMode = gl.TRIANGLES;
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
}

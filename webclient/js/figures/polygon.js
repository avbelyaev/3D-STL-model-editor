/**
 * Created by anthony on 16.02.2018.
 */


class Figure extends Drawable {
    constructor(positions, colors, gl, vsSource, fsSource, id) {
        const colorsExtended = isOneColored(colors, positions)
            ? extendColorsToVertices(colors, positions)
            : colors;
        const idWithPrefix = `fig-${id}`;

        super(positions, colorsExtended, gl, vsSource, fsSource, idWithPrefix);
        log(`constructing Figure ${this.id}`);

        this.drawMode = gl.TRIANGLES;
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

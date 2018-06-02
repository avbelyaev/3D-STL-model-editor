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

            // normals
            bindBufferToAttribute(this.attribLocations.vertexNormal, this.normalBufferInfo);

            // uniforms
            this.__updateMatrices();
            this.gl.uniformMatrix4fv(this.uniformLocations.uModel, false, this.mModel);
            this.gl.uniformMatrix4fv(this.uniformLocations.uView, false, this.mView);
            this.gl.uniformMatrix4fv(this.uniformLocations.uProjection, false, this.mProj);
            this.gl.uniform3fv(this.uniformLocations.uReverseLightDirection,
                vec3.normalize([], LIGHT_SOURCE));

            // world matrix == model matrix. but we also need to inverse-transpose world matrix
            const mWorld = mat4.clone(this.mModel);
            const mWorldInverse = mat4.invert([], mWorld);
            const mWorldInverseTranspose = mat4.transpose([], mWorldInverse);
            this.gl.uniformMatrix4fv(this.uniformLocations.uWorldInverseTranspose, false, mWorldInverseTranspose);

            // draw
            this.gl.drawArrays(this.drawMode, 0, this.numElements);
        }
    }
}

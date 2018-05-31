/**
 * Created by anthony on 16.02.2018.
 */


class Figure extends Drawable {
    constructor(positions, colors, gl, vsSource, fsSource, id) {
        const colorsExtended = isOneColored(colors, positions)
            ? extendColorsToVertices(colors, positions)
            : colors;

        super(positions, colorsExtended, gl, vsSource, fsSource, id, DRAWABLES.FIGURE);
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

    static ofInnerRepresentation(data, figureId) {
        const triangles = data['triangles'];

        const positions = [];
        triangles.forEach(t => {
            positions.push(...t['a']);
            positions.push(...t['b']);
            positions.push(...t['c']);

            positions.map(pos => parseInt(pos) * this.posMultiplicationFactor);
        });

        const figure = new Figure(positions, COLORS.RANDOM(), gl, vsSource, fsSource, figureId);
        figure.init();

        return figure;
    }
}

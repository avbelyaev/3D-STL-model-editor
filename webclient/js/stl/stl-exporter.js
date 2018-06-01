/**
 * Created by anthony on 01.06.2018.
 */

// I do not own the code below.
// With all respect to it's authors, it was taken from:
// https://github.com/mrdoob/three.js/blob/master/examples/js/exporters/STLExporter.js
class STLExporter {

    static exportToBinaryStl(figure) {
        const triangles = figure.triangles;
        const vertices = figure.vertices;
        const normals = figure.normals;

        let offset = 80; // skip header

        const bufferLength = triangles.length * 2 + triangles.length * 3 * 4 * 4 + 80 + 4;
        const arrayBuffer = new ArrayBuffer(bufferLength);
        const output = new DataView(arrayBuffer);

        output.setUint32(offset, triangles.length, true);
        offset += 4;

        let normalsIndex = 0;
        let vertexIndex = 0;
        for (let j = 0, jl = triangles.length; j < jl; j++) {

            output.setFloat32(offset, normals[normalsIndex][0], true); // normal
            offset += 4;
            output.setFloat32(offset, normals[normalsIndex][1], true);
            offset += 4;
            output.setFloat32(offset, normals[normalsIndex][2], true);
            offset += 4;

            normalsIndex++;

            for (let k = 0; k < 3; k++) {

                output.setFloat32(offset, vertices[vertexIndex][0], true); // vertices
                offset += 4;
                output.setFloat32(offset, vertices[vertexIndex][1], true);
                offset += 4;
                output.setFloat32(offset, vertices[vertexIndex][2], true);
                offset += 4;

                vertexIndex++;
            }

            output.setUint16(offset, 0, true);
            offset += 2; // attribute byte count

        }

        return output;
    }
}

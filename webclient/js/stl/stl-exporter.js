/**
 * Created by anthony on 01.06.2018.
 */

// I do not own any code below.
// With all respect to it's original authors, it was taken from:
// https://github.com/mrdoob/three.js/blob/master/examples/js/exporters/STLExporter.js
class STLExporter {

    static exportToBinaryStl(figure) {
        let offset = 80; // skip header
        const triangles = figure.stats.trianglesNum;
        const bufferLength = triangles * 2 + triangles * 3 * 4 * 4 + 80 + 4;
        const arrayBuffer = new ArrayBuffer(bufferLength);
        const output = new DataView(arrayBuffer);

        output.setUint32(offset, triangles, true);
        offset += 4;

        //TODO normals should be updated on figure move too!!!!
        // TODO geometry kernels may rely on them

        for (let j = 0, jl = faces.length; j < jl; j++) {

            const face = faces[j];

            vector.copy(face.normal).applyMatrix3(normalMatrixWorld).normalize();

            output.setFloat32(offset, vector.x, true);
            offset += 4; // normal
            output.setFloat32(offset, vector.y, true);
            offset += 4;
            output.setFloat32(offset, vector.z, true);
            offset += 4;

            const indices = [face.a, face.b, face.c];

            for (let k = 0; k < 3; k++) {

                vector.copy(vertices[indices[k]]).applyMatrix4(matrixWorld);

                output.setFloat32(offset, vector.x, true);
                offset += 4; // vertices
                output.setFloat32(offset, vector.y, true);
                offset += 4;
                output.setFloat32(offset, vector.z, true);
                offset += 4;

            }

            output.setUint16(offset, 0, true);
            offset += 2; // attribute byte count

        }

        return output;
    }
}

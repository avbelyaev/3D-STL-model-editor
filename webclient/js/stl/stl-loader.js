/**
 * Created by anthony on 25.02.2018.
 */

// I do not own any code below.
// With all respect to it's original authors, it was taken from:
// https://github.com/mrdoob/three.js/blob/master/examples/js/loaders/STLLoader.js
class STLLoader {

    static parseBinarySTL(file, callback) {
        log(`parsing binary file`);

        const fileReader = new FileReader();
        fileReader.onload = function() {
            const arrayBuffer = this.result;

            try {
                const parsed = STLLoader.__parseData(arrayBuffer);
                callback(null, parsed);

            } catch (e) {
                callback(e, null);
            }
        };
        fileReader.onerror = function (error) {
            callback(error, null);
        };
        fileReader.readAsArrayBuffer(file);
    }

    static __parseData(data) {
        const reader = new DataView( data );
        const faces = reader.getUint32( 80, true );

        let r, g, b, hasColors = false, colors;
        let defaultR, defaultG, defaultB, alpha;

        // process STL header
        // check for default color in header ("COLOR=rgba" sequence).

        for (let index = 0; index < 80 - 10; index++) {

            if ( ( reader.getUint32( index, false ) == 0x434F4C4F /*COLO*/ ) &&
                ( reader.getUint8( index + 4 ) == 0x52 /*'R'*/ ) &&
                ( reader.getUint8( index + 5 ) == 0x3D /*'='*/ ) ) {

                hasColors = true;
                colors = [];

                defaultR = reader.getUint8( index + 6 ) / 255;
                defaultG = reader.getUint8( index + 7 ) / 255;
                defaultB = reader.getUint8( index + 8 ) / 255;
                alpha = reader.getUint8( index + 9 ) / 255;
            }
        }

        const dataOffset = 84;
        const faceLength = 12 * 4 + 2;
        const vertices = [];
        const normals = [];
        const triangles = [];

        for (let face = 0; face < faces; face++) {

            const triangle = {
                'v': [],
                'n': []
            };

            const start = dataOffset + face * faceLength;
            const normalX = reader.getFloat32( start, true );
            const normalY = reader.getFloat32( start + 4, true );
            const normalZ = reader.getFloat32( start + 8, true );

            normals.push( normalX, normalY, normalZ );
            triangle.n.push(normalX, normalY, normalZ);

            if (hasColors) {

                const packedColor = reader.getUint16( start + 48, true );

                if ((packedColor & 0x8000) === 0) {
                    // facet has its own unique color
                    r = ( packedColor & 0x1F ) / 31;
                    g = ( ( packedColor >> 5 ) & 0x1F ) / 31;
                    b = ( ( packedColor >> 10 ) & 0x1F ) / 31;

                } else {
                    r = defaultR;
                    g = defaultG;
                    b = defaultB;
                }
            }

            for (let i = 1; i <= 3; i++) {
                const vertexstart = start + i * 12;

                const a = reader.getFloat32( vertexstart, true );
                const b = reader.getFloat32( vertexstart + 4, true);
                const c = reader.getFloat32( vertexstart + 8, true );

                vertices.push(a, b, c);
                triangle.v.push(a, b, c);

                if (hasColors) {
                    colors.push(r, g, b);
                }
            }

        }

        return {
            vertices,
            normals,
            triangles
        };
    }
}

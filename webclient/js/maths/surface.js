/**
 * Created by anthony on 01.06.2018.
 */

class Surface {

    /**
     * count normal for surface of 3 points where point is of type vec3 or array[3]
     */
    static countNormal(p1, p2, p3) {
        const ax = p2[0] - p1[0];
        const ay = p2[1] - p1[1];
        const az = p2[2] - p1[2];

        const bx = p3[0] - p1[0];
        const by = p3[1] - p1[1];
        const bz = p3[2] - p1[2];

        let nx = (ay * bz) - (az * by);
        let ny = (az * bx) - (ax * bz);
        let nz = (ax * by) - (ay * bx);

        // Normalize (divide by root of dot product)
        const l = Math.sqrt(nx*nx + ny*ny + nz*nz);
        nx /= l;
        ny /= l;
        nz /= l;

        return [nx, ny, nz];
    }
}

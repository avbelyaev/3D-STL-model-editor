/**
 * Created by anthony on 09.02.2018.
 */

const CAM_VERTICAL_ANGLE_MAX_DEGREE = 178;
const CAM_VERTICAL_ANGLE_MIN_DEGREE = 2;
const CAM_DIST_MAX = 2500;
const CAM_DIST_MIN = 30;
const CAM_HORIZONTAL_ROTATION_DECELERATION = 4;
const CAM_VERT_ROTATION_DECELERATION = 3;
const CAM_DIST_CHANGE_DECELERATION = 10;

const LIGHT_SOURCE = [0.5, 0.8, 0.7];

/**
 * Camera position is a point in spherical coordinate system
 */
class Camera {
    constructor(initDist, initHorizontalAngleDeg, initVerticalAngleDeg, lookAt) {
        // lookAt camera only
        this.top = [0, 1, 0];
        this.lookAtPos = lookAt;

        this.distance = initDist;
        this.horizontalAngleDeg = initHorizontalAngleDeg;
        this.verticalAngleDeg = initVerticalAngleDeg;
        this.positionVec = [];
        this.__updatePosition();
    }

    updateHorizontalAngleDeg(updateFunc) {
        this.horizontalAngleDeg = updateFunc(this.horizontalAngleDeg);
        this.__updatePosition();
    }

    updateDistance(updateFunc) {
        this.distance = updateFunc(this.distance);

        this.distance = this.distance < CAM_DIST_MAX ? this.distance : CAM_DIST_MAX;
        this.distance = this.distance > CAM_DIST_MIN ? this.distance : CAM_DIST_MIN;
        this.__updatePosition();
    }

    updateVerticalAngleDeg(updateFunc) {
        this.verticalAngleDeg = updateFunc(this.verticalAngleDeg);

        this.verticalAngleDeg = this.verticalAngleDeg < CAM_VERTICAL_ANGLE_MAX_DEGREE
            ? this.verticalAngleDeg
            : CAM_VERTICAL_ANGLE_MAX_DEGREE;
        this.verticalAngleDeg = this.verticalAngleDeg > CAM_VERTICAL_ANGLE_MIN_DEGREE
            ? this.verticalAngleDeg
            : CAM_VERTICAL_ANGLE_MIN_DEGREE;
        this.__updatePosition();
    }

    __updatePosition() {
        // let P be the point with (x,y,z)
        // x: R * sin(YOP) * sin(ZOP)
        // y: R * cos(YOP)
        // z: R * sin(YOP) * cos(ZOP)
        const spherical = (f, g) => this.distance
            * f(degToRad(this.verticalAngleDeg)) * g(degToRad(this.horizontalAngleDeg));

        this.positionVec[0] = spherical(Math.sin, Math.sin);
        this.positionVec[1] = spherical(Math.cos, (any) => 1);
        this.positionVec[2] = spherical(Math.sin, Math.cos);
    }

    static setValueFunction(newValue) {
        // currValue is ignored
        return (currValue) => parseFloat(newValue);
    };

    static incValueFunction(newValue) {
        return (currValue) => currValue + parseFloat(newValue);
    };
}

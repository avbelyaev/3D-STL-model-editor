/**
 * Created by anthony on 02.06.2018.
 */

const CROPPER_TYPE = Object.freeze({
    OX: 'ox',
    OY: 'oy',
    OZ: 'oz'
});

// Super-Lehmann-class (or Gutenderg ?)
class Cropper {

    static initCroppers() {
        Cropper.initOXCropper();
        Cropper.initOYCropper();
        Cropper.initOZCropper();
    }

    static initOXCropper() {
        const height = 2000;
        const depth = -1000;
        const far = 2500;

        const a = [0, height, 0];
        const b = [-far, 0, 0];
        const c = [0, depth, far];
        const d = [0, depth, -far];

        Cropper.__initCroppingModel(a, b, c, d, 'ox', CROPPER_TYPE.OX);
    }

    static initOYCropper() {
        const height = 2000;
        const depth = -1000;
        const far = 2500;

        const a = [depth, 0, far];
        const b = [0, depth, 0];
        const c = [far, 0, 0];
        const d = [depth, 0, -far];

        Cropper.__initCroppingModel(a, b, c, d, 'oy', CROPPER_TYPE.OY);
    }

    static initOZCropper() {
        const height = 2000;
        const depth = -1000;
        const far = 2500;

        const a = [0, height, 0];
        const b = [-far, depth, 0];
        const c = [far, depth, 0];
        const d = [0, 0, -far];

        Cropper.__initCroppingModel(a, b, c, d, 'oz', CROPPER_TYPE.OZ);
    }

    static __initCroppingModel(a, b, c, d, label, subtype) {
        const abc = [...a, ...b, ...c];
        const acd = [...a, ...c, ...d];
        const adb = [...a, ...d, ...b];
        const bdc = [...b, ...d, ...c];

        const positions = [...abc, ...acd, ...adb, ...bdc];

        const lehmanClassCropper = new Figure(positions, extendRandomColors(positions),
            gl, vsSource, fsSource, label, DRAWABLES.CROPPER);
        lehmanClassCropper.subtype = subtype;
        lehmanClassCropper.init();

        IndexedDB.upsertFigure(lehmanClassCropper);

        figureController.addToolFigure(lehmanClassCropper);
    };
}

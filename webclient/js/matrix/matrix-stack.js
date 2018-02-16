/**
 * Created by anthony on 21.01.2018.
 */

// class MatrixStack {
//     constructor() {
//         this.stack = [];
//         this.restore();
//     }
//
//     restore() {
//         this.stack.pop();
//         if (1 > this.stack.length) {
//             this.stack[0] = mat4.create();
//         }
//     }
//
//     save() {
//         this.stack.push(this.getCurrentMatrix());
//     }
//
//     getCurrentMatrix() {
//         return this.stack[this.stack.length - 1].slice();
//     }
//
//     setCurrentMatrix(m) {
//         this.stack[this.stack.length - 1] = m;
//         return m;
//     }
//
//     // matrix ops
//
//     translate(translationVec3) {
//         const m = this.getCurrentMatrix();
//         const translated = mat4.translate(m, m, translationVec3);
//         this.setCurrentMatrix(translated);
//         return translated;
//     }
//
//     rotateY(angleInRadians) {
//         const m = this.getCurrentMatrix();
//         const rotated = mat4.rotateY(m, m, angleInRadians);
//         this.setCurrentMatrix(rotated);
//         return rotated;
//     }
// }


const makeModelMatrix = (isMovable, scaleVec, translationVec, rotationVec) => {
    const modelMatrix = mat4.create();

    // scale
    mat4.scale(modelMatrix, modelMatrix, scaleVec);

    // move
    const figureMove = isMovable ? translationVec : [0, 0, 0];
    mat4.translate(modelMatrix, modelMatrix, figureMove);

    // rotate
    const angleRadiansVec = isMovable ? rotationVec : 0;
    mat4.rotateX(modelMatrix, modelMatrix, angleRadiansVec[0]);
    mat4.rotateY(modelMatrix, modelMatrix, -angleRadiansVec[1]);
    mat4.rotateZ(modelMatrix, modelMatrix, angleRadiansVec[2]);

    return modelMatrix;
};

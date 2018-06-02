/**
 * Created by anthony on 31.05.2018.
 */

class Axis {

    static initDefaultAxis() {
        // the weird part is that X-Z axes are duplicated:
        // one axis has Y set to 0.1
        // the other one has Y = -0.1
        // so we have axis that is visible from above of grid and from below grid
        // otherwise axis intersects with grid lines
        const len = 400;
        const axisXLen = len;
        const axisYLen = len;
        const axisZLen = len;

        const axisXTop = new Line([0, 0.1, 0], [axisXLen, 0.1, 0], COLORS.RED, gl, vsSourceNoLight, fsSourceNoLight,
            'axisXTop', DRAWABLES.AXIS);
        axisXTop.init();
        figureController.addStaticFigure(axisXTop);

        const axisXBottom = new Line([0, -0.1, 0], [axisXLen, -0.1, 0], COLORS.RED, gl, vsSourceNoLight, fsSourceNoLight,
            'axisXBot', DRAWABLES.AXIS);
        axisXBottom.init();
        figureController.addStaticFigure(axisXBottom);


        const axisY = new Line([0, -axisYLen, 0], [0, axisYLen, 0], COLORS.GREEN, gl, vsSourceNoLight, fsSourceNoLight,
            'axisY', DRAWABLES.AXIS);
        axisY.init();
        figureController.addStaticFigure(axisY);


        const axisZTop = new Line([0, 0.1, 0], [0, 0.1, axisZLen], COLORS.BLUE, gl, vsSourceNoLight, fsSourceNoLight,
            'axisZTop', DRAWABLES.AXIS);
        axisZTop.init();
        figureController.addStaticFigure(axisZTop);

        const axisZBottom = new Line([0, -0.1, 0], [0, -0.1, axisZLen], COLORS.BLUE, gl, vsSourceNoLight, fsSourceNoLight,
            'axisZBot', DRAWABLES.AXIS);
        axisZBottom.init();
        figureController.addStaticFigure(axisZBottom);
    }
}

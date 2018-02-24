/**
 * Created by anthony on 23.02.2018.
 */

class FigureController {
    constructor() {
        log('constructing Figure Controller');

        this.dynamicFigures = [];
        this.staticFigures = [];

        this.figureControllerElement = document.getElementsByClassName('menu__figure-controller')[0];
        this.childElementsClassName = 'figure-controller__radio-button';
        this.childElementsGroupName = 'figure-controller-group';
        this.childElementsAttr = 'figureIndex';
    }

    addDynamicFigure(dynamicFigure) {
        this.dynamicFigures.push(dynamicFigure);

        // save dynamic figure's index into radio-button
        const radioButton = createRadioElement(this.childElementsClassName, this.childElementsGroupName, true);
        this.__customizeRadioButton(radioButton);
        this.figureControllerElement.appendChild(radioButton);

        selectedFigure = this.selectedFigure;
    }

    addStaticFigure(staticFigure) {
        this.staticFigures.push(staticFigure);
    }

    drawFigures() {
        // make sure static figures wont move
        this.staticFigures.map(sf => sf.draw());
        this.dynamicFigures.map(df => df.draw());
    }

    get selectedFigure() {
        const checked = Array.from(document.getElementsByClassName(this.childElementsClassName))
            .find(radioButton => radioButton.checked);
        const selectedFigureIndex = parseInt(checked.getAttribute(this.childElementsAttr));

        return this.dynamicFigures[selectedFigureIndex];
    }

    __customizeRadioButton(radioButton) {
        const figureIndexValue = this.dynamicFigures.length - 1;
        radioButton.setAttribute(this.childElementsAttr, figureIndexValue.toString());
        radioButton.setAttribute('onclick', 'updateFigure()');
    }
}

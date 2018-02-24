/**
 * Created by anthony on 23.02.2018.
 */

class FigureController {
    constructor() {
        log('constructing Figure Controller');

        this.dynamicFigures = new Map();
        this.staticFigures = new Map();

        this.figureControllerElement = document.getElementsByClassName('menu__figure-controller')[0];
        this.childElementsClassName = 'figure-controller__radio-button';
        this.childElementsGroupName = 'figure-controller-group';
        this.childElementsAttr = 'selectedFigureId';
    }

    addDynamicFigure(dynamicFigure) {
        log(`adding dynamic figure ${dynamicFigure.id}`);

        this.dynamicFigures.set(dynamicFigure.id, dynamicFigure);

        // save dynamic figure's index into radio-button
        const radioButton = createRadioElement(this.childElementsClassName, this.childElementsGroupName, true);
        this.__customizeRadioButton(radioButton, dynamicFigure.id);
        this.figureControllerElement.appendChild(radioButton);

        selectedFigure = this.selectedFigure;
    }

    addStaticFigure(staticFigure) {
        log(`adding static figure ${staticFigure.id}`);

        this.staticFigures.set(staticFigure.id, staticFigure);
    }

    drawFigures() {
        // make sure static figures wont move
        this.staticFigures.forEach(sf => sf.draw());
        this.dynamicFigures.forEach(df => df.draw());
    }

    get selectedFigure() {
        const checked = Array.from(document.getElementsByClassName(this.childElementsClassName))
            .find(radioButton => radioButton.checked);
        const selectedFigureId = checked.getAttribute(this.childElementsAttr);

        return this.dynamicFigures.get(selectedFigureId);
    }

    __customizeRadioButton(radioButton, figureId) {
        radioButton.setAttribute(this.childElementsAttr, figureId);
        radioButton.setAttribute('onclick', 'updateFigure()');
    }
}

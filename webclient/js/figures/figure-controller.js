/**
 * Created by anthony on 23.02.2018.
 */

class FigureController {
    constructor() {
        log('constructing Figure Controller');

        this.dynamicFigures = new Map();
        this.staticFigures = new Map();

        this.figureControllerElement = document.getElementsByClassName('figure-controller__button-list')[0];
        this.childElementsClassName = 'figure-controller__button--input';
        this.childElementsGroupName = 'figure-controller-group';
        this.childElementsAttr = 'selectedFigureId';
    }

    addDynamicFigure(dynamicFigure) {
        log(`adding dynamic figure ${dynamicFigure.id}`);

        this.dynamicFigures.set(dynamicFigure.id, dynamicFigure);

        // save dynamic figure's index into radio-button
        const customAttr = {
            'name': this.childElementsAttr,
            'value': dynamicFigure.id
        };
        const figureButton = createFigureButton(
            this.childElementsClassName, this.childElementsGroupName, true, customAttr);
        this.__customizeButton(figureButton, dynamicFigure.id);
        this.figureControllerElement.appendChild(figureButton);

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

    __customizeButton(radioButton, figureId) {
        radioButton.setAttribute('onclick', 'updateFigure()');
        radioButton.innerHTML += figureId;
    }
}

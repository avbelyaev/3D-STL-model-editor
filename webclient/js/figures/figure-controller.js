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

        // save dynamic figure's id into radio-button
        const figureButton = this.createFigureButton(
            this.childElementsClassName, this.childElementsGroupName, true, dynamicFigure.id);
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

    createFigureButton(className, groupName, checked, idAttr) {
        let radioButton = document.createElement('input');
        radioButton.type = 'radio';
        radioButton.name = groupName;
        radioButton.setAttribute('class', className);
        radioButton.setAttribute(this.childElementsAttr, idAttr);
        if (checked) {
            radioButton.setAttribute('checked', 'checked');
        }

        let label = document.createElement('label');
        label.setAttribute('class', 'figure-controller__button--label');

        const checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.name = "name";
        checkbox.value = "value";
        checkbox.id = "id";

        let wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'figure-controller__button--wrapper');
        wrapper.setAttribute('onclick', 'updateFigure()');
        wrapper.appendChild(radioButton);
        wrapper.appendChild(label);
        wrapper.appendChild(checkbox);
        wrapper.innerHTML += idAttr;

        return wrapper;
    };
}

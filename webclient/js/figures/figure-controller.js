/**
 * Created by anthony on 23.02.2018.
 */

class FigureController {
    constructor() {
        log('constructing Figure Controller');

        this.dynamicFigures = new Map();
        this.staticFigures = new Map();

        this.figureControllerElement = document.getElementsByClassName('figure-controller__button-list')[0];
        this.classForRadioButtons = 'figure-controller__radio-button--input';
        this.classForCheckboxes = 'figure-controller__checkbox--input';
        this.childElementsGroupName = 'figure-controller-group';
        this.childElementsAttr = 'selectedFigureId';
    }

    addDynamicFigure(dynamicFigure) {
        log(`adding dynamic figure ${dynamicFigure.id}`);

        this.dynamicFigures.set(dynamicFigure.id, dynamicFigure);

        // save dynamic figure's id into radio-button
        const figureButton = this.createFigureButton(this.childElementsGroupName, true, dynamicFigure.id);
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
        const checked = Array.from(document.getElementsByClassName(this.classForRadioButtons))
            .find(radioButton => radioButton.checked);
        const selectedFigureId = checked.getAttribute(this.childElementsAttr);

        return this.dynamicFigures.get(selectedFigureId);
    }

    get figuresToBeProcessed() {
        const toBeProcessed = Array.from(document.getElementsByClassName(this.classForCheckboxes))
            .filter(checkbox => checkbox.checked)
            .map(checkedCheckBox => checkedCheckBox.getAttribute(this.childElementsAttr));

        return toBeProcessed;
    }

    createFigureButton(groupName, checked, idAttr) {
        let radioButton = document.createElement('input');
        radioButton.type = 'radio';
        radioButton.name = groupName;
        radioButton.setAttribute('class', this.classForRadioButtons);
        radioButton.setAttribute(this.childElementsAttr, idAttr);
        if (checked) {
            radioButton.setAttribute('checked', 'checked');
        }

        let label = document.createElement('label');
        label.setAttribute('class', 'figure-controller__button--label');

        const checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.name = groupName;
        checkbox.setAttribute('class', this.classForCheckboxes);
        checkbox.setAttribute(this.childElementsAttr, idAttr);

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

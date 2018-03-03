/**
 * Created by anthony on 23.02.2018.
 */

class FigureController {
    constructor() {
        log('constructing Figure Controller');

        this.dynamicFigures = new Map();
        this.staticFigures = new Map();

        this.figureControllerElement = document.getElementsByClassName('figure-controller__button-list')[0];
        this.selectedFigureClass = 'figure-controller__selected-figure';
        this.processedFiguresClass = 'figure-controller__bool-op';
        this.visibilityCheckboxClass = 'figure-controller__visibility';
        this.childElementsGroupName = 'figure-controller-group';
        this.figureIdAttrName = 'figureId';
    }

    addDynamicFigure(dynamicFigure) {
        log(`adding dynamic figure ${dynamicFigure.id}`);

        this.dynamicFigures.set(dynamicFigure.id, dynamicFigure);

        // save dynamic figure's id into radio-button
        const figureButton = this.createFigureButton(this.childElementsGroupName, dynamicFigure.id);
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
        const checked = Array.from(document.getElementsByClassName(this.selectedFigureClass))
            .find(radioButton => radioButton.checked);
        const selectedFigureId = checked.getAttribute(this.figureIdAttrName);

        return this.dynamicFigures.get(selectedFigureId);
    }

    get figuresToBeProcessed() {
        return Array.from(document.getElementsByClassName(this.processedFiguresClass))
            .filter(checkbox => checkbox.checked)
            .map(checkedCheckBox => checkedCheckBox.getAttribute(this.figureIdAttrName));
    }

    createFigureButton(groupName, idAttr) {
        let selectedFigureButton = document.createElement('input');
        selectedFigureButton.type = 'radio';
        selectedFigureButton.name = groupName;
        selectedFigureButton.setAttribute('class', this.selectedFigureClass);
        selectedFigureButton.setAttribute(this.figureIdAttrName, idAttr);
        selectedFigureButton.setAttribute('checked', 'checked');

        const figureIdLabel = document.createElement('label');
        figureIdLabel.innerHTML += idAttr;

        const boolOpCheckbox = document.createElement('input');
        boolOpCheckbox.type = "checkbox";
        boolOpCheckbox.name = groupName;
        boolOpCheckbox.setAttribute('class', this.processedFiguresClass);
        boolOpCheckbox.setAttribute(this.figureIdAttrName, idAttr);

        const visibilityLabel = document.createElement('label');
        visibilityLabel.innerHTML += 'visible';

        const visibilityCheckbox = document.createElement('input');
        visibilityCheckbox.type = "checkbox";
        visibilityCheckbox.name = groupName;
        visibilityCheckbox.setAttribute('class', this.visibilityCheckboxClass);
        visibilityCheckbox.setAttribute(this.figureIdAttrName, idAttr);
        visibilityCheckbox.setAttribute('onclick', 'updateVisibility(this)');
        visibilityCheckbox.setAttribute('checked', 'checked');

        let wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'figure-controller__button--wrapper');
        wrapper.setAttribute('onclick', 'updateFigure()');
        wrapper.appendChild(selectedFigureButton);
        wrapper.appendChild(figureIdLabel);
        wrapper.appendChild(boolOpCheckbox);
        wrapper.appendChild(visibilityLabel);
        wrapper.appendChild(visibilityCheckbox);

        return wrapper;
    };
}

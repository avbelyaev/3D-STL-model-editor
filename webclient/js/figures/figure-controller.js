/**
 * Created by anthony on 23.02.2018.
 */

class FigureController {
    constructor() {
        log('starting Figure Controller');

        this.dynamicFigures = new Map();
        this.staticFigures = new Map();
        this.toolFigures = new Map();

        const controlSelectionElem = document.getElementById(H2JS_CONTROL_SELECTION);
        this.figureControllerElement = controlSelectionElem.getElementsByClassName(H2JS_CONTROL_ELEMENT)[0];
        this.selectedFigureClass = 'figure-controller__selected-figure';
        this.processedFiguresClass = 'figure-controller__bool-op';
        this.childElementsGroupName = 'figure-controller-group';
        this.figureIdAttrName = 'figureId';
    }

    addDynamicFigure(dynamicFigure) {
        if (DRAWABLES.CROPPER === dynamicFigure.type) {
            log('cannot add system-tool figure as dynamic');
            return;
        }
        if (0 === this.dynamicFigures.size) {
            sidebar.removePlaceholderOnEmptyList();
        }

        log(`adding dynamic figure ${dynamicFigure.id}`);
        this.dynamicFigures.set(dynamicFigure.id, dynamicFigure);

        // save dynamic figure's id into radio-button
        const figureButton = this.createFigureButton(this.childElementsGroupName, dynamicFigure.id);
        this.figureControllerElement.appendChild(figureButton);

        sidebar.updateOperationAndSelectedModel();
    }

    addStaticFigure(staticFigure) {
        log(`adding static figure ${staticFigure.id}`);

        this.staticFigures.set(staticFigure.id, staticFigure);
    }

    addToolFigure(toolFigure) {
        if (DRAWABLES.CROPPER === toolFigure.type) {
            this.toolFigures.set(toolFigure.id, toolFigure);
        }
    }

    drawFigures() {
        // make sure static figures wont move
        this.staticFigures.forEach(sf => sf.draw());
        this.dynamicFigures.forEach(df => df.draw());
    }

    get selectedFigure() {
        const checked = Array.from(document.getElementsByClassName(this.selectedFigureClass))
            .find(radioButton => radioButton.checked);

        if (checked) {
            const selectedFigureId = checked.getAttribute(this.figureIdAttrName);
            return this.dynamicFigures.get(selectedFigureId);

        } else {
            return null;
        }
    }

    get processedFigures() {
        return Array.from(document.getElementsByClassName(this.processedFiguresClass))
            .filter(checkbox => checkbox.checked)
            .map(checkedCheckBox => checkedCheckBox.getAttribute(this.figureIdAttrName));
    }

    getToolFigureBySubtype(subtype) {
        return Array.from(this.toolFigures.values())
            .filter(toolFigure => subtype === toolFigure.subtype);
    }

    toggleDynamicFiguresVisibility(isVisible) {
        Array.from(this.dynamicFigures.values()).map(f => f.visible = isVisible);
    }

    togglefigureOfTypeVisibility(ofType, isVisible) {
        Array.from(this.staticFigures.values())
            .filter(f => f.type === ofType)
            .map(f => f.visible = isVisible);
    }

    createFigureButton(groupName, idAttr) {
        let selectedFigureButton = document.createElement('input');
        selectedFigureButton.type = 'radio';
        selectedFigureButton.name = groupName;
        selectedFigureButton.setAttribute('class', this.selectedFigureClass);
        selectedFigureButton.setAttribute(this.figureIdAttrName, idAttr);
        selectedFigureButton.setAttribute('checked', 'checked');

        const figureIdLabel = document.createElement('label');
        figureIdLabel.setAttribute('class', H2JS_FIGURE_CONTROLLER_ITEM_TITLE);
        figureIdLabel.innerHTML += idAttr;

        const boolOpCheckbox = document.createElement('input');
        boolOpCheckbox.type = "checkbox";
        boolOpCheckbox.name = groupName;
        boolOpCheckbox.setAttribute('class', this.processedFiguresClass);
        boolOpCheckbox.setAttribute(this.figureIdAttrName, idAttr);


        let wrapper = document.createElement('div');
        wrapper.setAttribute('class', H2JS_FIGURE_CONTROLLER_ITEM);
        wrapper.setAttribute('onclick', 'sidebar.updateOperationAndSelectedModel()');
        wrapper.appendChild(selectedFigureButton);
        wrapper.appendChild(figureIdLabel);
        wrapper.appendChild(boolOpCheckbox);

        return wrapper;
    };

    fixSelectedModel() {
        if (null !== figureController.selectedFigure) {
            console.log('fixing (updating) selected model');
            figureController.selectedFigure.updateFigure();

            IndexedDB.upsertFigure(figureController.selectedFigure);
        }
    }
}

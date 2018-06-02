/**
 * Created by anthony on 31.05.2018.
 */


class Menu {
    constructor() {
        window.addEventListener('click', Menu.__handleClick);

        this.file = {};

        this.edit = {};

        this.view = {
            allModelsHidden: false,
            axisHidden: false,
            gridHidden: false,
            logHidden: false
        };
    }

    // ===================================
    // ------------- File ----------------
    // ===================================
    static toggleFile() {
        Menu.__hideAllDropdownsExceptElement(H2JS_FILE_DROPDOWN);
    };

    fileNewModel() {
        operationPerformer.performAddition();
    }

    fileSaveModel() {
        operationPerformer.performDownload();
    }

    // ===================================
    // ------------- Edit ----------------
    // ===================================
    static toggleEdit() {
        Menu.__hideAllDropdownsExceptElement(H2JS_EDIT_DROPDOWN);
    };

    editFixSelectedModel() {
        figureController.fixSelectedModel();
    }

    editRemoveSelectedModel() {

    }

    editCropPerpendicularlyToOX() {
        Menu.__crop(CROPPER_TYPE.OX);
    }

    editCropPerpendicularlyToOY() {
        Menu.__crop(CROPPER_TYPE.OY);
    }

    editCropPerpendicularlyToOZ() {
        Menu.__crop(CROPPER_TYPE.OZ);
    }

    static __crop(cropperType) {
        const cropper = figureController.getToolFigureBySubtype(cropperType)[0];
        if (cropper) {
            cropper.updateFigure();
            operationPerformer.performBoolOp(
                Operations.INTERSECT, figureController.selectedFigure, cropper);
        }
    }

    // ===================================
    // ------------ Operation ------------
    // ===================================
    static toggleOperation() {
        Menu.__hideAllDropdownsExceptElement(H2JS_OPERATION_DROPDOWN);
    };

    performOperation() {
        if (1 < figureController.processedFigures.length
            && null != figureController.selectedOperation) {
            operationPerformer.performBoolOp(
                operationPerformer.selectedOperation,
                figureController.processedFigures[0],
                figureController.processedFigures[1]);

        } else {
            log('Error! Not enough information to perform operation');
        }
    }

    updateSelectedOperation(operation) {
        const opElem = document.getElementsByClassName(H2JS_CONTROL_OPERATION_CURRENT_OP)[0];
        opElem.innerText = null != operation ? operation.label : "Не выбрано";

        operationPerformer.selectedOperation = operation;
    }

    declineOperation() {
        const opElem = document.getElementsByClassName(H2JS_CONTROL_OPERATION_CURRENT_OP)[0];
        opElem.innerText = "Не выбрано";
        const modelAElem = document.getElementsByClassName(H2JS_CONTROL_OPERATION_MODEL_A)[0];
        modelAElem.innerHTML = "Модель A не выбрана";
        const modelBElem = document.getElementsByClassName(H2JS_CONTROL_OPERATION_MODEL_B)[0];
        modelBElem.innerHTML = "Модель B не выбрана";

        operationPerformer.selectedOperation = null;
    }

    // ===================================
    // ------------- View ----------------
    // ===================================
    static toggleView() {
        Menu.__hideAllDropdownsExceptElement(H2JS_VIEW_DROPDOWN);
    }

    viewRefreshScene() {
        // reload(true) supposed to clear cache
        window.location.reload(true);
    }

    viewToggleModelsVisibility(event) {
        figureController.toggleDynamicFiguresVisibility(this.view.allModelsHidden);
        this.view.allModelsHidden = !this.view.allModelsHidden;
        event.target.innerText = this.view.allModelsHidden
            ? "Показать все модели"
            : "Скрыть все модели";
    }

    viewToggleAxisVisibility(event) {
        figureController.togglefigureOfTypeVisibility(DRAWABLES.AXIS, this.view.axisHidden);
        this.view.axisHidden = !this.view.axisHidden;
        event.target.innerText = this.view.axisHidden
            ? "Показать оси координат"
            : "Скрыть оси координат";
    }

    viewToggleGridVisibility(event) {
        figureController.togglefigureOfTypeVisibility(DRAWABLES.GRID, this.view.gridHidden);
        this.view.gridHidden = !this.view.gridHidden;
        event.target.innerText = this.view.gridHidden
            ? "Показать сетку"
            : "Скрыть сетку";
    }

    viewToggleLogVisibility(event) {
        // empty
    }


    getLogger() {
        const logElement = document.getElementsByClassName(H2JS_LOG)[0];
        return logElement.getElementsByClassName(H2JS_LOG_CONTENT)[0];
    };

    static log(text) {
        const dateTimeNow = new Date();
        const currentTime = dateTimeNow.getHours() + ":" +
            dateTimeNow.getMinutes() + ":" +
            dateTimeNow.getSeconds() + ":" +
            dateTimeNow.getMilliseconds();

        if ('string' === typeof text && text.toLowerCase().includes('error')) {
            text = `<span class=${H2JS_LOG_CONTENT_ERROR}>${text}</span>`;
        }

        logr.innerHTML += currentTime + "\t" + text + "<br>";

        //scroll log to the bottom
        const logElement = document.getElementsByClassName(H2JS_LOG)[0];
        const logContentElem = logElement.getElementsByClassName(H2JS_LOG_CONTENT)[0];
        logContentElem.scrollTop = logContentElem.scrollHeight;
    }


    static __handleClick() {
        window.onclick = function (event) {
            if (!event.target.matches('.dropbtn')) {
                Menu.__hideAllDropdowns();
            }
        }
    }

    static __hideAllDropdownsExceptElement(elementId) {
        Menu.__hideAllDropdowns();
        document.getElementById(elementId).classList.toggle(H2JS_DROPDOWN_SHOW);
    }

    static __hideAllDropdowns() {
        const dropdowns = document.getElementsByClassName(H2JS_DROPDOWN_CONTENT);
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains(H2JS_DROPDOWN_SHOW)) {
                openDropdown.classList.remove(H2JS_DROPDOWN_SHOW);
            }
        }
    }
}

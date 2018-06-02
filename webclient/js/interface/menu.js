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
            gridHidden: false
        };
    }

    // ===================================
    // ------------- File ----------------
    // ===================================
    static toggleFile() {
        Menu.__hideAllDropdownsExceptElement(H2JS_FILE_DROPDOWN);
    };

    static fileNewModel() {

    }

    // ===================================
    // ------------- Edit ----------------
    // ===================================
    static toggleEdit() {
        Menu.__hideAllDropdownsExceptElement(H2JS_EDIT_DROPDOWN);
    };


    // ===================================
    // ------------ Operation ------------
    // ===================================
    static toggleOperation() {
        Menu.__hideAllDropdownsExceptElement(H2JS_OPERATION_DROPDOWN);
    };

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



    createLogger() {
        const logElement = document.getElementsByClassName(H2JS_LOG)[0];
        const logContentHolder = logElement.getElementsByClassName(H2JS_LOG_CONTENT)[0];

        // make logger resizable
        const logElementClass = '.' + H2JS_LOG;
        interact(logElementClass)
            .resizable({
                edges: {
                    top: true,
                    bottom: false
                },
                restrictEdges: {
                    outer: 'parent',
                    endOnly: true,
                },
                restrictSize: {
                    min: {
                        height: 170
                    },
                    max: {
                        height: 728
                    }
                }
            })
            .on('resizemove', function (event) {
                const target = event.target;
                let y = (parseFloat(target.getAttribute('data-y')) || 0);

                // update the element's style
                target.style.height = event.rect.height + 'px';

                // translate when resizing from top or left edges
                y += event.deltaRect.top;

                target.style.webkitTransform = target.style.transform =
                    'translate(' + 0 + 'px,' + y + 'px)';

                target.setAttribute('data-y', y);
            });

        return logContentHolder;
    };


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

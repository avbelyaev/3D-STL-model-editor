/**
 * Created by anthony on 31.05.2018.
 */


class Menu {
    constructor() {
        window.addEventListener('click', Menu.__handleClick);

        this.file = {};

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

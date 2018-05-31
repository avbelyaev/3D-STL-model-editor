/**
 * Created by anthony on 31.05.2018.
 */


class Menu {
    constructor() {
        window.addEventListener('click', Menu.__handleClick);
    }

    static toggleFile() {
        Menu.__hideAllDropdownsExceptElement(H2JS_FILE_DROPDOWN);
    };

    static toggleEdit() {
        Menu.__hideAllDropdownsExceptElement(H2JS_EDIT_DROPDOWN);
    };

    static toggleView() {
        Menu.__hideAllDropdownsExceptElement(H2JS_VIEW_DROPDOWN);
    }

    static __handleClick() {
        window.onclick = function(event) {
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

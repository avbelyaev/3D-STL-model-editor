/**
 * Created by anthony on 23.02.2018.
 */

const createFigureButton = (className, groupName, checked, customAttr) => {
    let radioElem = document.createElement('input');
    radioElem.setAttribute('type', 'radio');
    radioElem.setAttribute('name', groupName);
    radioElem.setAttribute('class', className);
    radioElem.setAttribute(customAttr.name, customAttr.value);
    if (checked) {
        radioElem.setAttribute('checked', 'checked');
    }

    let label = document.createElement('label');
    label.setAttribute('class', 'figure-controller__button--label');
    label.appendChild(radioElem);

    let buttonWrapper = document.createElement('div');
    buttonWrapper.setAttribute('class', 'figure-controller__button--wrapper');
    buttonWrapper.appendChild(label);

    return buttonWrapper;
};

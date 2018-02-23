/**
 * Created by anthony on 23.02.2018.
 */

const createRadioElement = (className, groupName, checked) => {
    let radioHtml = document.createElement('input');
    radioHtml.setAttribute('type', 'radio');
    radioHtml.setAttribute('name', groupName);
    radioHtml.setAttribute('class', className);

    if (checked) {
        radioHtml.setAttribute('checked', 'checked');
    }
    radioHtml.setAttribute('onclick', 'updateFigure()');

    return radioHtml;
};

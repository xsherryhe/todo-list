import { applicationSettings as settings } from '../application';
import down from '../../images/down.svg';
import up from '../../images/up.svg';
import disabledDown from '../../images/down-gray.svg';
import disabledUp from '../../images/up-gray.svg';
import checkmark from '../../images/check.svg';
import disabledCheckmark from '../../images/check-gray.svg';

export function clearBody() {
  setBodyHeight();
  document.body.innerHTML = '';
}

export function setBodyHeight() {
  document.body.style = `min-height: ${window.scrollY + window.innerHeight}px`;
}

export function editableAttribute(obj, attribute, attributeType, options = {}) {
  const separateEdit = settings.separateEditAttrButton[obj.type].includes(attribute),
        attrText = options.attributeText || obj[attribute] || 'None';

  const editableAttributeHTML =
  `<div class="attribute" data-type="${obj.type}" data-id="${obj.id}" data-attribute="${attribute}">
      <span class="element-text">${options.elementText || ''}</span>
      <span class="attr-text">${separateEdit ? attrText : ''}</span>
      <button class="edit-attribute link ${separateEdit ? 'separate' : ''}" 
              data-type="${obj.type}" data-id="${obj.id}"
              data-attribute="${attribute}" data-attribute-type="${attributeType}"
              data-attribute-value="${obj[attribute] || ''}" 
              ${options.data ? 
                Object.entries(options.data)
                      .map(([key, val]) => `data-${snakeCase(key)}="${val}"`) 
              : ''}>
        ${separateEdit ? 'Edit' : attrText}
      </button>
   </div>`;
  return editableAttributeHTML;
}

export function renderDisabled(node = document.body, disabled = true) {
  [...node.children].forEach(child => {
    if(disabled) {
      child.classList.add('disabled');
      child.classList.remove('enabled');
    } else {
      child.classList.remove('disabled');
      child.classList.add('enabled');
    }
  });
  node.querySelectorAll('button,input[type="checkbox"],input[type="radio"]')
      .forEach(selectable => selectable.disabled = disabled);
  
  _renderDisabledIcons(node, disabled);
}

function _renderDisabledIcons(node, disabled) {
  node.querySelectorAll('.check')
      .forEach(check => check.src = disabled ? disabledCheckmark : checkmark);
  node.querySelectorAll('.down')
      .forEach(downBtn => downBtn.src = disabled ? disabledDown : down);
  node.querySelectorAll('.up')
      .forEach(upBtn => upBtn.src = disabled ? disabledUp : up);
}

export function parseNumberList(list) {
  return list.split(' ').filter(item => item).map(Number);
}

export function capitalize(string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase()
}

export function snakeCase(string) {
  return string.split(/(?=[A-Z])/).map(word => word.toLowerCase()).join('-');
}

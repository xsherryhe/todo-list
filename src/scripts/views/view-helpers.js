import { applicationSettings as settings } from '../application';
import checkmark from '../../images/check.svg';
import disabledCheckmark from '../../images/check-gray.svg';

export function clearBody() {
  document.body.style = `min-height: ${window.scrollY + window.innerHeight}px`;
  document.body.innerHTML = '';
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
              data-attribute-value="${obj[attribute] || ''}">
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
  node.querySelectorAll('.check')
      .forEach(check => check.src = disabled ? disabledCheckmark : checkmark);
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

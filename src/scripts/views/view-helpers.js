import { applicationSettings as settings } from '../application';

export function renderEditableAttribute(obj, attribute, attributeType, options = {}) {
  const attrElement = document.createElement('div'),
        separateEdit = settings.separateEditAttrButton[obj.type].includes(attribute),
        attrText = options.attributeText || obj[attribute] || 'None';
  
  attrElement.classList.add('attribute');
  attrElement.dataset.type = obj.type;
  attrElement.dataset.id = obj.id;
  attrElement.dataset.attribute = attribute;
  attrElement.innerHTML = 
    `<div>${options.elementText || ''}${separateEdit ? attrText : ''}</div>
     <button class="edit-attribute link" data-type="${obj.type}" data-id="${obj.id}"
             data-attribute="${attribute}" data-attribute-type="${attributeType}"
             data-attribute-value="${obj[attribute] || ''}">
        ${separateEdit ? 'Edit' : attrText}
     </button>`;

  (options.parentElement || document.body).append(attrElement);
}

export function renderSelectablesDisabled(node = document, disabled = true) {
  node.querySelectorAll('button,input[type="checkbox"],input[type="radio"]')
      .forEach(selectable => selectable.disabled = disabled);
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

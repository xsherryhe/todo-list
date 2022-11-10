import { applicationSettings as settings } from '../application';

export function renderEditableAttribute(obj, attribute, attributeType, options = {}) {
  const attrElement = document.createElement('div'),
        attrContentElement = document.createElement('div'),
        editAttrButton = document.createElement('button'),
        separateEdit = settings.separateEditAttrButton[obj.type].includes(attribute),
        attrText = options.attributeText || obj[attribute] || 'None';
  
  attrElement.classList.add('attribute');
  attrContentElement.textContent = options.elementText || '';
  if(separateEdit) attrContentElement.textContent += attrText;

  [attrElement, editAttrButton].forEach(element => {
    element.dataset.type = obj.type;
    element.dataset.id = obj.id;
    element.dataset.attribute = attribute;
  })
  editAttrButton.classList.add('edit-attribute');
  editAttrButton.dataset.attributeType = attributeType;
  editAttrButton.dataset.attributeValue = obj[attribute] || '';
  editAttrButton.textContent = separateEdit ? 'Edit' : attrText;

  attrElement.append(attrContentElement, editAttrButton);
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

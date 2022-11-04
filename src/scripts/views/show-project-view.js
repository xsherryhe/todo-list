import PubSub from 'pubsub-js';
import { SHOW, SHOW_RENDERED, PAGE_RENDERED } from '../pubsub-event-types';
import { applicationData as renderData } from '../application';

PubSub.subscribe(SHOW('project'), showProjectView);

export default function showProjectView(_, data) {
  document.body.innerHTML = '';
  const project = renderData.projectsList.withId(data.id);
  _renderIntro(project);
  _renderTodoItems(project);
  PubSub.publish(PAGE_RENDERED, showProjectView.bind(null, _, data));
  PubSub.publish(SHOW_RENDERED('project'));
}

function _renderIntro(project) {
  const indexButton = document.createElement('button'),
        headingElement = document.createElement('div'),
        editButton = document.createElement('button'),
        newTodoItemButton = document.createElement('button');
  indexButton.classList.add('index');
  indexButton.dataset.type = project.type;
  indexButton.textContent = 'All Projects';

  editButton.classList.add('edit-attribute');
  editButton.dataset.type = project.type;
  editButton.dataset.id = project.id;
  editButton.dataset.attribute = 'title';
  editButton.dataset.attributeType = 'text';
  editButton.textContent = project.title;

  newTodoItemButton.classList.add('new');
  newTodoItemButton.dataset.type = 'todoItem';
  newTodoItemButton.dataset.projectId = project.id;
  newTodoItemButton.textContent = '+';

  headingElement.append(editButton, newTodoItemButton);
  document.body.append(indexButton, headingElement);
}

function _renderTodoItems(project) {
  renderData.todoItemsList.withIds(project.todoItemIds).forEach(todoItem => {
    const todoItemElement = document.createElement('div'),
          editTitleButton = document.createElement('button'),
          dueDateElement = document.createElement('div'),
          editDueDateButton = document.createElement('button'),
          showButton = document.createElement('button'),
          destroyButton = document.createElement('button');

    todoItemElement.classList.add(todoItem.priority);
    dueDateElement.textContent = 'Due Date: ';

    [showButton, editTitleButton, editDueDateButton, destroyButton].forEach(button => {
      button.dataset.type = todoItem.type;
      button.dataset.id = todoItem.id;
    })
    showButton.classList.add('show');
    showButton.textContent = 'Expand';

    [editTitleButton, editDueDateButton].forEach(button => button.classList.add('edit-attribute'));
    editTitleButton.dataset.attribute = 'title';
    editTitleButton.dataset.attributeType = 'text';
    editTitleButton.textContent = todoItem.title;

    editDueDateButton.dataset.attribute = 'dueDate';
    editDueDateButton.dataset.attributeType = 'date';
    editDueDateButton.textContent = todoItem.dueDate;

    destroyButton.classList.add('destroy');
    destroyButton.textContent = '-';
    
    dueDateElement.append(editDueDateButton);
    todoItemElement.append(editTitleButton, dueDateElement, showButton, destroyButton);
    document.body.append(todoItemElement);
  })
}

import PubSub from 'pubsub-js';
import { SHOW, SHOW_RENDERED, PAGE_RENDERED } from '../pubsub-event-types';
import { applicationData as renderData } from '../application';
import { renderEditableAttribute } from './view-helpers';
import { formatRelative } from 'date-fns';

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
        newTodoItemButton = document.createElement('button');
  indexButton.classList.add('index');
  indexButton.dataset.type = project.type;
  indexButton.textContent = 'All Projects';

  renderEditableAttribute(project, 'title', 'text', { parentElement: headingElement });
  
  newTodoItemButton.classList.add('new');
  newTodoItemButton.dataset.type = 'todoItem';
  newTodoItemButton.dataset.projectId = project.id;
  newTodoItemButton.textContent = '+';

  headingElement.append(newTodoItemButton);
  document.body.append(indexButton, headingElement);
}

function _renderTodoItems(project) {
  renderData.todoItemsList.withIds(project.todoItems).forEach(todoItem => {
    const todoItemElement = document.createElement('div'),
          showButton = document.createElement('button'),
          destroyButton = document.createElement('button');

    todoItemElement.classList.add(todoItem.priority, 'todo-item');
    todoItemElement.dataset.id = todoItem.id;

    renderEditableAttribute(todoItem, 'title', 'text', { parentElement: todoItemElement });
    renderEditableAttribute(todoItem, 'dueDate', 'datetime-local',
                            { parentElement: todoItemElement, elementText: 'Due: ',
                              attributeText: todoItem.dueDate ? formatRelative(new Date(todoItem.dueDate), new Date())
                                                              : 'None' });

    [showButton, destroyButton].forEach(button => {
      button.dataset.type = todoItem.type;
      button.dataset.id = todoItem.id;
    })
    showButton.classList.add('show');
    showButton.textContent = 'Expand';
    destroyButton.classList.add('destroy');
    destroyButton.textContent = '-';
    
    todoItemElement.append(showButton, destroyButton);
    document.body.append(todoItemElement);
  })
}

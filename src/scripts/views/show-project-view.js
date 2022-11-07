import PubSub from 'pubsub-js';
import { SHOW, SHOW_RENDERED, PAGE_RENDERED } from '../pubsub-event-types';
import { applicationData as renderData, applicationSettings as settings } from '../application';
import { renderEditableAttribute } from './view-helpers';
import { formatRelative } from 'date-fns';

PubSub.subscribe(SHOW('project'), showProjectView);

export default function showProjectView(_, data) {
  document.body.innerHTML = '';
  const project = renderData.projectsList.withId(data.id);
  _renderIntro(project);
  _renderTodoItems(project, data.todoItemsShow);
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

function _renderTodoItems(project, todoItemsShow) {
  const todoItemsShowArr = todoItemsShow.split(' ').filter(item => item).map(Number);
  renderData.todoItemsList.withIds(project.todoItems).forEach(todoItem => {
    const todoItemElement = document.createElement('div'),
          updateStatusButton = document.createElement('button'),
          showButton = document.createElement('button'),
          hideButton = document.createElement('button'),
          destroyButton = document.createElement('button');

    todoItemElement.classList.add(todoItem.priority, todoItem.status, 'todo-item');
    todoItemElement.dataset.id = todoItem.id;

    renderEditableAttribute(todoItem, 'title', 'text', { parentElement: todoItemElement });

    updateStatusButton.classList.add('update-status');
    updateStatusButton.dataset.type = todoItem.type;
    updateStatusButton.dataset.id = todoItem.id;
    //TO DO: Change check to icon image
    updateStatusButton.textContent = settings.statuses.indexOf(todoItem.status) ? '✓' : '';
    todoItemElement.append(updateStatusButton);

    renderEditableAttribute(todoItem, 'dueDate', 'datetime-local',
                            { parentElement: todoItemElement, elementText: 'Due: ',
                              attributeText: todoItem.dueDate ? formatRelative(new Date(todoItem.dueDate), new Date())
                                                              : 'None' });

    [showButton, hideButton].forEach(button => {
      button.dataset.type = project.type;
      button.dataset.id = project.id;
      button.dataset.todoItemId = todoItem.id;
      button.classList.add('show');
    })                                                         
    showButton.classList.add('show-todoItem');
    showButton.dataset.todoItemsShow = todoItemsShow + ` ${todoItem.id}`;
    showButton.textContent = 'Expand';

    hideButton.classList.add('hide-todoItem', 'hidden');
    hideButton.dataset.todoItemsShow = todoItemsShowArr.filter(id => id !== +todoItem.id).join(' ');
    hideButton.textContent = 'Shrink';

    destroyButton.dataset.type = todoItem.type;
    destroyButton.dataset.id = todoItem.id;
    destroyButton.classList.add('destroy');
    destroyButton.textContent = '-';

    if(todoItemsShowArr.includes(todoItem.id))
      PubSub.publish(SHOW('todoItem'), { id: todoItem.id });
    
    todoItemElement.append(showButton, hideButton, destroyButton);
    document.body.append(todoItemElement);
  })
}

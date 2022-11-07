import PubSub from 'pubsub-js';
import { SHOW, SHOW_RENDERED, HIDE, PAGE_RENDERED } from '../pubsub-event-types';
import { applicationData as renderData } from '../application';
import { renderEditableAttribute, parseNumberList } from './view-helpers';

PubSub.subscribe(SHOW('project'), showProjectView);

export default function showProjectView(_, data) {
  document.body.innerHTML = '';
  const project = renderData.projectsList.withId(data.id);
  _renderIntro(project);
  _renderTodoItems(project, data.todoItemsFull);
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

function _renderTodoItems(project, todoItemsFull) {
  const todoItemsFullArr = parseNumberList(todoItemsFull);
  const todoItemsElement = document.createElement('div');
  todoItemsElement.classList.add('todo-items');
  todoItemsElement.dataset.todoItemsFull = todoItemsFull;
  renderData.todoItemsList.withIds(project.todoItems).forEach(todoItem =>
    PubSub.publish(SHOW('todoItem'), { id: todoItem.id, full: todoItemsFullArr.includes(todoItem.id), parentElement: todoItemsElement }));
  document.body.append(todoItemsElement);
}

PubSub.subscribe(SHOW('todoItemFull'), updateTodoItemsFull);
PubSub.subscribe(HIDE('todoItemFull'), updateTodoItemsFull);
function updateTodoItemsFull(msg, data) {
  const id = renderData.todoItemsList.withId(data.id).belongs.project,
        oldTodoItemsFull = document.querySelector('.todo-items').dataset.todoItemsFull,
        todoItemsFull = msg.includes('show') ? 
                        oldTodoItemsFull + ` ${data.id}`
                      : parseNumberList(oldTodoItemsFull).filter(id => id !== +data.id).join(' ');
  PubSub.publish(SHOW('project'), { id, todoItemsFull })
}

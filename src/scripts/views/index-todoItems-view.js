import PubSub from 'pubsub-js';
import { INDEX, INDEX_RENDERED, SHOW, HIDE } from '../pubsub-event-types';
import { applicationData as renderData, applicationSettings as settings } from '../application';
import { parseNumberList } from './view-helpers';

PubSub.subscribe(INDEX('todoItem'), indexTodoItemsView);
function indexTodoItemsView(_, data) {
  const todoItemsFullArr = parseNumberList(data.full);
  const prevTodoItemsIndexElement = document.querySelector('.todo-items-index');
  prevTodoItemsIndexElement?.remove();
  document.body.innerHTML += `<div class="todo-items-index todo-items" data-full="${data.full}"></div>`;
  renderData.todoItemsList.withIds(data.ids)
            .sort((a, b) => settings.statuses.indexOf(a.status) - settings.statuses.indexOf(b.status))
            .forEach(todoItem =>
                PubSub.publish(SHOW('todoItem'), { id: todoItem.id, full: todoItemsFullArr.includes(todoItem.id), 
                                                   belongType: data.belongType, parentElementSelector: '.todo-items' }));
  PubSub.publish(INDEX_RENDERED('todoItem'));
}

PubSub.subscribe(SHOW('todoItemFull'), updateTodoItemsFull);
PubSub.subscribe(HIDE('todoItemFull'), updateTodoItemsFull);
function updateTodoItemsFull(msg, data) {
  const id = renderData.todoItemsList.withId(+data.id).belongs[data.belongType],
        oldTodoItemsFull = document.querySelector('.todo-items').dataset.full,
        todoItemsFull = msg.includes('show') ?
                        oldTodoItemsFull + ` ${data.id}`
                      : parseNumberList(oldTodoItemsFull).filter(id => id !== +data.id).join(' ');
  PubSub.publish(SHOW(data.belongType), { id, todoItemsFull })
}

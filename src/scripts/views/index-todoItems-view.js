import PubSub from 'pubsub-js';
import { INDEX, SHOW, HIDE } from '../pubsub-event-types';
import { applicationData as renderData } from '../application';
import { parseNumberList } from './view-helpers';

PubSub.subscribe(INDEX('todoItem'), indexTodoItemsView);
function indexTodoItemsView(_, data) {
  const todoItemsFullArr = parseNumberList(data.full);
  const todoItemsElement = document.createElement('div');
  todoItemsElement.classList.add('todo-items');
  todoItemsElement.dataset.full = data.full;
  renderData.todoItemsList.withIds(data.ids).forEach(todoItem =>
    PubSub.publish(SHOW('todoItem'), { id: todoItem.id, full: todoItemsFullArr.includes(todoItem.id), 
                                       belongType: data.belongType, parentElement: todoItemsElement }));
  document.body.append(todoItemsElement);
}

PubSub.subscribe(SHOW('todoItemFull'), updateTodoItemsFull);
PubSub.subscribe(HIDE('todoItemFull'), updateTodoItemsFull);
function updateTodoItemsFull(msg, data) {
  const id = renderData.todoItemsList.withId(data.id).belongs[data.belongType],
        oldTodoItemsFull = document.querySelector('.todo-items').dataset.full,
        todoItemsFull = msg.includes('show') ?
                        oldTodoItemsFull + ` ${data.id}`
                      : parseNumberList(oldTodoItemsFull).filter(id => id !== +data.id).join(' ');
  PubSub.publish(SHOW(data.belongType), { id, todoItemsFull })
}
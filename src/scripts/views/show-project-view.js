import PubSub from 'pubsub-js';
import { INDEX, SHOW, SHOW_RENDERED, PAGE_RENDERED } from '../pubsub-event-types';
import { applicationData as renderData } from '../application';
import { setBodyHeight, editableAttribute } from './view-helpers';

PubSub.subscribe(SHOW('project'), showProjectView);

export default function showProjectView(_, data) {
  const project = renderData.projectsList.withId(data.id);
  setBodyHeight();
  document.body.innerHTML =
  `<div class="project-intro">
      <button class="index" data-type="${project.type}">All Projects</button>
      <div class="project-heading">
        ${editableAttribute(project, 'title', 'text', { data: { iconColor: 'white' } } ) }
      </div>
   </div>
   <div class="todo-items-heading">
      <h2>To-Dos</h2>
      <button class="new symbol" data-type="todoItem" data-project-id="${project.id}">+</button>
   </div>`;
  _renderTodoItemsIndex(project, data.todoItemsFull);
  PubSub.publish(PAGE_RENDERED, showProjectView.bind(null, _, data));
  PubSub.publish(SHOW_RENDERED('project'));
}

function _renderTodoItemsIndex(project, todoItemsFull) {
  PubSub.publish(INDEX('todoItem'), 
                { belongType: project.type, ids: project.todoItems, full: todoItemsFull })
}

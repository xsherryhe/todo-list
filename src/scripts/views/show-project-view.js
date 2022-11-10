import PubSub from 'pubsub-js';
import { INDEX, SHOW, SHOW_RENDERED, PAGE_RENDERED } from '../pubsub-event-types';
import { applicationData as renderData } from '../application';
import { renderEditableAttribute } from './view-helpers';

PubSub.subscribe(SHOW('project'), showProjectView);

export default function showProjectView(_, data) {
  document.body.innerHTML = '';
  const project = renderData.projectsList.withId(data.id);
  _renderIntro(project);
  _renderTodoItemsIndex(project, data.todoItemsFull);
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

function _renderTodoItemsIndex(project, todoItemsFull) {
  PubSub.publish(INDEX('todoItem'), 
                { belongType: project.type, ids: project.todoItems, full: todoItemsFull })
}

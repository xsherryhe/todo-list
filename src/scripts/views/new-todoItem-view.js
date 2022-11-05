import PubSub from 'pubsub-js';
import { NEW, NEW_RENDERED } from '../pubsub-event-types';
import { applicationData as renderData, applicationSettings as settings } from '../application';

PubSub.subscribe(NEW('todoItem'), newTodoItemView);
export default function newTodoItemView(_, data) {
  const newTodoItemButton = document.querySelector('.new[data-type="todoItem"]'),
        backButton = document.createElement('button'),
        formElement = document.createElement('form');
  backButton.classList.add('back');
  backButton.textContent = 'Back';
  formElement.dataset.type = 'todoItem';
  formElement.innerHTML =
    `<div class="field">
      <label for="title">New To-Do</label>
      <input type="text" name="title" id="title">
     </div>
     <div class="field">
      <label for="dueDate">Due Date</label>
      <input type="datetime-local" name="dueDate" id="dueDate">
     </div>
     <div class="field">
      <label for="description">Description</label>
      <textarea name="description" id="description"></textarea>
     </div>
     <div class="field">
      <label for="notes">Notes</label>
      <textarea name="notes" id="notes"></textarea>
     </div>
     <div class="field">
      <label for="belongs[project]">Project</label>
      <select name="belongs[project]" id="belongs[project]">
        ${renderData.projectsList.projects.map(project => 
          `<option value="${project.id}" ${project.id == data.projectId ? 'selected' : ''}>
            ${project.title}
          </option>`)
        .join('\n')}
      </select>
     </div>
     <div class="field">
      <label for="priority">Priority</label>
      <select name="priority" id="priority">
        ${settings.priorities.map(priority => 
          `<option value="${priority}">${priority}</option>`).join('\n')}
      </select>
     </div>
     <input type="hidden" name="status" id="status" value="${settings.statuses[0]}">
     <button class="new" data-type="checklistItem">Add a Checklist Item</button>
     <button class="submit">Submit</button>`;

  newTodoItemButton.replaceWith(backButton, formElement);
  //addProjectButton.remove();
  PubSub.publish(NEW_RENDERED('todoItem'));
  
}

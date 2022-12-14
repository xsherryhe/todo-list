import PubSub from 'pubsub-js';
import { NEW, NEW_RENDERED } from '../pubsub-event-types';
import { applicationData as renderData, applicationSettings as settings } from '../application';
import { renderDisabled } from './view-helpers';

PubSub.subscribe(NEW('todoItem'), newTodoItemView);
export default function newTodoItemView(_, data) {
  renderDisabled();
  
  const newTodoItemButton = document.querySelector('.new[data-type="todoItem"]');
  const formHTML =
  `<div class="new-form-wrapper" data-type="todoItem">
    <form class="new-form enabled" data-type="todoItem">
        <button class="back">Back</button>
        <div class="field">
          <label for="title">New To-Do</label>
          <input type="text" name="title" id="title">
        </div>
        <div class="field">
          <label for="dueDate">Due Date</label>
          <input type="datetime-local" name="dueDate" id="dueDate">
        </div>
        <div class="field">
          <label for="description" class="textarea-label">Description</label>
          <textarea name="description" id="description"></textarea>
        </div>
        <div class="field">
          <label for="notes" class="textarea-label">Notes</label>
          <textarea name="notes" id="notes"></textarea>
        </div>
        <div class="field">
          <label for="belongs[project]">Project</label>
          <select name="belongs[project]" id="belongs[project]">
            ${renderData.projectsList.projects.map(project =>
              `<option value="${project.id}" ${project.id == +data.projectId ? 'selected' : ''}>
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
        <h3>Checklist</h3>
        <button class="new link" data-belong-type="todoItem" data-type="checklistItem" data-index="1">Add a Checklist Item</button>
        <button class="submit">Submit</button>
     </form>
  </div>`;

  newTodoItemButton.insertAdjacentHTML('afterend', formHTML);
  newTodoItemButton.remove();
  PubSub.publish(NEW_RENDERED('todoItem'));
}

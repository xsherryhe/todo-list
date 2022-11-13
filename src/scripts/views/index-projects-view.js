import PubSub from 'pubsub-js';
import { INDEX, INDEX_RENDERED, PAGE_RENDERED } from '../pubsub-event-types';
import { applicationData as renderData, applicationSettings as settings } from '../application';

PubSub.subscribe(INDEX('project'), indexProjectsView)
export default function indexProjectsView() {
  document.body.innerHTML =
  `<div class="intro">
      <div class="intro-heading">
        <h1>Actionality</h1>
        <h2>Your one-stop to-do app</h2>
      </div>
      <button class="new" data-type="todoItem" data-project-id="0">
        Add a New To-Do
      </button>
   </div>
   <div class="projects-heading">
      <h2>My Projects</h2>
      <button class="new symbol" data-type="project">+</button>
   </div>`;

  _renderProjects();
  PubSub.publish(PAGE_RENDERED, indexProjectsView);
  PubSub.publish(INDEX_RENDERED('project'));
}

function _renderProjects() {
  renderData.projectsList.projects.forEach(project => {
    const projectElement = document.createElement('button');
    projectElement.classList.add('project', 'show');
    projectElement.dataset.type = project.type;
    projectElement.dataset.id = project.id;
    projectElement.dataset.todoItemsFull = '';
    projectElement.innerHTML = `<h3>${project.title}</h3>`;
    if(project.id) projectElement.innerHTML += 
    `<button class="destroy" 
             data-type="${project.type}" data-id="${project.id}">
        Delete
     </button>`;

    const previewItems = 
      renderData.todoItemsList
                .withIds(project.todoItems, { conditions: { status: settings.statuses[0] } });
    const elementType = previewItems.length ? 'ul' : 'div';
    projectElement.innerHTML +=
    `<${elementType} class="project-preview status-${previewItems.length ? 0 : 1}">
        ${previewItems.length ? 
          previewItems.slice(0, settings.previewNum).map(todoItem =>
            `<li>${todoItem.title}</li>`).join('')
        : "Everything’s done!" }
     </${elementType}>`

    document.body.append(projectElement);
  })
}

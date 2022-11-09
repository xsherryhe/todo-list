import PubSub from 'pubsub-js';
import { INDEX, INDEX_RENDERED, PAGE_RENDERED } from '../pubsub-event-types';
import { applicationData as renderData, applicationSettings as settings } from '../application';

PubSub.subscribe(INDEX('project'), indexProjectsView)
export default function indexProjectsView() {
  document.body.innerHTML = '';
  _renderIntro();
  _renderProjects();
  PubSub.publish(PAGE_RENDERED, indexProjectsView);
  PubSub.publish(INDEX_RENDERED('project'));
}

function _renderIntro() {
  const introElement = document.createElement('div');
  introElement.classList.add('intro');
  introElement.innerHTML = 
    `<div class="intro-heading">
      <h1>Actionality</h1>
      <h2>Your one-stop to-do app</h2>
     </div>
     <button class="new" data-type="todoItem" data-project-id="0">
      Add a New To-Do
     </button>`;
  document.body.append(introElement);
}

function _renderProjects() {
  _renderProjectsHeading();
  _renderProjectsList();
}

function _renderProjectsHeading() {
  const projectsHeadingElement = document.createElement('div');
  projectsHeadingElement.classList.add('projects-heading');
  projectsHeadingElement.innerHTML = 
    `<h2>My Projects</h2>
     <button class="new symbol" data-type="project">+</button>`;
  document.body.append(projectsHeadingElement);
}

function _renderProjectsList() {
  renderData.projectsList.projects.forEach(project => {
    const projectElement = document.createElement('div'),
          previewElement = document.createElement('ul');
    
    projectElement.classList.add('project');
    previewElement.classList.add('project-preview');
    
    projectElement.innerHTML =
      `<button class="show link" data-type="${project.type}" 
               data-id="${project.id}" data-todo-items-full="">
        ${project.title}
       </button>`;
    if(project.id) projectElement.innerHTML += 
      `<button class="destroy" 
               data-type="${project.type}" data-id="${project.id}">
        Remove
       </button>`;

    renderData.todoItemsList.withIds(project.todoItems)
              .slice(0, settings.previewNum).forEach(todoItem => {
      const todoItemElement = document.createElement('li');
      todoItemElement.textContent = todoItem.title;
      previewElement.append(todoItemElement);
    })

    projectElement.append(previewElement);
    document.body.append(projectElement);
  })
}

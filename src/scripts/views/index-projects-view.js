import PubSub from 'pubsub-js';
import { INDEX, INDEX_RENDERED, PAGE_RENDERED } from '../pubsub-event-types';
import { applicationData as renderData } from '../application';
import * as settings from '../settings';

PubSub.subscribe(INDEX('project'), indexProjectsView)
export default function indexProjectsView() {
  document.body.innerHTML = '';
  _renderIntro();
  _renderProjects();
  PubSub.publish(PAGE_RENDERED, indexProjectsView);
  PubSub.publish(INDEX_RENDERED('project'));
}

function _renderIntro() {
  const headingElement = document.createElement('h1'),
        bylineElement = document.createElement('h2'),
        newTodoItemButton = document.createElement('button');
  headingElement.textContent = 'Actionality';
  bylineElement.textContent = 'Your one-stop to-do app';
  newTodoItemButton.classList.add('new');
  newTodoItemButton.dataset.type = 'todoItem';
  newTodoItemButton.dataset.projectId = 0;
  newTodoItemButton.textContent = 'Add a New To-Do';

  document.body.append(headingElement, bylineElement, newTodoItemButton);
}

function _renderProjects() {
  _renderProjectsHeading();
  _renderProjectsList();
}

function _renderProjectsHeading() {
  const projectsHeadingElement = document.createElement('div'),
        projectsHeadingTextElement = document.createElement('h2'),
        newProjectButton = document.createElement('button');

  projectsHeadingTextElement.textContent = 'My Projects';
  newProjectButton.classList.add('new');
  newProjectButton.dataset.type = 'project';
  newProjectButton.textContent = '+';

  projectsHeadingElement.append(projectsHeadingTextElement, newProjectButton);
  document.body.append(projectsHeadingElement);
}

function _renderProjectsList() {
  renderData.projectsList.projects.forEach(project => {
    const projectElement = document.createElement('div'),
          showButton = document.createElement('button'),
          destroyButton = document.createElement('button'),
          previewElement = document.createElement('ul');

    [showButton, destroyButton].forEach(button => {
      button.dataset.type = project.type;
      button.dataset.id = project.id;
    })
    showButton.classList.add('show');
    showButton.textContent = project.title;
    destroyButton.classList.add('destroy');
    destroyButton.textContent = '-';

    renderData.todoItemsList.withIds(project.todoItemIds)
              .slice(0, settings.previewNum).forEach(todoItem => {
      const todoItemElement = document.createElement('li');
      todoItemElement.textContent = todoItem.title;
      previewElement.appendChild(todoItemElement);
    });

    projectElement.appendChild(showButton);
    if (project.id) projectElement.appendChild(destroyButton);
    projectElement.append(previewElement);
    document.body.appendChild(projectElement);
  })
}

import PubSub from 'pubsub-js';
import { INDEX, INDEX_RENDERED, PAGE_RENDERED } from '../pubsub-event-types';
import { applicationData as renderData } from '../application';
import * as settings from '../settings';

PubSub.subscribe(INDEX('project'), indexProjectsView)
export default function indexProjectsView() {
  _indexProjectsRenderIntro();
  _indexProjectsRenderProjects();
  PubSub.publish(PAGE_RENDERED, indexProjectsView);
  PubSub.publish(INDEX_RENDERED('project'), 'project');
}

function _indexProjectsRenderIntro() {
  const headingElement = document.createElement('h1'),
        bylineElement = document.createElement('h2'),
        addTodoButton = document.createElement('button');
  headingElement.textContent = 'Actionality';
  bylineElement.textContent = 'Your one-stop to-do app';
  addTodoButton.classList.add('add-todo');
  addTodoButton.textContent = 'Add a New To-Do';

  document.body.append(headingElement, bylineElement, addTodoButton);
}

function _indexProjectsRenderProjects() {
  _indexProjectsRenderProjectsHeading();
  _indexProjectsRenderProjectsList();
}

function _indexProjectsRenderProjectsHeading() {
  const projectsHeadingElement = document.createElement('div'),
        projectsHeadingTextElement = document.createElement('h2'),
        addProjectButton = document.createElement('button');

  projectsHeadingTextElement.textContent = 'My Projects';
  addProjectButton.classList.add('add-project');
  addProjectButton.textContent = '+';

  projectsHeadingElement.append(projectsHeadingTextElement, addProjectButton);
  document.body.append(projectsHeadingElement);
}

function _indexProjectsRenderProjectsList() {
  renderData.projectsList.projects.forEach(project => {
    const projectElement = document.createElement('div'),
          showButton = document.createElement('button'),
          deleteButton = document.createElement('button'),
          previewElement = document.createElement('ul');

    showButton.classList.add('show');
    showButton.dataset.id = project.id;
    showButton.textContent = project.title;
    deleteButton.classList.add('delete');
    deleteButton.dataset.id = project.id;
    deleteButton.textContent = '-';
    project.todoItems.slice(0, settings.previewNum).forEach(todoItem => {
      const todoItemElement = document.createElement('li');
      todoItemElement.textContent = todoItem.title;
      previewElement.appendChild(todoItemElement);
    });

    projectElement.appendChild(showButton);
    if (project.id) projectElement.appendChild(deleteButton);
    projectElement.append(previewElement);
    document.body.appendChild(projectElement);
  })
}

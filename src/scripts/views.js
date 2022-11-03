import PubSub from 'pubsub-js';
import { ANY_UPDATED, INDEX_PROJECTS_VIEW, INDEX_PROJECTS_VIEW_RENDERED } from './pubsub-event-types';
import { applicationData as renderData } from './application';

let currPageView = indexProjectsView;

PubSub.subscribe(ANY_UPDATED, updateView)
function updateView() {
  currPageView();
}

PubSub.subscribe(INDEX_PROJECTS_VIEW, indexProjectsView)
function indexProjectsView() {
  const headingElement = document.createElement('h1'),
        bylineElement = document.createElement('h2'),
        projectsHeadingElement = document.createElement('h2');
  headingElement.textContent = 'Actionality';
  bylineElement.textContent = 'Your one-stop to-do app';
  projectsHeadingElement.textContent = 'My Projects';
  document.body.append(headingElement, bylineElement, projectsHeadingElement);
  renderData.projects.forEach(project => {
    const projectElement = document.createElement('div'),
          titleElement = document.createElement('button');
    titleElement.textContent = project.title;
    projectElement.appendChild(titleElement);
    document.body.appendChild(projectElement);
  })
  currPageView = indexProjectsView;
  PubSub.publish(INDEX_PROJECTS_VIEW_RENDERED);
}



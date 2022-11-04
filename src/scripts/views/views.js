import './index-projects-view'
import './new-project-view'
import './show-project-view'
import './new-todoItem-view'
import './show-todoItem-view'

import PubSub from 'pubsub-js';
import { PAGE_RENDERED, ANY_UPDATED, BACK } from '../pubsub-event-types';
import defaultView from './index-projects-view';

let currPageView = defaultView;

PubSub.subscribe(PAGE_RENDERED, setCurrPageView)
function setCurrPageView(_, view) {
  currPageView = view;
}

PubSub.subscribe(ANY_UPDATED, updateView)
PubSub.subscribe(BACK, updateView)
function updateView() {
  document.body.innerHTML = '';
  currPageView();
}

import './index-projects-view'
import './index-todoItems-view'
import './index-checklistItems-view'
import './new-project-view'
import './new-todoItem-view'
import './new-checklistItem-view'
import './show-project-view'
import './show-todoItem-view'
import './edit-view'
import './error-view'

import PubSub from 'pubsub-js';
import { PAGE_RENDERED, DATA_UPDATED, BACK } from '../pubsub-event-types';
import defaultView from './index-projects-view';

let currPageView = defaultView;

PubSub.subscribe(PAGE_RENDERED, setCurrPageView);
function setCurrPageView(_, view) {
  currPageView = view;
}

PubSub.subscribe(DATA_UPDATED, updateView);
PubSub.subscribe(BACK, updateView);
function updateView() {
  document.body.innerHTML = '';
  currPageView();
}

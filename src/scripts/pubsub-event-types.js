export const INITIALIZE = 'initialize';
export const DATA_INITIALIZED = 'dataInitialized';

export const CREATE = type => `create.${type}`;
export const DESTROY = type => `create.${type}`;

export const UPDATE = type => `update.${type}`;
export const UPDATE_STATUS = type => `update.${type}.status`;
export const UPDATE_PRIORITY = type => `update.${type}.priority`;

export const ANY_UPDATED = 'updated';
export const UPDATED = type => `updated.${type}`;
export const BELONG_UPDATED = type => `updated.${type}.belong`;
export const LIST_UPDATED = type => `updated.${type}.list`;

export const INDEX_PROJECTS_VIEW = 'view.projects.index';
export const INDEX_PROJECTS_VIEW_RENDERED = 'rendered.projects.index';

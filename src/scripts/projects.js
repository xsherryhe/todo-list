import { Storageable, Validatable, PresenceValidatable, Updatable, Collectionable, Listable } from './composition-units';

export function Project(attributes) {
  const obj = Object.assign({ type: 'project' }, attributes);
  [Storageable, Validatable, Updatable].forEach(compFn => compFn(obj));
  PresenceValidatable(obj, ['title']);
  Collectionable(obj, 'todoItem');

  return obj;
}

//may change depending on storage data format
export function ProjectsList(fromStorageList) {
  const obj = { itemFactory: Project, itemType: 'project' }
  Listable(obj, fromStorageList);
  return obj;
}

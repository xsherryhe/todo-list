import { Updatable, Collectionable, Listable } from './composition-units';

export function Project(attributes) {
  const obj = Object.assign({ type: 'project' }, attributes);
  Updatable(obj);
  Collectionable(obj, 'todoItem');

  return obj;
}

//may change depending on storage data format
export function ProjectsList(rawItemList) {
  const obj = { itemFactory: Project, itemType: 'project' }
  Listable(obj, rawItemList);
  return obj;
}
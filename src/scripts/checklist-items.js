import { Storageable, Validatable, PresenceValidatable, Updatable, Statusable, Belongable, Listable } from './composition-units';

export function ChecklistItem(attributes) {
  const obj = Object.assign({ type: 'checklistItem' }, attributes);
  [Storageable, Validatable, Updatable, Statusable].forEach(compFn => compFn(obj));
  PresenceValidatable(obj, ['title']);
  Belongable(obj, 'todoItem');

  return obj;
}

export function ChecklistItemsList(fromStorageList) {
  const obj = { itemFactory: ChecklistItem, itemType: 'checklistItem' };
  Listable(obj, fromStorageList);
  return obj;
}

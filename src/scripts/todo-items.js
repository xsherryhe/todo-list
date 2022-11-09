import { Storageable, Validatable, PresenceValidatable, Updatable, Statusable, Prioritizable, 
         Collectionable, Belongable, Listable, BelongUpdatable } from './composition-units';
import { ChecklistItem } from './checklist-items';

export function TodoItem(attributes) {
  const obj = Object.assign({ type: 'todoItem' }, attributes);
  [Storageable, Validatable, Updatable, Statusable, Prioritizable].forEach(compFn => compFn(obj));
  [Belongable, BelongUpdatable].forEach(compFn => compFn(obj, 'project'));
  PresenceValidatable(obj, ['title']);
  Collectionable(obj, 'checklistItem', ChecklistItem);

  return obj;
}

export function TodoItemsList(fromStorageList) {
  const obj = { itemFactory: TodoItem, itemType: 'todoItem' };
  Listable(obj, fromStorageList);
  return obj;
}

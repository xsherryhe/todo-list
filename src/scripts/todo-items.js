import { Validatable, PresenceValidatable, Updatable, Statusable, Prioritizable, 
         Collectionable, Belongable, Listable, BelongUpdatable } from './composition-units';
import { ChecklistItem } from './checklist-items';

export function TodoItem(attributes) {
  const obj = Object.assign({ type: 'todoItem' }, attributes);
  [Validatable, Updatable, Statusable, Prioritizable].forEach(compFn => compFn(obj));
  [Belongable, BelongUpdatable].forEach(compFn => compFn(obj, 'project'));
  PresenceValidatable(obj, ['title']);
  Collectionable(obj, 'checklistItem', ChecklistItem);

  return obj;
}

export function TodoItemsList(rawItemList) {
  const obj = { itemFactory: TodoItem, itemType: 'todoItem' };
  Listable(obj, rawItemList);
  return obj;
}

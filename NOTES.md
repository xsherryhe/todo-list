//To do: Delete, create new, move to different project, delete project, create new project, edit project

Factories
-Todo: title, description, dueDate, priority (low 0, medium 1, high 2), status(0 incomplete, 1 complete), notes
  -priorities private variable with array of priorities
  -sub updateTodo, updateAttrs(details of update)
  -updateAttrs(details of update): for each detail in update, set the attribute; pub dataChanged
  -sub changeTodoPriority, changePriority
  -changePriority: priority = Math.max(Math.min(priority + data, 0), priorities.length - 1); updateAttrs(priority)
  -sub changeTodoStatus, changeStatus
  -changeStatus: status = (status + 1) % statuses.length; updateAttrs(status)

-Project: items (array)
  -addNew: pub dataChanged

-ProjectsList: projects(array)
  -sub storageInitialized, setProjects to storageData
  -setProjects(storageData = {})
  -getProjects

-localStorageProvider
  -deal with API details of localStorage

Modules
-todoController
  -initialize
    -pub initializeFromStorage
    -pub indexProjects

-storage:
  -sub initialize, initializeFromStorage
  -initializeFromStorage(storageProvider = localStorageProvider)
    -pub storageInitialized, storageData
  -sub dataChanged, saveToStorage
  -saveToStorage(storageProvider = localStorageProvider)
    -update storageData from ProjectsList

-DOMEvents
  -sub indexProjectsRendered
    -project button click: pub showProject, project index
  -sub showProjectRendered
    -all projects button click: pub indexProjects
    -for each todo item:
      -expand button click: pub showTodo, todo data
      -shrink button click: pub hideTodo, todo index
  -sub showTodoRendered
    -change status button click: pub changeTodoStatus, item index
    -change priority button click: pub changeTodoPriority, item index + button data-direction property (1 or -1)
    -text (button) click: pub editText, todo item index + button class
    -date (button) click: pub editDate
  -sub editInputRendered, enter key or update button click: pub updateTodo, details of update

-views
  *todos and projects have datasets with type of item (todo or project) and index
  -sub dataChanged, updateView(type of item, item index)
  -sub indexProjects, indexProjectsView
  -indexProjectsView(projects = projectsList.getProjects())
    -pub indexProjectsRendered
  -sub showProject, showProjectView(project)
  -showProjectView(project)
    -pub showProjectRendered
  -sub showTodo, showTodoView(todo)
  -showTodoView(todo)
    -pub showTodoRendered, todo index
  -sub hideTodo, hideTodoView(todo)
  -sub editText, editTextView
  -sub editDate, editDateView
  -editTextView(item index, type)
    -pub editInputRendered, item index
  -editDateView(item index, type)
    -pub editInputRendered, item index
  -getColors(array, color1, color2): split color range evenly and divide between number of items in array, return array items mapped to colors

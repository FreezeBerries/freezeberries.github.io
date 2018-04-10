var app = app || {};

app.listObj = function(name, list) {
    this.name = ko.observable(name);
    this.isSelected = ko.observable(false);
    this.list = ko.observableArray();
    this.created = ko.observable(new Date() + ' || ' + Math.random());
}

app.todoObj = function(text) {
    this.text = ko.observable(text || '');
    this.time = ko.observable(new Date().toLocaleString());
    this.isCompleted = ko.observable(false);

    //edit
    this.editText = ko.observable('');
    this.isEditing = ko.observable(false);
}

var listViewModal = function() {
    var self = this;
    self.todoList = ko.observableArray();
    self.userInput = ko.observable('');
    self.isLoading = ko.observable(true);
    self.name = ko.observable('');
    self.groupIndexRef = ko.observable();
    self.todo = ko.observable();
    self.deleteTodoObj = ko.observable();

    self.init = function(todo, index) {
        self.name(todo.name());
        self.todoList(todo.list());
        self.groupIndexRef(index);
        self.todo(todo);
    }

    self.userInputEnter = function(d, e) {
        if (e.keyCode === 13) {
            self.addTodo();
        }
        return true;
    }

    self.deleteTodoModal = function(index) {
        self.deleteTodoObj(index);
    }

    self.addTodo = function(index) {
        if (self.userInput() === '') {
            return;
        }

        self.todoList.unshift(new app.todoObj(self.userInput()));
        self.userInput('');
        app.db.saveTodoLists();
    };

    self.deleteTodo = function() {
        self.todoList.splice(self.todoList.indexOf(self.deleteTodoObj()), 1);
        $('#delete-todo').modal('hide');
        app.db.saveTodoLists();
    };

    self.editTodoSave = function(elm) {
        elm.text(elm.editText());
        // $('.flip-container').removeClass('flip');
        elm.isEditing(false);
        app.db.saveTodoLists();
    };

    self.editTodoCancel = function(elm) {
        elm.isEditing(false);
        // $('.flip-container').removeClass('flip');
    };

    self.editTodoMode = function(elm) {
        elm.editText(elm.text());
        // $('.flip-container').addClass('flip');
        elm.isEditing(true);
    };

    self.clearComplete = function() {
        for (var i = self.todoList().length - 1; i >= 0; i--) {
            if (self.todoList()[i].isCompleted()) {
                self.todoList.splice(i, 1);
            }
        }
        app.db.saveTodoLists();
    };

    self.renameListModal = function() {
        ViewModels.groupsVM.openChangeListName(self.todo());
    };

    self.deleteListModal = function() {
        ViewModels.groupsVM.openDeleteList(self.todo());
    }

};

var groupsViewModel = function() {
    var self = this;
    self.todoLists = ko.observableArray();

    self.dropdownOn = ko.observable(false);

    self.openDropdown = function(event, elm) {
        self.dropdownOn(true);
        // event.preventDefault();
    };

    self.resetListSelection = function() {
        self.todoLists()[0].isSelected(true);
        ViewModels.listVM.init(self.todoLists()[0]);
    }

    self.userInputName = ko.observable('');
    self.isAddingNew = ko.observable(false);

    self.openSideBar = function() {
        $('.overlay').addClass('active')
        $('.sidebar').animate({ left: "0" }, 500);

    }

    self.closeSideBar = function() {
        $('.overlay').removeClass('active')
        $('.sidebar').animate({ left: "-1000" }, 500);

    }

    self.actionForListIndex = ko.observable();
    self.renameListUserInput = ko.observable('');
    self.renameListUserInputError = ko.observable();
    self.openChangeListName = function(index) {
        self.renameListUserInput(index.name());
        self.actionForListIndex(index);
        $('#rename-todo-list').modal();
    }
    self.changeListName = function() {
        self.renameListUserInputError(undefined);
        var userInput = self.renameListUserInput();

        if (userInput == '') {
            self.renameListUserInputError('Please Enter a value');

            $('#rename-todo-list').addClass('shake-opacity');
            setTimeout(function() { $('#rename-todo-list').removeClass('shake-opacity'); }, 300);
            return;
        }

        for (var i = 0; i < self.todoLists().length; i++) {
            if (self.todoLists()[i].created == self.actionForListIndex().created) {
                if (ViewModels.listVM.name() === self.todoLists()[i].name()) {
                    ViewModels.listVM.name(userInput)
                }
                self.todoLists()[i].name(userInput);
                break;
            }
        }

        $('#rename-todo-list').modal('hide');
        app.db.saveTodoLists();
    }

    self.openDeleteList = function(index) {
        self.actionForListIndex(index);
        $('#delete-todo-list').modal();
    }
    self.deleteList = function() {
        for (var i = 0; i < self.todoLists().length; i++) {
            if (self.todoLists()[i].created == self.actionForListIndex().created) {
                self.todoLists.splice(i, 1);
                break;
            }
        }
        ViewModels.groupsVM.resetListSelection();
        $('#delete-todo-list').modal('hide');
        app.db.saveTodoLists();
    }


    self.selectList = function(index) {
        if (self.dropdownOn()) {
            self.dropdownOn(false);
            return;
        }

        var selectedListIndex;
        for (var i = 0; i < self.todoLists().length; i++) {
            if (self.todoLists()[i].created == index.created) {
                self.todoLists()[i].isSelected(true);
                selectedListIndex = i;
            }
            else {
                self.todoLists()[i].isSelected(false);
            }
        }
        if (window.innerWidth <= 700 && self.dropdownOn() === false) {
            self.closeSideBar();
        }
        ViewModels.listVM.init(index, selectedListIndex);
    };


    //adding ui

    self.addNewEnter = function(d, e) {
        if (e.keyCode === 13) {
            self.saveAddNew();
        }
        return true;
    }

    self.addNewView = function() {
        self.isAddingNew(true);
    };

    self.cancelAddNew = function() {
        self.isAddingNew(false);
        self.userInputName('');
    };

    self.saveAddNew = function() {
        var userInput = self.userInputName();
        self.userInputName('');
        self.isAddingNew(false);

        self.todoLists.push(new app.listObj(userInput));
        app.db.saveTodoLists();
    };
};
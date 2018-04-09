var app = app || {};

// app.init = function() {
//     ko.applyBindings(new app.viewModal(), $('#todo-container')[0]);
// };

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
        console.log(e.keyCode);
        if (e.keyCode === 13) {
            console.log('hit');
            self.addTodo();
        }
        return true;
    }

    self.deleteTodoModal = function(index) {
        self.deleteTodoObj(index);
        console.log('this is it', index);
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
        console.log('hit clear complete');
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
        console.log('delete this');
        for (var i = 0; i < self.todoLists().length; i++) {
            if (self.todoLists()[i].created == self.actionForListIndex().created) {
                console.log('hit');
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
        console.log(e.keyCode);
        if (e.keyCode === 13) {
            console.log('hit');
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

// var AppViewModel = function() {
//     var self = this;

//     self.isVisible = ko.observable(false);

//     self.makeVisible = function() {
//         self.isVisible(true);

//         ViewModels.accountVM.isVisible(false);
//         ViewModels.navbarVM.isVisible(true);
//         ViewModels.sceneVM.isVisible('dashboard');
//     }
// };

// var DashboardViewModel = function() {
//     var self = this;
//     self.isLoading = ko.observable(true);
//     self.quizzes = ko.observableArray();

//     self.new = function() {
//         ViewModels.sceneVM.isVisible('creator');
//     };

//     self.startQuiz = function(index) {
//         ViewModels.quizVM.init(index);
//         ViewModels.sceneVM.isVisible('quiz');
//     };

//     self.deleteQuiz = function(index) {
//         console.log(index);
//         for (var i = 0; i < self.quizzes().length; i++) {
//             if(self.quizzes()[i].id == index.id) {
//                 self.quizzes.splice(i, 1);
//                 break;
//             }
//         }

//         if(index.id == 'demo') {
//             return;
//         }

//         db.collection(app.user.uid).doc(index.id).delete().then(function() {
//             console.log("Document successfully deleted!");
//         }).catch(function(error) {
//             console.error("Error removing document: ", error);
//         });
//     }
// };


// var answerObj = function(answer) {
//     var self = this;
//     self.answer = ko.observable(answer || '');
//     self.answerErrorMessage = ko.observable();
//     self.isCorrect = ko.observable(false);
// }

// var questionObj = function(question) {
//     var self = this;
//     self.question = ko.observable(question || '');
//     self.questionErrorMessage = ko.observable();
//     self.answers = ko.observableArray();
//     self.answers.push(new answerObj());
//     self.answers.push(new answerObj());
//     self.answers.push(new answerObj());
//     self.answers.push(new answerObj());
// }


// var CreatorViewModel = function() {
//     var self = this;

//     self.name = ko.observable('');
//     self.nameErrorMessage = ko.observable();
//     self.description = ko.observable('');
//     self.descriptionErrorMessage = ko.observable();
//     self.questions = ko.observableArray();
//     self.questions.push(new questionObj());

//     self.hasErrors = ko.observable(false);

//     self.reset = function() {
//         self.name('');
//         self.description('');
//         self.questions([]);
//         self.hasErrors(false);
//         self.questions.push(new questionObj());
//     }

//     self.addQuestion = function() {
//         self.questions.push(new questionObj());
//     };

//     self.back = function() {
//         ViewModels.sceneVM.isVisible('dashboard');
//     };

//     self.submit = function() {
//         self.hasErrors(false);
//         var name = self.name();
//         var description = self.description();
//         var questions = self.questions();

//         if (name == '') {
//             self.hasErrors(true);
//             self.nameErrorMessage('Please enter a value');
//         }
//         if (description == '') {
//             self.hasErrors(true);
//             self.descriptionErrorMessage('Please enter a value');
//         }

//         if (questions.length) {
//             for (var i = 0; i < questions.length; i++) {
//                 //read only
//                 var question = questions[i].question();
//                 var answers = questions[i].answers();

//                 if (question == '') {
//                     self.hasErrors(true);
//                     questions[i].questionErrorMessage('Please enter a value');
//                 }

//                 if (answers.length) {
//                     for (var x = 0; x < answers.length; x++) {
//                         if (answers[x].answer() == '') {
//                             answers[x].answerErrorMessage('Please enter a value');
//                         }
//                     }

//                 }
//             }
//         }

//         if (self.hasErrors()) {

//             $('#quiz-form form').addClass('shake');
//             setTimeout(function() { $('#quiz-form form').removeClass('shake'); }, 333);
//             self.hasErrors(true);
//             return;
//         }
//         else {
//             var quizQuestions = [];
//             for (var i = 0; i < questions.length; i++) {
//                 var quizAnswers = [];
//                 for (var x = 0; x < questions[i].answers().length; x++) {
//                     quizAnswers.push(app.obj.answer(questions[i].answers()[x].answer(), questions[i].answers()[x].isCorrect()));
//                 }
//                 quizQuestions.push(app.obj.question(questions[i].question(), quizAnswers));
//             }

//             app.db.createQuiz(app.obj.quiz(name, description, quizQuestions));
//             self.reset();
//         }
//     };
// }

// var QuizViewModel = function() {
//     var self = this;
//     self.questions = ko.observableArray();
//     self.index = ko.observable(0);
//     self.question = ko.observable();
//     self.answers = ko.observableArray();
//     self.userAnswer = ko.observable(null);
//     self.id = ko.observable();
//     self.noUserSelection = ko.observable();
//     self.show = ko.observable('result'); //result, correct, or wrong
//     self.result = ko.observable('');
//     self.correctCounter = ko.observable(0);
//     self.wrongCounter = ko.observable(0);

//     self.init = function(quizObj) {
//         self.noUserSelection(undefined);
//         self.questions(quizObj.questions);
//         self.index(0);
//         self.id(quizObj.id);
//         self.question(quizObj.questions[0].question);
//         self.answers(quizObj.questions[0].answers);
//         self.result('');
//         $('.flip-container').removeClass('flip');
//         self.correctCounter(0);
//         self.wrongCounter(0);
//     };

//     self.next = function() {
//         var userAnswer = $('[name="user-answer"]:checked').val();
//         var correctAnswer = null;
//         if (userAnswer === undefined) {
//             self.noUserSelection(true);
//             return;
//         }
//         else {
//             self.noUserSelection(undefined);
//         }

//         for (var i = 0; i < self.answers().length; i++) {
//             if (self.answers()[i].isCorrect) {
//                 correctAnswer = i + 1;
//                 break;
//             }
//         }


//         if (userAnswer == correctAnswer) {
//             self.correctCounter(self.correctCounter() + 1);
//             self.show('correct');
//         }
//         else {
//             self.wrongCounter(self.wrongCounter() + 1);
//             self.show('wrong');
//         }

//         if (self.index() + 1 != self.questions().length) {
//             $('.flip-container').addClass('flip');
//             setTimeout(function() {
//                 self.question(self.questions()[self.index() + 1].question);
//                 self.answers(self.questions()[self.index() + 1].answers);
//                 self.index(self.index() + 1);
//             }, 250);

//             setTimeout(function() {
//                 $('.flip-container').removeClass('flip');
//             }, 1000);
//         }
//         else {
//             self.show('result');
//             $('.flip-container').addClass('flip');
//         }
//     }

//     self.cancel = function() {
//         ViewModels.sceneVM.isVisible('dashboard');
//     };

//     self.finish = function() {
//         console.log('test over');
//     }
// }



// var loadQuizes = function() {
//     ViewModels.dashboardVM.quizzes([]);
//     ViewModels.dashboardVM.isLoading(true);
//     app.db.getAllQuizes(function(result) {
//         if (result.success) {
//             ViewModels.dashboardVM.isLoading(false);
//             ViewModels.dashboardVM.quizzes.push(result.data);
//         }
//     });
// };

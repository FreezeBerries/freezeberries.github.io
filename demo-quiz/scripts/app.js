var AppViewModel = function() {
    var self = this;

    self.isVisible = ko.observable(false);

    self.makeVisible = function() {
        self.isVisible(true);

        ViewModels.accountVM.isVisible(false);
        ViewModels.navbarVM.isVisible(true);
        ViewModels.sceneVM.isVisible('dashboard');
    }
};

var DashboardViewModel = function() {
    var self = this;
    self.isLoading = ko.observable(true);
    self.quizzes = ko.observableArray();
    self.quizBeingDeleted = ko.observable();

    self.new = function() {
        ViewModels.sceneVM.isVisible('creator');
    };

    self.startQuiz = function(index) {
        ViewModels.quizVM.init(index);
        ViewModels.sceneVM.isVisible('quiz');
    };

    self.deleteQuizModal = function(index) {
        self.quizBeingDeleted(index);
        $('#delete-todo-list').modal()
    }

    self.deleteQuiz = function() {
        var index = self.quizBeingDeleted();
        for (var i = 0; i < self.quizzes().length; i++) {
            if (self.quizzes()[i].id == index.id) {
                self.quizzes.splice(i, 1);
                break;
            }
        }
        $('#delete-todo-list').modal('hide')
    
        db.collection(app.user.uid + '/quizzes/lists').doc(index.id).delete().then(function() {
        }).catch(function(error) {
        });
    }
};


var answerObj = function(answer) {
    var self = this;
    self.answer = ko.observable(answer || '');
    self.answerErrorMessage = ko.observable();
    self.isCorrect = ko.observable(false);
}

var questionObj = function(question) {
    var self = this;
    self.question = ko.observable(question || '');
    self.questionErrorMessage = ko.observable();
    self.answers = ko.observableArray();
    self.answers.push(new answerObj());
    self.answers.push(new answerObj());
    self.answers.push(new answerObj());
    self.answers.push(new answerObj());
}


var CreatorViewModel = function() {
    var self = this;

    self.name = ko.observable('');
    self.nameErrorMessage = ko.observable();
    self.description = ko.observable('');
    self.descriptionErrorMessage = ko.observable();
    self.questions = ko.observableArray();
    self.questions.push(new questionObj());

    self.hasErrors = ko.observable(false);

    self.reset = function() {
        self.name('');
        self.description('');
        self.questions([]);
        self.hasErrors(false);
        self.questions.push(new questionObj());
    }

    self.addQuestion = function() {
        self.questions.push(new questionObj());
    };

    self.back = function() {
        ViewModels.sceneVM.isVisible('dashboard');
    };

    self.submit = function() {
        self.hasErrors(false);
        var name = self.name();
        var description = self.description();
        var questions = self.questions();

        if (name == '') {
            self.hasErrors(true);
            self.nameErrorMessage('Please enter a value');
        }
        if (description == '') {
            self.hasErrors(true);
            self.descriptionErrorMessage('Please enter a value');
        }

        if (questions.length) {
            for (var i = 0; i < questions.length; i++) {
                //read only
                var question = questions[i].question();
                var answers = questions[i].answers();

                if (question == '') {
                    self.hasErrors(true);
                    questions[i].questionErrorMessage('Please enter a value');
                }

                if (answers.length) {
                    for (var x = 0; x < answers.length; x++) {
                        if (answers[x].answer() == '') {
                            answers[x].answerErrorMessage('Please enter a value');
                        }
                    }

                }
            }
        }

        if (self.hasErrors()) {

            $('#quiz-form form').addClass('shake');
            setTimeout(function() { $('#quiz-form form').removeClass('shake'); }, 333);
            self.hasErrors(true);
            return;
        }
        else {
            var quizQuestions = [];
            for (var i = 0; i < questions.length; i++) {
                var quizAnswers = [];
                for (var x = 0; x < questions[i].answers().length; x++) {
                    quizAnswers.push(app.obj.answer(questions[i].answers()[x].answer(), questions[i].answers()[x].isCorrect()));
                }
                quizQuestions.push(app.obj.question(questions[i].question(), quizAnswers));
            }

            app.db.createQuiz(app.obj.quiz(name, description, quizQuestions), function() {
                loadQuizes();
                self.reset();
                self.back();
            });
        }
    };
}

var QuizViewModel = function() {
    var self = this;
    self.questions = ko.observableArray();
    self.index = ko.observable(0);
    self.question = ko.observable();
    self.answers = ko.observableArray();
    self.userAnswer = ko.observable(null);
    self.id = ko.observable();
    self.noUserSelection = ko.observable();
    self.show = ko.observable('result'); //result, correct, or wrong
    self.result = ko.observable('');
    self.correctCounter = ko.observable(0);
    self.wrongCounter = ko.observable(0);
    self.showResult = ko.observable(false);

    self.init = function(quizObj) {
        self.noUserSelection(undefined);
        self.questions(quizObj.questions);
        self.index(0);
        self.id(quizObj.id);
        self.question(quizObj.questions[0].question);
        self.answers(quizObj.questions[0].answers);
        self.result('');
        $('.flip-container').removeClass('flip');
        self.correctCounter(0);
        self.wrongCounter(0);
        self.showResult(false);
    };

    self.next = function() {
        var userAnswer = $('[name="user-answer"]:checked').val();
        var correctAnswer = null;
        if (userAnswer === undefined) {
            self.noUserSelection(true);
            return;
        }
        else {
            self.noUserSelection(undefined);
        }

        for (var i = 0; i < self.answers().length; i++) {
            if (self.answers()[i].isCorrect) {
                correctAnswer = i + 1;
                break;
            }
        }


        if (userAnswer == correctAnswer) {
            self.correctCounter(self.correctCounter() + 1);
            self.show('correct');
        }
        else {
            self.wrongCounter(self.wrongCounter() + 1);
            self.show('wrong');
        }

        $('.flip-container').addClass('flip');
        setTimeout(function() {
            self.question(self.questions()[self.index() + 1].question);
            self.answers(self.questions()[self.index() + 1].answers);
            self.index(self.index() + 1);
        }, 250);

        setTimeout(function() {
            $('.flip-container').removeClass('flip');
        }, 1000);
        
        if (self.index() + 1 != self.questions().length) {

        }
        else {
            setTimeout(function(){
                self.showResult(true);
            }, 250);
            // $('.flip-container').addClass('flip');
        }
    }

    self.cancel = function() {
        ViewModels.sceneVM.isVisible('dashboard');
    };
}



var loadQuizes = function() {
    ViewModels.dashboardVM.quizzes([]);
    ViewModels.dashboardVM.isLoading(true);
    app.db.getAllQuizes(function(result) {
        if (result.success) {
            window.temp = result.data;
            ViewModels.dashboardVM.isLoading(false);
            ViewModels.dashboardVM.quizzes.push(result.data);
            ViewModels.dashboardVM.quizzes.sort(function(a,b){
                return b.createdTimestamp - a.createdTimestamp
            });
        }
    });
};

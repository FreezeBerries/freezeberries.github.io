var ViewModels = {};
var app = app || {};
app.user = null;

app.init = function(option) {
    console.log(option);
    // re-init
    if (app.isInit) {
        if (option == undefined && option.view == undefined) return;
        switch (option.view) {
            case 'login':
                ViewModels.accountVM.makeVisible(true);
                ViewModels.loginVM.makeVisible(true);
                break;
            case 'dashboard':

                // if (option.view === 'dashboard') {
                    ViewModels.groupsVM.todoLists([]);
                    app.db.getAllTodoLists(function(list) {
                        var data = list.data;
                        app.db.id = list.id;

                        for (var i = 0; i < data.length; i++) {
                            data[i].isSelected = false;
                            ViewModels.groupsVM.todoLists.push(ko.mapping.fromJS(data[i]))
                        };
                        ViewModels.groupsVM.resetListSelection();
                    });
                // }

                // ViewModels.groupsVM.resetListSelection();
                // loadQuizes();
                ViewModels.loginVM.userName('');
                ViewModels.loginVM.userPassword('');
                ViewModels.accountVM.isVisible(false);
                ViewModels.navbarVM.isVisible(true);
                // ViewModels.appVM.makeVisible(true);
                break;
        }
        return;
    };


    ViewModels = {
        //account file
        accountVM: new AccountViewModal(option && option.view == 'login'),
        forgotPasswordVM: new ForgotPasswordViewModel(),
        signupVM: new SignUpViewModel(),
        loginVM: new LoginViewModel(option && option.view == 'login'),
        //layout file
        navbarVM: new NavbarViewModel(option && option.view == 'dashboard'),
        sceneVM: new SceneViewModel('dashboard'),
        loadingVM: new LoadingViewModal(),
        //app file
        listVM: new listViewModal(),
        groupsVM: new groupsViewModel()
        // appVM: new AppViewModel(option && option.view == 'dashboard'),
        // dashboardVM: new DashboardViewModel(),
        // creatorVM: new CreatorViewModel(),
        // quizVM: new QuizViewModel()
    };

    app.transitions.init(function() {
        if (option.view === 'dashboard') {
            ViewModels.groupsVM.todoLists([]);
            app.db.getAllTodoLists(function(list) {
                var data = list.data;
                app.db.id = list.id;

                for (var i = 0; i < data.length; i++) {
                    data[i].isSelected = false;
                    ViewModels.groupsVM.todoLists.push(ko.mapping.fromJS(data[i]))
                };
                ViewModels.groupsVM.resetListSelection();
            });
        }

        ko.applyBindings(ViewModels);
        ViewModels.loadingVM.makeVisible(false);
        app.isInit = true;
    });
};

$(function() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            app.user = user;
            app.init({ view: 'dashboard' });
        }
        else {
            app.init({ view: 'login' });
        }
    });
});

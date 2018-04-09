var ViewModels = {};
var app = app || {};
app.user = null;

app.init = function(option) {
    // re-init
    if (app.isInit) {
        if (option == undefined && option.view == undefined) return;
        switch (option.view) {
            case 'login':
                ViewModels.accountVM.makeVisible(true);
                ViewModels.loginVM.makeVisible(true);
                break;
            case 'dashboard':
                loadQuizes();
                ViewModels.loginVM.userName('');
                ViewModels.loginVM.userPassword('');
                ViewModels.appVM.makeVisible(true);
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
        appVM: new AppViewModel(option && option.view == 'dashboard'),
        dashboardVM: new DashboardViewModel(),
        creatorVM: new CreatorViewModel(),
        quizVM: new QuizViewModel()
    };

    app.transitions.init(function() {
        if (option.view === 'dashboard') {
            loadQuizes();
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

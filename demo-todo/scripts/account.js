var AccountViewModal = function(show) {
    var self = this;

    self.isVisible = ko.observable(show || false);

    self.makeVisible = function() {
        self.isVisible(true);

        ViewModels.loginVM.makeVisible();

    }
};

var ForgotPasswordViewModel = function() {
    var self = this;

    self.email = ko.observable();
    self.isVisible = ko.observable(false);
    self.show = ko.observable('form');

    self.errorMessage = ko.observable();

    self.makeVisible = function() {
        self.isVisible(true);
        ViewModels.signupVM.isVisible(false);
        ViewModels.loginVM.isVisible(false);
    }

    self.tryAgain = function() {
        self.email('');
        self.show('form');
    }

    self.resetPassword = function() {
        self.errorMessage(undefined);

        if (!util.isValidateEmail(self.email())) {
            $('#resetPassword').addClass('shake-opacity');
            self.errorMessage('Please enter your account email.');
            setTimeout(function() { $('#resetPassword').removeClass('shake-opacity'); }, 333);
            return

        } else {
            self.show('sent');
            firebase.auth().sendPasswordResetEmail(self.email());
        }
    }
}

var SignUpViewModel = function(makeSignupViewVisible) {
    var self = this;

    self.userName = ko.observable();
    self.userPassword = ko.observable();
    self.isVisible = ko.observable(makeSignupViewVisible);

    self.userNameError = ko.observable();
    self.userPasswordError = ko.observable();

    self.errorMessage = ko.observable();

    self.makeVisible = function() {
        self.isVisible(true);

        ViewModels.loginVM.isVisible(false);
        ViewModels.forgotPasswordVM.isVisible(false);
    }
    //private
    var usernameValidation = function() {
        //username is email
        var e = self.userName();
        var returningBool = true;

        self.userNameError(undefined);

        // username must be a valid email
        if (!util.isValidateEmail(e)) {
            self.userNameError('Must be a valid email');
        }
        // username can not repeat. If it doesn't go to forgot password.
        // Sorry, that username's taken. Try another?

        if (self.userNameError() !== undefined) {
            returningBool = false;
        }

        return returningBool;
    }
    //private
    var passwordValidation = function() {
        var p = self.userPassword();
        var returningBool = true;

        self.userPasswordError(undefined);

        // password must be at least 5 characters
        if (!p || p.length < 5) {
            self.userPasswordError('Password must be at least 5 characters long');
        }

        if (self.userPasswordError() !== undefined) {
            returningBool = false;
        }

        return returningBool;
    }

    self.signup = function() {
        var isUsernameValue = usernameValidation();
        var isPasswordValue = passwordValidation();
        if (!isUsernameValue || !isPasswordValue) {
            $('#register').addClass('shake-opacity');

            setTimeout(function() { $('#register').removeClass('shake-opacity'); }, 333);
            return;
        }
        firebase.auth().createUserWithEmailAndPassword(self.userName(), self.userPassword()).catch(function(error) {
            // Handle Errors here.
            self.errorMessage(error.message);
            $('#register').addClass('shake-opacity');

            setTimeout(function() { $('#register').removeClass('shake-opacity'); }, 333);
        });
    }

}

var LoginViewModel = function(makeLoginViewVisible) {
    var self = this;

    self.userName = ko.observable("");
    self.userPassword = ko.observable("");
    self.isVisible = ko.observable(makeLoginViewVisible || false);

    self.errorMessage = ko.observable();

    self.makeVisible = function() {
        self.isVisible(true);

        ViewModels.signupVM.isVisible(false);
        ViewModels.forgotPasswordVM.isVisible(false);
    }

    self.login = function() {
        self.errorMessage(undefined);
        firebase.auth().signInWithEmailAndPassword(self.userName(), self.userPassword()).catch(function(error) {
            $('#login').addClass('shake-opacity');
            setTimeout(function() { $('#login').removeClass('shake-opacity'); }, 333);
            self.errorMessage(error.message);
        });
    }

}

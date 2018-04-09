var NavbarViewModel = function(showNavbar) {
    var self = this;
    self.isVisible = ko.observable(showNavbar || false);

    self.logout = function() {
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
        }).catch(function(error) {
            // An error happened.
        });
    }
};

var LoadingViewModal = function(){
    var self = this;
    
    self.isVisible = ko.observable(true);
    self.makeVisible = function(isVisible) {
        self.isVisible(isVisible);
    }
}
/*
    sceneName = 
    dashboard
    quiz
    creator
*/
var SceneViewModel = function(sceneName) {
    var self = this;
    self.isVisible = ko.observable(sceneName);

    self.makeVisible = function(sceneName) {
        self.isVisible(sceneName);
    }
};

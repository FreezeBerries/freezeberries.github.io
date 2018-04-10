var app = app || {};
app.db = app.db || {};

app.db.saveTodoLists = function() {
    var saveTodoLists = {
        data: ko.toJS(ViewModels.groupsVM.todoLists()).map((obj) => {
            delete obj.__ko_mapping__;
            return Object.assign({}, obj)
        })
    };
    
    db.collection(app.user.uid).doc('todoLists').set(saveTodoLists)
        .then(function(docRef) {
        })
        .catch(function(error) {
        });
};


app.db.getAllTodoLists = function(cb) {
    db.collection(app.user.uid).doc('todoLists').get().then(function(doc) {
        if (!doc.exists || doc.data().data.length == 0) {
            ViewModels.groupsVM.todoLists([
                new app.listObj("Personal"),
                new app.listObj("Shopping"),
                new app.listObj("Work")
            ]);
            ViewModels.groupsVM.resetListSelection();
            app.db.saveTodoLists();
            return;
        }

        if (cb !== undefined) cb(doc.data());
    });
};
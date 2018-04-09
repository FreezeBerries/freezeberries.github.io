var app = app || {};
app.db = app.db || {};

// app.db.newAccount = function() {
//     db.collection('demos/todos/' + app.user.uid).add(ko.fromJS([
//             new app.listObj("Personal"),
//             new app.listObj("Shopping"),
//             new app.listObj("Work")
//         ]))
//         .then(function(docRef) {
//             // console.log("Document written with ID: ", docRef.id);
//             // if (cb) cb({ success: true });
//         })
//         .catch(function(error) {
//             // console.error("Error adding document: ", error);
//             // if (cb) cb({ success: false });
//         });
// }

app.db.saveTodoLists = function() {
    var saveTodoLists = {
        data: ko.toJS(ViewModels.groupsVM.todoLists()).map((obj) => {
            delete obj.__ko_mapping__;
            return Object.assign({}, obj)
        })
    };
    // //fixed firebase bug
    // saveTodoLists = JSON.parse(JSON.stringify(saveTodoLists));
    console.log(saveTodoLists);
    // console.log('todoList', saveTodoLists , typeof(saveTodoLists));
    db.collection(app.user.uid).doc('todoLists').set(saveTodoLists)
        .then(function(docRef) {
            // console.log("Document written with ID: ", docRef.id);
            // if (cb) cb({ success: true });
        })
        .catch(function(error) {
            // console.error("Error adding document: ", error);
            // if (cb) cb({ success: false });
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

        console.log(doc.data());
        if (cb !== undefined) cb(doc.data());
    });
};




// app.obj.quiz = function(name, description, questions) {
//     var self = {};
//     self.name = name || null;
//     self.description = description || null;
//     self.questions = questions || null;
//     self.createdTimestamp = Date.now();
//     self.updatedTimestamp = null;

//     return self;
// };

// app.obj.question = function(question, answers) {
//     var self = {};
//     self.question = question || null;
//     self.answers = answers || null;
//     self.createdTimestamp = Date.now();
//     self.updatedTimestamp = null;

//     return self;
// };

// app.obj.answer = function(answer, isCorrect) {
//     var self = {};
//     self.answer = answer;
//     self.isCorrect = isCorrect;
//     self.createdTimestamp = Date.now();
//     self.updatedTimestamp = null;

//     return self;
// };

// app.db.createQuiz = function(appQuizObj) {

//     db.collection(app.user.uid).add(appQuizObj)
//         .then(function(docRef) {
//             // console.log("Document written with ID: ", docRef.id);
//             // if (cb) cb({ success: true });
//         })
//         .catch(function(error) {
//             // console.error("Error adding document: ", error);
//             // if (cb) cb({ success: false });
//         });
// }

// app.db.getAllQuizes = function(cb) {
//     var mikesQuiz = app.obj.quiz("Mike's Quiz", "Hi, this is my test. Enjoy!", [
//         app.obj.question("when was javascript created?", [
//             app.obj.answer("May 1995", true),
//             app.obj.answer("June 2010", false),
//             app.obj.answer("April 2000", false),
//             app.obj.answer("December 1970", false)
//         ]),
//         app.obj.question("Who created the C# programming language?", [
//             app.obj.answer("Microsoft", true),
//             app.obj.answer("Apple", false),
//             app.obj.answer("Google", false),
//             app.obj.answer("Adobe", false)
//         ]),
//         app.obj.question("When was sql created?", [
//             app.obj.answer("1970s", true),
//             app.obj.answer("1980s", false),
//             app.obj.answer("1990s", false),
//             app.obj.answer("2000s", false)
//         ]),
//         app.obj.question("The internet started as a darpa project in the 60s called?", [
//             app.obj.answer("ARPANET", true),
//             app.obj.answer("SKYNET", false),
//             app.obj.answer("FISHINGNET", false),
//             app.obj.answer("WORLDNET", false)
//         ])
//     ]);

//     db.collection(app.user.uid).get().then(function(querySnapshot) {
//         if (cb) {
//             cb({success: true, data: Object.assign(mikesQuiz, {id: 'demo'} )});
//         }
//         querySnapshot.forEach(function(doc) {
//             // doc.data() is never undefined for query doc snapshots
//             // console.log(doc.id, " => ", doc.data());


//             if (cb) cb({ success: true, data: Object.assign(doc.data(), { id: doc.id }) });
//         });
//     });
// };

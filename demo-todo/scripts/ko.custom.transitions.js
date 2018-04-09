var app = app || {};
app.transitions = app.transitions || {};

app.transitions.init = function(cb) {
    ko.bindingHandlers.fadeVisible = {
        init: function(element, valueAccessor) {
            // Initially set the element to be instantly visible/hidden depending on the value
            var value = valueAccessor();

            ko.unwrap(value) ? $(element).fadeIn(1000) : $(element).fadeOut(1000);
            // $(element).toggle(ko.unwrap(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
        },
        update: function(element, valueAccessor) {
            // Whenever the value subsequently changes, slowly fade the element in or out
            var value = valueAccessor();
            ko.unwrap(value) ? $(element).fadeIn(1000) : $(element).fadeOut(1000);
        }
    };

    ko.bindingHandlers.leftVisible = {
        init: function(element, valueAccessor) {
            // Initially set the element to be instantly visible/hidden depending on the value
            var value = valueAccessor();

            if (ko.unwrap(value)) {
                $(element).animate({ marginLeft: "0", marginRight: "0", opacity: 'show' }, 500);
            }
            else {
                $(element).animate({ marginLeft: "-1000px", marginRight: "1000px", opacity: 'hide' }, 500);
            }

        },
        update: function(element, valueAccessor) {
            // Whenever the value subsequently changes, slowly fade the element in or out
            var value = valueAccessor();

            if (ko.unwrap(value)) {
                $(element).animate({ marginLeft: "0", marginRight: "0", opacity: 'show' }, 500);
            }
            else {
                $(element).animate({ marginLeft: "-1000px", marginRight: "1000px", opacity: 'hide' }, 500);
            }
        }
    };

    ko.bindingHandlers.rightVisible = {
        init: function(element, valueAccessor) {
            // Initially set the element to be instantly visible/hidden depending on the value
            var value = valueAccessor();

            if (ko.unwrap(value)) {
                $(element).animate({ marginLeft: "0", marginRight: "0", opacity: 'show' }, 500);
            }
            else {
                $(element).animate({ marginLeft: "1000px", marginRight: "-1000px", opacity: 'hide' }, 500);
            }

        },
        update: function(element, valueAccessor) {
            // Whenever the value subsequently changes, slowly fade the element in or out
            var value = valueAccessor();

            if (ko.unwrap(value)) {
                $(element).animate({ marginLeft: "0", marginRight: "0", opacity: 'show' }, 500);
            }
            else {
                $(element).animate({ marginLeft: "1000px", marginRight: "-1000px", opacity: 'hide' }, 500);
            }
        }
    };

    ko.bindingHandlers.topVisible = {
        init: function(element, valueAccessor) {
            // Initially set the element to be instantly visible/hidden depending on the value
            var value = valueAccessor();

            if (ko.unwrap(value)) {
                $(element).animate({ marginBottom: "0", marginTop: "0", opacity: 'show' }, 500);
            }
            else {
                $(element).animate({ marginBottom: "2000px", marginTop: "-2000px", opacity: 'hide' }, 500);
            }

        },
        update: function(element, valueAccessor) {
            // Whenever the value subsequently changes, slowly fade the element in or out
            var value = valueAccessor();

            if (ko.unwrap(value)) {
                $(element).animate({ marginBottom: "0", marginTop: "0", opacity: 'show' }, 500);
            }
            else {
                $(element).animate({ marginBottom: "2000px", marginTop: "-2000px", opacity: 'hide' }, 500);
            }
        }
    };
    ko.bindingHandlers.appVisible = {
        init: function(element, valueAccessor) {
            // Initially set the element to be instantly visible/hidden depending on the value
            var value = valueAccessor();

            if (ko.unwrap(value)) {
                $(element).animate({ marginBottom: "0", marginTop: "0", opacity: 'show' }, 10);
            }
            else {
                $(element).hide();
            }

        },
        update: function(element, valueAccessor) {
            // Whenever the value subsequently changes, slowly fade the element in or out
            var value = valueAccessor();

            if (ko.unwrap(value)) {
                $(element).animate({ marginBottom: "0", marginTop: "0", opacity: 'show' }, 500);
            }
            else {
                $(element).hide(500);
            }
        }
    };

    if (cb) cb();
}


// $("#coolDiv").css({left:left})  // Set the left to its calculated position
//              .animate({"left":"0px"}, "slow");

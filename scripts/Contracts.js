define(["require", "exports"], function (require, exports) {
    "use strict";
    var Actions = (function () {
        function Actions() {
        }
        Actions.ToBoard = 1;
        Actions.ToTray = 2;
        Actions.OpenOrClose = 3;
        return Actions;
    }());
    exports.Actions = Actions;
});

define(["require", "exports"], function (require, exports) {
    "use strict";
    var Actions = (function () {
        function Actions() {
        }
        Actions.ToBoard = 1;
        Actions.ToTray = 2;
        Actions.OpenOrClose = 3;
        Actions.Pass = 4;
        Actions.ReDraw = 5;
        Actions.Approve = 6;
        return Actions;
    }());
    exports.Actions = Actions;
});

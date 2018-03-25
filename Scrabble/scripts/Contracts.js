define(["require", "exports"], function (require, exports) {
    "use strict";
    var Actions = (function () {
        function Actions() {
        }
        Actions.Init = 0;
        Actions.ToBoard = 1;
        Actions.ToTray = 2;
        Actions.OpenOrClose = 3;
        Actions.Pass = 4;
        Actions.ReDraw = 5;
        Actions.Approve = 6;
        Actions.BotMove = 7;
        Actions.BotMoveResponse = 8;
        return Actions;
    }());
    exports.Actions = Actions;
});

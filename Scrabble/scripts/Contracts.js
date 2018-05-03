define(["require", "exports"], function (require, exports) {
    "use strict";
    var Actions = (function () {
        function Actions() {
        }
        Actions.Init = 0;
        Actions.ToBoard = 20;
        Actions.ToTray = 21;
        Actions.OpenOrClose = 30;
        Actions.Pass = 40;
        Actions.ReDraw = 41;
        Actions.PunchAndPick = 42;
        Actions.BotMove = 50;
        Actions.BotMoveResponse = 51;
        Actions.Approve = 60;
        Actions.DismissDialog = 90;
        return Actions;
    }());
    exports.Actions = Actions;
});

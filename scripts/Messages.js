define(["require", "exports"], function (require, exports) {
    "use strict";
    var Messages = (function () {
        function Messages() {
        }
        Messages.InvalidMove = "";
        Messages.UseSynonym = "";
        Messages.Messages = "";
        Messages.CrossCells = "";
        Messages.HasIslands = "";
        Messages.HasOraphans = "";
        Messages.OrphanCell = "";
        Messages.HasDupliates = "";
        Messages.Claimed = "";
        return Messages;
    }());
    exports.Messages = Messages;
});

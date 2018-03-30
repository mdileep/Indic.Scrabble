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
        Messages.Thinking = "";
        Messages.YourTurn = "";
        Messages.BotEffort = "";
        Messages.BotNoWords = "";
        Messages.BotEffort2 = "";
        Messages.GameOver = "";
        Messages.Winner = "";
        Messages.MatchTied = "";
        Messages.WhyGameOver = "";
        Messages.NoWordsAdded = "";
        Messages.Stats = "";
        return Messages;
    }());
    exports.Messages = Messages;
});

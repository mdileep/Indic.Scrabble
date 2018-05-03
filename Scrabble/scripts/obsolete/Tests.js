define(["require", "exports", 'AskBot'], function (require, exports, AB) {
    "use strict";
    var RunerTest = (function () {
        function RunerTest() {
        }
        RunerTest.Go = function () {
            var Board = {
                Bot: "eenadu",
                Reference: "281",
                Name: "11x11",
                Cells: [
                    "", "", "", "", "", "", "", "", "", "", "",
                    "", "", "", "", "", "", "", "", "", "", "",
                    "", "", "", "", "", "", "", "", "శ", "", "",
                    "", "", "", "", "", "", "", "క", "స,ఇ", "", "",
                    "", "", "", "", "", "", "గ", "క", "", "", "",
                    "", "", "", "", "", "శ", "బ", "శ", "", "", "",
                    "", "", "", "", "చ,ఆ", "వ,ఇ", "", "", "", "", "",
                    "", "", "", "", "ల", "", "", "", "", "", "",
                    "", "", "", "", "", "", "", "", "", "", "",
                    "", "", "", "", "", "", "", "", "", "", "",
                    "", "", "", "", "", "", "", "", "", "", "",
                ],
                Conso: "క ఙ చ జ ప ల స",
                Special: "(ల,ఉ) ",
                Vowels: "అ ఆ ఈ ఉ ఉ ఎ ఏ ఓ"
            };
            AB.AskBot.BotMoveClient(Board);
        };
        return RunerTest;
    }());
    exports.RunerTest = RunerTest;
});

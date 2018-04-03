define(["require", "exports", 'axios', 'GameLoader', 'Contracts', 'Util'], function (require, exports, axios, GameLoader, Contracts, U) {
    "use strict";
    var AskBot = (function () {
        function AskBot() {
        }
        AskBot.NextMove = function () {
            GameLoader.GameLoader.store.dispatch({
                type: Contracts.Actions.BotMove,
                args: {}
            });
        };
        AskBot.BotMove = function (post) {
            AskBot.BotMoveServer(post);
        };
        AskBot.BotMoveServer = function (post) {
            axios
                .post("/API.ashx?nextmove", post)
                .then(function (response) {
                GameLoader.GameLoader.store.dispatch({
                    type: Contracts.Actions.BotMoveResponse,
                    args: response.data
                });
            })
                .catch(function (error) { });
        };
        AskBot.BotMoveClient = function (post) {
        };
        return AskBot;
    }());
    exports.AskBot = AskBot;
    var BoardUtil = (function () {
        function BoardUtil() {
        }
        BoardUtil.FindNeighbors = function (index, size) {
            var arr = { Right: -1, Left: -1, Top: -1, Bottom: -1 };
            var pos = BoardUtil.Position(index, size);
            var bottom = BoardUtil.Abs(pos.X + 1, pos.Y, size);
            var top = BoardUtil.Abs(pos.X - 1, pos.Y, size);
            var left = BoardUtil.Abs(pos.X, pos.Y - 1, size);
            var right = BoardUtil.Abs(pos.X, pos.Y + 1, size);
            arr = { Right: right, Left: left, Top: top, Bottom: bottom };
            return arr;
        };
        BoardUtil.Position = function (N, size) {
            var X = Math.floor(N / size);
            var Y = (N % size);
            return { X: X, Y: Y };
        };
        BoardUtil.Abs = function (X, Y, size) {
            var min = 0;
            var max = size - 1;
            if ((X < min || X > max) || (Y < min || Y > max)) {
                return -1;
            }
            return (size * (X + 1)) + Y - size;
        };
        return BoardUtil;
    }());
    exports.BoardUtil = BoardUtil;
    var WordLoader = (function () {
        function WordLoader() {
        }
        WordLoader.LoadWords = function (file) {
            var arr = [];
            return arr;
        };
        WordLoader.Load = function (file) {
            return WordLoader.LoadWords(file);
        };
        return WordLoader;
    }());
    exports.WordLoader = WordLoader;
    var ProbableWordComparer = (function () {
        function ProbableWordComparer() {
        }
        ProbableWordComparer.prototype.Equals = function (x, y) {
            if (x.Cells.length == y.Cells.length) {
                return true;
            }
            for (var i = 0; i < x.Cells.length; i++) {
                if (x.Cells[i].Index != y.Cells[i].Index) {
                    return false;
                }
                if (x.Cells[i].Target != y.Cells[i].Target) {
                    return false;
                }
            }
            return true;
        };
        return ProbableWordComparer;
    }());
    exports.ProbableWordComparer = ProbableWordComparer;
    var Config2 = (function () {
        function Config2() {
        }
        Config2.GetBot = function (bot) {
            return null;
        };
        Config2.GetBoard = function (name) {
            return null;
        };
        Config2.GetCharSet = function (lang) {
            return null;
        };
        return Config2;
    }());
    exports.Config2 = Config2;
    var Runner2 = (function () {
        function Runner2() {
        }
        Runner2.prototype.BestMove = function (Board) {
            var Moves = this.Probables(Board);
            if (Moves.length == 0) {
                return null;
            }
            return Moves[0];
        };
        Runner2.prototype.Probables = function (Board) {
            var Moves = [];
            if (Board == null) {
                return;
            }
            var bot = Config2.GetBot(Board.Bot);
            if (bot == null) {
                return;
            }
            var board = Config2.GetBoard(Board.Name);
            if (board == null) {
                return;
            }
            var CharSet = Config2.GetCharSet(bot.Language);
            var size = board.Size;
            var weights = board.Weights;
            var cells = Board.Cells;
            var vowels = Board.Vowels;
            var conso = Board.Conso;
            var special = Board.Special;
            var file = bot.Dictionary;
            if (CharSet == null || cells == null || weights == null || U.Util.IsNullOrEmpty(file) ||
                (U.Util.IsNullOrEmpty(vowels) && U.Util.IsNullOrEmpty(conso) && U.Util.IsNullOrEmpty(special))) {
                return Moves;
            }
            if (cells.length != size * size || weights.length != size * size) {
                return Moves;
            }
            var All = [];
            var NonCornerTiles = [];
            var AllPattern = "";
            var NonCornerPattern = "";
            var Movables = (vowels + " " + conso + " " + special);
            var MovableList = Movables.Replace("(", " ").Replace(")", " ").Replace(",", "").split(' ');
            var SpecialList = this.DistinctList(special.Replace("(", " ").Replace(")", " ").Replace(",", ""), ' ');
            return Moves;
        };
        Runner2.prototype.DistinctList = function (Set, Seperator) {
            var List = [];
            var arr = Set.split(Seperator);
            for (var indx in arr) {
                var s = arr[indx];
                if (U.Util.IsNullOrEmpty(s)) {
                    continue;
                }
                if (!List.Contains(s)) {
                    List.push(s);
                }
            }
            return List;
        };
        Runner2.prototype.GetCountDict2 = function (input) {
            var Dict = {};
            var arr = input.split(',');
            for (var indx in arr) {
                var s = arr[indx];
                for (var indx2 = 0; indx2 < s.length; indx2++) {
                    var c = s[indx2];
                    if (Dict.hasOwnProperty(c)) {
                        Dict[c]++;
                    }
                    else {
                        Dict[c] = 1;
                    }
                }
            }
            return Dict;
        };
        Runner2.prototype.GetCountDict = function (inputs) {
            if (inputs == null) {
                return null;
            }
            var Dict = {};
            for (var indx in inputs) {
                var input = inputs[indx];
                if (U.Util.IsNullOrEmpty(input)) {
                    continue;
                }
                if (Dict.ContainsKey(input)) {
                    Dict[input]++;
                }
                else {
                    Dict[input] = 1;
                }
            }
            return Dict;
        };
        Runner2.Classify = function (CharSet, syllable, Consos, Vowels) {
            var Sunna = [];
            var arr = syllable.split(',');
            for (var indx in arr) {
                var c = arr[indx];
                if (CharSet.SunnaSet.Contains(c)) {
                    Sunna.push(c);
                }
                else {
                    if (CharSet.Vowels.Contains(c)) {
                        Vowels.push(c);
                    }
                    else if (CharSet.Consonents.Contains(c)) {
                        Consos.push(c);
                    }
                    else {
                        debugger;
                    }
                }
            }
            Vowels = Vowels.concat(Sunna);
        };
        Runner2.Classify2 = function (CharSet, syllable, Consos, Vowels) {
            var Sunna = [];
            var arr = syllable.split(',');
            for (var indx in arr) {
                var c = arr[indx];
                if (CharSet.SunnaSet.Contains(c)) {
                    Sunna.push(c);
                }
                else {
                    if (CharSet.Vowels.Contains(c)) {
                        Vowels.push(c);
                    }
                    else if (CharSet.Consonents.Contains(c)) {
                        Consos.push(c);
                    }
                    else {
                        debugger;
                    }
                }
            }
            Vowels = Vowels.concat(Sunna);
        };
        Runner2.GenWordPattern = function (CharSet, word, consoPatternNoComma, sunnaPattern, allPatternNoComma, prePattern, postPattern, useSyllableIndex) {
            var temp = "";
            var arr = word.split('|');
            for (var i = 0; i < arr.length; i++) {
                var syllable = arr[i];
                var pattern = "";
                if (useSyllableIndex) {
                }
                else {
                }
                temp = temp + pattern + ",";
            }
            temp = temp.TrimEnd(',');
            temp = prePattern + temp + postPattern;
            temp = U.Util.Format("({0})|", [temp]);
            return temp;
        };
        Runner2.prototype.GetSpecialDict = function (SpecialList) {
            var SpeicalDict = [];
            for (var indx in SpecialList) {
                var sp = SpecialList[indx];
            }
            return SpeicalDict;
        };
        Runner2.prototype.MaxWeightIndex = function (Weights) {
            var maxIndex = 0;
            var maxVal = 0;
            var index = 0;
            for (var indx in Weights) {
                var weight = Weights[index];
                if (weight > maxVal) {
                    maxVal = weight;
                    maxIndex = index;
                }
                index++;
            }
            return maxIndex;
        };
        return Runner2;
    }());
    exports.Runner2 = Runner2;
});

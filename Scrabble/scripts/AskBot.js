define(["require", "exports", 'axios', 'GameStore', 'Contracts', 'Util', 'WordLoader'], function (require, exports, axios, GS, C, U, WL) {
    "use strict";
    var AskServer = (function () {
        function AskServer() {
        }
        AskServer.NextMove = function () {
            GS.GameStore.Dispatch({
                type: C.Actions.BotMove,
                args: {}
            });
        };
        AskServer.BotMove = function (post) {
            AskServer.BotMoveClient(post);
        };
        AskServer.BotMoveServer = function (post) {
            axios
                .post("/API.ashx?nextmove", post)
                .then(function (response) {
                GS.GameStore.Dispatch({
                    type: C.Actions.BotMoveResponse,
                    args: response.data
                });
            })
                .catch(function (error) {
            });
        };
        AskServer.BotMoveClient = function (post) {
            setTimeout(function () {
                var st = performance.now();
                var move = new RegexEngine().BestMove(post);
                var effort = U.Util.ElapsedTime(performance.now() - st);
                var response = {
                    Action: "nextmove",
                    Result: move,
                    Effort: effort
                };
                GS.GameStore.Dispatch({
                    type: C.Actions.BotMoveResponse,
                    args: response
                });
            }, AskServer.WaitTime);
        };
        AskServer.Validate = function () {
            GS.GameStore.Dispatch({
                type: C.Actions.ResolveWords,
                args: {}
            });
        };
        AskServer.Resolve = function (words) {
            AskServer.ResolveClient(words);
        };
        AskServer.ResolveServer = function (words) {
        };
        AskServer.ResolveClient = function (words) {
            setTimeout(function () {
                var st = performance.now();
                var invalid = WL.WordLoader.Resolve(words);
                var effort = U.Util.ElapsedTime(performance.now() - st);
                var response = {
                    Action: "resolve",
                    Result: invalid,
                    Effort: effort
                };
                GS.GameStore.Dispatch({
                    type: response.Result.length == 0 ?
                        C.Actions.Award :
                        C.Actions.TakeConsent,
                    args: response.Result
                });
            }, AskServer.WaitTime);
        };
        AskServer.WaitTime = 100;
        return AskServer;
    }());
    exports.AskServer = AskServer;
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
    var ProbableWordComparer = (function () {
        function ProbableWordComparer() {
        }
        ProbableWordComparer.Distinct = function (_Words) {
            var Words = [];
            for (var indx in _Words) {
                if (ProbableWordComparer.Contains(Words, _Words[indx])) {
                    continue;
                }
                Words.push(_Words[indx]);
            }
            return Words;
        };
        ProbableWordComparer.Equals = function (x, y) {
            if (x.Cells.length != y.Cells.length) {
                return false;
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
        ProbableWordComparer.Contains = function (Words, Word) {
            for (var indx in Words) {
                if (ProbableWordComparer.Equals(Words[indx], Word)) {
                    return true;
                }
            }
            return false;
        };
        return ProbableWordComparer;
    }());
    exports.ProbableWordComparer = ProbableWordComparer;
    var RegexEngine = (function () {
        function RegexEngine() {
        }
        RegexEngine.prototype.BestMove = function (Board) {
            var Moves = this.Probables(Board);
            if (Moves.length == 0) {
                return null;
            }
            return Moves[0];
        };
        RegexEngine.prototype.Probables = function (Board) {
            var Moves = [];
            if (Board == null) {
                return;
            }
            var bot = GameConfig.GetBot(Board.Bot);
            if (bot == null) {
                return;
            }
            var board = GameConfig.GetBoard(Board.Name);
            if (board == null) {
                return;
            }
            var CharSet = GameConfig.GetCharSet(bot.Language);
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
            MovableList = MovableList.filter(function (x) { return x.length != 0; });
            var SpecialList = this.DistinctList(special.Replace("(", " ").Replace(")", " ").Replace(",", ""), ' ');
            var EverySyllableOnBoard = this.GetSyllableList(cells, size, false, true);
            var NonCornerSyllables = this.GetSyllableList(cells, size, true, false);
            All = (this.GetFlatList(EverySyllableOnBoard, ',') + " " + Movables).Replace("(", " ").Replace(")", " ").Replace(",", " ").Replace("|", " ").split(' ');
            AllPattern = U.Util.Format("^(?<All>[{0},])*$", [this.GetFlatList2(All)]);
            NonCornerTiles = (this.GetFlatList2(NonCornerSyllables) + " " + Movables).Replace("(", " ").Replace(")", " ").Replace(",", " ").Replace("|", " ").split(' ');
            NonCornerPattern = U.Util.Format("^(?<All>[{0},])*$", [this.GetFlatList2(NonCornerTiles)]);
            var AllDict = this.GetCountDict(All);
            var NonCornerDict = this.GetCountDict(NonCornerTiles);
            var WordsDictionary = WL.WordLoader.LoadWords(file);
            WordsDictionary = this.ShortList(WordsDictionary, AllPattern, AllDict);
            var NonCornerProbables = this.ShortList(WordsDictionary, NonCornerPattern, NonCornerDict);
            var SpeicalDict = this.GetSpecialDict(CharSet, SpecialList);
            if (EverySyllableOnBoard.length > 0) {
                Moves = Moves.concat(RegexEngine.SyllableExtensions(cells, size, CharSet, WordsDictionary, NonCornerProbables, MovableList, SpeicalDict));
                Moves = Moves.concat(RegexEngine.WordExtensions(cells, size, CharSet, WordsDictionary, MovableList, SpeicalDict));
            }
            else {
                var maxIndex = this.MaxWeightIndex(weights);
                Moves = Moves.concat(RegexEngine.EmptyExtensions(cells, size, CharSet, maxIndex, WordsDictionary, MovableList, SpeicalDict));
            }
            WordsDictionary = null;
            this.RefreshScores(Moves, weights, size);
            return Moves;
        };
        RegexEngine.EmptyExtensions = function (Cells, size, CharSet, maxIndex, AllWords, Movables, SpeicalDict) {
            var Moves = [];
            {
                for (var indx in AllWords) {
                    var word = AllWords[indx];
                    var Pre = "";
                    var Center = "";
                    var Post = "";
                    var f = word.Tiles.indexOf(',');
                    Center = word.Tiles.substring(0, f);
                    Post = word.Tiles.substring(f + 1);
                    var Pres = Pre == "" ? [] : Pre.TrimEnd(',').split(',');
                    var Centers = Center.split(',');
                    var Posts = Post == "" ? [] : Post.TrimStart(',').split(',');
                    var Tiles = Movables.slice(0, Movables.length);
                    var res = RegexEngine.Resolve(Pres, Centers, Posts, Tiles, SpeicalDict);
                    if (!res) {
                        continue;
                    }
                    var WH = RegexEngine.TryHarizontal(Cells, size, maxIndex, 0, Pres, Centers, Posts);
                    var WV = RegexEngine.TryVertical(Cells, size, maxIndex, 0, Pres, Centers, Posts);
                    var WHValid = RegexEngine.Validate3(WH, AllWords);
                    var WVValid = RegexEngine.Validate3(WV, AllWords);
                    if (WHValid) {
                        Moves.push(WH);
                    }
                    if (WVValid) {
                        Moves.push(WV);
                    }
                }
            }
            return Moves;
        };
        RegexEngine.SyllableExtensions = function (Cells, size, CharSet, AllWords, Probables, Movables, SpeicalDict) {
            var Moves = [];
            {
                var All = RegexEngine.GetSyllableList2(Cells, size, false, true);
                for (var indx in All) {
                    var syllable = All[indx];
                    var pattern = RegexEngine.GetSyllablePattern2(CharSet, syllable.Tiles.Replace("(", "").Replace(")", ""), "(?<Center>.*?)", "(?<Pre>.*?)", "(?<Post>.*?)");
                    pattern = U.Util.Format("^{0}$", [pattern]);
                    var R = new RegExp(pattern);
                    {
                        for (var indx2 in Probables) {
                            var probable = Probables[indx2];
                            if (!R.test(probable.Tiles)) {
                                continue;
                            }
                            var M = R.exec(probable.Tiles);
                            var Pre = RegexEngine.MatchedString(M.groups["Pre"], "");
                            var Center = RegexEngine.MatchedString(M.groups["Conso"], "");
                            var Post = RegexEngine.MatchedString(M.groups["Post"], "");
                            var Pres = Pre == "" ? [] : Pre.TrimEnd(',').split(',');
                            var Centers = Center == "" ? [] : Center.split(',');
                            var Posts = Post == "" ? [] : Post.TrimStart(',').split(',');
                            if (!Post.StartsWith(",") && Posts.length > 0) {
                                Centers = (Center + Posts[0]).split(',');
                                Posts = Posts.slice(1);
                            }
                            var Tiles = Movables.slice(0, Movables.length);
                            var res = RegexEngine.Resolve(Pres, Centers, Posts, Tiles, SpeicalDict);
                            if (!res) {
                                continue;
                            }
                            var WH = RegexEngine.TryHarizontal(Cells, size, syllable.Index, 0, Pres, Centers, Posts);
                            var WV = RegexEngine.TryVertical(Cells, size, syllable.Index, 0, Pres, Centers, Posts);
                            var WHValid = RegexEngine.Validate3(WH, AllWords);
                            var WVValid = RegexEngine.Validate3(WV, AllWords);
                            if (WHValid) {
                                Moves.push(WH);
                            }
                            if (WVValid) {
                                Moves.push(WV);
                            }
                        }
                    }
                }
            }
            return Moves;
        };
        RegexEngine.WordExtensions = function (Cells, size, CharSet, AllWords, Movables, SpeicalDict) {
            var Moves = [];
            {
                var WordsOnBoard = RegexEngine.GetWordsOnBoard(Cells, size, false);
                for (var indx in WordsOnBoard) {
                    var wordOnBoard = WordsOnBoard[indx];
                    var raw = wordOnBoard.Tiles.Replace("(", "").Replace(")", "").Replace(",", "").Replace("|", ",");
                    var len = raw.split(',').length;
                    var pattern = RegexEngine.GenWordPattern(CharSet, wordOnBoard.Tiles, "(?<Center{0}>.*?)", "", "(?<Center{0}>.*?)", "(?<Pre>.*?)", "(?<Post>.*?)", true);
                    pattern = U.Util.Format("^{0}$", [pattern.TrimEnd('|')]);
                    var R = new RegExp(pattern);
                    {
                        for (var indx2 in AllWords) {
                            var word = AllWords[indx2];
                            if (raw == word.Tiles) {
                                continue;
                            }
                            if (!R.test(word.Tiles)) {
                                continue;
                            }
                            var M = R.exec(word.Tiles);
                            var Pre = "";
                            var Post = "";
                            var Center = "";
                            Pre = RegexEngine.MatchedString(M.groups["Pre"], "");
                            for (var i = 0; i < word.Syllables; i++) {
                                Center = Center + RegexEngine.MatchedString(M.groups["Center" + (i + 1)], ",") + ":";
                            }
                            Center = Center.TrimEnd(':');
                            Post = RegexEngine.MatchedString(M.groups["Post"], "");
                            var Pres = Pre == "" ? [] : Pre.TrimEnd(',').split(',');
                            var Centers = Center.split(':');
                            var Posts = Post == "" ? [] : Post.TrimStart(',').split(',');
                            if (Centers.length != len) {
                                if (!Post.StartsWith(",") && Posts.length > 0) {
                                    Centers.push(Posts[0]);
                                    Posts = Posts.slice(1);
                                }
                            }
                            var Tiles = Movables.slice(0, Movables.length);
                            var res = RegexEngine.Resolve(Pres, Centers, Posts, Tiles, SpeicalDict);
                            if (!res) {
                                continue;
                            }
                            if (wordOnBoard.Position == "R") {
                                var WH = RegexEngine.TryHarizontal(Cells, size, wordOnBoard.Index, wordOnBoard.Syllables - 1, Pres, Centers, Posts);
                                var WHValid = RegexEngine.Validate3(WH, AllWords);
                                if (WHValid) {
                                    Moves.push(WH);
                                }
                            }
                            if (wordOnBoard.Position == "C") {
                                var WH = RegexEngine.TryVertical(Cells, size, wordOnBoard.Index, wordOnBoard.Syllables - 1, Pres, Centers, Posts);
                                var WHValid = RegexEngine.Validate3(WH, AllWords);
                                if (WHValid) {
                                    Moves.push(WH);
                                }
                            }
                        }
                    }
                }
            }
            return Moves;
        };
        RegexEngine.TryHarizontal = function (Cells, size, Index, offset, Pre, Centers, Post) {
            var Moves = [];
            var PreCount = Pre.length;
            var PostCount = Post.length;
            var NewCells = Cells.Clone();
            var Impacted = [];
            if (Pre.length != 0) {
                for (var x = Pre.length - 1; x >= 0; x--) {
                    var n = BoardUtil.FindNeighbors(Index - x, size);
                    if (n.Left != -1) {
                        NewCells[n.Left] += Pre[x];
                        Impacted.push(n.Left);
                        Moves.push({ Tiles: Pre[x], Index: n.Left });
                    }
                    else {
                        return { Words: [], Direction: "H", WordsCount: 0, Moves: [] };
                    }
                }
            }
            if (Centers.length != 0) {
                for (var c = 0; c < Centers.length; c++) {
                    var cellIndex = Index + c;
                    if (cellIndex == -1 || Centers[c] == "") {
                        continue;
                    }
                    NewCells[cellIndex] += Centers[c];
                    Impacted.push(cellIndex);
                    Moves.push({ Tiles: Centers[c], Index: cellIndex });
                }
            }
            if (Post.length != 0) {
                for (var x = 0; x < Post.length; x++) {
                    var n = BoardUtil.FindNeighbors(Index + offset + x, size);
                    if (n.Right != -1) {
                        NewCells[n.Right] += Post[x];
                        Impacted.push(n.Right);
                        Moves.push({ Tiles: Post[x], Index: n.Right });
                    }
                    else {
                        return { Words: [], Direction: "H", WordsCount: 0, Moves: [] };
                    }
                }
            }
            var W = [];
            for (var i in Impacted) {
                var index = Impacted[i];
                W = W.concat(RegexEngine.WordsAt(NewCells, size, index));
            }
            return { Words: W, Moves: Moves, WordsCount: W.length, Direction: "H" };
        };
        RegexEngine.TryVertical = function (Cells, size, Index, offset, Pre, Centers, Post) {
            var Moves = [];
            var PreCount = Pre.length;
            var PostCount = Post.length;
            var Pos = BoardUtil.Position(Index, size);
            var NewCells = Cells.Clone();
            var Impacted = [];
            if (Pre.length != 0) {
                for (var x = Pre.length - 1; x >= 0; x--) {
                    var cellIndex = BoardUtil.Abs(Pos.X - x, Pos.Y, size);
                    var n = BoardUtil.FindNeighbors(cellIndex, size);
                    if (n.Top != -1) {
                        NewCells[n.Top] += Pre[x];
                        Impacted.push(n.Top);
                        Moves.push({ Tiles: Pre[x], Index: n.Top });
                    }
                    else {
                        return { Words: [], Direction: "V", WordsCount: 0, Moves: [] };
                    }
                }
            }
            if (Centers.length != 0) {
                for (var c = 0; c < Centers.length; c++) {
                    var cellIndex = BoardUtil.Abs(Pos.X + c, Pos.Y, size);
                    if (cellIndex == -1 || Centers[c] == "") {
                        continue;
                    }
                    NewCells[cellIndex] += Centers[c];
                    Impacted.push(cellIndex);
                    Moves.push({ Tiles: Centers[c], Index: cellIndex });
                }
            }
            if (Post.length != 0) {
                for (var x = 0; x < Post.length; x++) {
                    var cellIndex = BoardUtil.Abs(Pos.X + offset + x, Pos.Y, size);
                    var n = BoardUtil.FindNeighbors(cellIndex, size);
                    if (n.Bottom != -1) {
                        NewCells[n.Bottom] += Post[x];
                        Impacted.push(n.Bottom);
                        Moves.push({ Tiles: Post[x], Index: n.Bottom });
                    }
                    else {
                        return { Words: [], Direction: "V", WordsCount: 0, Moves: [] };
                    }
                }
            }
            var W = [];
            for (var i in Impacted) {
                var index = Impacted[i];
                W = W.concat(RegexEngine.WordsAt(NewCells, size, index));
            }
            return { Words: W, Moves: Moves, WordsCount: W.length, Direction: "V" };
        };
        RegexEngine.prototype.RefreshScores = function (Moves, Weights, size) {
            for (var indx in Moves) {
                var Move = Moves[indx];
                var score = 0;
                for (var indx2 in Move.Words) {
                    var w = Move.Words[indx2];
                    var wordScore = 0;
                    for (var indx3 in w.Cells) {
                        var cell = w.Cells[indx3];
                        var weight = Weights[cell.Index];
                        wordScore = wordScore + weight;
                        cell.Score = weight;
                    }
                    w.Score = wordScore;
                    score = score + wordScore;
                }
                Move.Score = score;
            }
            Moves.sort(function (x, y) { return x.Score - y.Score; });
            Moves.reverse();
        };
        RegexEngine.prototype.ShortList = function (Words, NonCornerPattern, Dict) {
            if (U.Util.IsNullOrEmpty(NonCornerPattern)) {
                return [];
            }
            var R = RegExp(NonCornerPattern);
            var Matches = this.MatchedWords(Words, NonCornerPattern);
            var Shortlisted = [];
            {
                for (var indx in Matches) {
                    var word = Matches[indx];
                    if (word.Syllables == 1) {
                        continue;
                    }
                    var CharCount = this.GetCountDict2(word.Tiles);
                    var isValid = this.Validate(Dict, CharCount);
                    if (!isValid) {
                        continue;
                    }
                    Shortlisted.push(word);
                }
            }
            return Shortlisted;
        };
        RegexEngine.Validate3 = function (WV, AllWords) {
            WV.Words = ProbableWordComparer.Distinct(WV.Words);
            WV.WordsCount = WV.Words.length;
            if (WV.Words.length == 0 || WV.Moves.length == 0) {
                return false;
            }
            return RegexEngine.Validate2(WV.Words, AllWords);
        };
        RegexEngine.Validate2 = function (WV, AllWords) {
            for (var indx in WV) {
                var w = WV[indx];
                var v = AllWords.filter(function (x) { return x.Tiles == w.String; });
                if (v == null || v.length == 0) {
                    return false;
                }
            }
            return true;
        };
        RegexEngine.prototype.Validate = function (InputDict, CharCount) {
            if (InputDict == null) {
                return true;
            }
            var isValid = true;
            for (var key in CharCount) {
                var item = CharCount[key];
                if (InputDict[key] == null) {
                    isValid = false;
                    break;
                }
                if (InputDict[item.Key] < item.Value) {
                    isValid = false;
                    break;
                }
            }
            return isValid;
        };
        RegexEngine.Resolve2 = function (prev, Tiles, SpeicalList) {
            if (U.Util.IsNullOrEmpty(prev)) {
                return { res: true, temp: "" };
            }
            if (prev.length == 1) {
                if (Tiles.Contains(prev)) {
                    Tiles.Remove(prev);
                    return { res: true, temp: prev };
                }
                else {
                    return { res: false, temp: prev };
                }
            }
            else {
                if (SpeicalList.hasOwnProperty(prev)) {
                    if (Tiles.Contains(prev)) {
                        Tiles.Remove(prev);
                        return { res: true, temp: prev };
                    }
                }
                for (var key in SpeicalList) {
                    var special = SpeicalList[key];
                    if (!special.test(prev)) {
                        continue;
                    }
                    if (Tiles.Contains(key)) {
                        Tiles.Remove(key);
                    }
                    else {
                        continue;
                    }
                    var order = [];
                    var M = special.exec(prev);
                    var Pre = M.groups["Pre"];
                    var Center = M.groups["Center"];
                    var Post = M.groups["Post"];
                    if (!U.Util.IsNullOrEmpty(Pre)) {
                        var temp = "";
                        var resolved = RegexEngine.Resolve2(Pre, Tiles, SpeicalList);
                        if (!resolved.res) {
                            return { res: false, temp: Pre };
                        }
                        temp = resolved.temp;
                        order.push(U.Util.IsNullOrEmpty(temp) ? Pre : temp);
                    }
                    order.push(special.Key);
                    if (!U.Util.IsNullOrEmpty(Center)) {
                        var temp = "";
                        var resolved = RegexEngine.Resolve2(Center, Tiles, SpeicalList);
                        if (!resolved.res) {
                            return { res: false, temp: Center };
                        }
                        order.push(U.Util.IsNullOrEmpty(temp) ? Center : temp);
                    }
                    if (!U.Util.IsNullOrEmpty(Post)) {
                        var temp = "";
                        var resolved = RegexEngine.Resolve2(Post, Tiles, SpeicalList);
                        if (!resolved) {
                            return { res: false, temp: "" };
                        }
                        order.push(U.Util.IsNullOrEmpty(temp) ? Post : temp);
                    }
                    return { res: true, temp: order.join(',') };
                }
                {
                    var order = [];
                    for (var i = 0; i < prev.length; i++) {
                        var c = prev[i];
                        if (Tiles.Contains(c)) {
                            Tiles.Remove(c);
                            order.push(c);
                        }
                        else {
                            return { res: false, temp: c };
                        }
                    }
                    return { res: true, temp: order.join(',') };
                }
            }
        };
        RegexEngine.Resolve = function (Pres, Centers, Posts, Tiles, SpeicalDict) {
            var res = true;
            for (var i = 0; i < Pres.length; i++) {
                var tile = Pres[i];
                var result = RegexEngine.Resolve2(tile, Tiles, SpeicalDict);
                if (!result.res) {
                    return false;
                }
                var temp = result.temp;
                if (!U.Util.IsNullOrEmpty(temp)) {
                    Pres[i] = temp;
                }
            }
            for (var i = 0; i < Centers.length; i++) {
                var tile = Centers[i];
                var result = RegexEngine.Resolve2(tile, Tiles, SpeicalDict);
                if (!result.res) {
                    return false;
                }
                var temp = result.temp;
                if (!U.Util.IsNullOrEmpty(temp)) {
                    Centers[i] = temp;
                }
            }
            for (var i = 0; i < Posts.length; i++) {
                var tile = Posts[i];
                var result = RegexEngine.Resolve2(tile, Tiles, SpeicalDict);
                if (!result.res) {
                    return false;
                }
                var temp = result.temp;
                if (!U.Util.IsNullOrEmpty(temp)) {
                    Posts[i] = temp;
                }
            }
            return true;
        };
        RegexEngine.prototype.MatchedWords = function (words, Pattern) {
            var r = RegExp(Pattern);
            var List = words.filter(function (s) { return r.test(s.Tiles); });
            return List;
        };
        RegexEngine.MatchedString = function (group, seperator) {
            if (group == null) {
                return "";
            }
            var ret = "";
            for (var indx in group) {
                var capture = group[indx];
                ret = ret + capture + seperator;
            }
            if (!U.Util.IsNullOrEmpty(seperator)) {
                ret = ret.TrimEnd(seperator);
            }
            return ret;
        };
        RegexEngine.GetWordsOnBoard = function (Cells, size, includeDuplicates) {
            var Words = [];
            for (var i = 0; i < size; i++) {
                var R = RegexEngine.GetWords(Cells, "R", i, size, includeDuplicates);
                var C = RegexEngine.GetWords(Cells, "C", i, size, includeDuplicates);
                Words = Words.concat(R);
                Words = Words.concat(C);
            }
            return Words;
        };
        RegexEngine.GetWords = function (Cells, option, r, size, includeDuplicates) {
            var Words = [];
            var pending = "";
            var cnt = 0;
            for (var i = 0; i < size; i++) {
                var index = -1;
                switch (option) {
                    case "R":
                        index = BoardUtil.Abs(r, i, size);
                        break;
                    case "C":
                        index = BoardUtil.Abs(i, r, size);
                        break;
                }
                var cell = Cells[index];
                if (cell != "") {
                    pending += "(" + cell + ")|";
                    cnt++;
                    continue;
                }
                if (pending != "" && cell == "") {
                    if (cnt > 1) {
                        var word = pending.TrimEnd('|');
                        if (includeDuplicates) {
                            var startIndex = RegexEngine.GetStartIndex(option, r, i, size, cnt);
                            Words.push({ Tiles: word, Syllables: cnt, Position: option, Index: startIndex });
                        }
                        else {
                            var X = Words.filter(function (x) { return x.Tiles == word; });
                            if (X == null || X.length == 0) {
                                var startIndex = RegexEngine.GetStartIndex(option, r, i, size, cnt);
                                Words.push({ Tiles: word, Syllables: cnt, Position: option, Index: startIndex });
                            }
                        }
                    }
                    pending = "";
                    cnt = 0;
                    continue;
                }
            }
            if (cnt > 1) {
                var word = pending.TrimEnd('|');
                if (includeDuplicates) {
                    var startIndex = RegexEngine.GetStartIndex(option, r, size, size, cnt);
                    Words.push({ Tiles: word, Syllables: cnt, Position: option, Index: startIndex });
                }
                else {
                    var X = Words.filter(function (x) { return x.Tiles == word; });
                    if (X == null || X.length == 0) {
                        var startIndex = RegexEngine.GetStartIndex(option, r, size, size, cnt);
                        Words.push({ Tiles: word, Syllables: cnt, Position: option, Index: startIndex });
                    }
                }
            }
            return Words;
        };
        RegexEngine.WordsAt = function (Cells, size, index) {
            var List = [];
            var Neighbor = BoardUtil.FindNeighbors(index, size);
            var r = Neighbor.Right != -1 ? Cells[Neighbor.Right] : "";
            var l = Neighbor.Left != -1 ? Cells[Neighbor.Left] : "";
            var t = Neighbor.Top != -1 ? Cells[Neighbor.Top] : "";
            var b = Neighbor.Bottom != -1 ? Cells[Neighbor.Bottom] : "";
            var Lefties = [];
            var Righties = [];
            if (r != "") {
                Righties.push({ Tiles: r, Index: Neighbor.Right });
                var index_ = Neighbor.Right;
                var flg = true;
                while (flg) {
                    var n = BoardUtil.FindNeighbors(index_, size);
                    var r_ = n.Right != -1 ? Cells[n.Right] : "";
                    if (r_ == "") {
                        flg = false;
                        break;
                    }
                    Righties.push({ Tiles: r_, Index: n.Right });
                    index_ = n.Right;
                }
            }
            if (l != "") {
                Lefties.push({ Tiles: l, Index: Neighbor.Left });
                var index_ = Neighbor.Left;
                var flg = true;
                while (flg) {
                    var n = BoardUtil.FindNeighbors(index_, size);
                    var l_ = n.Left != -1 ? Cells[n.Left] : "";
                    if (l_ == "") {
                        flg = false;
                        break;
                    }
                    Lefties.push({ Tiles: l_, Index: n.Left });
                    index_ = n.Left;
                }
            }
            var Topies = [];
            var Downies = [];
            if (t != "") {
                Topies.push({ Tiles: t, Index: Neighbor.Top });
                var index_ = Neighbor.Top;
                var flg = true;
                while (flg) {
                    var n = BoardUtil.FindNeighbors(index_, size);
                    var t_ = n.Top != -1 ? Cells[n.Top] : "";
                    if (t_ == "") {
                        flg = false;
                        break;
                    }
                    Topies.push({ Tiles: t_, Index: n.Top });
                    index_ = n.Top;
                }
            }
            if (b != "") {
                Downies.push({ Tiles: b, Index: Neighbor.Bottom });
                var index_ = Neighbor.Bottom;
                var flg = true;
                while (flg) {
                    var n = BoardUtil.FindNeighbors(index_, size);
                    var d_ = n.Bottom != -1 ? Cells[n.Bottom] : "";
                    if (d_ == "") {
                        flg = false;
                        break;
                    }
                    Downies.push({ Tiles: d_, Index: n.Bottom });
                    index_ = n.Bottom;
                }
            }
            Topies.reverse();
            Lefties.reverse();
            if (Topies.length + Downies.length > 0) {
                var Vertical = RegexEngine.MakeAWord(Topies, { Tiles: Cells[index], Index: index }, Downies);
                List.push(Vertical);
            }
            if (Lefties.length + Righties.length > 0) {
                var Harizontal = RegexEngine.MakeAWord(Lefties, { Tiles: Cells[index], Index: index }, Righties);
                List.push(Harizontal);
            }
            return List;
        };
        RegexEngine.MakeAWord = function (F1, C, F2) {
            var W = {};
            var List = [];
            var ret = "";
            for (var indx in F1) {
                var s = F1[indx];
                ret = ret + s.Tiles.Replace(",", "") + ",";
                var Cell = { Target: s.Tiles, Index: s.Index };
                List.push(Cell);
            }
            {
                ret = ret + C.Tiles.Replace(",", "") + ",";
                var Cell = { Target: C.Tiles, Index: C.Index };
                List.push(Cell);
            }
            for (var indx in F2) {
                var s = F2[indx];
                ret = ret + s.Tiles.Replace(",", "") + ",";
                var Cell = { Target: s.Tiles, Index: s.Index };
                List.push(Cell);
            }
            ret = ret.Trim(',');
            W.String = ret;
            W.Cells = List;
            return W;
        };
        RegexEngine.GetStartIndex = function (option, r, pos, size, move) {
            switch (option) {
                case "R":
                    return BoardUtil.Abs(r, pos - move, size);
                case "C":
                    return BoardUtil.Abs(pos - move, r, size);
            }
            return -1;
        };
        RegexEngine.GetSyllableList2 = function (Cells, size, filter, free) {
            var List = [];
            for (var index = 0; index < Cells.length; index++) {
                var cell = Cells[index];
                if (cell == "") {
                    continue;
                }
                var Neighbor = BoardUtil.FindNeighbors(index, size);
                var r = Neighbor.Right != -1 ? Cells[Neighbor.Right] : "";
                var l = Neighbor.Left != -1 ? Cells[Neighbor.Left] : "";
                var t = Neighbor.Top != -1 ? Cells[Neighbor.Top] : "";
                var b = Neighbor.Bottom != -1 ? Cells[Neighbor.Bottom] : "";
                if (filter) {
                    if ((r != "" || l != "") && (t != "" || b != "")) {
                    }
                    else {
                        var x = free ? cell : "(" + cell + ")";
                        List.push({ Tiles: x, Index: index });
                    }
                }
                else {
                    var x = free ? cell : "(" + cell + ")";
                    List.push({ Tiles: x, Index: index });
                }
            }
            return List;
        };
        RegexEngine.prototype.GetSyllableList = function (Cells, size, filterEdges, asGroups) {
            var List = [];
            for (var index = 0; index < Cells.length; index++) {
                var cell = Cells[index];
                if (cell == "") {
                    continue;
                }
                var Neighbor = BoardUtil.FindNeighbors(index, size);
                var r = Neighbor.Right != -1 ? Cells[Neighbor.Right] : "";
                var l = Neighbor.Left != -1 ? Cells[Neighbor.Left] : "";
                var t = Neighbor.Top != -1 ? Cells[Neighbor.Top] : "";
                var b = Neighbor.Bottom != -1 ? Cells[Neighbor.Bottom] : "";
                if (filterEdges) {
                    if ((r != "" || l != "") && (t != "" || b != "")) {
                    }
                    else {
                        var x = asGroups ? cell : "(" + cell + ")";
                        if (!List.Contains(x)) {
                            List.push(x);
                        }
                    }
                }
                else {
                    var x = asGroups ? cell : "(" + cell + ")";
                    if (!List.Contains(x)) {
                        List.push(x);
                    }
                }
            }
            return List;
        };
        RegexEngine.GetSpecialSyllablePattern2 = function (CharSet, specialOptions) {
            if (U.Util.IsNullOrEmpty(specialOptions)) {
                return "";
            }
            var ret = "";
            {
                var temp = "";
                var Consos = [];
                var Vowels = [];
                RegexEngine.Classify2(CharSet, specialOptions, Consos, Vowels);
                if (Vowels.length > 0 && Consos.length > 0) {
                    for (var indx in Consos) {
                        var a = Consos[indx];
                        temp = temp + a;
                    }
                    temp = temp + "(?<Center>.*?)";
                    for (var indx in Vowels) {
                        var a = Vowels[indx];
                        temp = temp + a;
                    }
                    temp = "(?<Pre>.*?)" + temp + "(?<Post>.*?)";
                }
                else {
                    for (var indx in Consos) {
                        var a = Consos[indx];
                        temp = temp + a;
                    }
                    for (var indx in Vowels) {
                        var a = Vowels[indx];
                        temp = temp + a;
                    }
                    temp = "(?<Pre>.*?)" + temp + "(?<Post>.*?)";
                }
                ret = "^" + temp + "$";
            }
            return ret;
        };
        RegexEngine.GetSyllablePattern = function (CharSet, syllable, consoPatternNoComma, sunnaPattern, allPatternNoComma) {
            var temp = "";
            var Consos = [];
            var Vowels = [];
            RegexEngine.Classify(CharSet, syllable, Consos, Vowels);
            if (Vowels.length > 0 && Consos.length > 0) {
                var tempC = "";
                for (var indx in Consos) {
                    var a = Consos[indx];
                    tempC = tempC + a;
                }
                var tempA = "";
                for (var indx in Vowels) {
                    var a = Vowels[indx];
                    tempA = tempA + a;
                }
                temp = U.Util.Format("{0}{1}{2}{3}", [tempC, consoPatternNoComma, tempA, sunnaPattern]);
            }
            else {
                for (var indx in Consos) {
                    var a = Consos[indx];
                    temp = temp + a;
                }
                if (Vowels.length == 0) {
                    temp = U.Util.Format("{0}{1}", [temp, allPatternNoComma == "" ? "" : (allPatternNoComma)]);
                }
                for (var indx in Vowels) {
                    var a = Vowels[indx];
                    temp = temp + a;
                }
                if (Consos.length == 0) {
                    temp = U.Util.Format("{0}{1}", [temp, sunnaPattern]);
                }
                if (Vowels.length == 0 && Consos.length == 0) {
                    debugger;
                }
            }
            return temp;
        };
        RegexEngine.GetSyllablePattern2 = function (CharSet, syllable, consoPatternNoComma, prePattern, PostPattern) {
            var temp = "";
            var Consos = [];
            var Vowels = [];
            RegexEngine.Classify(CharSet, syllable, Consos, Vowels);
            if (Vowels.length > 0 && Consos.length > 0) {
                var tempC = "";
                for (var indx in Consos) {
                    var a = Consos[indx];
                    tempC = tempC + a;
                }
                var tempA = "";
                for (var indx in Vowels) {
                    var a = Vowels[indx];
                    tempA = tempA + a;
                }
                temp = U.Util.Format("({3}({0}{1}{2}){4})", [tempC, consoPatternNoComma, tempA, prePattern, PostPattern]);
            }
            else {
                for (var indx in Consos) {
                    var a = Consos[indx];
                    temp = temp + a;
                }
                for (var indx in Vowels) {
                    var a = Vowels[indx];
                    temp = temp + a;
                }
                temp = U.Util.Format("({1}{0}{2})", [temp, prePattern, PostPattern]);
            }
            return temp;
        };
        RegexEngine.Join = function (str, join) {
            var ret = "";
            for (var indx = 0; indx < str.length; indx++) {
                var ch = str[indx];
                ret = ret + ch + join;
            }
            ret = ret.TrimEnd(join);
            return ret;
        };
        RegexEngine.prototype.GetFlatList2 = function (inputs) {
            var list = inputs.Clone();
            list.sort();
            var X = [];
            for (var indx in list) {
                var input = list[indx];
                if (!X.Contains(input)) {
                    X.push(input);
                }
            }
            return this.GetFlatList(X, ' ').Replace(" ", "");
        };
        RegexEngine.prototype.GetFlatList = function (List, Seperator) {
            var ret = "";
            for (var indx in List) {
                var s = List[indx];
                ret = ret + s + Seperator;
            }
            ret = ret.TrimEnd(Seperator);
            return ret;
        };
        RegexEngine.prototype.GetFlatList3 = function (List, Seperator) {
            var ret = "";
            for (var indx in List) {
                var s = List[indx];
                ret = ret + s.Tiles + Seperator;
            }
            ret = ret.TrimEnd(Seperator);
            return ret;
        };
        RegexEngine.prototype.DistinctList = function (Set, Seperator) {
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
        RegexEngine.prototype.GetCountDict2 = function (input) {
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
        RegexEngine.prototype.GetCountDict = function (inputs) {
            if (inputs == null) {
                return null;
            }
            var Dict = {};
            for (var indx in inputs) {
                var input = inputs[indx];
                if (U.Util.IsNullOrEmpty(input)) {
                    continue;
                }
                if (Dict.hasOwnProperty(input)) {
                    Dict[input]++;
                }
                else {
                    Dict[input] = 1;
                }
            }
            return Dict;
        };
        RegexEngine.Classify = function (CharSet, syllable, Consos, Vowels) {
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
        RegexEngine.Classify2 = function (CharSet, syllable, Consos, Vowels) {
            var Sunna = [];
            for (var indx = 0; indx < syllable.length; indx++) {
                var c = syllable[indx];
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
        RegexEngine.GenWordPattern = function (CharSet, word, consoPatternNoComma, sunnaPattern, allPatternNoComma, prePattern, postPattern, useSyllableIndex) {
            var temp = "";
            var arr = word.split('|');
            for (var i = 0; i < arr.length; i++) {
                var syllable = arr[i];
                var pattern = "";
                if (useSyllableIndex) {
                    pattern = RegexEngine.GetSyllablePattern(CharSet, syllable.Replace("(", "").Replace(")", ""), U.Util.Format(consoPatternNoComma, [i + 1]), U.Util.Format(sunnaPattern, [i + 1]), i == arr.length - 1 ? "" : U.Util.Format(allPatternNoComma, [i + 1]));
                }
                else {
                    pattern = RegexEngine.GetSyllablePattern(CharSet, syllable.Replace("(", "").Replace(")", ""), consoPatternNoComma, sunnaPattern, i == arr.length - 1 ? "" : allPatternNoComma);
                }
                temp = temp + pattern + ",";
            }
            temp = temp.TrimEnd(',');
            temp = prePattern + temp + postPattern;
            temp = U.Util.Format("({0})|", [temp]);
            return temp;
        };
        RegexEngine.prototype.GetSpecialDict = function (CharSet, SpecialList) {
            var SpeicalDict = {};
            for (var indx in SpecialList) {
                var sp = SpecialList[indx];
                var pattern = RegexEngine.GetSpecialSyllablePattern2(CharSet, sp);
                SpeicalDict[sp] = new RegExp(pattern);
            }
            return SpeicalDict;
        };
        RegexEngine.prototype.MaxWeightIndex = function (Weights) {
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
        return RegexEngine;
    }());
    exports.RegexEngine = RegexEngine;
    var GameConfig = (function () {
        function GameConfig() {
        }
        GameConfig.GetBot = function (bot) {
            var players = Config.Players;
            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                var isBot = player.Bot != null;
                if (!isBot) {
                    continue;
                }
                if (player.Bot.Id == bot) {
                    return player.Bot;
                }
            }
            return null;
        };
        GameConfig.GetBoard = function (name) {
            return Config.Board;
        };
        GameConfig.GetCharSet = function (lang) {
            return Config.CharSet;
        };
        return GameConfig;
    }());
    exports.GameConfig = GameConfig;
});

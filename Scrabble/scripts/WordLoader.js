define(["require", "exports", 'axios', 'GameActions'], function (require, exports, axios, GA) {
    "use strict";
    var WordLoader = (function () {
        function WordLoader() {
        }
        WordLoader.LoadWords = function (file) {
            if (WordLoader.Lists != null && WordLoader.Lists[file] != null) {
                return WordLoader.Lists[file];
            }
            return [];
        };
        WordLoader.AddWord = function (word) {
            var cnt = WordLoader.Lists["Custom"].length;
            WordLoader.Lists["Custom"].push({
                Tiles: word,
                Index: cnt++,
                Syllables: word.split(',').length,
            });
        };
        WordLoader.Load = function (file, rawResponse) {
            var words = rawResponse.split('\n');
            var List = [];
            var cnt = 0;
            for (var indx in words) {
                var line = words[indx];
                List.push({
                    Tiles: line,
                    Index: cnt++,
                    Syllables: line.split(',').length,
                });
            }
            WordLoader.Lists[file] = List;
            WordLoader.Lists.Loaded++;
            rawResponse = null;
        };
        WordLoader.Init = function (file) {
            axios
                .get("/bots/" + file)
                .then(function (response) {
                WordLoader.Load(file, response.data);
                GA.GameActions.VocabularyLoaded(file);
            })
                .catch(function (error) {
            });
        };
        WordLoader.Resolve = function (words) {
            var unResolved = [];
            for (var indx in words) {
                var word = words[indx];
                var isValid = WordLoader.IsValid(word);
                if (!isValid) {
                    unResolved.push(word);
                }
            }
            return unResolved;
        };
        WordLoader.IsValid = function (word) {
            var res = false;
            for (var indx in WordLoader.Lists) {
                var List = WordLoader.Lists[indx];
                for (var indx2 in List) {
                    var Word = List[indx2];
                    if (word == Word.Tiles) {
                        if (console) {
                            console.log(Word.Tiles);
                        }
                        return true;
                    }
                }
            }
            return res;
        };
        WordLoader.Lists = { Loaded: 0, Total: 0, Custom: [] };
        return WordLoader;
    }());
    exports.WordLoader = WordLoader;
});

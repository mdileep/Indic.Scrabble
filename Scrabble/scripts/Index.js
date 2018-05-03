define(["require", "exports", 'Util'], function (require, exports, Util) {
    "use strict";
    var Index = (function () {
        function Index() {
        }
        Index.Play = function (lang) {
            var player1 = Util.DOMUtil.SelectedValue(lang + ".player1");
            var player2 = Util.DOMUtil.SelectedValue(lang + ".player2");
            var board = Util.DOMUtil.SelectedValue("boards");
            window.location.href = Util.Util.Format("Scrabble.aspx?{0}-{1}:{2},{3}", [lang, board, player1, player2]);
        };
        Index.Register = function () {
            Util.DOMUtil.ApplyTemplate("list", 'langTemplate', Config);
            for (var indx in Config.Langs) {
                var lang = Config.Langs[indx];
                Util.DOMUtil.RegisterClick(lang + '.Play', function (e) {
                    var lang = e.currentTarget.getAttribute("-lang");
                    Index.Play(lang);
                });
            }
        };
        return Index;
    }());
    exports.Index = Index;
    Index.Register();
});

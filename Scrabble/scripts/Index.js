define(["require", "exports", 'Util'], function (require, exports, Util) {
    "use strict";
    var Config = {
        boards: [{ id: "11x11", name: "11x11" }],
        langs: [{
                lang: "te",
                name: "తెలుగు ~ Telugu",
                player: "ఆటగాడు(మీరు) : Player(You)",
                vs: "తో : vs",
                play: "ఆడదాం: Play",
                bot: "యంత్రుడు: Bot",
                bots: [
                    { id: "eenadu", name: "ఈనాడు: Eenadu" },
                    { id: "bbc.te", name: "బీబీసీ తెలుగు: BBC Telugu" }]
            }, {
                lang: "kn",
                name: "ಕನ್ನಡ ~ Kannada",
                player: "Player(You)",
                vs: "vs",
                play: "Play",
                bot: "Bot",
                bots: [
                    { id: "vijay", name: "ವಿಜಯ ಕರ್ನಾಟಕ: Vijay Karnataka" }]
            }]
    };
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
            for (var indx in Config.langs) {
                var lang = Config.langs[indx].lang;
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

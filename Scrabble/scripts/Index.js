define(["require", "exports", 'Util'], function (require, exports, Util) {
    "use strict";
    var Index = (function () {
        function Index() {
        }
        Index.Play = function (lang) {
            var palyer1 = Util.DOMUtil.SelectedValue(lang + ".player1");
            var palyer2 = Util.DOMUtil.SelectedValue(lang + ".player2");
            window.location.href = Util.Util.Format("Scrabble.aspx?{0}:{1},{2}", [lang, palyer1, palyer2]);
        };
        Index.Register = function () {
            Util.DOMUtil.ApplyTemplate("list", 'langTemplate', [
                {
                    lang: "te",
                    name: "తెలుగు ~ Telugu",
                    player: "ఆటగాడు(మీరు) : Player(You)",
                    vs: "తో : vs",
                    play: "ఆడదాం: Play",
                    bot: "యంత్రుడు: Bot",
                    bots: [
                        { id: "eenadu", name: "ఈనాడు: Eenadu" },
                        { id: "bbc.te", name: "బీబీసీ తెలుగు: BBC Telugu" }
                    ],
                }]);
            Util.DOMUtil.RegisterClick('te.Play', function (e) { Index.Play('te'); });
        };
        return Index;
    }());
    exports.Index = Index;
    Index.Register();
});

//---------------------------------------------------------------------------------------------
// <copyright file="Index.ts" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 29-Jan-2018 21:56EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------
import * as Util from 'Util';

export class Index {
    public static Play(lang: string): void {
        var player1 = Util.DOMUtil.SelectedValue(lang + ".player1");
        var player2 = Util.DOMUtil.SelectedValue(lang + ".player2");
        var board = Util.DOMUtil.SelectedValue("boards");
        window.location.href = Util.Util.Format("Scrabble.aspx?{0}-{1}:{2},{3}", [lang, board, player1, player2]);
    }
    public static Register(): void {
        Util.DOMUtil.ApplyTemplate("list", 'langTemplate',
            {
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
            });
        Util.DOMUtil.RegisterClick('te.Play', function (e) { Index.Play('te'); });
        Util.DOMUtil.RegisterClick('kn.Play', function (e) { Index.Play('kn'); });
    }
}
Index.Register();
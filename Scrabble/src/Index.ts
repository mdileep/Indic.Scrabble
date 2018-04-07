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
        var palyer1 = Util.DOMUtil.SelectedValue(lang + ".player1");
        var palyer2 = Util.DOMUtil.SelectedValue(lang + ".player2");
        window.location.href = Util.Util.Format("Scrabble.aspx?{0}:{1},{2}", [lang, palyer1, palyer2]);
    }
    public static Register(): void {
        Util.DOMUtil.ApplyTemplate("list", 'langTemplate', [
            {
                lang: "te",
                name: "తెలుగు ~ Telugu",
                player: "ఆటగాడు(మీరు) : Player(You)",
                vs: "తో : vs",
                play: "ఆడదాం: Play",
                bot:"యంత్రుడు: Bot",
                bots:
                [
                    { id: "eenadu", name: "ఈనాడు: Eenadu" },
                    { id: "bbc.te", name: "బీబీసీ తెలుగు: BBC Telugu" }
                ],
            }]);
        Util.DOMUtil.RegisterClick('te.Play', function (e) { Index.Play('te'); });
    }
}
Index.Register();
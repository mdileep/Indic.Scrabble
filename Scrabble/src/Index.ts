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
declare var Config: any;
export class Index {
    public static Play(lang: string): void {
        var player1 = Util.DOMUtil.SelectedValue(lang + ".player1");
        var player2 = Util.DOMUtil.SelectedValue(lang + ".player2");
        var board = Util.DOMUtil.SelectedValue("boards");
        window.location.href = Util.Util.Format("Scrabble.aspx?{0}-{1}:{2},{3}", [lang, board, player1, player2]);
    }
    public static Register(): void {
        Util.DOMUtil.ApplyTemplate("list", 'langTemplate', Config);
        for (var indx in Config.langs) {
            var lang: string = Config.langs[indx];
            Util.DOMUtil.RegisterClick(lang + '.Play', function (e) {
                var lang = (e.currentTarget as HTMLElement).getAttribute("-lang");
                Index.Play(lang);
            });
        }
    }
}
Index.Register();
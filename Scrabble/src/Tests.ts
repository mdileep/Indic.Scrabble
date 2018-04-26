﻿import * as AB from 'AskBot';
import * as U from 'Util';

export class RunerTest {
    static Go(): void {
        var Board =
            {
                Bot: "eenadu",
                Reference: "281",
                Name: "11x11",
                Cells: [
                    "",    "",    "",    "",    "",    "",    "","",    "",    "",    "",   
                    "",    "",    "",    "",    "",    "",    "","",    "",    "",    "",   
                    "",    "",    "",    "",    "",    "",    "","",    "శ",    "",    "",   
                    "",    "",    "",    "",    "",    "",    "", "క","స,ఇ",    "",    "",   
                    "",    "",    "",    "",    "",    "",    "గ","క",    "",    "",    "",   
                    "",    "",    "",    "",    "",    "శ",   "బ","శ",    "",    "",    "",   
                    "",    "",    "",    "",    "చ,ఆ","వ,ఇ","",    "",    "",    "",    "",   
                    "",    "",    "",    "",    "ల",   "",   "",    "",    "",    "",    "",   
                    "",    "",    "",    "",    "",    "",    "",    "",    "",    "",    "",   
                    "",    "",    "",    "",    "",    "",    "",    "",    "",    "",    "",   
                    "",    "",    "",    "",    "",    "",    "",    "",    "",    "",    "",   
                ],
                Conso: "క ఙ చ జ ప ల స",
                Special: "(ల,ఉ) ",
                Vowels: "అ ఆ ఈ ఉ ఉ ఎ ఏ ఓ"
            } as AB.ScrabbleBoard;
        AB.AskBot.BotMoveClient(Board);
    }
}
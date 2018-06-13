//---------------------------------------------------------------------------------------------
// <copyright file="WordLoader.ts" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 13-May-2018 19:01EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------

import * as Contracts from 'Contracts';
import * as axios from 'axios';
import * as GA from 'GameActions';
import * as GS from 'GameStore';

export class WordLoader {
    static Loaded = 0;
    static Total = 0;
    static Custom: string = "Custom";
    static Lists: any = {};
    //
    static LoadWords(file: string, askOpponent: boolean): Contracts.Word[] {
        if (WordLoader.Lists == null) {
            return [] as Contracts.Word[];
        }

        if (WordLoader.Lists[file] != null) {
            return WordLoader.Lists[file];
        }

        if (!askOpponent) {
            return [] as Contracts.Word[];
        }

        //Pick First Non-Custom
        for (var key in WordLoader.Lists) {
            if (key == WordLoader.Custom) {
                continue;
            }
            return WordLoader.Lists[key];
        }
        return [] as Contracts.Word[];
    }
    static AddWord(word: string): void {
        var cnt = WordLoader.Lists[WordLoader.Custom].length;
        WordLoader.Lists[WordLoader.Custom].push({
            Tiles: word,
            Index: cnt++,
            Syllables: word.split(',').length,
        } as Contracts.Word);
    }
    static Load(file: string, rawResponse: string): void {
        var words: string[] = rawResponse.split('\n');
        var List = [] as Contracts.Word[];
        var cnt = 0;
        for (var indx in words) {
            var line = words[indx];
            List.push(
                {
                    Tiles: line,
                    Index: cnt++,
                    Syllables: line.split(',').length,
                } as Contracts.Word);
        }
        WordLoader.Lists[file] = List;
        WordLoader.Loaded++;
        rawResponse = null;
    }
    static Init(file: string) {
        axios
            .get("/bots/" + file)
            .then(response => {
                WordLoader.Load(file, response.data as string);
                WordLoader.VocabularyLoaded(file);
            })
            .catch(error => {
                //TODO...
            });
    }
    static Report(gameId: number, words: string[]): void {
        if (words.length == 0) { return; }
        axios
            .post("API.ashx?reportwords", { id: gameId, words: words })
            .then(response => {

            })
            .catch(error => {
                //TODO...
            });
    }
    static Resolve(words: string[]): string[] {
        var unResolved: string[] = [];
        for (var indx in words) {
            var word: string = words[indx];
            var isValid: boolean = WordLoader.IsValid(word);
            if (!isValid) {
                unResolved.push(word);
            }
        }
        return unResolved;
    }
    static IsValid(word: string): boolean {
        var res = false;
        for (var indx in WordLoader.Lists) {
            var List: Contracts.Word[] = WordLoader.Lists[indx];
            for (var indx2 in List) {
                var Word: Contracts.Word = List[indx2];
                if (word == Word.Tiles) {
                    if (console) { console.log(Word.Tiles); }
                    return true;
                }
            }
        }
        return res;
    }
    static Prepare(list: string[]) {
        WordLoader.Total = list.length;
        if (list.length == 0) {
            WordLoader.LoadComplete();
            return;
        }
        WordLoader.LoadVocabularies(list);
    }
    static LoadVocabularies(list: string[]): void {
        for (var indx in list) {
            WordLoader.Init(list[indx]);
        }
    }
    static VocabularyLoaded(file: string): void {
        if (WordLoader.Loaded != WordLoader.Total) {
            return;
        }
        WordLoader.LoadComplete();
    }
    static LoadComplete() {
        WordLoader.Lists[WordLoader.Custom] = [];
        GS.GameStore.Dispatch({
            type: Contracts.Actions.Init,
            args: {
            }
        });
    }
    static Post(gameId: number): void {
        WordLoader.Report(gameId, WordLoader.Lists[WordLoader.Custom] as string[]);
    }
    static Dispose() {
        WordLoader.Lists = null;
    }
}
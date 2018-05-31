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


import * as C from 'Contracts';
import * as axios from 'axios';
import * as GA from 'GameActions';

export class WordLoader {
    static Loaded = 0;
    static Total = 0;
    static Lists: any = { Custom: [] };
    static LoadWords(file: string, force: boolean): C.Word[] {
        if (WordLoader.Lists != null && WordLoader.Lists[file] != null) {
            return WordLoader.Lists[file];
        }
        //Pick Non-Custom
        if (force && WordLoader.Lists != null) {
            for (var key in WordLoader.Lists) {
                if (key != "Custom") {
                    return WordLoader.Lists[key];
                }
            }
        }
        return [] as C.Word[];
    }
    static AddWord(word: string): void {
        var cnt = WordLoader.Lists["Custom"].length;
        WordLoader.Lists["Custom"].push({
            Tiles: word,
            Index: cnt++,
            Syllables: word.split(',').length,
        } as C.Word);
    }
    static Load(file: string, rawResponse: string): void {
        var words: string[] = rawResponse.split('\n');
        var List = [] as C.Word[];
        var cnt = 0;
        for (var indx in words) {
            var line = words[indx];
            List.push(
                {
                    Tiles: line,
                    Index: cnt++,
                    Syllables: line.split(',').length,
                } as C.Word);
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
                GA.GameActions.VocabularyLoaded(file);
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
            var List: C.Word[] = WordLoader.Lists[indx];
            for (var indx2 in List) {
                var Word: C.Word = List[indx2];
                if (word == Word.Tiles) {
                    if (console) { console.log(Word.Tiles); }
                    return true;
                }
            }
        }
        return res;
    }
}
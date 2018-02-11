//---------------------------------------------------------------------------------------------
// <copyright file="GamePlayer.ts" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 30-Jan-2018 19:32EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Contracts from 'Contracts';
import * as GameLoader from 'GameLoader';
import * as Indic from 'Indic';

class GamePlayer extends React.Component<Contracts.iPlayerView, Contracts.iPlayerView> {
    constructor(props: Contracts.iPlayerView) {
        super(props);
        this.state = props;
    }

    render() {
        var className: string = this.props.CurrentTurn ? "currentTurn" : "noTurn";

        var childs: React.ReactElement<Contracts.iProps>[] = [];

        var id = "U" + this.props.Id;
        var elem = React.createElement('span',
            {
                id: id,
                ref: id,
                key: id,
                className: className,
                title: this.props.Name,
            }, this.props.Name);
        childs.push(elem);

        if (this.props.showScore) {
            var score = React.createElement("span", { key: "score", className: "score" }, this.props.Score);
            childs.push(score);
        }

        if (this.props.showWords) {
            var words = this.renderWords();
            childs.push(words);
        }

        var className: string = "player";
        if (this.props.showWords && !this.hasWords() && !this.props.showScore) {
            className = "hide";
        }

        var id = "D_" + this.props.Id;
        var div = React.createElement('div',
            {
                id: id,
                ref: id,
                key: id,
                className: className,
                title: this.props.Name,
            }, childs);
        return div;
    }

    renderWords() {
        var ol: React.ReactElement<Contracts.iProps> = this.renderWordsList();
        var className: string = this.hasWords() ? "words" : "hide";
        var _id = "w_" + (this.props.Id + 1);
        var div = React.createElement('div',
            {
                id: _id,
                key: _id,
                ref: _id,
                className: className,
                title: "Words",
            }, [ol]);
        return div;
    }

    renderWordsList() {
        var items: React.ReactElement<Contracts.iProps>[] = [];
        for (var j = 0; j < this.props.Awarded.length; j++) {
            var word: Contracts.iWord = this.props.Awarded[j];
            var text: string = word.Text + "(" + word.Score + ")";
            var li = React.createElement("li",
                {
                    key: "wa" + j,
                    className: "cWord",
                    title: text
                }, text);
            items.push(li);
        }
        for (var j = 0; j < this.props.Claimed.length; j++) {
            var word: Contracts.iWord = this.props.Claimed[j];
            var text: string = word.Text + "(" + word.Score + ") *";
            var li = React.createElement("li",
                {
                    key: "wc" + j,
                    className: "wWord",
                    title: text
                }, text);
            items.push(li);
        }
        var id = "ul_" + (this.props.Id + 1);
        var ol = React.createElement("ol",
            {
                id: id,
                key: id,
                ref: id,
                className: "wordsList",
                title: "List"
            }, items);
        return ol;
    }

    hasWords(): boolean {
        return (this.props.Awarded.length + this.props.Claimed.length != 0);
    }
}
export default GamePlayer;
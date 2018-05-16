var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    var GamePlayer = (function (_super) {
        __extends(GamePlayer, _super);
        function GamePlayer(props) {
            _super.call(this, props);
            this.state = props;
        }
        GamePlayer.prototype.render = function () {
            var classList = [];
            classList.push(this.props.CurrentTurn ? "currentTurn" : "noTurn");
            classList.push(this.props.Bot != null ? "bot" : "human");
            var childs = [];
            var id = "U" + this.props.Id;
            var elem = React.createElement('span', {
                id: id,
                ref: id,
                key: id,
                className: classList.join(" "),
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
            var classList = ["player"];
            if (this.props.showWords && !this.hasWords() && !this.props.showScore) {
                classList.push("hide");
            }
            var id = "D_" + this.props.Id;
            var div = React.createElement('div', {
                id: id,
                ref: id,
                key: id,
                className: classList.join(" "),
                title: this.props.Name,
            }, childs);
            return div;
        };
        GamePlayer.prototype.renderWords = function () {
            var ol = this.renderWordsList();
            var className = this.hasWords() ? "words" : "hide";
            var _id = "w_" + (this.props.Id + 1);
            var div = React.createElement('div', {
                id: _id,
                key: _id,
                ref: _id,
                className: className,
                title: "Words",
            }, [ol]);
            return div;
        };
        GamePlayer.prototype.renderWordsList = function () {
            var items = [];
            for (var j = 0; j < this.props.Awarded.length; j++) {
                var word = this.props.Awarded[j];
                var text = word.Text + "(" + word.Score + ")";
                var li = React.createElement("li", {
                    key: "wa" + j,
                    className: "cWord",
                    title: text
                }, text);
                items.push(li);
            }
            for (var j = 0; j < this.props.Claimed.length; j++) {
                var word = this.props.Claimed[j];
                var text = word.Text + "(" + word.Score + ") *";
                var li = React.createElement("li", {
                    key: "wc" + j,
                    className: "wWord",
                    title: text
                }, text);
                items.push(li);
            }
            var id = "ul_" + (this.props.Id + 1);
            var ol = React.createElement("ol", {
                id: id,
                key: id,
                ref: id,
                className: "wordsList",
                title: "List"
            }, items);
            return ol;
        };
        GamePlayer.prototype.hasWords = function () {
            return (this.props.Awarded.length + this.props.Claimed.length != 0);
        };
        return GamePlayer;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GamePlayer;
});

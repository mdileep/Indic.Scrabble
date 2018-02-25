var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react", 'Contracts', 'GameLoader'], function (require, exports, React, Contracts, GameLoader) {
    "use strict";
    var RaiseHand = (function (_super) {
        __extends(RaiseHand, _super);
        function RaiseHand(props) {
            _super.call(this, props);
            this.state = props;
        }
        RaiseHand.prototype.render = function () {
            var childs = [];
            var pass = React.createElement('button', {
                id: "pass",
                key: "pass",
                ref: "pass",
                className: "pass",
                title: "Pass",
                onClick: this.OnPass
            }, [], "Pass");
            childs.push(pass);
            var blocks = React.createElement('div', {
                id: "raiseHand",
                key: "raiseHand",
                ref: "raiseHand",
                className: "raiseHand",
                title: "RaiseHand",
            }, childs);
            return blocks;
        };
        RaiseHand.prototype.OnPass = function (ev) {
            GameLoader.GameLoader.store.dispatch({
                type: Contracts.Actions.Pass,
                args: {}
            });
        };
        return RaiseHand;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = RaiseHand;
});

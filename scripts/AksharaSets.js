define(["require", "exports"], function (require, exports) {
    "use strict";
    var AksharaSets = (function () {
        function AksharaSets() {
        }
        AksharaSets.FullSpecialSet = [];
        AksharaSets.SpecialSet = [];
        AksharaSets.SunnaSet = [];
        AksharaSets.Vowels = [];
        AksharaSets.Consonents = [];
        AksharaSets.Virama = "";
        AksharaSets.Synonyms = {};
        return AksharaSets;
    }());
    exports.AksharaSets = AksharaSets;
});

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var getAllMatchPositions = function getAllMatchPositions(string, regex) {
    var match = void 0;
    var indexes = [];
    while (match = regex.exec(string)) {
        indexes.push([match.index, match.index + match[0].length]);
    }
    return indexes;
};

exports.default = getAllMatchPositions;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _findWithRegex = require('find-with-regex');

var _findWithRegex2 = _interopRequireDefault(_findWithRegex);

var _lodash = require('lodash.escaperegexp');

var _lodash2 = _interopRequireDefault(_lodash);

var _getAllMatchPositions = require('./utils/getAllMatchPositions');

var _getAllMatchPositions2 = _interopRequireDefault(_getAllMatchPositions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (trigger, regExp) {
  return function (contentBlock, callback) {
    //findWithRegex(new RegExp('/`(.*?)`/', 'g'), contentBlock, callback);
    //const match = contentBlock.getText().match(/\[(.*?)\]/);

    var matches = (0, _getAllMatchPositions2.default)(contentBlock.getText(), /\[(.*?)\]/g);

    if (matches.length) {
      matches.forEach(function (match) {
        return callback(match[0], match[1]);
      });
    }
  };
};
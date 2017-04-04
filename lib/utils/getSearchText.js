'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getWordAt = require('./getWordAt');

var _getWordAt2 = _interopRequireDefault(_getWordAt);

var _getAllMatchPositions = require('./getAllMatchPositions');

var _getAllMatchPositions2 = _interopRequireDefault(_getAllMatchPositions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getSearchText = function getSearchText(editorState, selection) {
  var anchorKey = selection.getAnchorKey();
  var anchorOffset = selection.getAnchorOffset() - 1;
  var currentContent = editorState.getCurrentContent();
  var currentBlock = currentContent.getBlockForKey(anchorKey);
  var blockText = currentBlock.getText() + '';

  var regex = /\[(.*?)\]/g;

  var matchingPositions = (0, _getAllMatchPositions2.default)(blockText, regex);

  var searchPosition = matchingPositions.find(function (position) {
    return anchorOffset >= position[0] && anchorOffset <= position[1];
  });

  return { begin: searchPosition[0], end: searchPosition[1], searchValue: blockText.slice(searchPosition[0] + 1, searchPosition[1] - 1) };

  // console.log(blockText, anchorOffset);
  // return getWordAt(blockText, anchorOffset);
};

exports.default = getSearchText;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultSuggestionsFilter = undefined;

var _decorateComponentWithProps = require('decorate-component-with-props');

var _decorateComponentWithProps2 = _interopRequireDefault(_decorateComponentWithProps);

var _immutable = require('immutable');

var _draftJs = require('draft-js');

var _Mention = require('./Mention');

var _Mention2 = _interopRequireDefault(_Mention);

var _MentionSuggestions = require('./MentionSuggestions');

var _MentionSuggestions2 = _interopRequireDefault(_MentionSuggestions);

var _MentionSuggestionsPortal = require('./MentionSuggestionsPortal');

var _MentionSuggestionsPortal2 = _interopRequireDefault(_MentionSuggestionsPortal);

var _defaultRegExp = require('./defaultRegExp');

var _defaultRegExp2 = _interopRequireDefault(_defaultRegExp);

var _mentionStrategy = require('./mentionStrategy');

var _mentionStrategy2 = _interopRequireDefault(_mentionStrategy);

var _mentionSuggestionsStrategy = require('./mentionSuggestionsStrategy');

var _mentionSuggestionsStrategy2 = _interopRequireDefault(_mentionSuggestionsStrategy);

var _mentionStyles = {
  "mention": "draftJsMentionPlugin__mention__29BEd"
};

var _mentionStyles2 = _interopRequireDefault(_mentionStyles);

var _mentionSuggestionsStyles = {
  "mentionSuggestions": "draftJsMentionPlugin__mentionSuggestions__2DWjA"
};

var _mentionSuggestionsStyles2 = _interopRequireDefault(_mentionSuggestionsStyles);

var _mentionSuggestionsEntryStyles = {
  "mentionSuggestionsEntry": "draftJsMentionPlugin__mentionSuggestionsEntry__3mSwm",
  "mentionSuggestionsEntryFocused": "draftJsMentionPlugin__mentionSuggestionsEntryFocused__3LcTd draftJsMentionPlugin__mentionSuggestionsEntry__3mSwm",
  "mentionSuggestionsEntryText": "draftJsMentionPlugin__mentionSuggestionsEntryText__3Jobq",
  "mentionSuggestionsEntryAvatar": "draftJsMentionPlugin__mentionSuggestionsEntryAvatar__1xgA9"
};

var _mentionSuggestionsEntryStyles2 = _interopRequireDefault(_mentionSuggestionsEntryStyles);

var _defaultSuggestionsFilter = require('./utils/defaultSuggestionsFilter');

var _defaultSuggestionsFilter2 = _interopRequireDefault(_defaultSuggestionsFilter);

var _positionSuggestions = require('./utils/positionSuggestions');

var _positionSuggestions2 = _interopRequireDefault(_positionSuggestions);

var _getAllMatchPositions = require('./utils/getAllMatchPositions');

var _getAllMatchPositions2 = _interopRequireDefault(_getAllMatchPositions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var defaultTheme = {
    // CSS class for mention text
    mention: _mentionStyles2.default.mention,
    // CSS class for suggestions component
    mentionSuggestions: _mentionSuggestionsStyles2.default.mentionSuggestions,
    // CSS classes for an entry in the suggestions component
    mentionSuggestionsEntry: _mentionSuggestionsEntryStyles2.default.mentionSuggestionsEntry,
    mentionSuggestionsEntryFocused: _mentionSuggestionsEntryStyles2.default.mentionSuggestionsEntryFocused,
    mentionSuggestionsEntryText: _mentionSuggestionsEntryStyles2.default.mentionSuggestionsEntryText,
    mentionSuggestionsEntryAvatar: _mentionSuggestionsEntryStyles2.default.mentionSuggestionsEntryAvatar
  };

  var callbacks = {
    keyBindingFn: undefined,
    handleKeyCommand: undefined,
    onDownArrow: undefined,
    onUpArrow: undefined,
    onTab: undefined,
    onEscape: undefined,
    handleReturn: undefined,
    onChange: undefined
  };

  var ariaProps = {
    ariaHasPopup: 'false',
    ariaExpanded: 'false',
    ariaOwneeID: undefined,
    ariaActiveDescendantID: undefined
  };

  var searches = (0, _immutable.Map)();
  var escapedSearch = void 0;
  var clientRectFunctions = (0, _immutable.Map)();

  var store = {
    getEditorState: undefined,
    setEditorState: undefined,
    getPortalClientRect: function getPortalClientRect(offsetKey) {
      return clientRectFunctions.get(offsetKey)();
    },
    getAllSearches: function getAllSearches() {
      return searches;
    },
    isEscaped: function isEscaped(offsetKey) {
      return escapedSearch === offsetKey;
    },
    escapeSearch: function escapeSearch(offsetKey) {
      escapedSearch = offsetKey;
    },

    resetEscapedSearch: function resetEscapedSearch() {
      escapedSearch = undefined;
    },

    register: function register(offsetKey) {
      searches = searches.set(offsetKey, offsetKey);
    },

    updatePortalClientRect: function updatePortalClientRect(offsetKey, func) {
      clientRectFunctions = clientRectFunctions.set(offsetKey, func);
    },

    unregister: function unregister(offsetKey) {
      searches = searches.delete(offsetKey);
      clientRectFunctions = clientRectFunctions.delete(offsetKey);
    }
  };

  // Styles are overwritten instead of merged as merging causes a lot of confusion.
  //
  // Why? Because when merging a developer needs to know all of the underlying
  // styles which needs a deep dive into the code. Merging also makes it prone to
  // errors when upgrading as basically every styling change would become a major
  // breaking change. 1px of an increased padding can break a whole layout.
  var _config$mentionPrefix = config.mentionPrefix,
      mentionPrefix = _config$mentionPrefix === undefined ? '' : _config$mentionPrefix,
      _config$theme = config.theme,
      theme = _config$theme === undefined ? defaultTheme : _config$theme,
      _config$positionSugge = config.positionSuggestions,
      positionSuggestions = _config$positionSugge === undefined ? _positionSuggestions2.default : _config$positionSugge,
      mentionComponent = config.mentionComponent,
      _config$entityMutabil = config.entityMutability,
      entityMutability = _config$entityMutabil === undefined ? 'IMMUTABLE' : _config$entityMutabil,
      _config$mentionTrigge = config.mentionTrigger,
      mentionTrigger = _config$mentionTrigge === undefined ? '@' : _config$mentionTrigge,
      _config$mentionRegExp = config.mentionRegExp,
      mentionRegExp = _config$mentionRegExp === undefined ? _defaultRegExp2.default : _config$mentionRegExp,
      _config$entryComponen = config.entryComponent,
      entryComponent = _config$entryComponen === undefined ? null : _config$entryComponen;

  var mentionSearchProps = {
    ariaProps: ariaProps,
    callbacks: callbacks,
    theme: theme,
    store: store,
    entityMutability: entityMutability,
    positionSuggestions: positionSuggestions,
    mentionTrigger: mentionTrigger,
    mentionPrefix: mentionPrefix,
    entryComponent: entryComponent
  };
  return {
    MentionSuggestions: (0, _decorateComponentWithProps2.default)(_MentionSuggestions2.default, mentionSearchProps),
    decorators: [{
      strategy: (0, _mentionStrategy2.default)(mentionTrigger),
      component: (0, _decorateComponentWithProps2.default)(_Mention2.default, { theme: theme, mentionComponent: mentionComponent })
    }, {
      strategy: (0, _mentionSuggestionsStrategy2.default)(mentionTrigger, mentionRegExp),
      component: (0, _decorateComponentWithProps2.default)(_MentionSuggestionsPortal2.default, { store: store })
    }],
    getAccessibilityProps: function getAccessibilityProps() {
      return {
        role: 'combobox',
        ariaAutoComplete: 'list',
        ariaHasPopup: ariaProps.ariaHasPopup,
        ariaExpanded: ariaProps.ariaExpanded,
        ariaActiveDescendantID: ariaProps.ariaActiveDescendantID,
        ariaOwneeID: ariaProps.ariaOwneeID
      };
    },

    initialize: function initialize(_ref) {
      var getEditorState = _ref.getEditorState,
          setEditorState = _ref.setEditorState;

      store.getEditorState = getEditorState;
      store.setEditorState = setEditorState;
    },

    onDownArrow: function onDownArrow(keyboardEvent) {
      return callbacks.onDownArrow && callbacks.onDownArrow(keyboardEvent);
    },
    onTab: function onTab(keyboardEvent) {
      return callbacks.onTab && callbacks.onTab(keyboardEvent);
    },
    onUpArrow: function onUpArrow(keyboardEvent) {
      return callbacks.onUpArrow && callbacks.onUpArrow(keyboardEvent);
    },
    onEscape: function onEscape(keyboardEvent) {
      return callbacks.onEscape && callbacks.onEscape(keyboardEvent);
    },
    handleReturn: function handleReturn(keyboardEvent) {
      return callbacks.handleReturn ? callbacks.handleReturn(keyboardEvent) : 'handled';
    },
    handleBeforeInput: function handleBeforeInput(chars, _ref2) {
      var getEditorState = _ref2.getEditorState,
          setEditorState = _ref2.setEditorState;

      //console.log(getEditorState(), command.keyCode);

      var editorState = getEditorState();

      var contentState = editorState.getCurrentContent();
      var blocks = contentState.getBlocksAsArray();
      var selectionState = editorState.getSelection();

      var anchorKey = selectionState.getAnchorKey();
      var anchorOffset = selectionState.getAnchorOffset();

      var plainText = contentState.getPlainText();
      var currentContentBlock = contentState.getBlockForKey(anchorKey);
      var currentOffset = selectionState.getAnchorOffset();

      if (chars === '[') {
        var endSelection = new _draftJs.SelectionState({
          anchorKey: selectionState.getAnchorKey(),
          anchorOffset: selectionState.getAnchorOffset(),
          focusKey: selectionState.getFocusKey(),
          focusOffset: selectionState.getFocusOffset()
        });
        var newContentState = _draftJs.Modifier.replaceText(contentState, endSelection, '[]');
        editorState = _draftJs.EditorState.push(editorState, newContentState, 'insert-characters');
        editorState = _draftJs.EditorState.forceSelection(editorState, new _draftJs.SelectionState({
          anchorKey: selectionState.getAnchorKey(),
          anchorOffset: selectionState.getAnchorOffset() + 1,
          focusKey: selectionState.getFocusKey(),
          focusOffset: selectionState.getFocusOffset() + 1
        }));

        setEditorState(editorState);
        return 'handled';
      }

      var regex = /\[(.*?)\]/g;

      var matchingPositions = (0, _getAllMatchPositions2.default)(plainText, regex);

      if (matchingPositions.some(function (position) {
        return currentOffset > position[0] && currentOffset < position[1];
      })) {
        return true;
      }

      var operatorPattern = /(?:[-0-9 .%^&*()_+\"'\/])/;
      return operatorPattern.test(chars) ? false : 'handled';

      return true;
    },
    onChange: function onChange(editorState) {

      var selection = editorState.getSelection();

      var startKey = selection.getStartKey();
      var startOffset = selection.getStartOffset();
      var endKey = selection.getEndKey();
      var endOffset = selection.getEndOffset();
      var prevOffset = startOffset - 1;
      var block = editorState.getCurrentContent().getBlockForKey(startKey);
      var characterList = block.getCharacterList();

      if (selection.isCollapsed()) {
        var prevChar = characterList.get(prevOffset);
        var nextChar = characterList.get(startOffset);

        if (!prevChar || !nextChar) {
          if (callbacks.onChange) return callbacks.onChange(editorState);
          return editorState;
        }

        var prevEntity = prevChar.getEntity();
        var nextEntity = nextChar.getEntity();
        var entity = prevEntity === nextEntity && prevEntity;

        if (!entity) {
          if (callbacks.onChange) return callbacks.onChange(editorState);
          return editorState;
        }

        var finalPrevOffset = prevOffset;
        var finalNextOffset = startOffset;

        while (finalPrevOffset > 0) {
          finalPrevOffset--;
          var char = characterList.get(finalPrevOffset);
          if (char.getEntity() !== entity) {
            finalPrevOffset++;
            break;
          }
        }

        var blockLength = block.getLength();
        while (finalNextOffset < blockLength) {
          finalNextOffset++;
          var _char = characterList.get(finalNextOffset);
          if (_char.getEntity() !== entity) {
            break;
          }
        }

        editorState = _draftJs.EditorState.forceSelection(editorState, new _draftJs.SelectionState({
          anchorKey: selection.getAnchorKey(),
          anchorOffset: finalPrevOffset,
          focusKey: selection.getFocusKey(),
          focusOffset: finalNextOffset
        }));
      } else {
        var selectionStart = startOffset;
        var selectionEnd = endOffset;

        var startEntity = selectionStart && characterList.get(selectionStart) && characterList.get(selectionStart).getEntity();

        if (startEntity) {
          while (selectionStart > 0) {
            selectionStart--;
            var _char2 = characterList.get(selectionStart);
            if (_char2.getEntity() !== startEntity) {
              selectionStart++;
              break;
            }
          }
        }

        var endEntity = selectionEnd && characterList.get(selectionEnd) && characterList.get(selectionEnd).getEntity();

        if (endEntity) {
          while (selectionEnd > 0) {
            selectionEnd++;
            var _char3 = characterList.get(selectionEnd);
            if (_char3.getEntity() !== endEntity) {
              break;
            }
          }
        }

        editorState = _draftJs.EditorState.forceSelection(editorState, new _draftJs.SelectionState({
          anchorKey: selection.getAnchorKey(),
          anchorOffset: selectionStart,
          focusKey: selection.getFocusKey(),
          focusOffset: selectionEnd
        }));
      }

      if (callbacks.onChange) return callbacks.onChange(editorState);
      return editorState;
    }
  };
};

var defaultSuggestionsFilter = exports.defaultSuggestionsFilter = _defaultSuggestionsFilter2.default;
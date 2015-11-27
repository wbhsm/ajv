'use strict';

/**
 * Define custom keyword
 * @param {String} keyword custom keyword, should be a valid identifier, should be different from all standard, custom and macro keywords.
 * @param {Object} definition keyword definition object with properties `type` (type(s) which the keyword applies to), `validate` or `compile`.
 */
module.exports = function addKeyword(keyword, definition) {
  var self = this;
  if (this.RULES.keywords[keyword])
    throw new Error('Keyword ' + keyword + ' is already defined');

  if (definition.macro) {
    if (definition.type) throw new Error('type cannot be defined for macro keywords');
    _addMacro(keyword, definition.macro);
  } else {
    var dataType = definition.type;
    if (Array.isArray(dataType)) {
      var i, len = dataType.length;
      for (i=0; i<len; i++) checkDataType(dataType[i]);
      for (i=0; i<len; i++) _addRule(keyword, dataType[i], definition);
    } else {
      if (dataType) checkDataType(dataType);
      _addRule(keyword, dataType, definition);
    }
  }

  this.RULES.keywords[keyword] = true;
  this.RULES.all[keyword] = true;


  function _addRule(keyword, dataType, definition) {
    var ruleGroup;
    for (var i=0; i<self.RULES.length; i++) {
      var rg = self.RULES[i];
      if (rg.type == dataType) {
        ruleGroup = rg;
        break;
      }
    }

    if (!ruleGroup) {
      ruleGroup = { type: dataType, rules: [] };
      self.RULES.push(ruleGroup);
    }

    var rule = { keyword: keyword, definition: definition, custom: true };
    ruleGroup.rules.push(rule);
  }


  function _addMacro(keyword, macro) {
    var macros = self.RULES.macros;
    var rule = { keyword: keyword, macro: macro };
    if (macros) macros[macros.length] = rule;
    else self.RULES.macros = [rule];
    self.RULES.allMacros = self.RULES.allMacros || {};
    self.RULES.allMacros[keyword] = true;
  }


  function checkDataType(dataType) {
    if (!self.RULES.types[dataType]) throw new Error('Unknown type ' + dataType);
  }
};
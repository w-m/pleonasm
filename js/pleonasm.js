(function (exports) {
  
  'use strict';

  var dicts = {};

  var hex_alphabet  = '0123456789abcdef';
  var trsl_alphabet = 'ulkmhpvtwgnbcdyf';

  var hex_re  = new RegExp('[^' + hex_alphabet  + ']', 'g');
  var trsl_re = new RegExp('[^' + trsl_alphabet + ']', 'g');

  var onload_callbacks = [];

  var isNode = (!!(typeof module !== 'undefined' && module.exports && exports === module.exports));

  if (isNode) {
    var fs = require('fs');
  }

  function checkReady() {
    if (checkDictionariesAvailable()) {
      for (var i = 0; i < onload_callbacks.length; i++) {
        var cb = onload_callbacks.pop();
        cb();
      }
    }
  }

  exports.onload = function(callback) {
    if (checkReady()) {
      callback();
    } else {
      onload_callbacks.push(callback);
    }
  };

  function initTree(id) {
    return function(lines) {
      buildTree(id, lines);
      checkReady();
    };
  }

  loadDict('adj.txt',  initTree('adj'));
  loadDict('noun.txt', initTree('noun'));
  loadDict('verb.txt', initTree('verb'));

  var treeIDs = ['verb', 'adj', 'noun'];

  function translate_from_hex(hex) {
    for (var i = 0; i < 16; i++) {
      hex = hex.replace(new RegExp(hex_alphabet[i], 'g'), trsl_alphabet[i]);
    }
    return hex;
  }

  function translate_to_hex(code) {
    for (var i = 0; i < 16; i++) {
      code = code.replace(new RegExp(trsl_alphabet[i], 'g'), hex_alphabet[i]);
    }
    return code;
  }

  function checkDictionariesAvailable() {
    for (var treeID = 0; treeID < treeIDs.length; treeID++) {
      if (!(treeIDs[treeID] in dicts)) {
        return false;
      }
    }
    return true;
  }

  exports.encode = function(hex, wordDelimiter, groupDelimiter) {

    if(typeof(wordDelimiter) === 'undefined') { wordDelimiter = ' '; }
    if(typeof(groupDelimiter) === 'undefined') { groupDelimiter = ', '; }

    if (!checkDictionariesAvailable()) {
      return {code: 'Loading Dictionaries...'};
    }

    var result = {};

    var hex_lower = hex.toLowerCase();
    var filtered = hex_lower.replace(hex_re, '');
    var translated = translate_from_hex(filtered);

    result.translation = translated;

    var treeIndex = 0;
    var codeWords = [];

    while (translated.length > 0) {

      // verb, adj, noun, verb, adj, noun, ...
      var tree = dicts[treeIDs[treeIndex % treeIDs.length]];

      var longest = find_longest(tree, translated);
      translated = translated.substring(longest.depth);

      codeWords.push(longest.match);

      treeIndex++;
    }
    
    result.codeWords = codeWords;
    result.code = exports.format(codeWords, wordDelimiter, groupDelimiter);
    result.spaced = result.code.replace(trsl_re, ' ');

    return result;
  };

  exports.format = function(codeWords, wordDelimiter, groupDelimiter) {
    
    var groups = [];
    var groupSize = treeIDs.length;
    for (var i = 0; i < Math.ceil(codeWords.length / groupSize); i++) {
      var subGroup = codeWords.slice(i * groupSize, (i * groupSize) + groupSize);
      groups.push(subGroup.join(wordDelimiter));
    }
    return groups.join(groupDelimiter);
  };

  exports.decode = function(code) {

    var removed_redundancy = code.replace(trsl_re, '');
    var spaced = code.replace(trsl_re, ' ');
    var hex = translate_to_hex(removed_redundancy);
    return {hex: hex, spaced: spaced, translation: removed_redundancy};
  };

  function find_longest(tree, word) {

    var depth = 0;
    var longest_match = null;

    for (var i = 0; i <= word.length; i++) {
      var sub_path = word.substring(0, i);
      if (sub_path in tree) {
        var match = tree[sub_path];
        if (match !== null) {
          depth = i;
          longest_match = match;
        }
      } else {
        break;
      }
    }
    return {depth: depth, match: longest_match};
  }

  function loadDict(dictFileName, dataCallBack) {

    function processData(plainText) {
        var lines = plainText.split('\n');
        dataCallBack(lines);
    }
    
    var path = 'dictionaries/' + dictFileName;

    if (isNode) {
      fs.readFile(path, function (err, data) {
        if (err) {
          throw err; 
        }
        processData(data.toString()); 
      });
    } else {
      var client = new XMLHttpRequest();
      client.open('GET', path);
      client.onreadystatechange = function() {
        if (client.readyState === 4) {
          processData(client.responseText);
        }
      };
      client.send();
    }
  }

  function buildTree(dictID, lines) {

    // tree-like data structure for lookup
    // flat representation as object for faster building, access
    var tree = {};

    for (var i = 0; i < lines.length; i++) {
      // create keys by removing redundant characters
      var filtered_line = lines[i].replace(trsl_re, '');

      // create empty nodes on the way to the key
      // e.g. b = null, bc = null when inserting bcd = braced
      // --> to know when to stop the lookup
      for (var j = 0; j < filtered_line.length; j++) {
        var sub_path = filtered_line.substring(0, j);
        if (!(sub_path in tree)) {
          tree[sub_path] = null;
        }
      }
      // actual lookup table
      tree[filtered_line] = lines[i];
    }
    dicts[dictID] = tree;
  }
}) (typeof exports === 'undefined' ? this['pleonasm'] = {}: exports);

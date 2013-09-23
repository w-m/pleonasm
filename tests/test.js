path = require('path');
fs = require('fs');
assert = require('assert');

pleonasm = require('pleonasm');

function loadTest(testFileName, dataCallBack) {

  fs.readFile(path.resolve(__dirname, testFileName), function (err, data) {
    if (err) {
      throw err; 
    }
    var lines = data.toString().split('\n');
    dataCallBack(lines);
  });
}


function check_file(data, testName) {
  
  var tests = 0;
  for (var i = 0; i < data.length; i++) {
    var line = data[i];
    if (!line) {
      continue;
    }
    
    var split = line.split('\t');

    var source = split[0];
    var code = split[1];

    var encoded = pleonasm.encode(source, ' ', ' ').code;
    var decoded = pleonasm.decode(encoded).hex;
    assert.equal(encoded, code, 'Encoding failed in test ' + testName + '. Expected: ' + code + ', got: ' + encoded);
    assert.equal(decoded, source, 'Decoding failed in test ' + testName + '. Expected: ' + source + ', got: ' + decoded);
    tests += 1;
  }
  console.log('All ' + tests + ' test cases of ' + testName + ' successful!');
}

pleonasm.onload(function() {
  function testWithName(name) {
    return function(data) { check_file(data, name) };
  };
  loadTest('test_complete_dict.txt', testWithName('complete dictionaries (test_complete_dict)'));
  loadTest('test_hex_4.txt', testWithName('all hex numbers with length <= 4 (test_hex_4)'));
  loadTest('test_random.txt', testWithName('random strings (test_random)'));
});


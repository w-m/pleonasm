
var pleonasm = require('pleonasm');

pleonasm.onload(function() {
  
  var sample_hex = 'ad3a507';
  var encoded = pleonasm.encode(sample_hex);
  console.log(sample_hex + ' encoded as: ' + encoded.code);

  var sample_phrase = 'perform step gods, fear';
  var decoded = pleonasm.decode(sample_phrase);
  console.log(sample_phrase + ' decoded to: ' + decoded.hex);

});

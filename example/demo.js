
var pleonasm = require('pleonasm');

pleonasm.onload(function() {
  
  var encoded = pleonasm.encode('ad3a507');
  console.log(encoded.code);

  var decoded = pleonasm.decode('perform step gods, fear');
  console.log(decoded.hex);

});

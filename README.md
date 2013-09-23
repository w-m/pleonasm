pleonasm
========

Create English phrases from hex strings that are easier to recognize and remember

Try it out: http://w-m.github.io/pleonasm/


### Javascript API

```Javascript
.onload(fn)
```

Register a function to be called when the when the dictionaries are loaded and pleonasm is ready to use.

------------------------------------

```Javascript
.encode('601a9f')
```

Encode a hex string into an English phrase. Returns an object, with the key 'code' as the result:

```Javascript
{ translation: 'vulngf',
  codeWords: [ 'visualizing', 'free' ],
  code: 'visualizing free',
  spaced: 'v  u l   ng f   ' }
```  

Can take wordDelimiter and groupDelimiter as additional arguments (see .format).

```Javascript
.encode('0167aa36cf832', '_', '/')
{ translation: 'ulvtnnmvcfwmk',
  codeWords: 
   [ 'rule',  'veterinarian',
     'move',  'care',
     'fewer', 'mark' ],
  code: 'rule_veterinarian_move/care_fewer_mark',
  spaced: ' ul  v t   n    n m v  c    f w   m  k' }
```  
------------------------------------

```Javascript
.decode('visualizing free')
```

Decode an English phrase to get a hex number.

```Javascript
{ hex: '601a9f',
  spaced: 'v  u l   ng f   ',
  translation: 'vulngf' }
```

------------------------------------

```Javascript
.format(codeWords, wordDelimiter, groupDelimiter)
```

Format an array of code words into a string. Words are connected with wordDelimiter (usually ' '), phrases of three words each are connected with groupDelimiter (usually ', ')).

### Javascript (Browser)

Files needed:
```
dictionaries/
-- adj.txt
-- noun.txt
-- verb.txt
js/
-- pleonasm.js
```

```HTML
<script src="js/pleonasm.js"></script>
<script>
  pleonasm.onload(function() {
    var encoded = pleonasm.encode('ad3a507').code;
  });
</script>
```

### node.js

Install via npm:

```
npm install pleonasm

npm test pleonasm
```

Usage:

```Javascript
var pleonasm = require('pleonasm');

pleonasm.onload(function() {
  var encoded = pleonasm.encode('ad3a507').code;
});
```

### Python

```Python
from pleonasm import Encoder, decode

enc = Encoder('../dictionaries')
encoded = enc.encode('601a9f')
print encoded # 'visualizing free'

decoded = decode('rule_veterinarian_move')
print decoded # '0167aa36'
```

### Acknowledgements and other projects

The dictionaries are created from the 1-grams of the [Google Ngram](http://books.google.com/ngrams) data.

The idea of the grammatical template stems from [tripphrase](http://worrydream.com/tripphrase/).

[humanhash](https://github.com/zacharyvoase/humanhash) creates hashes (compressed) from a 256-word dictionary.

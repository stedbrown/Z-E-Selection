const deepl = require('deepl-node');
const t = new deepl.Translator('0addd005-2281-4566-bb4b-f9bdcbdf375e:fx');
t.translateText('ciao', null, 'en-US').then(r => console.log(r)).catch(e => console.log(e));

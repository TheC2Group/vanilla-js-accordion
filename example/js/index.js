var Accordion = require('../../cjs/accordion.js');

var defaultAcc = new Accordion(document.querySelector('.Example1'));

var multipleAcc = new Accordion(document.querySelector('.Example2'), {
    allowMultiple: false,
    setFocus: 'panel'
});

var hashAcc = new Accordion(document.querySelector('.Example3'), {
    allowMultiple: false
});

document.querySelector('.destroy').addEventListener('click', function () {
    defaultAcc.destroy();
});

document.querySelector('.enable').addEventListener('click', function() {
    defaultAcc = new Accordion(document.querySelector('.Example1'));
});

/*!
 * jay.pre (https://github.com/unscrum/jaymvc)
 * Copyright 2018 Jay Brummels
 * Licensed under MIT (https://github.com/unscrum/jaymvc/LICENSE)
 */

/*log stuff*/
function log() {
    if (typeof console != 'undefined') {
        var args = Array.prototype.slice.call(arguments);
        var ln = args.length;
        for (var x = 0; x < ln; x++) {
            console.log(args[x]);
        }
    }
}

/* useful string functions*/
String.prototype.htmlBreakToNewLine = function (){

    return this.replace(/<br\/>/g, '\n');
};
String.prototype.newLineHtmlBreak = function () {

    return this.replace(/\n/g, '<br/>');
};


String.prototype.trim = function () {
    return this.replace( /^[\s\xA0]+/ , '' ).replace( /[\s\xA0]+$/ , '' );
};

String.prototype.startsWith = function ( str ) {
    return ( this.match( '^' + str ) == str );
};

String.prototype.endsWith = function ( str ) {
    return ( this.match( str + '$' ) == str );
};

/*some jay functions and namespace defined*/
var jay = {
    pascalToCamel: function (string) {
        return string.charAt(0).toLowerCase() + string.substring(1);
    },
    camelToPascal: function (string) {
        return string.charAt(0).toUpperCase() + string.substring(1);
    },
    formatNumber: function (number) {
        number += '';
        var parts = number.split('.');
        var integer = parts[0];
        var dec = parts.length > 1 ? '.' + parts[1] : '';
        var regex = /(\d+)(\d{3})/;

        while (regex.test(integer))
            integer = integer.replace(regex, '$1' + ',' + '$2');

        return integer + dec;
    },
    precisionRound: function(number, precision) {
        var factor = Math.pow(10, precision);
        return Math.round(number * factor) / factor;
    },
    rgbToHex: function(rgb){
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (rgb && rgb.length === 4) ? '#' +
            ('0' + parseInt(rgb[1],10).toString(16)).slice(-2) +
            ('0' + parseInt(rgb[2], 10).toString(16)).slice(-2) +
            ('0' + parseInt(rgb[3], 10).toString(16)).slice(-2) : '#000000';
    },
    failMessage : 'Oops, that wasn\'t supposed to happen. Please make sure you\'re still connected and try again.'
};
 
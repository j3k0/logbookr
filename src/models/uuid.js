(function (root, isBrowser) {
    var definition = (function () {
        // UUID Generator

        // Fill an array of 16 bits random values.
        var crypto = (root.crypto || {});
        crypto.getRandomValues16 = (
            crypto.getRandomValues ||
            function (array) {
            for (var i = 0; i < array.length; ++i) {
                array[i] = (((1 + Math.random()) * 0x10000) | 0) - 0x10000;
            }
        }
        );

        function S4(array, i) {
            return (array[i] + 0x10000).toString(16).substring(1);
        }

        /** Generate a pseudo-GUID by concatenating random hexadecimal. */
        var uuid;
        if (root.Uint16Array) {
            uuid = function () {
                var a = new Uint16Array(8);
                crypto.getRandomValues16(a);
                return (S4(a, 0) + S4(a, 1) + "-" +
                        S4(a, 2) + "-" + S4(a, 3) + "-" +
                        S4(a, 4) + "-" + S4(a, 5) +
                        S4(a, 6) + S4(a, 7));
            };
        }
        else {
            uuid = function () {
                var a = [0,0,0,0,0,0,0,0];
                crypto.getRandomValues16(a);
                return (S4(a, 0) + S4(a, 1) + "-" +
                        S4(a, 2) + "-" + S4(a, 3) + "-" +
                        S4(a, 4) + "-" + S4(a, 5) +
                        S4(a, 6) + S4(a, 7));
            };
        }

        return uuid;
    });


    return isBrowser
        ? define(definition)
        : module.exports = definition(require)
}(this, 'undefined' !== typeof window));

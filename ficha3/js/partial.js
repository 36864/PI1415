function partial(func) {
    /*jshint validthis: true*/
    'use strict';
    var args, pthis;
    args = Array.prototype.slice.call(arguments, 1);
    pthis = this;
    return function () {
        var i, j = 0;
        for (i = 0; i < args.length; i += 1) {
            if (args[i] === null) {
                args[i] = arguments[j];
                j += 1;
            }
        }
        return func.apply(pthis, Array.prototype.concat(args, Array.prototype.slice.call(arguments, j)));
    };
}

Function.prototype.partial = function (ctx) {
    'use strict';
    var func, args, i, argnames, elem;
    func = this;
    args = [];
    /*jslint regexp: true */
    argnames = func.toString().replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg, '').match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1].split(/,/);
    /*jslint regexp: false */
    for (i = 0; i < argnames.lenth; i += 1) {
        args[argnames[i]] = ctx[argnames[i]] || null;
    }
    if (args.length === 0) {
        i = 0;
        for (elem in ctx) {
            if (ctx.hasOwnProperty(elem)) {
                args[i] = ctx[elem];
                i += 1;
            }
        }
    }
    return partial.apply(null, Array.prototype.concat(func, args));
};

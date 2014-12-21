/*a, b
function patial(func) {
    'use strict';
    var args;
    args = Array.slice(arguments);
    
    return function () {
        var i, j = 0;
        for (i = 0; i < args.length; i += 1) {
            if (args[i] === null) {
                args[i] = arguments[j];
                j += 1;
            }
        }
        
        return func.apply(null, args);
    };
}

*/

/*c
function partial(func) {
    'use strict';
    var args, pthis;
    args = Array.slice(arguments);
    pthis = this;
    return function () {
        var i, j = 0;
        for (i = 0; i < args.length; i += 1) {
            if (args[i] === null) {
                args[i] = arguments[j];
                j += 1;
            }
        }
        
        return func.apply(pthis, args);
    };
    
}


*/

Function.prototype.partial = function (ctx) {
    'use strict';
    var func = this, args, i, argnames;
    /*jslint regexp: true */
    argnames = func.toString().replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg, '').match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1].split(/,/);
    /*jslint regexp: false */
    /*jslint plusplus:true */
    for (i = 0; i < argnames.lenth; (++i)) {
        args[argnames[i]] = ctx[argnames[i]] || null;
    }
    /*jslint plusplus:false */

    return partial(func, args);
    return function () {
          var i, j = 0;
        for (i = 0; i < args.length; i += 1) {
            if (args[i] === null) {
                args[i] = arguments[j];
                j += 1;
            }
        }
        return func.apply(this, args);
    };
};
*/
function partial(func) {
    /*jshint */
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
        return func.apply(pthis, args);
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
    /*jslint plusplus:true */
    for (i = 0; i < argnames.lenth; (++i)) {
        args[argnames[i]] = ctx[argnames[i]] || null;
    }
    /*jslint plusplus:false */
    //alert(args);
    if (args.length === 0) {
        i = 0;
        for (elem in ctx) {
      //      alert("working");
//            alert(elem);
            args[i] = ctx[elem];
            i += 1;
          //  alert(args[1]);
        }
    }
 //   alert(args);
    return partial.apply(null, Array.prototype.concat(func, args));
};



//var test1 = partial(Math.pow, null, 10);
var test2 = Math.pow.partial({ a: 2, b: null});
//alert(test1(2));
alert(test2(10));
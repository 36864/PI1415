/*global $mu, partial*/

function namedParamPower(a, b) {
    'use strict';
    return Math.pow(a, b);
}

function minOf3(a, b, c) {
    'use strict';
    return Math.min(a, b, c);
}

function greaterThan(a, b) {
    'use strict';
    return a > b;
}

$mu.test('Partial Test', function () {
    'use_strict';
    var t2npfn, t2npsn, tfpnp, t2upfn, t2upsn, tfpup, t3np1n, t3np2n, t3npan, t2npo;
    
    t2npfn = partial(namedParamPower, null, 10);
    $mu.assert(t2npfn(2) === Math.pow(2, 10), 'Test two named parameters, first null');
    t2npsn = partial(namedParamPower, 2, null);
    $mu.assert(t2npsn(10) === Math.pow(2, 10), 'Test two named parameters, second null');
    tfpnp = namedParamPower.partial({ a: 2, b : null});
    $mu.assert(tfpnp(10) === Math.pow(2, 10), 'Test function prototype, named parameters');
    t2upfn = partial(Math.pow, null, 10);
    $mu.assert(t2upfn(2) === Math.pow(2, 10), 'Test two unnamed parameters, first null');
    t2upsn = partial(Math.pow, 2, null);
    $mu.assert(t2upsn(10) === Math.pow(2, 10), 'Test two unnamed parameters, second null');
    tfpup = namedParamPower.partial({ a: 2, b : null});
    $mu.assert(tfpup(10) === Math.pow(2, 10), 'Test function prototype, unnamed parameters');
    t3np1n = minOf3.partial({ a : 3, b: 5});
    $mu.assert(t3np1n(1) === 1, 'Test 3 named parameters, 1 null');
    t3np2n = minOf3.partial({ a : 3});
    $mu.assert(t3np2n(5, 2) === 2, 'Test 3 named parameters, 2 null');
    t3npan = minOf3.partial();
    $mu.assert(t3npan(5, 3, 19) === 3, 'Test 3 named parameters, all null');
    t2npo = greaterThan.partial({ b: 10 });
    $mu.assert(t2npo(20), 'Test 2 named parameters, ordered');
});
         
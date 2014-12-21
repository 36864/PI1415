function not(f) {
    'use strict';
	return function () {
		var args = Array.prototype.slice.call(arguments, 0);
		return !f.apply(null, args);
	};
}

Function.prototype.not = function () {
    'use strict';
    var notF = this;
	return function () {
		var args = Array.prototype.slice.call(arguments, 0);
		return !notF.apply(null, args);
	};
};

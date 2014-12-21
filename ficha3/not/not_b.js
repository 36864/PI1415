Function.prototype.not = function ()
	{ 
		var notF = this;
		return function (){
			var args = Array.prototype.slice.call(arguments, 0);
			return !notF.apply(null, args);
		}
	};

function isEven(v)
{
	return v%2 == 0;
}

function isOdd(v)
{
	return v%2 == 1;
}

function isMzeroMnine(v1, v2)
{
	return v1>0 && v2<9;
}

var isNEven = isEven.not();
var isNOdd = isOdd.not();
var isMoreZMinorN = isMzeroMnine.not();
/*
console.log(isNEven(4));		//false
console.log(isNEven(5));		//true

console.log(isNOdd(4));			//true
console.log(isNOdd(5));			//false

$mu.test('Function Not - B', function (){
							$mu.assert(isNEven(4) == false, "isNEven(4)");
							$mu.assert(isNEven(5) == true, "isNEven(5)");
							$mu.assert(isNOdd(4) == true, "isNOdd(4)");
							$mu.assert(isNOdd(5) == false, "isNOdd(5)");
							$mu.assert(isMoreZMinorN(1, 8) == false, "isMoreZMinorN(1, 8)");
							$mu.assert(isMoreZMinorN(0, 8) == true, "isMoreZMinorN(0, 8)");
							});*/
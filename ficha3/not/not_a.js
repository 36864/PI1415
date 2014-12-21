function not(f)
{
	return function (){
		var args = Array.prototype.slice.call(arguments, 0);
		return !f.apply(null, args);
	};
}

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

var isEvenNOdd = not(isOdd);
var isNOdd = not(isEven);
var isMoreZMinorN = not(isMzeroMnine);

/*console.log(isOdd(4));		//false
console.log(isEvenNOdd(4));	//true

console.log(isEven(4));		//true
console.log(isNOdd(4));		//false*/

$mu.test('Function Not - A', function (){
							$mu.assert(isEvenNOdd(4) == true, "isEvenNOdd(4)");
							$mu.assert(isEvenNOdd(5) == false, "isEvenNOdd(5)");
							$mu.assert(isNOdd(4) == false, "isNOdd(4)");
							$mu.assert(isNOdd(5) == true, "isNOdd(5)");
							$mu.assert(isMoreZMinorN(5, 4) == false, "isMoreZMinorN(5, 4)");
							$mu.assert(isMoreZMinorN(5, 9) == true, "isMoreZMinorN(5, 9)");
							});
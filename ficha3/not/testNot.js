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

var isNEven = isEven.not();
var NOdd = isOdd.not();
var isMoreZMinor = isMzeroMnine.not();
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

$mu.test('Function Not - B', function (){
							$mu.assert(isNEven(4) == false, "isNEven(4)");
							$mu.assert(isNEven(5) == true, "isNEven(5)");
							$mu.assert(NOdd(4) == true, "isNOdd(4)");
							$mu.assert(NOdd(5) == false, "isNOdd(5)");
							$mu.assert(isMoreZMinor(1, 8) == false, "isMoreZMinorN(1, 8)");
							$mu.assert(isMoreZMinor(0, 8) == true, "isMoreZMinorN(0, 8)");
							});
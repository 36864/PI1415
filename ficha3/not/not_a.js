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

function isShit(v1, v2)
{
	return v1>1 && v2<9;
}

var isEvenNOdd = not(isOdd);
var isNOdd = not(isEven);

console.log(isOdd(4));		//false
console.log(isEvenNOdd(4));	//true

console.log(isEven(4));		//true
console.log(isNOdd(4));		//false

console.log(isShit(4, 8));	//false
var isNShit = not(isShit);
console.log(isNShit(4, 8));	//true

$mu.test('Function Not - A', function (){
							$mu.assert(isEvenNOdd(4) == true, "isEvenNOdd(4)");
							$mu.assert(isEvenNOdd(5) == false, "isEvenNOdd(5)");
							$mu.assert(isNOdd(4) == false, "isNOdd(4)");
							$mu.assert(isNOdd(5) == true, "isNOdd(5)");

							});
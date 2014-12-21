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

function isShit(v1, v2)
{
	return v1>1 && v2<9;
}

//var isEvenNOdd = isOdd.not();
//isEven(0, 3);

var isNEven = isEven.not();
console.log(isNEven(4));		//false
console.log(isNEven(5));		//true

var isNOdd = isOdd.not();
console.log(isNOdd(4));			//true
console.log(isNOdd(5));			//false

$mu.test('Function Not - B', function (){
							$mu.assert(isNEven(4) == false, "isNEven(4)");
							$mu.assert(isNEven(5) == true, "isNEven(5)");
							$mu.assert(isNOdd(4) == true, "isNOdd(4)");
							$mu.assert(isNOdd(5) == false, "isNOdd(5)");

							});
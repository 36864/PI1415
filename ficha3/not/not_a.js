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
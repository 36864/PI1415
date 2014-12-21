
$mu.test('Function classGrades', function (){
	var testing =(
	[{"num": 11, "class": "C1", "grade": 12},
	{"num": 222, "class": "C1", "grade": 14},
	{"num": 333, "class": "C2", "grade": 11},
	{"num": 444, "class": "C1", "grade": 12},
	{"num": 444, "class": "C2", "grade": 15}])
	
	var testClassC1 = classGrades(testing).C1.class
	$mu.assert(testClassC1 === "C1", "testClassC1");
	var testClassC2 = classGrades(testing).C2.class
	$mu.assert(testClassC2 === "C2", "testClassC2");
	var testMaxC1 = classGrades(testing).C1.max
	$mu.assert(testMaxC1 === 14, "testMaxC1");
	var testMaxC2 = classGrades(testing).C2.max
	$mu.assert(testMaxC2 === 15, "testMaxC2");
	var testAvgC1 = classGrades(testing).C1.average
	$mu.assert(testAvgC1 === 12, "testAvgC1");
	var testAvgC2 = classGrades(testing).C2.average
	$mu.assert(testAvgC2 === 13, "testAvgC2");
});
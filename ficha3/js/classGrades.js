function classGrades(alunos){
	var alunosSorted = alunos.sort(function(alunoA, alunoB){
		return alunoA.class > alunoB.class
	})
	var classe = alunosSorted[0].class
	var max = 0, average = 0, count = 0
	var ret_obj = {}
	var aluno_classe = new classStats(classe, average, max)
	
	for(var i = 0; i < alunosSorted.length; i++){
		if(classe !== alunosSorted[i].class){
			average /= count
			aluno_classe.average = average
			aluno_classe.max = max
			ret_obj[classe] = aluno_classe
			classe = alunosSorted[i].class
			max = 0, average = 0, count = 0
			aluno_classe = new classStats(classe, average, max)
		}
		count++
		if(max < alunosSorted[i].grade)
			max = alunosSorted[i].grade
		average += alunosSorted[i].grade
	}
	average /= count
	aluno_classe.average = average
	aluno_classe.max = max
	ret_obj[classe] = aluno_classe

return ret_obj
}

function classStats(classe, average, max){
	this.class = classe
	this.average = average
	this.max = max
}
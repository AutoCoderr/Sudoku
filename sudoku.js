"use strict";

let limitTree;

let displaySudoku;

let nbEmbronchements = {};

const displayDebug = false;

let oneFound;

let nbBranch = null;

let branchs = null;

let currentBranch = null;

let profondeurBranch = 0;

let sudoku;

let startTimeSudoKu;


function resolvSudoku(unSudoku,unLimitTree,displaySudokuCallBack){
	nbEmbronchements = {};
	startTimeSudoKu = new Date().getTime();
	if (unSudoku.length != 9) {
		alert("Format du tableau incorrect");
		return;
	}
	for (let l=0;l<unSudoku.length;l++) {
		if (unSudoku[l].length != 9) {
			alert("Format du tableau incorrect");
			return;
		}
	}

	sudoku = copySudoku(unSudoku);

	displaySudoku = displaySudokuCallBack;

	console.clear();

	limitTree = unLimitTree;

	//console.log("limitTree => "+limitTree);

	let resolved = false;;

	let j = 0;

	while(!resolved) {
		oneFound = false;
		console.log("boucle "+(j+1));
		for (let l=0;l<sudoku.length;l++) { // recupere possibilités pour cette cellule + methode par inclusion
			for (let c=0;c<sudoku[l].length;c++) {
				if (typeof(sudoku[l][c]) != "number" | sudoku[l][c] == 0) {
					genPossible(l,c);
				}
			}
		}
		//debug(j+" ==> ");
		//debug(sudoku);
		//debug("");
		for (let l=0;l<sudoku.length;l++) {
			for (let c=0;c<sudoku[l].length;c++) {
				if (typeof(sudoku[l][c]) != "number") {
					for (let i=0;i<sudoku[l][c].length;i++) {
						debug("["+(l+1)+","+(c+1)+","+i+"]"+sudoku[l][c][i]);
						if (!isUsed(l,c,i)) {
							if (exclusionBloc(l,c,i) === true | exclusionLine(l,c,i) === true | exclusionColonne(l,c,i) === true) { // methode par exclution
								oneFound = true;
								console.log("found by exclusion ["+(l+1)+","+(c+1)+"] => "+sudoku[l][c][i]);
								sudoku[l][c] = sudoku[l][c][i];
								break;
							}
						} else {
							sudoku[l][c].splice(i,1);
							if (sudoku[l][c].length == 1) { // methode par inclusion s'il n'y a qu'une possibilité
								if (!isUsed(l,c,0)) {
									oneFound = true;
									sudoku[l][c] = sudoku[l][c][0];
									console.log("found by inclusion ["+(l+1)+","+(c+1)+"] => "+sudoku[l][c]);
									break;
								} else {
									sudoku[l][c].splice(0,1);
								}
							}
						}
					}
				}
			}
		}
		for (let l=0;l<sudoku.length;l++) {
			for (let c=0;c<sudoku[l].length;c++) {
				if (typeof(sudoku[l][c]) != "number") {
					for (let i=0;i<sudoku[l][c].length;i++) {
						debug("["+(l+1)+","+(c+1)+","+i+"]"+sudoku[l][c][i]);
						if (isUsed(l,c,i)) {
							sudoku[l][c].splice(i,1);
							if (sudoku[l][c].length == 1) { // methode par inclusion s'il n'y a qu'une possibilité
								if (!isUsed(l,c,0)) {
									oneFound = true;
									sudoku[l][c] = sudoku[l][c][0];
									console.log("found by inclusion ["+(l+1)+","+(c+1)+"] => "+sudoku[l][c]);
									break;
								} else {
									sudoku[l][c].splice(0,1);
								}
							}
						}
					}
					if (typeof(sudoku[l][c]) != "number" & sudoku[l][c].length > 1) {
						let exclu = paireTripletExclusifBloc(l,c,sudoku[l][c].length);
						if (exclu == false) {
							exclu = paireTripletExclusifLine(l,c,sudoku[l][c].length);
						}
						if (exclu == false) {
							exclu = paireTripletExclusifColonnne(l,c,sudoku[l][c].length);
						}
						if (exclu != false) {
							sudoku[l][c] = exclu;
						} else if (sudoku[l][c].length > 2) {
							exclu = paireTripletExclusifBloc(l,c,sudoku[l][c].length-1);
							if (exclu == false) {
								exclu = paireTripletExclusifLine(l,c,sudoku[l][c].length-1);
							}
							if (exclu == false) {
								exclu = paireTripletExclusifColonnne(l,c,sudoku[l][c].length-1);
							}
							if (exclu != false) {
								sudoku[l][c] = exclu;
							}	
						}
					}
				}
			}
		}

		resolved = true;
		for (let l=0;l<sudoku.length;l++) {
			for (let c=0;c<sudoku[l].length;c++) {
				if (typeof(sudoku[l][c]) != "number") {
					resolved = false;
				}
			}
		}

		if (oneFound == false & resolved == false) {
			if (branchs == null) {
				if (profondeurBranch < limitTree | limitTree == "infinity") {
					branchs = new Object();
					currentBranch = branchs;
					newBranch(currentBranch);
					profondeurBranch += 1;
					if (typeof(nbEmbronchements[profondeurBranch]) == "undefined") {
						nbEmbronchements[profondeurBranch] = 0;
					}
					nbEmbronchements[profondeurBranch] += 1;
				} else {
					displaySudoku(sudoku,"THIS SUDOKU CANNOT BE RESOLVED");
					return;
				}
			} else {
				if (currentBranch.nbEssai == currentBranch.essais.length) {
					if (typeof(currentBranch.parent) == "undefined") {
						nbBranch = null;
						branchs = null;
    					currentBranch = null;
    					profondeurBranch = 0;
						displaySudoku(sudoku,"THIS SUDOKU CANNOT BE RESOLVED");
						return;
					} else {
						currentBranch = currentBranch.parent;
						profondeurBranch -= 1;
						delete currentBranch.essais[currentBranch.nbEssai-1].branch;
						if (!verifTerminedTree()) {
							return;
						}
					}
				} else {
					console.log("profondeurBranch => "+profondeurBranch+" ; limitTree => "+limitTree+" ; thereAreEmpty => "+thereAreEmpty());
					if (typeof(currentBranch.essais[currentBranch.nbEssai-1].branch) == "undefined" & (profondeurBranch < limitTree | limitTree == "infinity") & !thereAreEmpty()) {
						const nb = currentBranch.nbEssai;
						currentBranch.essais[nb-1].branch = new Object();
						currentBranch.essais[nb-1].branch.parent = currentBranch;
						currentBranch = currentBranch.essais[nb-1].branch;
						newBranch(currentBranch);
						profondeurBranch += 1;
						if (typeof(nbEmbronchements[profondeurBranch]) == "undefined") {
							nbEmbronchements[profondeurBranch] = 0;
						}
						nbEmbronchements[profondeurBranch] += 1;
					} else {
						const nb = currentBranch.nbEssai;
						sudoku = copySudoku(currentBranch.grille);
						if (currentBranch.essais[nb].case == "A") {
							sudoku[currentBranch.LA][currentBranch.CA] = currentBranch.essais[nb].val;
						} else if (currentBranch.essais[nb].case == "B") {
							sudoku[currentBranch.LB][currentBranch.CB] = currentBranch.essais[nb].val;
						} else if (currentBranch.essais[nb].case == "AB") {
							sudoku[currentBranch.LA][currentBranch.CA] = currentBranch.essais[nb].A;
							sudoku[currentBranch.LB][currentBranch.CB] = currentBranch.essais[nb].B;
						}
						console.log("currentBranch.nbEssai [level "+profondeurBranch+"] => "+currentBranch.nbEssai);
						console.log("sudoku["+currentBranch.LA+"]["+currentBranch.CA+"] => "+sudoku[currentBranch.LA][currentBranch.CA]);
						console.log("sudoku["+currentBranch.LB+"]["+currentBranch.CB+"] => "+sudoku[currentBranch.LB][currentBranch.CB]);
						currentBranch.nbEssai += 1;
					}
				}
			}
			/*debug("nbEssai => "+branchs.nbEssai);
			debug("sudoku["+minA.L+"]["+minA.C+"] => "+sudoku[minA.L][minA.C]);
			debug("sudoku["+minB.L+"]["+minB.C+"] => "+sudoku[minB.L][minB.C]);*/
		}
		//debug(sudoku);
		j += 1;
	}

	//debug("FINISH => ");
	//debug(sudoku);

    nbBranch = null;

    branchs = null;

    currentBranch = null;

    profondeurBranch = 0;

    //console.log("verif() => "+verif());
	
	displaySudoku(sudoku,(verif() == true ? "CORRECT (trouvé en "+j+" boucles(s)) en "+(new Date().getTime()-startTimeSudoKu)+" ms" : "FAUX"));
}

function verifTerminedTree() {
	if (currentBranch.nbEssai == currentBranch.essais.length) {
		if (typeof(currentBranch.parent) == "undefined") {
			nbBranch = null;
			branchs = null;
    		currentBranch = null;
    		profondeurBranch = 0;
			displaySudoku(sudoku,"THIS SUDOKU CANNOT BE RESOLVED");
			return false;
		} else {
			currentBranch = currentBranch.parent;
			profondeurBranch -= 1;
			const nb = currentBranch.nbEssai;
			delete currentBranch.essais[nb-1].branch;
			verifTerminedTree();
		}
	} else {
		const nb = currentBranch.nbEssai;
		sudoku = copySudoku(currentBranch.grille);
		if (currentBranch.essais[nb].case == "A") {
			sudoku[currentBranch.LA][currentBranch.CA] = currentBranch.essais[nb].val;
		} else if (currentBranch.essais[nb].case == "B") {
			sudoku[currentBranch.LB][currentBranch.CB] = currentBranch.essais[nb].val;
		} else if (currentBranch.essais[nb].case == "AB") {
			sudoku[currentBranch.LA][currentBranch.CA] = currentBranch.essais[nb].A;
			sudoku[currentBranch.LB][currentBranch.CB] = currentBranch.essais[nb].B;
		}
		console.log("currentBranch.nbEssai [level "+profondeurBranch+"] => "+currentBranch.nbEssai);
		console.log("sudoku["+currentBranch.LA+"]["+currentBranch.CA+"] => "+sudoku[currentBranch.LA][currentBranch.CA]);
		console.log("sudoku["+currentBranch.LB+"]["+currentBranch.CB+"] => "+sudoku[currentBranch.LB][currentBranch.CB]);
		currentBranch.nbEssai += 1;
		return true;
	}
}


function genPossible(l,c) {
	let possibles = [1,2,3,4,5,6,7,8,9];
	for (let i=0;i<sudoku[l].length;i++) {
		removeFromList(possibles,sudoku[l][i]);
	}
	for (let i=0;i<sudoku.length;i++) {
		removeFromList(possibles,sudoku[i][c]);
	}
	parcourBloc(getBloc(l,c),(l,c,possibles) => {
		removeFromList(possibles,sudoku[l][c]);
	}, possibles);

	if (possibles.length == 1) { // methode par inclusion s'il n'y a qu'une possibilité
		oneFound = true;
		console.log("found by inclusion ["+(l+1)+","+(c+1)+"] => "+possibles[0]);
		possibles = possibles[0];
	}

	sudoku[l][c] = possibles;
}

function exclusionBloc(l,c,i) {
	let rep = true;
	parcourBloc(getBloc(l,c), (lb,cb) => {
		if ((l != lb | c != cb) & typeof(sudoku[lb][cb]) != "number") {
			for (let j=0;j<sudoku[lb][cb].length;j++) {
				if (sudoku[lb][cb][j] == sudoku[l][c][i]) {
					rep = false;
					break;
				}
			}
		}
	});
	return rep;
}

function exclusionLine(l,c,i) {
	for (let j=0;j<sudoku[l].length;j++) {
		if (j != c & typeof(sudoku[l][j]) != "number") {
			for (let k=0;k<sudoku[l][j].length;k++) {
				if (sudoku[l][j][k] == sudoku[l][c][i]) {
					return false;
				}
			}
		}
	}
	return true;
}

function exclusionColonne(l,c,i) {
	for (let j=0;j<sudoku.length;j++) {
		if (j != l & typeof(sudoku[j][c]) != "number") {
			for (let k=0;k<sudoku[j][c].length;k++) {
				if (sudoku[j][c][k] == sudoku[l][c][i]) {
					return false;
				}
			}
		}
	}
	return true;
}

function paireTripletExclusifBloc(l,c,nbi) {
	let cells = [];
	parcourBloc(getBloc(l,c),(lb,cb) => {
		if ((lb != l | cb != c) & typeof(sudoku[lb][cb]) != "number" & sudoku[lb][cb].length == nbi) {
			cells.push(sudoku[lb][cb]);
		}
	});
	return paireTripletExclusif(l,c,cells,nbi);
}

function paireTripletExclusifLine(l,c,nbi) {
	let cells = [];
	for(let i=0;i<sudoku[l].length;i++) {
		if (i != c & typeof(sudoku[l][i]) != "number" & sudoku[l][i].length == nbi) {
			cells.push(sudoku[l][i])
		}
	}
	return paireTripletExclusif(l,c,cells,nbi);
}

function paireTripletExclusifColonnne(l,c,nbi) {
	let cells = [];
	for(let i=0;i<sudoku.length;i++) {
		if (i != l & typeof(sudoku[i][c]) != "number" & sudoku[i][c].length == nbi) {
			cells.push(sudoku[i][c])
		}
	}
	return paireTripletExclusif(l,c,cells,nbi);
}

function paireTripletExclusif(l,c,cells,nbi) {
	//debug("cells length => "+cells.length);
	//debug("nbi => "+nbi);
	let cellsEquals = [];
	for (let i=0;i<cells.length;i++) {
		cellsEquals = [];
		for (let j=0;j<cells.length;j++) {
			if (i!=j) {
				if (equalsCell(cells[i],cells[j]) === true & nbEquals(cells[i],sudoku[l][c]) == sudoku[l][c].length-1) {
					//debug("if 1");
					//debug("begin cellsEquals.length = "+cellsEquals.length);
					if (cellsEquals.length == 0) {
						cellsEquals.push(cells[i]);
					}
					cellsEquals.push(cells[j]);
					//debug("after cellsEquals.length = "+cellsEquals.length);
					if (cellsEquals.length == nbi) {
						//debug("if 2");
						i = cells.length;
						break;
					}
				}
			}
		}
	}
	//debug("Finish for 1");
	//debug("cellsEquals.length = "+cellsEquals.length+" ; nbi = "+nbi);
	if (cellsEquals.length == nbi) {
		cellsEquals = cellsEquals[0];
		for (let i=0;i<sudoku[l][c].length;i++) {
			let present = false;
			for (let j=0;j<cellsEquals.length;j++) {
				if (sudoku[l][c][i] == cellsEquals[j]) {
					present = true;
					break;
				}
			}
			if (!present) {
				console.log("found by paireTripletExclusif ["+(l+1)+","+(c+1)+"] => "+sudoku[l][c][i]);
				return sudoku[l][c][i];
			}
		}
	}
	return false;
}

function nbEquals(A,B) {
	let nbEquals = 0;
	for (let i=0;i<A.length;i++) {
		for (let j=0;j<B.length;j++) {
			if (A[i] == B[j]) {
				nbEquals += 1;
			}
		}
	}
	//debug("nbEquals => "+nbEquals);
	//debug(A);
	//debug(B);
	return nbEquals;
} 

function equalsCell(A,B) {
	for (let i=0;i<A.length;i++) {
		let present = false;
		for (let j=0;j<B.length;j++) {
			if (A[i] == B[j]) {
				present = true;
				break;
			}
		}
		if (present == false) {
			return false;
		}
	}
	//debug("equals => ");
	//debug(A);
	//debug(B);
	return true;
}

function newBranch(currentBranch) {
	currentBranch.grille = copySudoku(sudoku);
	currentBranch.LA = null;
	currentBranch.CA = null;
	for (let l=0;l<sudoku.length;l++) {
		for (let c=0;c<sudoku[l].length;c++) {
			if (typeof(sudoku[l][c]) != "number") {
				if (currentBranch.LA == null) {
					currentBranch.LA = l;
					currentBranch.CA = c;
				} else if (sudoku[l][c].length < sudoku[currentBranch.LA][currentBranch.CA].length) {
					currentBranch.LA = l;
					currentBranch.CA = c;
				}
			}
		}
	}
	currentBranch.LB = null;
	currentBranch.CB = null;
	for (let l=0;l<sudoku.length;l++) {
		for (let c=0;c<sudoku[l].length;c++) {
			if (typeof(sudoku[l][c]) != "number" & (l != currentBranch.LA | c != currentBranch.CA)) {
				if (currentBranch.LB == null) {
					currentBranch.LB = l;
					currentBranch.CB = c;
				} else if (sudoku[l][c].length < sudoku[currentBranch.LB][currentBranch.CB].length) {
					currentBranch.LB = l;
					currentBranch.CB = c;
				}
			}
		}
	}
	currentBranch.essais = [];
	for (let i=0;i<sudoku[currentBranch.LA][currentBranch.CA].length;i++) {
		currentBranch.essais.push({case: "A", val:sudoku[currentBranch.LA][currentBranch.CA][i],});
	}
	console.log("LB => "+currentBranch.LB+" ; CB => "+currentBranch.CB);
	for (let i=0;i<sudoku[currentBranch.LB][currentBranch.CB].length;i++) {
		currentBranch.essais.push({case: "B", val:sudoku[currentBranch.LB][currentBranch.CB][i]});
	}
	for (let i=0;i<sudoku[currentBranch.LA][currentBranch.CA].length;i++) {
		for (let j=0;j<sudoku[currentBranch.LB][currentBranch.CB].length;j++) {
			currentBranch.essais.push({case: "AB", A: sudoku[currentBranch.LA][currentBranch.CA][i], B: sudoku[currentBranch.LB][currentBranch.CB][j]});
		}
	}

	console.log("new tree [level "+(profondeurBranch+1)+"]");
	console.log("sudoku["+currentBranch.LA+"]["+currentBranch.CA+"] => "+sudoku[currentBranch.LA][currentBranch.CA]);
	console.log("sudoku["+currentBranch.LB+"]["+currentBranch.CB+"] => "+sudoku[currentBranch.LB][currentBranch.CB]);

	currentBranch.nbEssai = 0;

	console.log("currentBranch.nbEssai => "+currentBranch.nbEssai);
	if (currentBranch.essais[0].case == "A") {
		sudoku[currentBranch.LA][currentBranch.CA] = currentBranch.essais[0].val;
	} else if (currentBranch.essais[0].case == "B") {
		sudoku[currentBranch.LB][currentBranch.CB] = currentBranch.essais[0].val;
	} else if (currentBranch.essais[0].case == "AB") {
		sudoku[currentBranch.LA][currentBranch.CA] = currentBranch.essais[0].A;
		sudoku[currentBranch.LB][currentBranch.CB] = currentBranch.essais[0].B;
	}
	console.log("sudoku["+currentBranch.LA+"]["+currentBranch.CA+"] => "+sudoku[currentBranch.LA][currentBranch.CA]);
	console.log("sudoku["+currentBranch.LB+"]["+currentBranch.CB+"] => "+sudoku[currentBranch.LB][currentBranch.CB]);
	currentBranch.nbEssai += 1;
}

function isUsed(l,c,i) {
	debug("["+(l+1)+","+(c+1)+","+i+"]"+sudoku[l][c][i]);
	let used = false;
	debug("before bloc");
	parcourBloc(getBloc(l,c),(lb,cb) => {
		if ((lb != l | cb != c) & typeof(sudoku[lb][cb]) == "number") {
			if (sudoku[lb][cb] == sudoku[l][c][i]) {
				used = true;
			}
		}
	});
	debug("after bloc");
	if (used) { return true; }
	debug("before line");
	debug("line "+(l+1));
	for(let j=0;j<sudoku[l].length;j++) {
		if (j != c & typeof(sudoku[l][j]) == "number") {
			if (l == 2) {
				debug("("+(l+1)+","+(j+1)+")"+sudoku[l][j]+" vs ("+(l+1)+","+(c+1)+","+(i)+")"+sudoku[l][c][i]);
			}
			if (sudoku[l][c][i] == sudoku[l][j]) {
				debug("if 1");
				return true;
			}
		}
	}
	debug("after line");
	for(let j=0;j<sudoku.length;j++) {
		if (j != l & typeof(sudoku[j][c]) == "number") {
			if (sudoku[l][c][i] == sudoku[j][c]) {
				return true;
			}
		}
	}
	return false;
}

function parcourBloc(bloc,callback,option) {
	let ld;
	let lf;
	let cd;
	let cf;

	switch(bloc) {
		case "1":
			ld = 0;
			lf = 2;
			cd = 0;
			cf = 2;
			break;
		case "2":
			ld = 0;
			lf = 2;
			cd = 3;
			cf = 5;
			break;
		case "3":
			ld = 0;
			lf = 2;
			cd = 6;
			cf = 8;
			break;
		case "4":
			ld = 3;
			lf = 5;
			cd = 0;
			cf = 2;
			break;
		case "5":
			ld = 3;
			lf = 5;
			cd = 3;
			cf = 5;
			break;
		case "6":
			ld = 3;
			lf = 5;
			cd = 6;
			cf = 8;
			break;
		case "7":
			ld = 6;
			lf = 8;
			cd = 0;
			cf = 2;
			break;
		case "8":
			ld = 6;
			lf = 8;
			cd = 3;
			cf = 5;
			break;
		case "9":
			ld = 6;
			lf = 8;
			cd = 6;
			cf = 8;
			break;
	}
	for (let l=ld;l<=lf;l++) {
		for (let c=cd;c<=cf;c++) {
			callback(l,c,option);
		}
	}
}

function removeFromList(list, val) {
	for (let i=0;i<list.length;i++) {
		if (list[i] == val) {
			list.splice(i,1);
			break;
		}
	}
}

function getBloc(l,c) {
	if ((0 <= l & l <= 2) & (0 <= c & c <= 2)) {
		return "1";
	} else if ((0 <= l & l <= 2) & (3 <= c & c <= 5)) {
		return "2";
	} else if ((0 <= l & l <= 2) & (6 <= c & c <= 8)) {
		return "3";
	} else if ((3 <= l & l <= 5) & (0 <= c & c <= 2)) {
		return "4";
	} else if ((3 <= l & l <= 5) & (3 <= c & c <= 5)) {
		return "5";
	} else if ((3 <= l & l <= 5) & (6 <= c & c <= 8)) {
		return "6";
	} else if ((6 <= l & l <= 8) & (0 <= c & c <= 2)) {
		return "7";
	} else if ((6 <= l & l <= 8) & (3 <= c & c <= 5)) {
		return "8";
	} else if ((6 <= l & l <= 8) & (6 <= c & c <= 8)) {
		return "9";
	}
}

function verif() {
	for (let l=0;l<sudoku.length;l++) {
		for (let c=0;c<sudoku[l].length;c++) {
			let ok = true;
			parcourBloc(getBloc(l,c),(lb,cb) => {
				if ((lb != l | cb != c)) {
					if (sudoku[lb][cb] == sudoku[l][c]) {
						ok = false;
						console.log("FAUX =>  ["+(lb+1)+","+(cb+1)+"] == ["+(l+1)+","+(c+1)+"]");
					}
				}
			});
			if (ok == false) { 
				return false; 
			}
			for(let j=0;j<sudoku[l].length;j++) {
				if (j != c) {
					if (sudoku[l][c] == sudoku[l][j]) {
						console.log("FAUX =>  ["+(l+1)+","+(j+1)+"] == ["+(l+1)+","+(c+1)+"]");
						return false;
					}
				}
			}
			for(let j=0;j<sudoku.length;j++) {
				if (j != l) {
					if (sudoku[l][c] == sudoku[j][c]) {
						console.log("FAUX =>  ["+(j+1)+","+(c+1)+"] == ["+(l+1)+","+(c+1)+"]");
						return false;
					}
				}
			}
		}
	}
	return true;
}

function thereAreEmpty() {
	for (let l=0;l<sudoku.length;l++) {
		for (let c=0;c<sudoku[l].length;c++) {
			if (typeof(sudoku[l][c]) != "number" & sudoku[l][c].length == 0) {
				return true;
			}
		}
	}
	return false;
}

function copySudoku(sudokuA) {
	let sudokuB = [];
	for (let l=0;l<sudokuA.length;l++) {
		sudokuB.push([]);
		for (let c=0;c<sudokuA[l].length;c++) {
			if (typeof(sudokuA[l][c]) == "number") {
				sudokuB[l].push(sudokuA[l][c]);
			} else {
				sudokuB[l].push([]);
				for (let i=0;i<sudokuA[l][c].length;i++) {
					sudokuB[l][c].push(sudokuA[l][c][i]);
				}
			}
		}
	}
	return sudokuB;
}

function debug(msg) {
	if (displayDebug) {
		console.log(msg);
	}
}
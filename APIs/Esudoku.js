function getSolution(limitTree) {

	let sudoku = [[0,0,0,  0,0,0,  0,0,0],
				  [0,0,0,  0,0,0,  0,0,0],
				  [0,0,0,  0,0,0,  0,0,0],

				  [0,0,0,  0,0,0,  0,0,0],
				  [0,0,0,  0,0,0,  0,0,0],
				  [0,0,0,  0,0,0,  0,0,0],

				  [0,0,0,  0,0,0,  0,0,0],
				  [0,0,0,  0,0,0,  0,0,0],
				  [0,0,0,  0,0,0,  0,0,0]];


	const lines = $(".tours").find("tr");

	for (let l=1;l<=lines.length;l++) {
			if (l%10 != 0) {
				let cells = $(lines[l]).find("td");
				for (let c=0;c<cells.length;c++) {
					let nbL;
					let nbC;
					if (1 <= l & l <= 9) {
						nbL = (l%3)-1;
						if (nbL == -1) { nbL = 2; }
					} else if (11 <= l & l <= 19) {
						nbL = ((l-10)%3)-1;
						if (nbL == -1) { nbL = 2; }
						nbL += 3;
					} else if (21 <= l & l <= 29) {
						nbL = ((l-20)%3)-1;
						if (nbL == -1) { nbL = 2; }
						nbL += 6;
					}
					if ((1 <= l & l <= 3) | (11 <= l & l <= 13) | (21 <= l & l <= 23)) {
						nbC = c;
					} else if ((4 <= l & l <= 6) | (14 <= l & l <= 16) | (24 <= l & l <= 26)) {
						nbC = c+3;
					} else if ((7 <= l & l <= 9) | (17 <= l & l <= 19) | (27 <= l & l <= 29)) {
						nbC = c+6;
					}
					let val = $(cells[c]).find("input")[0].value;
					if (val == "") {
						val = 0;
					} else {
						val = parseInt(val);
					}
					console.log("nbL => "+nbL+" ; nbC => "+nbC);
					console.log("l => "+l+" ; c => "+c);
					sudoku[nbL][nbC] = val;
				}
			}
	}
	

	console.log(sudoku);

	resolvSudoku(sudoku,limitTree, (sudoku,msg) => {

		alert(msg);
		if (msg != "THIS SUDOKU CANNOT BE RESOLVED") {
			const lines = $(".tours").find("tr");

			for (let l=1;l<=lines.length;l++) {
				let cells = $(lines[l]).find("td");
				for (let c=0;c<cells.length;c++) {
					let nbL;
					let nbC;
					if (l%10 != 0) {
						if (1 <= l & l <= 9) {
							nbL = (l%3)-1;
							if (nbL == -1) { nbL = 2; }
						} else if (11 <= l & l <= 19) {
							nbL = ((l-10)%3)-1;
							if (nbL == -1) { nbL = 2; }
							nbL += 3;
						} else if (21 <= l & l <= 29) {
							nbL = ((l-20)%3)-1;
							if (nbL == -1) { nbL = 2; }
							nbL += 6;
						}
						if ((1 <= l & l <= 3) | (11 <= l & l <= 13) | (21 <= l & l <= 23)) {
							nbC = c;
						} else if ((4 <= l & l <= 6) | (14 <= l & l <= 16) | (24 <= l & l <= 26)) {
							nbC = c+3;
						} else if ((7 <= l & l <= 9) | (17 <= l & l <= 19) | (27 <= l & l <= 29)) {
							nbC = c+6;
						}
						let val = sudoku[nbL][nbC];
						if (val == 0) {
							val = "";
						} else {
							val = val.toString();
						}
						$(cells[c]).find("input")[0].value = val;
					}
				}
			}
		}
	});

}
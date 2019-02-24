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


	const blocks = $(".Sudoku > .SudokuBlock");

	for (let b=0;b<blocks.length;b++) {
		const lines = $(blocks[b]).find("tr");
		for (let l=0;l<lines.length;l++) {
			const cells = $(lines[l]).find("td");
			for (let c=0;c<cells.length;c++) {
				let val = $(cells[c]).find("input").val();
				if (val == "") {
					val = 0;
				} else {
					val = parseInt(val);
				}
				let nbC;
				let nbL;
				if (b == 0 | b == 3 | b == 6) {
					nbC = c;
				} else if (b == 1| b == 4 | b == 7) {
					nbC = c + 3;
				} else if (b == 2 | b == 5 | b == 8) {
					nbC = c + 6;
				}

				if (0 <= b & b <= 2) {
					nbL = l;
				} else if (3 <= b & b <= 5) {
					nbL = l + 3;
				} else if (6 <= b & b <= 8) {
					nbL = l + 6;
				}
				sudoku[nbL][nbC] = val;
			}
		}
	}
	console.log(sudoku);
	resolvSudoku(sudoku,limitTree, (sudoku,msg) => {

		alert(msg);
		if (msg != "THIS SUDOKU CANNOT BE RESOLVED") {
			const blocks = $(".Sudoku > .SudokuBlock");

			for (let b=0;b<blocks.length;b++) {
				const lines = $(blocks[b]).find("tr");
				for (let l=0;l<lines.length;l++) {
					const cells = $(lines[l]).find("td");
					for (let c=0;c<cells.length;c++) {
						let nbC;
						let nbL;
						if (b == 0 | b == 3 | b == 6) {
							nbC = c;
						} else if (b == 1 | b == 4 | b == 7) {
							nbC = c + 3;
						} else if (b == 2 | b == 5 | b == 8) {
							nbC = c + 6;
						}
						if (0 <= b & b <= 2) {
							nbL = l;
						} else if (3 <= b & b <= 5) {
							nbL = l + 3;
						} else if (6 <= b & b <= 8) {
							nbL = l + 6;
						}
						let val = sudoku[nbL][nbC];
						val = val.toString();
						$(cells[c]).find(".InputValue").val(val);
					}
				}
			}
		}
	});

}
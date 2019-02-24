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


	const lines = $(".sudoku").find("tr");

	for (let l=0;l<lines.length;l++) {
		const cells = $(lines[l]).find("td");
		for (let c=0;c<cells.length;c++) {
			let val = cells[c].innerHTML;
			if (val == "") {
				val = 0;
			} else {
				val = parseInt(val);
			}
			sudoku[l][c] = val;
		}
	}
	

	console.log(sudoku);

	resolvSudoku(sudoku,limitTree, (sudoku,msg) => {

		alert(msg);
		if (msg != "THIS SUDOKU CANNOT BE RESOLVED") {
			const lines = $(".sudoku").find("tr");

			for (let l=0;l<lines.length;l++) {
				const cells = $(lines[l]).find("td");
				for (let c=0;c<cells.length;c++) {
					let val = sudoku[l][c];
					if ((typeof(val) == "number" & val == 0) | (typeof(val) != "number" & val.length == 0)) {
						val = "";
					} else {
						val = val.toString();
					}
					cells[c].innerHTML = val;
				}
			}
		}
	});

}
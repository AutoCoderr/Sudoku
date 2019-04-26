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


	const cells = $(".grille").find("td");

	for (let c=0;c<cells.length;c++) {
		const span = $(cells[c]).find("span")[0];
		if (typeof(span) != "undefined") {
			const nbL = parseInt($(span).attr("id").split("_")[1])-1;
			const nbC = parseInt($(span).attr("id").split("_")[2])-1;
			if (sudoku[nbL][nbC] != parseInt(span.innerHTML)) {
				sudoku[nbL][nbC] = parseInt(span.innerHTML);
			}
		}
	}
	

	console.log(sudoku);

	resolvSudoku(sudoku,limitTree, (sudoku,msg) => {

		alert(msg);
		if (msg != "THIS SUDOKU CANNOT BE RESOLVED") {
			const cells = $(".grille").find("td");

			for (let c=0;c<cells.length;c++) {
				const span = $(cells[c]).find("span")[0];
				if (typeof(span) != "undefined") {
					const nbL = parseInt($(span).attr("id").split("_")[1])-1;
					const nbC = parseInt($(span).attr("id").split("_")[2])-1;
					const val = sudoku[nbL][nbC].toString();
					$(span).css("display","");
					span.innerHTML = val;
					$("#possib_"+$(span).attr("id").split("_")[1]+"_"+$(span).attr("id").split("_")[2]).css("display","none");
				}
			}
		}
	});

}
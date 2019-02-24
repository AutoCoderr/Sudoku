const API = "https://54.38.184.22/Esudoku.js";

let scr = document.createElement("script");
scr.src = "https://code.jquery.com/jquery-1.9.1.min.js";
document.body.appendChild(scr);

let scrSudoku = document.createElement("script");
scrSudoku.src = "https://54.38.184.22/sudoku.js";
document.body.appendChild(scrSudoku);

let scrSudokuAPI = document.createElement("script");
scrSudokuAPI.src = API;
document.body.appendChild(scrSudokuAPI);
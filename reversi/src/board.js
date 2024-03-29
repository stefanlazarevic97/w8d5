// DON'T TOUCH THIS CODE
// if (typeof window === 'undefined'){
  const Piece = require("./piece");
// }
// DON'T TOUCH THIS CODE

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4].
 */
function _makeGrid() {
    let grid = new Array(8);

    for (let i = 0; i < grid.length; i++) {
        grid[i] = new Array(8);
    }

    grid[3][4] = new Piece('black');
    grid[4][3] = new Piece('black');
    grid[3][3] = new Piece('white');
    grid[4][4] = new Piece('white');

    return grid;
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]];

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
    const [row, col] = pos;
    
    return !((row < 0 || col < 0 || row > 7 || col > 7 ));
};

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
    const [row, col] = pos;

    if (this.isValidPos(pos)) {
        return this.grid[row][col];
    } else {
        throw Error('Not valid pos!');
    }
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
    return (this.getPiece(pos)?.color === color); // if piece exists AND colors match
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
    return !!this.getPiece(pos)
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns an empty array if it reaches the end of the board before finding 
 * another piece of the same color.
 *
 * Returns empty array if it hits an empty position.
 *
 * Returns empty array if no pieces of the opposite color are found.
 */

Board.prototype._positionsToFlip = function (pos, color, dir, piecesToFlip) {
    if (!piecesToFlip) {
        piecesToFlip = [];
    } else {
        piecesToFlip.push(pos);
    }

    const [startRow, startCol] = pos;
    const [horDir, verDir] = dir;
    const newPos = [startRow + horDir, startCol + verDir];

    if (!this.isValidPos(newPos)) {
        return [];
    } else if (!this.isOccupied(newPos)) {
        return [];
    } else if (this.isMine(newPos, color)) {
        return (piecesToFlip.length === 0) ? [] : piecesToFlip;
    } else {
        return this._positionsToFlip(newPos, color, dir, piecesToFlip);
    }
}

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
    if (this.isOccupied(pos)) {
        return false;
    }

    for (let i = 0; i < Board.DIRS.length; i++) {
        if (this._positionsToFlip(pos, color, Board.DIRS[i]).length > 0) {
            return true;
        }
    }

    return false;
};

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
    const [row, col] = pos;
    let positions = [];
   
    if (this.validMove(pos, color)) {
        this.grid[row][col] = new Piece(color);
    } else {
        throw Error ("Invalid move!");
    }
    
    for (let i = 0; i < Board.DIRS.length; i++) {
      positions = positions.concat((this._positionsToFlip(pos, color, Board.DIRS[i])));
    }
    
    positions.forEach((position) => this.getPiece(position).flip());
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
    let validPositions = [];

    for (i = 0; i < this.grid.length; i++) {
        for (j = 0; j < this.grid.length; j++) {
            if (this.validMove([i, j], color)) {
                validPositions.push([i, j]);
            }
        }   
    }

    return validPositions;
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
    return (this.validMoves(color).length > 0);
};

/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
    return (!this.hasMove("black") || !this.hasMove("white"));
};

/**
 * Prints a string representation of the Board to the console.
 */

Board.prototype.print = function (turn) {
    console.log("  0 1 2 3 4 5 6 7");
    
    for (let i = 0; i < this.grid.length; i++) {
        let rowOutput = `${i} `;

        for (let j = 0; j < this.grid[i].length; j++) {
            if (typeof this.grid[i][j] === "undefined") {
                if (this.validMove([i, j], turn)) {
                    rowOutput += "* ";
                } else {
                    rowOutput += "_ ";
                }
            } else {
                rowOutput += this.grid[i][j].toString() + " ";
            }
        }
        console.log(rowOutput);
    }
};

// DON'T TOUCH THIS CODE
// if (typeof window === 'undefined'){
  module.exports = Board;
// }
// DON'T TOUCH THIS CODE
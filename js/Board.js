// Board Class
// ====================================
(function() {
    // Private functions & variables
    var defaultValue = null;
    var self = null;
    var threeInARow = function(tokens) {
        var ret = true;
        var check = tokens[0];
        for (var i = 0; i < 3; i++) {
            if (check !== tokens[i] || check == defaultValue) {
                ret = false;
                break;
            }
        }
        return ret;
    };

    // Constructor
    Board = function() {
        this.ds = [
            [defaultValue, defaultValue, defaultValue],
            [defaultValue, defaultValue, defaultValue],
            [defaultValue, defaultValue, defaultValue]
        ];
    };
    Board.prototype.isWin = function(token) {
        // Check rows 
        if (this.checkFor(token)) return true;
        return false;
    };
    Board.prototype.isFull = function() {
        for (var i in this.ds) {
            var row = this.ds[i];
            for (var j in row) {
                if (row[j] == null) return false;
            }
        }
        return true;
    };
    Board.prototype.checkFor = function(token) {
        tokens = token instanceof Array ? token : [token, token, token];
        var row = this.checkRowsFor(tokens);
        if (row) return row;
        var col = this.checkColsFor(tokens);
        if (col) return col;
        var diag = this.checkDiagsFor(tokens);
        if (diag) return diag;
        return false;
    };
    Board.prototype.checkRowsFor = function(tokens) {
        if (arraysEqual(this.ds[0], tokens)) return [[0, 0], [0, 1], [0, 2]];
        if (arraysEqual(this.ds[1], tokens)) return [[1, 0], [1, 1], [1, 2]];
        if (arraysEqual(this.ds[2], tokens)) return [[2, 0], [2, 1], [2, 2]];
        return false;
    };
    Board.prototype.checkColsFor = function(tokens) {
       var col1 = [this.get(0, 0), this.get(1, 0), this.get(2, 0)]; 
       var col2 = [this.get(0, 1), this.get(1, 1), this.get(2, 1)]; 
       var col3 = [this.get(0, 2), this.get(1, 2), this.get(2, 2)]; 
       if (arraysEqual(col1, tokens)) return [[0, 0], [1, 0], [2, 0]];
       if (arraysEqual(col2, tokens)) return [[0, 1], [1, 1], [2, 1]];
       if (arraysEqual(col3, tokens)) return [[0, 2], [1, 2], [2, 2]];
       return false;
    };
    Board.prototype.checkDiagsFor = function(tokens) {
        var diag = [this.get(0, 0), this.get(1, 1), this.get(2, 2)];
        var antidiag = [this.get(2, 0), this.get(1, 1), this.get(0, 2)];
        if (arraysEqual(diag, tokens)) return [[0, 0], [1, 1], [2, 2]];
        if (arraysEqual(antidiag, tokens)) return [[2, 0], [1, 1], [0, 2]];
        return false;
    };
    Board.prototype.get = function(row, col) {
        return this.ds[row][col] || defaultValue;
    };
    Board.prototype.set = function(row, col, val) {
        this.ds[row][col] = val || defaultValue;                    
    };
    Board.prototype.setRow = function(rowNum, row) {
        this.ds[rowNum - 1] = row.concat();    
    };
    Board.prototype.toString = function() {
        return [
            '[' + this.ds[0].toString(),
                  this.ds[1].toString(),
                  this.ds[2].toString() + ']'
        ].join("\n");
    };

    // Simple tests
    var test = new Test("Board Test");
    test.test(function() {
        var board = new Board();
        var emptyBoardStr = "[,,\n,,\n,,]";
        test.assert(emptyBoardStr, board.toString(), "Empty board toString is incorrect.");

        board.setRow(1, ['x',  'x', 'x']);
        board.setRow(2, [null, 'o', null]);
        board.setRow(3, ['o',  'o', null]);

        // Test checkRowsFor private function
        test.assert(false, board.checkRowsFor([null, null, null]), "[null, null, null] is not on the board.");
        test.assert([[2, 0], [2, 1], [2, 2]], board.checkRowsFor(['o', 'o', null]), "[o, o, null] was not found in a row.");
        test.assert([[0, 1], [1, 1], [2, 1]], board.checkColsFor(['o', 'o', 'x']), "[o, o, x] was not found in a column.");
        test.assert([[2, 0], [1, 1], [0, 2]], board.checkDiagsFor(['o', 'o', 'x']), "[o, o, x] was not found in a diagonal.");
        // Test the checkFor function
        board.setRow(1, ['o', null, 'x']);
        board.setRow(2, ['o',  'x', null]);
        board.setRow(3, ['o',  'z', 'z']);
        test.assert(false, board.checkFor('p'), "[p, p, p] is not on the board.");
        test.assert([[0, 0], [1, 0], [2, 0]], board.checkFor('o'), "[o, o, o] was not found in a column with checkFor.");
        board.setRow(3, ['x',  'z', 'z']);
        test.assert([[2, 0], [1, 1], [0, 2]], board.checkFor('x'), "[x, x, x] was not found in a diagonal with checkFor.");
        board.setRow(3, ['z',  'z', 'z']);
        test.assert([[2, 0], [2, 1], [2, 2]], board.checkFor('z'), "[z, z, z] was not found in a row with checkFor.");

        // Test winning conditions
        board.setRow(1, ['x', 'x', 'x']);
        board.setRow(2, ['o',  'x', null]);
        board.setRow(3, ['o',  'z', 'z']);
        test.assert(true, board.isWin('x'), "Three x's in a row should be a win.");
        board.setRow(1, ['x',  'o', 'x']);
        board.setRow(2, [null, 'o', null]);
        board.setRow(3, ['o',  'o', 'x']);
        test.assert(true, board.isWin('o'), "Three o's in a column should be a win.");
        board.setRow(1, ['x', 'o', 'x']);
        board.setRow(2, ['o', 'x', 'o']);
        board.setRow(3, ['o', 'o', 'x']);
        test.assert(true, board.isWin('x'), "Three x's in a diagonal should be a win.");
        board.setRow(1, ['x', 'o',  'x']);
        board.setRow(2, ['o', null, 'o']);
        board.setRow(3, ['o', 'o',  'x']);
        test.assert(false, board.isWin('o'), "This board is not in a winning state.");
        test.assert(false, board.isWin('x'), "This board is not in a winning state.");
        // Set some tokens on the board
        var board2 = new Board();
        board2.set(0, 0, 'x');
        board2.set(1, 1, 'x');
        board2.set(2, 2, 'x');
        test.assert(true, board2.isWin('x'), "Setting x's diagonally should be a win.");
    });
})();

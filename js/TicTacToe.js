(function() {
    var chip = {
        human: '&times;',
        computer: '&#x25cb;'
    };
    // Computer tactics 
    // http://en.wikipedia.org/wiki/Tic-tac-toe#Strategy
    // 1-2. Check for or block winning move
    var checkForWin = function(tokenToCheck, tokenToPlace, dontTakePos) {
        var winningPath = this.board.checkFor([tokenToCheck, tokenToCheck, null]);
        if (!winningPath) {
            winningPath = this.board.checkFor([tokenToCheck, null, tokenToCheck]); 
            if (!winningPath) return false;
        }
        // Find the open spot.
        for (var i = 0; i < 3; i++) {
            if (this.board.get(winningPath[i][0], winningPath[i][1]) == null) {
                if (dontTakePos) return [winningPath[i][0], winningPath[i][1]];
                this.take(winningPath[i][0], winningPath[i][1], tokenToPlace);
                return [winningPath[i][0], winningPath[i][1]];
            }
        }
    };
    // 3-4. Check or block a fork
    var checkForFork = function(tokenToCheck, tokenToPlace, dontTakePos) {
        // Copy board
        var board = new Board();
        board.setRow(1, this.board.ds[0]);
        board.setRow(2, this.board.ds[1]);
        board.setRow(3, this.board.ds[2]);
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (board.get(i, j) == null) {
                    // If the value is null place the tokenToCheck then
                    // see if there are multiple ways to win.
                    board.set(i, j, tokenToCheck);
                    if (confirmFork.call(this, board, tokenToCheck)) {
                        if (dontTakePos) return [i, j];
                        this.take(i, j, tokenToPlace);
                        return [i, j];
                    }
                    board.set(i, j, null);
                }
            }
        }
        return false;
    };
    var confirmFork = function(board, token) {
        var rowWin = board.checkRowsFor([token, token, null]) || board.checkRowsFor([token, null, token]);
        var colWin = board.checkColsFor([token, token, null]) || board.checkColsFor([token, null, token]);
        var diagWin = board.checkDiagsFor([token, token, null]) || board.checkDiagsFor([token, null, token]);
        if ((rowWin && colWin) || (colWin && diagWin) || (rowWin && diagWin)) return true;
        return false;
    };
    var blockFork = function() {
        var forkPos = checkForFork.call(this, chip.human, chip.computer, true);
        if (!forkPos) return false;

        var board = new Board();
        board.setRow(1, this.board.ds[0]);
        board.setRow(2, this.board.ds[1]);
        board.setRow(3, this.board.ds[2]);
        board.set(forkPos[0], forkPos[1], chip.computer);
        // If there is another fork available to the human then we
        // need to get two in a row to make the human defend.
        var tempBoard = this.board;
        this.board = board;
        // If the computer is set for a win then 
        // check if the winning pos is the same spot as the second fork pos.
        var winningPos = checkForWin.call(this, chip.computer, chip.computer, true);
        var forkPos2 = checkForFork.call(this, chip.human, chip.computer, true);
        this.board = tempBoard;
        // If the winning pos is not equal to the 2nd fork pos, place at the first fork.
        if ((winningPos && forkPos2) && winningPos.toString() !== forkPos2.toString()) {
            this.take(forkPos[0], forkPos[1], chip.computer);
            return true;
        }
        if (!forkPos2) {
            this.take(forkPos[0], forkPos[1], chip.computer);
            return true;
        }
        // Human has another fork opportunity.
        checkForSide.call(this);
        return true;
    };
    // 5-8. Check for an open move
    var checkForOpen = function() {
        // 5. If the center is open, take it.
        if (this.board.get(1, 1) == null) {
            this.take(1, 1, chip.computer);
            return;
        }

        // 6. If the human has a corner grab the opposite corner.
        if (this.board.get(0, 0) == chip.human && this.board.get(2, 2) == null) {
            this.take(2, 2, chip.computer); return;
        } else if (this.board.get(0, 2) == chip.human && this.board.get(2, 0) == null) {
            this.take(2, 0, chip.computer); return;
        } else if (this.board.get(2, 2) == chip.human && this.board.get(0, 0) == null) {
            this.take(0, 0, chip.computer); return;
        } else if (this.board.get(2, 0) == chip.human && this.board.get(0, 2) == null) {
            this.take(0, 2, chip.computer); return;
        }

        // 7. If there is an empty corner grab it. Go for win scenario if possible.
        if (this.board.get(0, 0) == null) { this.take(0, 0, chip.computer); return; }
        if (this.board.get(0, 2) == null) { this.take(0, 2, chip.computer); return; }
        if (this.board.get(2, 2) == null) { this.take(2, 2, chip.computer); return; }
        if (this.board.get(2, 0) == null) { this.take(2, 0, chip.computer); return; }

        // 8. If there is an empty side take it.
        checkForSide.call(this);
    };
    var checkForSide = function() {
        if (this.board.get(0, 1) == null) { this.take(0, 1, chip.computer); return; }
        if (this.board.get(1, 2) == null) { this.take(1, 2, chip.computer); return; }
        if (this.board.get(2, 1) == null) { this.take(2, 1, chip.computer); return; }
        if (this.board.get(1, 0) == null) { this.take(1, 0, chip.computer); return; }
    };

    TicTacToe = function() {
        this.board = new Board();
    };
    TicTacToe.prototype.take = function(row, col, val) {
        if (this.board.get(row, col) !== null) {
            $(document).trigger('game.error', { reason: "There is already a token in that box." });
            return false;
        }
        this.board.set(row, col, val);
        $(document).trigger('game.take', { row: row, col: col, text: val });

        if (this.board.isWin(val)) {
            switch (val) {
                case chip.human:    $(document).trigger('game.gameover', { winner: 'human' }); break;
                case chip.computer: $(document).trigger('game.gameover', { winner: 'computer' }); break;
                default:
            }
            return false; // Game over
        }
        else if (this.board.isFull()) {
            $(document).trigger('game.gameover', { winner: 'draw' });
            return false; // Game over
        }
        return true;
    };
    TicTacToe.prototype.humanMove = function(row, col) {
        if (!this.take(row, col, chip.human)) return;
        if (!this.board.isFull())
            this.computerMove();
    };
    TicTacToe.prototype.computerMove = function() {
        // 1.
        if (checkForWin.call(this, chip.computer, chip.computer)) return;
        // 2. 
        if (checkForWin.call(this, chip.human, chip.computer)) return;
        // 3.
        if (checkForFork.call(this, chip.computer, chip.computer)) return;
        // 4.
        if (blockFork.call(this)) return;
        // 5-8.
        checkForOpen.call(this);
    };

    // Simple tests
    var test = new Test("TicTacToe Test");
    test.test(function() {
        var game = new TicTacToe();

        // 1. Test the computer winning move
        game.board.setRow(1, [chip.computer, chip.human, null]);
        game.board.setRow(2, [chip.human, chip.computer, null]);
        game.board.setRow(3, [chip.human, chip.computer, null]);
        game.computerMove();
        var answer = '['+chip.computer+','+chip.human+',\n' + 
                     chip.human+','+chip.computer+',\n' +
                     chip.human+','+chip.computer+','+chip.computer+']';
        test.assert(answer, game.board.toString(), "Computer did not make the winning move.");
        // 2. Test blocking a human's winning move
        game.board.setRow(1, [null, null, null]);
        game.board.setRow(2, [null, chip.computer, null]);
        game.board.setRow(3, [null, chip.human, chip.human]);
        game.computerMove();
        var answer = '[,,\n' + 
                     ','+chip.computer+',\n' +
                     chip.computer+','+chip.human+','+chip.human+']';
        test.assert(answer, game.board.toString(), "Computer did not block the human's winning move.");
        // 3. Test obtaining a fork position
        game.board.setRow(1, [null, null, null]);
        game.board.setRow(2, [chip.human, chip.human, chip.computer]);
        game.board.setRow(3, [null, chip.computer, null]);
        game.computerMove();
        var answer = '[,,\n' + 
                     chip.human+','+chip.human+','+chip.computer+'\n' +
                     ','+chip.computer+','+chip.computer+']';
        test.assert(answer, game.board.toString(), "Computer did not take the fork position.");
        // 4. Test blocking a fork position
        game.board.setRow(1, [null, null, null]);
        game.board.setRow(2, [null, chip.computer, chip.human]);
        game.board.setRow(3, [null, chip.human, null]);
        game.computerMove();
        var answer = '[,,\n' + 
                     ','+chip.computer+','+chip.human+'\n' +
                     ','+chip.human+','+chip.computer+']';
        test.assert(answer, game.board.toString(), "Computer did not block the fork position.");
        // 4. Test blocking a fork position, rare scenario where blocking a fork will cause another fork.
        game.board.setRow(1, [chip.human, null, null]);
        game.board.setRow(2, [null, chip.computer, null]);
        game.board.setRow(3, [null, null, chip.human]);
        game.computerMove();
        var answer = '['+chip.human+','+chip.computer+',\n' + 
                     ','+chip.computer+',\n' +
                     ',,'+chip.human+']';
        test.assert(answer, game.board.toString(), "Computer did not block the rare fork position.");
        // 4. Test blocking a fork position, another rare scenario where blocking a fork will cause another fork.
        game.board.setRow(1, [chip.computer, null, null]);
        game.board.setRow(2, [null, chip.human, null]);
        game.board.setRow(3, [null, null, chip.human]);
        game.computerMove();
        var answer = '['+chip.computer+',,'+chip.computer+'\n' + 
                     ','+chip.human+',\n' +
                     ',,'+chip.human+']';
        test.assert(answer, game.board.toString(), "Computer did not block the second rare fork position.");
        // 5. Test taking the center position
        game.board.setRow(1, [null, chip.human, null]);
        game.board.setRow(2, [null, null, null]);
        game.board.setRow(3, [null, null, null]);
        game.computerMove();
        var answer = '[,'+chip.human+',\n' + 
                     ','+chip.computer+',\n' +
                     ',,]';
        test.assert(answer, game.board.toString(), "Computer did not take the center position.");
        // 6. Test taking the opposite corner for the human
        game.board.setRow(1, [null, null, null]);
        game.board.setRow(2, [null, chip.computer, null]);
        game.board.setRow(3, [chip.human, null, null]);
        game.computerMove();
        var answer = '[,,'+chip.computer+'\n' + 
                     ','+chip.computer+',\n' +
                     chip.human+',,]';
        test.assert(answer, game.board.toString(), "Computer did not take the opposite corner.");
        // 7. Test taking an open corner
        game.board.setRow(1, [chip.human, chip.human, chip.computer]);
        game.board.setRow(2, [chip.computer, chip.computer, chip.human]);
        game.board.setRow(3, [chip.human, null, null]);
        game.computerMove();
        var answer = '['+chip.human+','+chip.human+','+chip.computer+'\n' + 
                     chip.computer+','+chip.computer+','+chip.human+'\n' +
                     chip.human+',,'+chip.computer+']';
        test.assert(answer, game.board.toString(), "Computer did not take the open corner.");
        // 8. Test taking an open side
        game.board.setRow(1, [chip.computer, chip.human, chip.human]);
        game.board.setRow(2, [null, chip.computer, null]);
        game.board.setRow(3, [chip.human, null, chip.computer]);
        game.computerMove();
        var answer = '['+chip.computer+','+chip.human+','+chip.human+'\n' + 
                     ','+chip.computer+','+chip.computer+'\n' +
                     chip.human+',,'+chip.computer+']';
        test.assert(answer, game.board.toString(), "Computer did not take the open side.");
    });
})();

$(document).ready(function() {
    var game = new TicTacToe();

    // Handle UI stuff
    var $boxes = $('.box');
    $boxes.click(function() {
        game.humanMove($(this).data('row'), $(this).data('col'));
    });
    $('.retry').click(function() { window.location.reload(); });
    $(document).on('game.error', function(e, obj) {
        alert(obj.reason);
    }).on('game.take', function(e, obj) {
        $boxes.filter('.box[data-row="' + obj.row + '"][data-col="' + obj.col + '"]').html(obj.text);
    }).on('game.gameover', function(e, obj) {
        $('.modal-title').html((function() {
            switch (obj.winner) {
                case 'human': return "You win!"; break;
                case 'computer': return "Computer wins!"; break;
                case 'draw': return "Its a draw!"; break;
            }
        })());
        $('.modal-subtext').html((function() {
            switch (obj.winner) {
                case 'human': return "Looks like i've failed in thwarting your superior intelligence."; break;
                case 'computer': return "This is to be expected right?"; break;
                case 'draw': return "Let's try this again.."; break;
            }
        })());
        $('.modal').modal();
    });

    // Additional testing. Running randomized games
    // to see if there are any senarios where the computer
    // loses.
    $(document).keypress(function(e) {
        if (e.which != 13) return;
        var game = new TicTacToe();

        $(document).off('game.gameover').on('game.gameover', function(e, obj) {
            $('.box').html('');
            if (obj.winner == 'human') {
                console.log(game.board.toString());
                console.log("Human won the scenario above.");
                console.log('**************************************');
            }
            game = new TicTacToe();
        });
        var randomTest = function() {
            // Find all empty boxes.
            var emptyBoxes = [];
            for (var i = 0; i < 3; i++) {
               for (var j = 0; j < 3; j++) {
                    if (game.board.get(i, j) == null)
                        emptyBoxes.push([i, j]);
               }
            }
            // randomly choose a position.
            var pos = Math.floor(Math.random() * (emptyBoxes.length - 1));
            game.humanMove(emptyBoxes[pos][0], emptyBoxes[pos][1]);
            setTimeout(randomTest, 50);
        };
        randomTest();
    });
});

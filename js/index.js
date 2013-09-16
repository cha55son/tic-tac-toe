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
        $('.modal-body').html([
            (function() {
                switch (obj.winner) {
                    case 'human': return "Human Wins!"; break;
                    case 'computer': return "Computer Wins!"; break;
                    case 'draw': return "Draw!"; break;
                }
            })()
        ].join());
        $('.modal').modal();
    });
});

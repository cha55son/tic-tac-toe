$(document).ready(function() {
    TTT.init();

    // Handle UI stuff
    $(document).on('ttt.error', function(e, obj) {
        alert(obj.reason);
    }).on('ttt.take', function(e, obj) {
        $('.box[data-row="' + obj.row + '"][data-col="' + obj.col + '"]').text(obj.text);
    });
});

(function() {
    window.TTT = {
        board: [
            [-1, -1, -1],
            [-1, -1, -1],
            [-1, -1, -1]
        ],
        init: function() {
            // Cache
            this.$board = $('.board');
            this.$boxes = $('.box', this.$board);

            // Events
            var me = this;
            this.$boxes.click(function() {
                me.humanMove($(this));
            });
            return this;
        },
        humanMove: function(el) {
            this.take(el.data('row'), el.data('col'), 'X');
        },
        take: function(row, col, val) {
            if (this.board[row][col] != -1) {
                $(document).trigger('ttt.error', { reason: "There is already a token in this box." });
                return false;
            }
            this.board[row][col] = val;                    
            $(document).trigger('ttt.take', { row: row, col: col, text: val });
        }
    };
})();

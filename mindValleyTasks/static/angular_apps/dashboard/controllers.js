/* All controllers go in this file */
/* Keep controllers as slim as possible */
/* Separate out as much as possible and include make services out of them. */ 
/* Naming convention for controllers: 'nameController'. A standard convention will make it easier to search for required controllers. */

(function(){

    angular.module('app.controllers', [
        'app.services',
        'app.utils',        
    ])
    
    // home (dashboard) controller
    .controller("homeController", [
    	"$scope",    	
    	function(
    		$scope
    	){    	
    		    	

    	}
    ])

    .controller("ticTacToeController", [
        "$scope",
        function($scope){

            $scope.board = (function(){
                var board = [];
                for (var i=0; i<3; i++){
                    for (var j=0; j<3; j++){
                        board.push({value: " ", row: i, col: j});    
                    }                    
                }
                return board;
            })();

            $scope.game = {
                turn: 1, // 1-> player, 0-> computer, 2 -> game over or tie
                reset: false,
                displayMessage: null,
                img: null
            };

            var player = "X";
            var pc = "O";

            // var startTime = null;
            // var endTime = null;

            $scope.displayMessage = function(m){
                $scope.game.displayMessage = m;
            }            

            $scope.pieceClicked = function(piece, turn){  

                if(piece.value!==" "){
                    return;
                }              

                if (turn===1){
                    drawMove(piece, turn);
                    if(checkWinner($scope.board, player)){
                        $scope.displayMessage("Hurray, you won! Whoops! That shouldn't have happened!");                        
                        reset();
                        return;
                    }
                    else{
                        if(checkGameOver($scope.board)){
                            $scope.displayMessage("Game ends in a Tie!");
                            gameFreeze();
                            $scope.game.reset = true;
                            return;
                        }
                    }
                    $scope.game.turn = 0;

                    //startTime = new Date();
                    simulateComputerMove();
                    //endTime = new Date();
                    //var sec = Math.floor((endTime - startTime) % 60000 / 1000);
                    //console.log("Time taken for move: ", sec, " seconds.");
                }                
            }

            function drawMove(piece, turn){
                // draws move in the template
                if (turn === 1){
                    piece.value = player;
                    piece.img = "/static/img/x.png";
                }
                else{
                    piece.value = pc;
                    piece.img = "/static/img/o.png";
                }
            }

            function checkGameOver(board){
                // checks if all pieces have been filled

                for (var i=0; i<9; i++){
                    if (board[i].value==" "){
                        return false;
                    }
                }
                return true;
            }

            function checkWinner(b, p){
                // check all posible combinations for winner with piece value p
                var b = $scope.board;
                return (
                    (b[0].value===p && b[1].value===p && b[2].value===p) ||
                    (b[3].value===p && b[4].value===p && b[5].value===p) ||
                    (b[6].value===p && b[7].value===p && b[8].value===p) ||
                    (b[0].value===p && b[3].value===p && b[6].value===p) ||
                    (b[1].value===p && b[4].value===p && b[7].value===p) ||
                    (b[2].value===p && b[5].value===p && b[8].value===p) ||
                    (b[0].value===p && b[4].value===p && b[8].value===p) ||
                    (b[2].value===p && b[4].value===p && b[6].value===p)
                );
            }

            function simulateComputerMove(){
                makeComputerMove();
                $scope.game.turn = 1;
            }

            function makeComputerMove(){
                // find best move using minimax
                var piece = findBestMove($scope.board, $scope.game.turn);
                drawMove($scope.board[piece.index]);

                // check for winner
                if (checkWinner($scope.board, pc)){
                    $scope.displayMessage("Sorry, you've lost! Try again!");
                    gameFreeze();
                }
            }

            function findBestMove(board, turn){
                // finds best move to be made
                // for maximiser (which is pc)

                var bestHeuristic = -1000;
                var b = board;
                var i;
                var bestPiece = {
                    value: pc,
                    row: null, 
                    col: null,
                }
                for (i=0; i<9; i++){
                    if(b[i].value === " "){
                        b[i].value = pc;
                        // find heuristic
                        var pieceHeuristic = minimax(b, 0, 1);
                        //console.log("Obtained pieceHeuristic ", pieceHeuristic, i);
                        b[i].value = " ";

                        if( pieceHeuristic > bestHeuristic ){
                            bestHeuristic = pieceHeuristic;
                            bestPiece.row = Math.floor(i/3);
                            bestPiece.col = i%3;
                            bestPiece.index = i;
                        }
                    }
                }
                return bestPiece;
            }

            function minimax(board, depth, turn){  
                // minimax algorithm implementation

                var b = board;
                var heuristic = evaluateHeuristic(b);
                var nextTurn = null; var i = null; var j = null;

                if(heuristic===10 || heuristic===-10){
                    return heuristic;
                }

                if(checkGameOver(b)){
                    return 0;
                }
                
                if(turn===0){
                    nextTurn = 1;
                }
                else{
                    nextTurn = 0;
                }

                //console.log("In minimix ", b, depth, turn, heuristic, nextTurn);
                //debugger;
                if (turn===1){
                    // minimiser                    
                    var bestHeuristic = 1000;
                    for(j=0; j<9; j++){
                        if(b[j].value===" "){
                            b[j].value = player;                          
                            bestHeuristic = Math.min(bestHeuristic, minimax(b, depth+1, nextTurn));
                            //console.log("Returned minimax->", bestHeuristic, j);
                            b[j].value = " ";                            
                        }
                    }                    
                    return bestHeuristic;
                }
                else{
                    // maximiser
                    var bestHeuristic = -1000;
                    for(i=0; i<9; i++){
                        if(b[i].value===" "){
                            b[i].value = pc;                                                 
                            bestHeuristic = Math.max(bestHeuristic, minimax(b, depth+1, nextTurn));
                            //console.log("Returned minimax->", bestHeuristic, i);
                            b[i].value = " ";                            
                        }
                    }                   
                    return bestHeuristic;
                }
            }


            function evaluateHeuristic(board){
                // returns heuristic score
                // +10 if pc has won
                // -10 if player has won
                // 0 if game can still go on

                //var b = board;
                var h = null;

                var p = player;
                if(checkWinner(board, p)){
                    h = -10;
                }
                else if(checkWinner(board, pc)){
                    h = 10;
                }
                else{
                    h = 0;
                }
                return h;                
            }
            
            // resets board and other flags
            function reset(){                

                $scope.board = (function(){
                    var board = [];
                    for (var i=0; i<3; i++){
                        for (var j=0; j<3; j++){
                            board.push({value: " ", row: i, col: j});    
                        }                    
                    }
                    return board;
                })();

                $scope.game.turn = 1;
                $scope.game.reset = false;
                $scope.game.displayMessage = null;
            }

            // freezes board
            function gameFreeze(){
                for (var i=0; i <9; i++){
                    if($scope.board[i].value===" "){
                        $scope.board[i].value = "-";    
                    }                    
                }
                $scope.game.reset = true;
            }

            // resets game on button click
            $scope.reset = function(){
                reset();
            }


        }
    ])

    .controller("cvUploaderController",[
        "$scope", 
        "cvService",
        function($scope, cvService){

            $scope.form = {
                name: null,
                dob: null,
                emailID: null,
                linkedInUrl: null,
                soUrl: null,
                githubUrl: null,
                qualifications: [],
                workExp: [],
                projects: [],
                interests: [],
            };

            (function init(){
                $scope.cvJson = null;
                $scope.uploaderState = 0;
                $scope.cvObject = null;    
            })();

            

            $scope.submit = function(){     
                $scope.uploaderState = 1;         
                try{
                    var json = JSON.parse($scope.cvJson);    
                }
                catch(err){
                    alert("Please enter a valid JSON!\n\n", err);
                    return;
                }  
                
                if(json){
                    cvService.uploadCV(json)
                    .then(function(resolve){
                        console.log(resolve);
                        $scope.cvObject = resolve[0];
                        $scope.uploaderState = 2;
                    }, function(reject){
                        console.error(reject);
                        $scope.uploaderState = 0;
                    });
                }
                else{
                    alert("Please enter a valid JSON!");
                }
            }

            $scope.reset = function(){
                $scope.cvJson = null;
                $socpe.uploaderState = 0;
                $scope.cvObject = null;
            }

        }
    ])

;})();
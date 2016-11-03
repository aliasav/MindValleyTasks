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
                turn: 0, // 0-> player, 1 -> computer, 2 -> game over or tie
            };

            $scope.pieceClicked = function(piece, turn){                

                console.log("Turn-> ", turn);
                if (turn===0){
                    drawMove(piece, turn);
                    if(checkWinner("X")){
                        alert("Hurray, you won!");
                        reset();
                    }
                    else{
                        if(checkGameOver($scope.board)){
                            alert("Game ends in a Tie!");
                        }
                    }
                    $scope.game.turn = 1;

                    simulateComputerMove();
                }
                // else{
                //     console.log("pc's move!");
                //     makeComputerMove();                  
                //     if(checkWinner("O")){
                //         alert("The computer won!");
                //     }
                //     else{
                //         if(checkGameOver()){
                //             alert("Game ends in a Tie!");
                //         }
                //     }
                //     $scope.game.turn = 0;
                // }
            }

            function drawMove(piece, turn){
                // draws move in the template
                if (turn === 0){
                    piece.value = "X"
                }
                else{
                    piece.value = "O";
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

            function checkWinner(p){
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
                console.log("Simulating computer move");
                makeComputerMove();
                $scope.game.turn = 0;
            }

            function makeComputerMove(){
                console.log("Making PC's move!");
                var piece = findBestMove($scope.board, $scope.game.turn);
                console.log("Making this move->", piece);               
            }

            function findBestMove(board, turn){                 
                var bestHeuristic = -1000;
                //var b = board; 
                var bestPiece = {
                    value: (function(){
                        if (turn===0){
                            return "X";
                        }
                        else{
                            return "O";
                        }
                    })(), 
                    row: null, 
                    col: null,
                }
                for (var i=0; i<9; i++){
                    if(board[i].value === " "){
                        board[i].value = bestPiece.value;                 
                        console.log("findBestMove", board[i].value, board, i);
                        // find heuristic
                        var pieceHeuristic = minimax(board, 0, turn);
                        console.log("Obtained pieceHeuristic ", pieceHeuristic, i);
                        board[i].value = " ";

                        if( pieceHeuristic > bestHeuristic ){
                            bestHeuristic = pieceHeuristic;
                            bestPiece.row = Math.round(i/3);
                            bestPiece.col = i%3;
                        }
                    }
                }
                return bestPiece;
            }

            $scope.iter = 0;

            function minimax(board, depth, turn){
                $scope.iter += 1;
                if($scope.iter>3){
                    return 0;
                }
                var b = board;
                var heuristic = evaluateHeuristic(b);
                var p = "X";
                var pc = "O";
                var nextTurn;                

                if (heuristic===10 || heuristic===-10){
                    return heuristic;
                }

                if (checkGameOver(b)){
                    return 0;
                }
                
                if(turn===0){
                    nextTurn = 1;
                }
                else{
                    nextTurn = 0;
                }

                console.log("In minimix ", b, depth, turn, heuristic, nextTurn);

                if (turn===1){
                    var bestHeuristic = 1000;
                    for(var i=0; i<9; i++){
                        if(b[i].value===" "){
                            b[i].value = pc;
                            console.log(b[i], b, i)                            
                            bestHeuristic = Math.min(bestHeuristic, minimax(b, depth+1, nextTurn));
                            console.log("Returned minimax->", bestHeuristic);
                            b[i].value = " ";                            
                        }
                    }
                    return bestHeuristic;
                }
                else{
                    var bestHeuristic = -1000;
                    for(var i=0; i<9; i++){
                        if(b[i].value===" "){
                            b[i].value = p;
                            console.log(b[i])
                            bestHeuristic = Math.max(bestHeuristic, minimax(b, depth+1, nextTurn));
                            console.log("Returned minimax->", bestHeuristic);
                            b[i].value = " ";                            
                        }
                    }
                    return bestHeuristic;
                }
            }



            function evaluateHeuristic(board){
                // returns heuristic score
                // +10 if player has won
                // -10 if pc has won
                // 0 if game can still go on

                var b = board;
                var p = "X"; var pc = "O"; var h = 0;
                
                // check rows                                
                for (var i=0; i<6; i=i+3){
                    
                    if (b[i].value===p && b[i=1].value===p && b[i+2].value===p){
                        h = 10;
                    }

                    if (b[i].value===pc && b[i=1].value===pc && b[i+2].value===pc){
                        h = -10;
                    }
                    
                }

                // check columns
                if(b[0].value===p && b[3].value===p && b[6]===p){
                    h = 10;                    
                }    
                if(b[0].value===pc && b[3].value===pc && b[6]===pc){
                    h = -10;
                }

                if(b[1].value===p && b[4].value===p && b[7]===p){
                    h = 10;
                }    
                if(b[1].value===pc && b[4].value===pc && b[7]===pc){
                    h = -10;
                }

                if(b[2].value===p && b[5].value===p && b[8]===p){
                    h = 10;
                }    
                if(b[2].value===pc && b[5].value===pc && b[8]===pc){
                    h = -10;
                }

                // check diagonals
                if (b[0].value===p && b[4].value===p && b[8].value===p){
                    h = 10;
                }

                if (b[0].value===pc && b[4].value===pc && b[8].value===pc){
                    h = -10;
                }

                if (b[2].value===p && b[4].value===p && b[6].value===p){
                    h = 10;
                }
                if (b[2].value===pc && b[4].value===pc && b[6].value===pc){
                    h = -10;
                }

                console.log("calculated heuristic -> ", h);
                if(h===10 || h===-10){
                    return h;
                }
                else{
                    return 0;    
                }            
            }

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

                $scope.game.turn = 0;

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
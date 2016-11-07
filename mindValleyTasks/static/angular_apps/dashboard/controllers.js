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
        "$state",   	
    	function($scope, $state){    	
    		
            $scope.stateChange = function(state){
                $state.go(state);
            }

    	}
    ])


    .controller("ticTacToeController", [
        "$scope",
        function($scope){

            // board used in template
            $scope.board = (function(){
                var board = [];
                for (var i=0; i<3; i++){
                    for (var j=0; j<3; j++){
                        board.push({value: " ", row: i, col: j});    
                    }                    
                }
                return board;
            })();

            // game variables
            $scope.game = {
                turn: 1, // 1-> player, 0-> computer, 2 -> game over or tie
                reset: false, // reset button display flag
                displayMessage: null, // display message
                img: null, // img associated with X or an O
                player: "X", // player symbol
                pc: "O", // pc symbol
                playerImg: "/static/img/x.png",
                pcImg: "/static/img/o.png",
            };

            // var startTime = null;
            // var endTime = null;

            $scope.displayMessage = function(m){
                // displays a message just above board                
                $scope.game.displayMessage = m;
            }            

            $scope.pieceClicked = function(piece, turn){  
                // piece clicked by plater

                if(piece.value!==" "){
                    return;
                }              

                if (turn===1){
                    drawMove(piece, turn);
                    if(checkWinner($scope.board, $scope.game.player)){
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
                    piece.value = $scope.game.player;
                    piece.img = $scope.game.playerImg;
                }
                else{
                    piece.value = $scope.game.pc;
                    piece.img = $scope.game.pcImg;
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
                // checks rows, columns and disginals

                //var b = $scope.board;
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
                if (checkWinner($scope.board, $scope.game.pc)){
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
                    value: $scope.game.pc,
                    row: null, 
                    col: null,
                }
                for (i=0; i<9; i++){
                    if(b[i].value === " "){
                        b[i].value = $scope.game.pc;
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
                            b[j].value = $scope.game.player;                          
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
                            b[i].value = $scope.game.pc;                                                 
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

                var h = null;
                if(checkWinner(board, $scope.game.player)){
                    h = -10;
                }
                else if(checkWinner(board, $scope.game.pc)){
                    h = 10;
                }
                else{
                    h = 0;
                }
                return h;                
            }
                        
            function reset(){                
                // resets board and other flags

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
            
            function gameFreeze(){
                // freezes board
                for (var i=0; i <9; i++){
                    if($scope.board[i].value===" "){
                        $scope.board[i].value = "-";    
                    }                    
                }
                $scope.game.reset = true;
            }
            
            $scope.reset = function(){
                // resets function attached to reset button
                reset();
            }


        }
    ])

    .controller("ticTacToeController2", [
        "$scope",
        function($scope){

            // board used in template
            $scope.board = (function(){
                var board = [];
                for (var i=0; i<4; i++){
                    for (var j=0; j<4; j++){
                        board.push({value: " ", row: i, col: j});    
                    }                    
                }
                return board;
            })();

            // game variables
            $scope.game = {
                turn: 1, // 1-> player, 0-> computer, 2 -> game over or tie
                reset: false, // reset button display flag
                displayMessage: null, // display message
                img: null, // img associated with X or an O
                player: "X", // player symbol
                pc: "O", // pc symbol
                playerImg: "/static/img/x.png",
                pcImg: "/static/img/o.png",
            };

            // var startTime = null;
            // var endTime = null;

            $scope.displayMessage = function(m){
                // displays a message just above board                
                $scope.game.displayMessage = m;
            }            

            $scope.pieceClicked = function(piece, turn){  
                // piece clicked by plater

                if(piece.value!==" "){
                    return;
                }              

                if (turn===1){
                    drawMove(piece, turn);
                    if(checkWinner($scope.board, $scope.game.player)){
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
                    piece.value = $scope.game.player;
                    piece.img = $scope.game.playerImg;
                }
                else{
                    piece.value = $scope.game.pc;
                    piece.img = $scope.game.pcImg;
                }
            }

            function checkGameOver(board){
                // checks if all pieces have been filled

                for (var i=0; i<16; i++){
                    if (board[i].value==" "){
                        return false;
                    }
                }
                return true;
            }

            function checkWinner(b, p){
                // check all posible combinations for winner with piece value p
                // checks rows, columns and disginals
                // 0   1   2   3 
                // 4   5   6   7
                // 8   9   10  11 
                // 12  13  14  15
 
                return (
                    (b[0].value===p && b[1].value===p && b[2].value===p && b[3].value===p) ||
                    (b[4].value===p && b[5].value===p && b[6].value===p && b[7].value===p) ||
                    (b[8].value===p && b[9].value===p && b[10].value===p && b[11].value===p) ||
                    (b[12].value===p && b[13].value===p && b[14].value===p && b[15].value===p) ||

                    (b[0].value===p && b[4].value===p && b[8].value===p && b[12].value===p) ||
                    (b[1].value===p && b[5].value===p && b[9].value===p && b[13].value===p) ||
                    (b[2].value===p && b[6].value===p && b[10].value===p && b[14].value===p) ||
                    (b[3].value===p && b[7].value===p && b[11].value===p && b[15].value===p) ||

                    (b[0].value===p && b[5].value===p && b[10].value===p && b[15].value===p) ||
                    (b[3].value===p && b[6].value===p && b[9].value===p && b[12].value===p)
                    
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
                if (checkWinner($scope.board, $scope.game.pc)){
                    $scope.displayMessage("Sorry, you've lost! Try again!");
                    gameFreeze();
                }
            }

            function findBestMove(board, turn){
                // finds best move to be made
                // for maximiser (which is pc)

                var bestHeuristic = -100000;
                var b = board;
                var i;
                var bestPiece = {
                    value: $scope.game.pc,
                    row: null, 
                    col: null,
                }
                for (i=0; i<16; i++){
                    if(b[i].value === " "){
                        b[i].value = $scope.game.pc;
                        // find heuristic
                        var pieceHeuristic = minimax(b, 0, 1);
                        console.log("Obtained pieceHeuristic ", pieceHeuristic, i);
                        b[i].value = " ";

                        if( pieceHeuristic > bestHeuristic ){
                            bestHeuristic = pieceHeuristic;
                            bestPiece.row = Math.floor(i/4);
                            bestPiece.col = i%4;
                            bestPiece.index = i;
                        }
                    }
                }
                return bestPiece;
            }
            $scope.minimaxCalls = 0;
            function minimax(board, depth, turn){  
                // minimax algorithm implementation
                $scope.minimaxCalls += 1;
                console.log($scope.minimaxCalls);
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
                    var bestHeuristic = 100000;
                    for(j=0; j<16; j++){
                        if(b[j].value===" "){
                            b[j].value = $scope.game.player;                          
                            bestHeuristic = Math.min(bestHeuristic, minimax(b, depth+1, nextTurn));
                            //console.log("Returned minimax->", bestHeuristic, j);
                            b[j].value = " ";                            
                        }
                    }                    
                    return bestHeuristic;
                }
                else{
                    // maximiser
                    var bestHeuristic = -100000;
                    for(i=0; i<16; i++){
                        if(b[i].value===" "){
                            b[i].value = $scope.game.pc;                                                 
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

                var h = null;
                if(checkWinner(board, $scope.game.player)){
                    h = -10;
                }
                else if(checkWinner(board, $scope.game.pc)){
                    h = 10;
                }
                else{
                    h = 0;
                }
                return h;                
            }
                        
            function reset(){                
                // resets board and other flags

                $scope.board = (function(){
                    var board = [];
                    for (var i=0; i<4; i++){
                        for (var j=0; j<4; j++){
                            board.push({value: " ", row: i, col: j});    
                        }                    
                    }
                    return board;
                })();

                $scope.game.turn = 1;
                $scope.game.reset = false;
                $scope.game.displayMessage = null;
            }
            
            function gameFreeze(){
                // freezes board
                for (var i=0; i <16; i++){
                    if($scope.board[i].value===" "){
                        $scope.board[i].value = "-";    
                    }                    
                }
                $scope.game.reset = true;
            }
            
            $scope.reset = function(){
                // resets function attached to reset button
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

    .controller("urlShortnerController", [
        "$scope", 
        "UTILS",
        "$http",
        "$q",
        "DOMAIN",
        "API_URLS",
        function($scope, UTILS, $http, $q, DOMAIN, API_URLS){

            $scope.response = null;
            $scope.inputUrl = null;
            $scope.success = false;

            $scope.shorten = function(){
                if(validateUrl($scope.inputUrl)){
                    console.log("Valid url: ", $scope.inputUrl);
                    shorten($scope.inputUrl)
                    .then(function(resolve){
                        console.log(resolve);
                        $scope.response = resolve[0];
                        $scope.success = true;

                        $scope.redirectUrl = DOMAIN.server + "rdr/" + $scope.response;

                    }, function(reject){
                        console.error(reject);
                        $scope.response = reject[0];
                        $scope.success = false;
                    });
                }
                else{
                    console.log("Invalid url: ", $scope.inputUrl);
                    alert("Please enter a valid URL!");
                }
            }

            function shorten(input){
                var defer = $q.defer();
                var url = DOMAIN.server + API_URLS.shortenUrl;
                var data = {
                    url: input,
                };
                $http.post(url, data)
                .success(function(data, status, headers, config){
                    defer.resolve([data, status]);
                })
                .error(function(data, status, headers, config){
                    defer.reject([data, status]);
                });

                return defer.promise;
            }

            function validateUrl(url){
                return UTILS.validateURL(url);
            }
        }
    ])

;})();
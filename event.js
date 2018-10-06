window.onload = function(){
	var playerBlack = document.getElementById('playerBlack');
	var playerWhite = document.getElementById('playerWhite');
	var blackResult = document.getElementById('blackResult');
	var whiteResult = document.getElementById('whiteResult');
	var gradeBlack = document.getElementById('gradeBlack');
	var gradeWhite = document.getElementById('gradeWhite');
	var roundNumber = document.getElementById('roundNumber');
	var reminder = document.getElementById('reminder');
	var chessboard = document.getElementById('chessboard');
	var startGame = document.getElementById('startGame');
	var useBlack = document.getElementById('useBlack');
	var useWhite = document.getElementById('useWhite');
	var sound = document.getElementById('sound');
	var goBack = document.getElementById('goBack');
	var restartGame = document.getElementById('restartGame');
	var boardCanvas = document.getElementById('boardCanvas');
	var ctx = boardCanvas.getContext("2d");

	initChessboard(ctx);

	window.matrix = new Array(8);
	for (var i = 0; i < 8; i++) {
		window.matrix[i] = new Array(8);
	}
	for (var j = 0; j < 8; j++) {
		for (var k = 0; k < 8; k++) {
			window.matrix[j][k] = 0;
		}
	}
	window.matrix[3][3] = -1;
	window.matrix[4][4] = -1;
	window.matrix[3][4] = 1;
	window.matrix[4][3] = 1;

	window.possiblePoint = new Array();
	window.possiblePoint[0] = new Object();
	window.possiblePoint[0].x = 3;
	window.possiblePoint[0].y = 2;
	window.possiblePoint[1] = new Object();
	window.possiblePoint[1].x = 2;
	window.possiblePoint[1].y = 3;
	window.possiblePoint[2] = new Object();
	window.possiblePoint[2].x = 5;
	window.possiblePoint[2].y = 4;
	window.possiblePoint[3] = new Object();
	window.possiblePoint[3].x = 4;
	window.possiblePoint[3].y = 5;
	window.possibleDirection = new Array();
	window.possibleDirection[0] = new Array();
	window.possibleDirection[0][0] = "bottom";
	window.possibleDirection[1] = new Array();
	window.possibleDirection[1][0] = "right";
	window.possibleDirection[2] =  new Array();
	window.possibleDirection[2][0] = "left";
	window.possibleDirection[3] = new Array();
	window.possibleDirection[3][0] = "top";

	window.blackSum = 2;
	window.whiteSum = 2;
	window.round = 0;
	window.on = 1;

	startGame.addEventListener('click',gameStart);
	goBack.addEventListener('click',function(){alert("人生如棋，落子无悔。 ");});
	restartGame.addEventListener('click',gameRestart);
	useBlack.addEventListener('click',aiWhite);
	useWhite.addEventListener('click',aiBlack);

	function gameStart(){
		if (!sound.paused) {
			sound.loop = false;
			sound.pause();
			sound.src = "addPoint.mp3";
		}
		playerBlack.style.borderColor = "red";
		boardCanvas.addEventListener('click',step);
	}

	function judgePoint(){
		var result = new Object();
		result.x = Math.floor(event.offsetX/64);
		result.y = Math.floor((event.offsetY+7)/64);
		return result;
	}

	function step(){
		var point = judgePoint();
		for (var i = 0; i < window.possiblePoint.length; i++) {
			if (possiblePoint[i] != null && (possiblePoint[i])) {
				if (point.x == window.possiblePoint[i].x && point.y == window.possiblePoint[i].y) {
					putPoint(point.x,point.y,window.on);
					for (var j = 0; j < window.possiblePoint.length; j++) {
						if (possiblePoint[j] !=null && (possiblePoint[j])) {
							clear(ctx,possiblePoint[j].x,possiblePoint[j].y);
						}
					}
					sound.play();
					drawChessPoint(ctx,point.x*64+34,point.y*64+34,window.on);
					exchange(point.x,point.y,window.possibleDirection[i],ctx);
					window.round++;
					grade();
					window.on = -window.on;
					predictNext(window.on,ctx);
					var impossibleFirst = isEmpty();
					if (impossibleFirst) {
						window.on = -window.on;
						predictNext(window.on,ctx);
						var impossibleSecond = isEmpty();
						if (impossibleSecond) {
							var gameover = judgeWinner();
							playerBlack.style.borderColor = "#deb887";
							playerWhite.style.borderColor = "#deb887";
							gameStatus(gameover);
							boardCanvas.removeEventListener('click',step);
							if (!sound.paused) {
								sound.pause();
								sound.src = "wjd.mp3";
								sound.loop = true;
							}
							return;
						}
						else{
							gameStatus(window.on*2);
							roundChange();
							return;
						}
					}
					else{
						gameStatus(window.on);
						roundChange();
						return;
					}
				}
			}
		}
		gameStatus(0);
	}

	function gameStatus(status){
		reminder.style.lineHeight = "32px";
		reminder.style.fontSize = "27px";
		switch(status){
			case 0:
				reminder.innerHTML = "落子错误，请重新落子。 ";
				break;
			case 1:
				reminder.innerHTML = "请黑方棋手落子。 ";
				break;
			case -1:
				reminder.innerHTML = "请白方棋手落子。 ";
				break;
			case 2:
				reminder.innerHTML = "因为白方棋手无位置可以落子，请黑方棋手落子。 ";
				break;
			case -2:
				reminder.innerHTML = "因为黑方棋手无位置可以落子，请白方棋手落子。 ";
				break;
			case 3:
				reminder.innerHTML = "游戏结束，平局。 ";
				break;
			case 4:
				reminder.innerHTML = "游戏结束，黑方棋手获胜。 ";
				playerBlack.style.borderColor = "red";
				playerBlack.style.borderWidth = "12px";
				blackResult.innerHTML = "胜";
				whiteResult.innerHTML = "败";
				break;
			case 5:
				reminder.innerHTML = "游戏结束，白方棋手获胜。 ";
				playerWhite.style.borderColor = "red";
				playerWhite.style.borderWidth = "12px";
				blackResult.innerHTML = "败";
				whiteResult.innerHTML = "胜";
				break;
		}
	}

	function grade(){
		gradeBlack.innerHTML = blackSum;
		gradeWhite.innerHTML = whiteSum;
		roundNumber.innerHTML = round;
	}

	function gameRestart(){
		if (!sound.paused) {
			sound.loop = false;
			sound.pause();
			sound.src = "addPoint.mp3";
		}
		playerBlack.style.borderColor = "red";
		playerWhite.style.borderColor = "#deb887";
		playerBlack.style.borderWidth = "4px";
		playerWhite.style.borderWidth = "4px";
		boardCanvas.removeEventListener('click',step);
		initChessboard(ctx);
		for (var i = 0; i < 8; i++) {
			window.matrix[i] = new Array(8);
		}
		for (var j = 0; j < 8; j++) {
			for (var k = 0; k < 8; k++) {
				window.matrix[j][k] = 0;
			}
		}
		window.matrix[3][3] = -1;
		window.matrix[4][4] = -1;
		window.matrix[3][4] = 1;
		window.matrix[4][3] = 1;

		window.possiblePoint = new Array();
		window.possiblePoint[0] = new Object();
		window.possiblePoint[0].x = 3;
		window.possiblePoint[0].y = 2;
		window.possiblePoint[1] = new Object();
		window.possiblePoint[1].x = 2;
		window.possiblePoint[1].y = 3;
		window.possiblePoint[2] = new Object();
		window.possiblePoint[2].x = 5;
		window.possiblePoint[2].y = 4;
		window.possiblePoint[3] = new Object();
		window.possiblePoint[3].x = 4;
		window.possiblePoint[3].y = 5;
		window.possibleDirection = new Array();
		window.possibleDirection[0] = new Array();
		window.possibleDirection[0][0] = "bottom";
		window.possibleDirection[1] = new Array();
		window.possibleDirection[1][0] = "right";
		window.possibleDirection[2] =  new Array();
		window.possibleDirection[2][0] = "left";
		window.possibleDirection[3] = new Array();
		window.possibleDirection[3][0] = "top";

		window.blackSum = 2;
		window.whiteSum = 2;
		window.on = 1;
		roundChange();

		boardCanvas.addEventListener('click',step);
	}

	function aiWhite(){
		if (!sound.paused) {
			sound.loop = false;
			sound.pause();
			sound.src = "addPoint.mp3";
		}
		playerBlack.style.borderColor = "red";
		boardCanvas.addEventListener('click',stepWithWhite);
	}

	function aiBlack(){
		if (!sound.paused) {
			sound.loop = false;
			sound.pause();
			sound.src = "addPoint.mp3";
		}
		playerBlack.style.borderColor = "red";
		boardCanvas.addEventListener('click',stepWithBlack);
		var choice = new Array();
		var k = 0;
		for (var j = 0; j < window.possiblePoint.length; j++) {
			if (possiblePoint[j] != null && (possiblePoint[j])) {
				choice[k] = new Object();
				choice[k].x = possiblePoint[j].x;
				choice[k].y = possiblePoint[j].y;
				k++;
			}
		}
		var r = randomize(k-1);
		var point = new Object();
		point.x = choice[r].x;
		point.y = choice[r].y;
		for (var i = 0; i < window.possiblePoint.length; i++) {
			if (possiblePoint[i] != null && (possiblePoint[i])) {
				if (point.x == window.possiblePoint[i].x && point.y == window.possiblePoint[i].y) {
					putPoint(point.x,point.y,window.on);
					for (var j = 0; j < window.possiblePoint.length; j++) {
						if (possiblePoint[j] !=null && (possiblePoint[j])) {
							clear(ctx,possiblePoint[j].x,possiblePoint[j].y);
						}
					}
					sound.play();
					drawChessPoint(ctx,point.x*64+34,point.y*64+34,window.on);
					exchange(point.x,point.y,window.possibleDirection[i],ctx);
					window.round++;
					grade();
					window.on = -window.on;
					predictNext(window.on,ctx);
					var impossibleFirst = isEmpty();
					if (impossibleFirst) {
						window.on = -window.on;
						predictNext(window.on,ctx);
						var impossibleSecond = isEmpty();
						if (impossibleSecond) {
							var gameover = judgeWinner();
							playerBlack.style.borderColor = "#deb887";
							playerWhite.style.borderColor = "#deb887";
							gameStatus(gameover);
							boardCanvas.removeEventListener('click',step);
							if (!sound.paused) {
								sound.pause();
								sound.src = "wjd.mp3";
								sound.loop = true;
							}
							return;
						}
						else{
							gameStatus(window.on*2);
							roundChange();
							return;
						}
					}
					else{
						gameStatus(window.on);
						roundChange();
						return;
					}
				}
			}
		}
	}

	function roundChange(){
		playerBlack.style.borderColor = "#deb887";
		playerWhite.style.borderColor = "#deb887";
		if (window.on == 1) {
			playerBlack.style.borderColor = "red";
		}
		else if (window.on == -1) {
			playerWhite.style.borderColor = "red";
		}
	}

	function stepWithBlack(){
		step();
		var choice = new Array();
		var k = 0;
		for (var j = 0; j < window.possiblePoint.length; j++) {
			if (possiblePoint[j] != null && (possiblePoint[j])) {
				choice[k] = new Object();
				choice[k].x = possiblePoint[j].x;
				choice[k].y = possiblePoint[j].y;
				k++;
			}
		}
		if (k > 0) {
			var r = randomize(k-1);
			var point = new Object();
			point.x = choice[r].x;
			point.y = choice[r].y;
			for (var i = 0; i < window.possiblePoint.length; i++) {
				if (possiblePoint[i] != null && (possiblePoint[i])) {
					if (point.x == window.possiblePoint[i].x && point.y == window.possiblePoint[i].y) {
						putPoint(point.x,point.y,window.on);
						for (var j = 0; j < window.possiblePoint.length; j++) {
							if (possiblePoint[j] !=null && (possiblePoint[j])) {
								clear(ctx,possiblePoint[j].x,possiblePoint[j].y);
							}
						}
						sound.play();
						drawChessPoint(ctx,point.x*64+34,point.y*64+34,window.on);
						exchange(point.x,point.y,window.possibleDirection[i],ctx);
						window.round++;
						grade();
						window.on = -window.on;
						predictNext(window.on,ctx);
						var impossibleFirst = isEmpty();
						if (impossibleFirst) {
							window.on = -window.on;
							predictNext(window.on,ctx);
							var impossibleSecond = isEmpty();
							if (impossibleSecond) {
								var gameover = judgeWinner();
								playerBlack.style.borderColor = "#deb887";
								playerWhite.style.borderColor = "#deb887";
								gameStatus(gameover);
								boardCanvas.removeEventListener('click',step);
								if (!sound.paused) {
									sound.pause();
									sound.src = "wjd.mp3";
									sound.loop = true;
								}
								return;
							}
							else{
								gameStatus(window.on*2);
								roundChange();
								return;
							}
						}
						else{
							gameStatus(window.on);
							roundChange();
							return;
						}
					}
				}
			}
		}
	}

	function stepWithWhite(){
		step();
		var choice = new Array();
		var k = 0;
		for (var j = 0; j < window.possiblePoint.length; j++) {
			if (possiblePoint[j] != null && (possiblePoint[j])) {
				choice[k] = new Object();
				choice[k].x = possiblePoint[j].x;
				choice[k].y = possiblePoint[j].y;
				k++;
			}
		}
		if (k > 0) {
			var r = randomize(k-1);
			var point = new Object();
			point.x = choice[r].x;
			point.y = choice[r].y;
			for (var i = 0; i < window.possiblePoint.length; i++) {
				if (possiblePoint[i] != null && (possiblePoint[i])) {
					if (point.x == window.possiblePoint[i].x && point.y == window.possiblePoint[i].y) {
						putPoint(point.x,point.y,window.on);
						for (var j = 0; j < window.possiblePoint.length; j++) {
							if (possiblePoint[j] !=null && (possiblePoint[j])) {
								clear(ctx,possiblePoint[j].x,possiblePoint[j].y);
							}
						}
						sound.play();
						drawChessPoint(ctx,point.x*64+34,point.y*64+34,window.on);
						exchange(point.x,point.y,window.possibleDirection[i],ctx);
						window.round++;
						grade();
						window.on = -window.on;
						predictNext(window.on,ctx);
						var impossibleFirst = isEmpty();
						if (impossibleFirst) {
							window.on = -window.on;
							predictNext(window.on,ctx);
							var impossibleSecond = isEmpty();
							if (impossibleSecond) {
								var gameover = judgeWinner();
								playerBlack.style.borderColor = "#deb887";
								playerWhite.style.borderColor = "#deb887";
								gameStatus(gameover);
								boardCanvas.removeEventListener('click',step);
								if (!sound.paused) {
									sound.pause();
									sound.src = "wjd.mp3";
									sound.loop = true;
								}
								return;
							}
							else{
								gameStatus(window.on*2);
								roundChange();
								return;
							}
						}
						else{
							gameStatus(window.on);
							roundChange();
							return;
						}
					}
				}
			}
		}
	}
}

$(document).ready(function(){
	$("#playerBlack").fadeIn();
	$("#playerWhite").fadeIn();
	$("#startGame").fadeIn(1500);
	$("#goBack").fadeIn(2000);
	$("#restartGame").fadeIn(2500);
	$("#aiGame").fadeIn(3000);
	$("#aiGame").click(function(){
		$("#userChoice").fadeIn(300);
		$("#useBlack").fadeIn(1200);
		$("#useWhite").fadeIn(1800);
	});
	$("#useBlack").click(function(){
		$("#userChoice").fadeOut(600);
	});
	$("#useWhite").click(function(){
		$("#userChoice").fadeOut(600);
	});
})

$(document).ready(function(){
	$("#baf").fadeIn(300);
	$("#heng").fadeIn(600);
	$("#bas").fadeIn(900);
	$("#zong").fadeIn(1200);
	$("#ke").fadeIn(1500);
	$("#er").fadeIn(1800);
	$("#bu").fadeIn(2100);
	$("#gong").fadeIn(2400);
	$("#hei").fadeIn(2700);
	$("#bai").fadeIn(3000);
	$("#jiao").fadeIn(3300);
	$("#shou").fadeIn(3600);
	$("#sheng").fadeIn(3900);
	$("#fu").fadeIn(4200);
	$("#wu").fadeIn(4500);
	$("#chang").fadeIn(4800);
	$("#enter").click(function(){
		$("#homepage").fadeOut();
		$("#gamePage").fadeIn();
	});
	$("#aiGame").click(function(){
		$("#userChoice").fadeIn(300);
		$("#useBlack").fadeIn(1200);
		$("#useWhite").fadeIn(1800);
	});
	$("#useBlack").click(function(){
		$("#userChoice").fadeOut(600);
	});
	$("#useWhite").click(function(){
		$("#userChoice").fadeOut(600);
	});
})
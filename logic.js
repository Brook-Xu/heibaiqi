function putPoint(i,j,color){
	window.matrix[i][j] = color;
	if (color == 1) {window.blackSum++;}
	else if (color == -1) {window.whiteSum++;}
}

function exchange(x,y,direction,ctx){
	for (var n = 0; n < direction.length; n++) {
		if (direction[n] != null) {
			switch(direction[n]){
				case "top":
					for (var m = 2; m <= y; m++) {
						if (window.matrix[x][y - m] == window.matrix[x][y]) {
							for (var a = 1; a < m; a++) {
								window.matrix[x][y - a] = window.on;
								exchangeSum(-window.on,window.on);
								change(ctx,window.on,x*64+34,(y-a)*64+34);
							}
							break;
						}
					}
					break;
				case "bottom":
					for (var m = 2; m < 8 - y; m++) {
						if (window.matrix[x][y + m] == window.matrix[x][y]) {
							for (var a = 1; a < m; a++) {
								window.matrix[x][y + a] = window.on;
								exchangeSum(-window.on,window.on);
								change(ctx,window.on,x*64+34,(y+a)*64+34);
							}
							break;
						}
					}
					break;
				case "left":
					for (var m = 2; m <= x; m++) {
						if (window.matrix[x - m][y] == window.matrix[x][y]) {
							for (var a = 1; a < m; a++) {
								window.matrix[x - a][y] = window.on;
								exchangeSum(-window.on,window.on);
								change(ctx,window.on,(x-a)*64+34,y*64+34);
							}
							break;
						}
					}
					break;
				case "right":
					for (var m = 2; m < 8 - x; m++) {
						if (window.matrix[x + m][y] == window.matrix[x][y]) {
							for (var a = 1; a < m; a++) {
								window.matrix[x + a][y] = window.on;
								exchangeSum(-window.on,window.on);
								change(ctx,window.on,(x+a)*64+34,y*64+34);
							}
							break;
						}
					}
					break;
				case "top-left":
					for (var m = 2; m <= min(x,y); m++) {
						if (window.matrix[x - m][y - m] == window.matrix[x][y]) {
							for (var a = 1; a < m; a++) {
								window.matrix[x - a][y - a] = window.on;
								exchangeSum(-window.on,window.on);
								change(ctx,window.on,(x-a)*64+34,(y-a)*64+34);
							}
							break;
						}
					}
					break;
				case "top-right":
					for (var m = 2; m <= min(8 - x, y); m++) {
						if (window.matrix[x + m][y - m] == window.matrix[x][y]) {
							for (var a = 1; a < m; a++) {
								window.matrix[x + a][y - a] = window.on;
								exchangeSum(-window.on,window.on);
								change(ctx,window.on,(x+a)*64+34,(y-a)*64+34);
							}
							break;
						}
					}
					break;
				case "bottom-left":
					for (var m = 2; m <= min(x, 8 - y); m++) {
						if (window.matrix[x - m][y + m] == window.matrix[x][y]) {
							for (var a = 1; a < m; a++) {
								window.matrix[x - a][y + a] = window.on;
								exchangeSum(-window.on,window.on);
								change(ctx,window.on,(x-a)*64+34,(y+a)*64+34);
							}
							break;
						}
					}
					break;
				case "bottom-right":
					for (var m = 2; m < min(8 - x, 8 - y); m++) {
						if (window.matrix[x + m][y + m] == window.matrix[x][y]) {
							for (var a = 1; a < m; a++) {
								window.matrix[x + a][y + a] = window.on;
								exchangeSum(-window.on,window.on);
								change(ctx,window.on,(x+a)*64+34,(y+a)*64+34);
							}
							break;
						}
					}
					break;
			}
		}
	}
}

function predictNext(color,ctx){
	for (var c = 0; c < window.possiblePoint.length; c++) {
		window.possiblePoint[c] = null;
	}
	for (var c = 0; c < window.possibleDirection.length; c++) {
		window.possibleDirection[c] = null;
	}
	var z = 0;
	for (var i = 0; i < window.matrix.length; i++) {
		for (var j = 0; j < window.matrix[0].length; j++) {
			if (window.matrix[i][j] == 0) {
				var index = switchPart(i,j);
				switch(index){
					case 1:
						var w = 0;
						if (prediction(i,j,"right",color)) {
							convey(i,j,z,w,"right");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						if (prediction(i,j,"bottom",color)) {
							convey(i,j,z,w,"bottom");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						if (prediction(i,j,"bottom-right",color)) {
							convey(i,j,z,w,"bottom-right");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						z++;
						break;
					case 2:
						var w = 0;
						if (prediction(i,j,"right",color)) {
							convey(i,j,z,w,"right");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						if (prediction(i,j,"bottom-right",color)) {
							convey(i,j,z,w,"bottom-right");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						if (prediction(i,j,"bottom",color)) {
							convey(i,j,z,w,"bottom");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						if (prediction(i,j,"bottom-left",color)) {
							convey(i,j,z,w,"bottom-left");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						if (prediction(i,j,"left",color)) {
							convey(i,j,z,w,"left");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						z++;
						break;
					case 3:
						var w = 0;
						if (prediction(i,j,"left",color)) {
							convey(i,j,z,w,"left");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						if (prediction(i,j,"bottom-left",color)) {
							convey(i,j,z,w,"bottom-left");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						if (prediction(i,j,"bottom",color)) {
							convey(i,j,z,w,"bottom");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						z++;
						break;
					case 4:
						var w = 0;
						if (prediction(i,j,"top",color)) {
							convey(i,j,z,w,"top");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						if (prediction(i,j,"top-right",color)) {
							convey(i,j,z,w,"top-right");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						if (prediction(i,j,"right",color)) {
							convey(i,j,z,w,"right");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						if (prediction(i,j,"bottom-right",color)) {
							convey(i,j,z,w,"bottom-right");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						if (prediction(i,j,"bottom",color)) {
							convey(i,j,z,w,"bottom");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						z++;
						break;
					case 5:
						var w = 0;
						if (prediction(i,j,"right",color)) {
							convey(i,j,z,w,"right");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						if (prediction(i,j,"bottom-right",color)) {
							convey(i,j,z,w,"bottom-right");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						if (prediction(i,j,"bottom",color)) {
							convey(i,j,z,w,"bottom");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						if (prediction(i,j,"bottom-left",color)) {
							convey(i,j,z,w,"bottom-left");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						if (prediction(i,j,"left",color)) {
							convey(i,j,z,w,"left");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						if (prediction(i,j,"top-left",color)) {
							convey(i,j,z,w,"top-left");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						if (prediction(i,j,"top",color)) {
							convey(i,j,z,w,"top");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						if (prediction(i,j,"top-right",color)) {
							convey(i,j,z,w,"top-right");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						z++;
						break;
					case 6:
						var w = 0;
						if (prediction(i,j,"top",color)) {
							convey(i,j,z,w,"top");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						if (prediction(i,j,"top-left",color)) {
							convey(i,j,z,w,"top-left");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						if (prediction(i,j,"left",color)) {
							convey(i,j,z,w,"left");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						if (prediction(i,j,"bottom-left",color)) {
							convey(i,j,z,w,"bottom-left");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						if (prediction(i,j,"bottom",color)) {
							convey(i,j,z,w,"bottom");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						z++;
						break;
					case 7:
						var w = 0;
						if (prediction(i,j,"right",color)) {
							convey(i,j,z,w,"right");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						if (prediction(i,j,"top-right",color)) {
							convey(i,j,z,w,"top-right");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						if (prediction(i,j,"top",color)) {
							convey(i,j,z,w,"top");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						z++;
						break;
					case 8:
						var w = 0;
						if (prediction(i,j,"left",color)) {
							convey(i,j,z,w,"left");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						if (prediction(i,j,"top-left",color)) {
							convey(i,j,z,w,"top-left");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						if (prediction(i,j,"top",color)) {
							convey(i,j,z,w,"top");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						if (prediction(i,j,"top-right",color)) {
							convey(i,j,z,w,"top-right");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						if (prediction(i,j,"right",color)) {
							convey(i,j,z,w,"right");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						z++;
						break;
					case 9:
						var w = 0;
						if (prediction(i,j,"left",color)) {
							convey(i,j,z,w,"left");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						if (prediction(i,j,"top-left",color)) {
							convey(i,j,z,w,"top-left");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						if (prediction(i,j,"top",color)) {
							convey(i,j,z,w,"top");
							possibleBlock(ctx,i * 64 + 34,j * 64 + 34);
							w++;
						}
						z++;
						break;
				}
			}
		}
	}
}

function judgeWinner(){
	if (window.blackSum > window.whiteSum) {return 4;}
	else if (window.blackSum < window.whiteSum) {return 5;}
	else if (window.blackSum == window.whiteSum) {return 3;}
}

function min(a,b){
	if (a > b) {
		return b;
	}
	else{
		return a;
	}
}

function isEmpty(){
	for (var i = 0; i < window.possiblePoint.length; i++) {
		if (window.possiblePoint[i] != null && (window.possiblePoint)) {return false;}
	}
	return true;
}

function exchangeSum(former,latter){
	if (former == -1 && latter == 1) {
		window.blackSum++;
		window.whiteSum--;
	}
	else if (former == 1 && latter == -1) {
		window.whiteSum++;
		window.blackSum--;
	}
}

function switchPart(i,j){
	if (i <= 1 && j <= 1) {return 1}
	if (i >= 2 && i <=5 && j <= 1) {return 2}
	if (i >= 6 && j <= 1) {return 3}
	if (i <= 1 && j >= 2 && j <= 5) {return 4}
	if (i >= 2 && i <= 5 && j >=2 && j <=5) {return 5}
	if (i >= 6 && j >= 2 && j <=5) {return 6}
	if (i <= 1 && j >= 6) {return 7}
	if (i >= 2 && i <= 5 && j >=6) {return 8}
	if (i >= 6 && j >= 6) {return 9}
}

function prediction(x,y,direction,color){
	switch(direction){
		case "top":
			if (window.matrix[x][y - 1] == -color) {
				for (var m = 2; m <= y && window.matrix[x][y - m + 1] == -color ; m++) {
					if (window.matrix[x][y - m] == color) {return true}
				}
			}
			return false;
		case "bottom":
			if (window.matrix[x][y + 1] == -color) {
				for (var m = 2; m < 8 - y && window.matrix[x][y + m - 1] == -color ; m++) {
					if (window.matrix[x][y + m] == color) {return true}
				}
			}
			return false;
		case "left":
			if (window.matrix[x - 1][y] == -color) {
				for (var m = 2; m <= x && window.matrix[x - m + 1][y] == -color ; m++) {
					if (window.matrix[x - m][y] == color) {return true}
				}
			}
			return false;
		case "right":
			if (window.matrix[x + 1][y] == -color) {
				for (var m = 2; m < 8 - x && window.matrix[x + m - 1][y] == -color ; m++) {
					if (window.matrix[x + m][y] == color) {return true}
				}
			}
			return false;
		case "top-left":
			if (window.matrix[x - 1][y - 1] == -color) {
				for (var m = 2; m <= min(x,y) && window.matrix[x - m + 1][y - m + 1] == -color ; m++) {
					if (window.matrix[x - m][y - m] == color) {return true}
				}
			}
			return false;
		case "top-right":
			if (window.matrix[x + 1][y - 1] == -color) {
				for (var m = 2; m <= min(7 - x,y) && window.matrix[x + m - 1][y - m + 1] == -color ; m++) {
					if (window.matrix[x + m][y - m] == color) {return true}
				}
			}
			return false;
		case "bottom-left":
			if (window.matrix[x - 1][y + 1] == -color) {
				for (var m = 2; m <= min(x, 7 - y) && window.matrix[x - m + 1][y + m - 1] == -color ; m++) {
					if (window.matrix[x - m][y + m] == color) {return true}
				}
			}
			return false;
		case "bottom-right":
			if (window.matrix[x + 1][y + 1] == -color) {
				for (var m = 2; m < min(8 - x, 8 - y) && window.matrix[x + m - 1][y + m - 1] == -color ; m++) {
					if (window.matrix[x + m][y + m] == color) {return true}
				}
			}
			return false;
	}
}

function convey(i,j,z,w,direction){
	window.possiblePoint[z] = new Object();
	window.possiblePoint[z].x = i;
	window.possiblePoint[z].y = j;
	if (window.possibleDirection[z] == null) {
		window.possibleDirection[z] = new Array();
	}
	window.possibleDirection[z][w] = direction;
}

function randomize(max){
	return Math.floor(Math.random()*(max + 1))
}
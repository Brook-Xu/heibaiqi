function initChessboard(ctx){
	ctx.save();
	ctx.fillStyle = "#1d8b1d";
	ctx.fillRect(0,0,516,516);

	var lineInPicture = document.getElementById("lineInBackground");
	var lineOutPicture = document.getElementById("lineOutBackground");
	var lineIn = ctx.createPattern(lineInPicture,"repeat");
	var lineOut = ctx.createPattern(lineOutPicture,"repeat");

	for (var i = 1; i <=7; i++) {
		drawChessboard(ctx,i*64+2,0,i*64+2,516,lineIn);
		drawChessboard(ctx,0,i*64+2,516,i*64+2,lineIn);
	}
	drawChessboard(ctx,2,0,2,516,lineOut);
	drawChessboard(ctx,0,2,516,2,lineOut);
	drawChessboard(ctx,2,515,516,515,lineOut);
	drawChessboard(ctx,515,2,515,516,lineOut);

	ctx.save();

	drawChessPoint(ctx,226,290,1);
	drawChessPoint(ctx,290,226,1);
	drawChessPoint(ctx,226,226,-1);
	drawChessPoint(ctx,290,290,-1);

	possibleBlock(ctx,226,162);
	possibleBlock(ctx,162,226);
	possibleBlock(ctx,290,354);
	possibleBlock(ctx,354,290);
}

function drawChessboard(ctx,startX,startY,endX,endY,background){
	ctx.lineWidth = 4;
	ctx.strokeStyle = background;
	ctx.beginPath();
	ctx.moveTo(startX,startY);
	ctx.lineTo(endX,endY);
	ctx.closePath();
	ctx.stroke();
}

function drawChessPoint(ctx,pointX,pointY,color){
	var blackPoint = ctx.createRadialGradient(pointX-14,pointY-20,20,pointX+16,pointY+27,40);
	blackPoint.addColorStop(0,'rgb(250,250,250)');
	blackPoint.addColorStop(0.35,'rgb(100,100,100)');
	blackPoint.addColorStop(1,'rgb(28,28,28)');
	var whitePoint = ctx.createRadialGradient(pointX-14,pointY-20,20,pointX+16,pointY+27,40);
	whitePoint.addColorStop(0,'rgb(255,250,250)');
	whitePoint.addColorStop(0.35,'rgb(245,240,240)');
	whitePoint.addColorStop(1,'rgb(223,218,218)');
	
	ctx.beginPath();
	ctx.arc(pointX,pointY,27,0,2*Math.PI,true);
	if (color == 1) {
		ctx.fillStyle = blackPoint;
	}
	else if(color == -1){
		ctx.fillStyle = whitePoint;
	}
	ctx.fill();
}

function possibleBlock(ctx,pointX,pointY){
	ctx.beginPath();
	ctx.strokeStyle = "#40e0d0";
	ctx.lineWidth = 2;
	ctx.arc(pointX,pointY,16,0,2*Math.PI,true);
	ctx.stroke();
}

function change(ctx,endColor,pointX,pointY){
	var blackPoint = ctx.createRadialGradient(pointX-14,pointY-20,20,pointX+16,pointY+27,40);
	blackPoint.addColorStop(0,'rgb(245,245,245)');
	blackPoint.addColorStop(0.35,'rgb(100,100,100)');
	blackPoint.addColorStop(1,'rgb(28,28,28)');
	var whitePoint = ctx.createRadialGradient(pointX-14,pointY-20,20,pointX+16,pointY+27,40);
	whitePoint.addColorStop(0,'rgb(255,250,250)');
	whitePoint.addColorStop(1,'rgb(225,220,220)');
	var lineOutPicture = document.getElementById("lineOutBackground");
	var lineOut = ctx.createPattern(lineOutPicture,"repeat");

	ctx.fillStyle = "#1d8b1d";
	ctx.fillRect(pointX-30,pointY-30,60,60);
	ctx.beginPath();
	if (endColor == 1) {ctx.fillStyle = blackPoint;}
	else if (endColor == -1) {ctx.fillStyle = whitePoint;}
	ctx.arc(pointX,pointY,27,0,2*Math.PI,true);
	ctx.fill();
}

function clear(ctx,pointX,pointY){
	ctx.clearRect(pointX*64+4,pointY*64+4,60,60);
	ctx.fillStyle = "#1d8b1d";
	ctx.fillRect(pointX*64+4,pointY*64+4,60,60);
}
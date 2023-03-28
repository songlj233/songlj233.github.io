//五子棋
var me=true;
var over=false;
var chessBoard=[];
var wins =[];
var count=0;
var myWin=[],tempmyWin=[];
var computerWin=[],tempcomputerWin=[];
var huiqiTime=0;	
var lastmex=-1,lastmey=-1;
var lastcmputerx=-1,lastcomputery=-1;

function init(){
	var chess = document.getElementById("chess");
	var context = chess.getContext('2d');
	drawBoard();
	dataInit();

	chess.onclick=function(e){
		play(e);
	}//end of chess.onclick
	
	var restart = document.getElementById("restart");
	restart.onclick=function(){
		me=true;
		over=false;
		drawBoard();
		dataInit();
	}
	
	var huiqiBtn = document.getElementById("huiqi");
	var timer = document.getElementById("timer");
	huiqiBtn.onclick=function(){
		huiqi();		
	}
}	

//玩
function play(e){
	if(over)return;
	if(!me)return;
	var x=e.offsetX;
	var y=e.offsetY;
	var i=Math.floor(x/30);
	var j=Math.floor(y/30);
	if(chessBoard[i][j]!=0)return;
	oneStep(i,j);
	
	for(var k=0;k<count;k++){
		tempcomputerWin[k] = computerWin[k];
		tempmyWin[k] = myWin[k];
		if(wins[i][j][k]){
			myWin[k]++;
			computerWin[k]+=5;
			if(myWin[k]==5){
				if(window.confirm("you win!再来一局?")){
					me=true;
					drawBoard();
					dataInit();
					return;
				}else{
					over=true;
					return;
				}
			}
		}
	}
	if(!over){
		me=!me;
		computerAI();
	}
}

function huiqi(){
	if(huiqiTime>0 && lastmex!=-1){
		timer.innerHTML=--huiqiTime;
		//画面清除人下的棋子
		var chess = document.getElementById("chess");
		var context = chess.getContext('2d');
		context.beginPath();
		context.clearRect(lastmex*30,lastmey*30,30,30);
		context.closePath();
		context.moveTo(lastmex*30<15?15:lastmex*30, lastmey*30+15);
		context.lineTo(lastmex*30+30>435?435:lastmex*30+30, lastmey*30+15);
		context.moveTo(lastmex*30+15, lastmey*30<15?15:lastmey*30);
		context.lineTo(lastmex*30+15, lastmey*30+30>435?435:lastmey*30+30);
		context.stroke();
		//画面清楚电脑下的棋子
		context.beginPath();
		context.clearRect(lastcomputerx*30,lastcomputery*30,30,30);
		context.closePath();
		context.moveTo(lastcomputerx*30<15?15:lastcomputerx*30, lastcomputery*30+15);
		context.lineTo(lastcomputerx*30+30>435?435:lastcomputerx*30+30, lastcomputery*30+15);
		context.moveTo(lastcomputerx*30+15, lastcomputery*30<15?15:lastcomputery*30);
		context.lineTo(lastcomputerx*30+15, lastcomputery*30+30>435?435:lastcomputery*30+30);
		context.stroke();
		//撤销数据
		chessBoard[lastmex][lastmey]=0;
		chessBoard[lastcomputerx][lastcomputery]=0;
		
		for(var k=0;k<count;k++){
			computerWin[k] = tempcomputerWin[k];
			myWin[k] = tempmyWin[k];
		}
		var pointSign = document.getElementById("pointSign");
		pointSign.style.display="none";
	}
}

//下一步棋子
function oneStep(i,j){
	var chess = document.getElementById("chess");
	var context = chess.getContext('2d');
	context.beginPath();
	context.arc(i*30+15,j*30+15,12,0,Math.PI*2);
	context.closePath();
	if(me){
		context.fillStyle="#444";
		chessBoard[i][j]=1;
		lastmex=i;
		lastmey=j;
	}else{
		context.fillStyle="#aaa";
		chessBoard[i][j]=2;
		lastcomputerx=i;
		lastcomputery=j;
		makeSign(i,j);
	}	
	context.fill();	
}

//改变红点标记位置
function makeSign(i,j){
	var pointSign = document.getElementById("pointSign");
	var allWidth = document.body.offsetWidth;
	pointSign.style.marginLeft=(allWidth-450)/2+i*30+11+"px";
	pointSign.style.marginTop=41+j*30+"px";
	pointSign.style.display="block";
}


function dataInit(){
	lastmex=lastmey=-1;
	lastcmputerx=lastcomputery=-1;
	huiqiTime=3;
	var timer = document.getElementById("timer");
	timer.innerHTML=3;
	count=0;
	for(var i=0;i<15;i++){
		chessBoard[i]=[];
		for(var j=0;j<15;j++){
			chessBoard[i][j]=0;
		}
	}
	
	//赢法数组
	for(var i=0;i<15;i++){
		wins[i]=[];
		for(var j=0;j<15;j++){
			wins[i][j]=[];
		}
	}
	//横
	for(var i=0;i<15;i++){
		for(var j=0;j<11;j++){
			for(var k=0;k<5;k++){
				wins[i][j+k][count]=true;
			}
			count++;
		}
	}
	//竖
	for(var i=0;i<15;i++){
		for(var j=0;j<11;j++){
			for(var k=0;k<5;k++){
				wins[j+k][i][count]=true;
			}
			count++;
		}
	}
	//斜
	for(var i=0;i<11;i++){
		for(var j=0;j<11;j++){
			for(var k=0;k<5;k++){
				wins[i+k][j+k][count]=true;
			}
			count++;
		}
	}
	//反斜
	for(var i=0;i<11;i++){
		for(var j=14;j>3;j--){
			for(var k=0;k<5;k++){
				wins[i+k][j-k][count]=true;
			}
			count++;
		}
	}

	//赢法统计数组
	for(var i=0;i<count;i++){
		myWin[i]=0;
		computerWin[i]=0;
	}	
}


function drawBoard(){
	var chess = document.getElementById("chess");
	var context = chess.getContext('2d');
	//清楚原有的图片
	context.beginPath();
	context.clearRect(0,0,450,450);
	context.closePath();
	
	context.strokeStyle = '#666';
	//画棋盘
	for(var i=0;i<15;i++){
		context.moveTo(15+i*30,15);
		context.lineTo(15+i*30,435);
		context.moveTo(15,15+i*30);
		context.lineTo(435,15+i*30);
	}
	context.stroke();
	
	//画中心点
	context.fillStyle="#444";
	context.beginPath();
	context.arc(7*30+15,7*30+15,4,0,Math.PI*2);
	context.closePath();
	context.fill();
	context.beginPath();
	context.arc(2*30+15,2*30+15,3,0,Math.PI*2);
	context.closePath();
	context.fill();
	context.beginPath();
	context.arc(2*30+15,12*30+15,3,0,Math.PI*2);
	context.closePath();
	context.fill();
	context.beginPath();
	context.arc(12*30+15,2*30+15,3,0,Math.PI*2);
	context.closePath();
	context.fill();
	context.beginPath();
	context.arc(12*30+15,12*30+15,3,0,Math.PI*2);
	context.closePath();		
	context.fill();	
	
	//清除红点标记
	var pointSign = document.getElementById("pointSign");
	pointSign.style.display="none";
}

//计算机下棋
function computerAI(){
	var myScore=[];
	var computerScore=[];
	var max=0;
	var x=0;
	var y=0;
	for(var i=0;i<15;i++){
		myScore[i]=[];
		computerScore[i]=[];
		for(var j=0;j<15;j++){
			myScore[i][j]=0;
			computerScore[i][j]=0;
		}
	}
	for(var i=0;i<15;i++){
		for(var j=0;j<15;j++){
			if(chessBoard[i][j]==0){
				//计算最高得分
				for(var k=0;k<count;k++){
					if(wins[i][j][k]){
						if(myWin[k] == 1){
							myScore[i][j]+=20*randNum();
						}else if(myWin[k] == 2){
							myScore[i][j]+=40*randNum();
						}else if(myWin[k] == 3){
							myScore[i][j]+=200*randNum();
						}else if(myWin[k] == 4){
							myScore[i][j]+=2000*randNum();
						}
						if(computerWin[k] == 1){
							computerScore[i][j]+=18*randNum();
						}else if(computerWin[k] == 2){
							computerScore[i][j]+=32*randNum();
						}else if(computerWin[k] == 3){
							computerScore[i][j]+=180*randNum();
						}else if(computerWin[k] == 4){
							computerScore[i][j]+=1800*randNum();
						}
					}
				}//end of k-loop
				
				//判断最高得分
				if(myScore[i][j] > max){
					max = myScore[i][j];
					x=i;
					y=j;
				}else if(myScore[i][j] == max){
					if(computerScore[i][j] > computerScore[x][y]){
						x=i;
						y=j;
					}
				}
				
				if(computerScore[i][j] > max){
					max = computerScore[i][j];
					x=i;
					y=j;
				}else if(computerScore[i][j] == max){
					if(myScore[i][j] > myScore[x][y]){
						x=i;
						y=j;
					}
				}
			}
		}
	}
	oneStep(x,y);
	me=!me;
	for(var k=0;k<count;k++){
		if(wins[x][y][k]){
			computerWin[k]++;
			myWin[k]+=5;
			if(computerWin[k]==5){
				if(window.confirm("computer win!再来一局?")){
					me=true;
					drawBoard();
					dataInit();
					return;
				}else{
					over=true;
					return;
				}
			}
		}
	}
}


function randNum(){
	return Math.random()+1;
}

window.onload = function(){
	init();
};


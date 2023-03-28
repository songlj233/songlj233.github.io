var debug = false;
var num=[],mynum=[],ans=[];
var tempi,tempj,lasti=-1,lastj=-1;
var gameCanvas,context;
var count;
var n=[1,2,3,4,5,6,7,8,9];
var music_switch_flag=0;
var degree_index=1,guanka_index=1;//默认难度为1的第1关，hard=1-3表示3种难度

function init(){
	gameCanvas = document.getElementById("gameCanvas");
	context = gameCanvas.getContext('2d');
	draw();
	initArray();
	dateInit();
	display9num();
	gameCanvas.onclick=function(e){
		play(e);
	}
	settingBtn = document.getElementById("settingBtn");
	settingBtn.onclick=function(e){
		showSetPanel();
	}
	show_rank = document.getElementById("show_rank");
	show_rank.onclick=function(e){
		showRankPanel();
	}
}

function play(e){
	var x=e.offsetX;
	var y=e.offsetY;
	var i=Math.floor(x/50);
	var j=Math.floor(y/50);
	context.save();
	//清楚原有的背景颜色
	context.fillStyle="#fff";//#fff是白色
	context.fillRect(0,0,450,450);
	tempi=i;tempj=j;
	
	//如果点击的是同一地方，且为mynum，则擦除该数
	if(lasti==i && lastj==j && num[i][j]==0 && mynum[i][j]!=0){
		context.fillStyle="#fff";
		mynum[i][j]=0;
		context.fillRect(50*i+1,50*j+1,48,48);
	}
	
	//如果不是数字，则背景颜色是绿色
	else if(num[i][j]==0 && mynum[i][j]==0){		
		context.fillStyle="#0f0";
		context.fillRect(50*i+1,50*j+1,48,48);			
	}
	//如果是数字，则该数字显示红色，其他相同数字显示黄色
	else{
		var clickNum=num[i][j]+mynum[i][j];
		context.fillStyle="#f00";
		context.fillRect(50*i+1,50*j+1,48,48);
		for(var ii=0;ii<9;ii++){
			for(var jj=0;jj<9;jj++){
				if ( (clickNum==num[ii][jj] || clickNum==mynum[ii][jj]) && !(i==ii && j==jj) ){
					context.fillStyle="#ff0";
					context.fillRect(50*ii+1,50*jj+1,48,48);
				}
			}
		}
	}
	lasti=i;lastj=j;
	context.restore();
	draw();
	dateInit();
	//addDate();
	showMyNum();
}

function draw(){
	gameCanvas = document.getElementById("gameCanvas");
	context = gameCanvas.getContext('2d');
	context.beginPath();
	context.strokeStyle = '#666';
	//画粗线条
	context.lineWidth='4';
	for(var i=0;i<4;i++){
		context.moveTo(i*150,0);
		context.lineTo(i*150,450);
		context.moveTo(0,i*150);
		context.lineTo(450,i*150);
	}
	context.stroke();
	//画细线条
	context.lineWidth='2';
	for(var i=0;i<3;i++){
		context.moveTo(i*150+50,0);
		context.lineTo(i*150+50,450);
		context.moveTo(i*150+100,0);
		context.lineTo(i*150+100,450);
		context.moveTo(0,i*150+50);
		context.lineTo(450,i*150+50);
		context.moveTo(0,i*150+100);
		context.lineTo(450,i*150+100);
	}
	context.stroke();	
}

function dateInit(){	
	//设定关卡
	level(degree_index,guanka_index);
	context.font="900 30px Verdana";
	for(var i=0;i<9;i++){
		for(var j=0;j<9;j++){
			if (0!=num[i][j]){
				context.fillText(num[i][j]+"", 15+i*50, 35+j*50);
			}
		}
	}
}

function initArray(){
	for(var i=0;i<9;i++){
		num[i]=[];
		mynum[i]=[];
		ans[i]=[];
		for(var j=0;j<9;j++){
			num[i][j]=0;
			mynum[i][j]=0;
			ans[i][j]=0;
		}
	}
}

function display9num(){
	numCanvas = document.getElementById("numCanvas");
	context2 = numCanvas.getContext('2d');
	context2.strokeStyle = '#666';
	//画竖线
	context.lineWidth='4';
	for(var i=0;i<=9;i++){
		context2.moveTo(i*50,0);
		context2.lineTo(i*50,50);
	}	
	//画横线
	for(var i=0;i<=1;i++){
		context2.moveTo(0,i*50);
		context2.lineTo(450,i*50);
	}
	context2.stroke();
	//显示数字
	context2.font="bold 28px 微软雅黑";
	for(var i=0;i<9;i++){
		context2.fillText(n[i]+"", 15+i*50, 35);
	}
	numCanvas.onclick=function(e){
		add9num(e);
	}
}

function add9num(e){
	var x=e.offsetX;
	var i=Math.floor(x/50);
	//如果是给玩家填的数
	if(num[tempi][tempj]==0){
		if(mynum[tempi][tempj]==0){
			context.font="100 28px Verdana";	
			context.fillText(n[i]+"", 15+tempi*50, 35+tempj*50);
			mynum[tempi][tempj]=n[i];	
			//改背景颜色
			context.save();
			context.fillStyle="#f00";
			context.fillRect(50*tempi+1,50*tempj+1,48,48);
			for(var ii=0;ii<9;ii++){
				for(var jj=0;jj<9;jj++){
					if ( (n[i]==num[ii][jj] || n[i]==mynum[ii][jj]) && !(tempi==ii && tempj==jj) ){
						context.fillStyle="#ff0";
						context.fillRect(50*ii+1,50*jj+1,48,48);
					}
				}
			}
			context.restore();
			dateInit();
			showMyNum();
			if(debug || isWin()){
				alert("win");
				restart();
			}
		}
	}
}

function isWin(){
	for(var i=0;i<9;i++){
		for(var j=0;j<9;j++){
			if(mynum[i][j] != ans[i][j])
				return false;
		}
	}
	return true;
}

function showMyNum(){
	context.save();
	context.font="100 28px Verdana";
	for(var i=0;i<9;i++){
		for(var j=0;j<9;j++){
			if (0!=mynum[i][j]){
				context.fillText(mynum[i][j]+"", 15+i*50, 35+j*50);
			}
		}
	}
	context.restore();	
}

function restart(){
	context.clearRect(0,0,450,450);
	draw();
	for(var i=0;i<9;i++){
		for(var j=0;j<9;j++){
			mynum[i][j] = 0;
		}
	}
	dateInit();
	playtime = 0;
}

window.onload = function(){
	init();
};


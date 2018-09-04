let LT = new LoadingText();
let imageSource = {
  ball: "resource/ball.png",
  cannon: "resource/cannon.png",
  leg: "resource/leg.png",
  player: "resource/player.png",
};
var images = {};

var playerX
let playerY;
var ballX, ballY;
var ballMoveX, ballMoveY;
let cannonX;
let groundY
var cannonRot;
var time;
var score;
var life;
var catchBall;
var isGameOver;

$(window).on('load', function() {
  $(window).trigger('resize');
  loadGraph();

  LT.LoadingStart(function() {
    for(let name in imageSource) {
      if(images[name] == null) {
        return false;
      }
    }
    return true;
  });
});

$(window).on('resize', function() {
    let canvas = document.getElementById('game');
    canvas.width = $('#game').width();
    canvas.height = $('#game').height();
});

function loadGraph() {
  for(let name in imageSource) {
    let image = new Image();
    image.src = imageSource[name];
    image.onload = function() {
      images[name] = image;
    }
  }
}

function mainStart() {
  switch(getDevice()) {
    case "phone":
    $('#game').on('touchmove', function(event) {
      event.preventDefault();
      // 座標の取得
      let width = $('#game').width();
      let scale = 650/width;
      let touchX = event.touches[0].pageX - $(event.target).offset().left;
      playerX = (touchX-30)*scale;
    });
    break;
    case "pc":
    $('#game').on('mousemove', function(event) {
      event.preventDefault();
      // 座標の取得
      let width = $('#game').width();
      let scale = 650/width;
      let touchX = event.originalEvent.clientX - $(event.target).offset().left;
      playerX = (touchX-30)*scale;
    });
    break;
  }

  cannonX =600;
  groundY = 400;
  cannonRot = Math.PI/4;
  playerX = 100;
  playerY = groundY - 60;
  ballX = cannonX;
  ballY = groundY-20;
  time = 0;
  score = 0;
  life = 3;
  catchBall = false;
  isGameOver = false;

  main();
}

function main() {
  requestAnimationFrame(main);
  if(!isGameOver) {
    moveGame();
    drawGame();
  }else {
    endGame();
  }
}

function moveGame() {
  if (playerX < -10) {
    playerX = -10;
  }
  if (playerX > 420) {
    playerX = 420;
  }

	time += 1;
  if (time < 20 && catchBall) {
    ballX = playerX + 28;
    ballY = playerY + 12;
  }
  if (time == 20) {
    cannonRot = getRand(75, 30) * Math.PI / 180;
    ballX = cannonX;
    ballY = groundY-20;
    ballMoveX = Math.cos(cannonRot) * -24;
    ballMoveY = Math.sin(cannonRot) * -24;
  }
  if (time >= 61) {
    ballX += ballMoveX;
    ballY += ballMoveY;
    ballMoveY += 1;
    if (ballY >= groundY) {
      ballY = groundY;
      ballMoveY = Math.sin(cannonRot) * -24;
    }
    if (ballX < -20) {
      catchBall = 0;
      life -= 1;
      time = 0;
      if (life == 0){
        isGameOver = true;

        var text = "クソゲーノックキャノンで"+score+"点を出しました！";
        var widget = $("#twitter-widget-0");
        var src = widget.attr("src");
        var url = src.replace(/\&text=.*\&/, "&text=" + text + "&");
        console.log(src);
        console.log(url);
        widget.attr({src: url});
        $('.tweet-wrapper').html("").append(widget);
        $('.tweet-wrapper').css('display', 'block');
      }
    }
    if (ballX >= playerX + 16 && ballX <= playerX + 40 && ballY >= playerY && ballY <= playerY+24) {
      catchBall = 1;
      score += 10;
      time = 0;
    }
  }
}

function drawGame() {
  let canvas = document.getElementById('game');
  let ctx = canvas.getContext('2d');
  let width = canvas.width;
  let height = canvas.height;
  let scale = width/650;

  ctx.fillStyle = "#96ffff";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#32be46";
  ctx.fillRect(0, groundY*scale, width, height);

  ctx.drawImage(images["player"], playerX*scale, playerY*scale, 40*scale,  64*scale);

  ctx.save();
  ctx.translate(ballX*scale, ballY*scale);
  ctx.rotate(cannonRot);
  ctx.drawImage(images["ball"], -12*scale, -12*scale, 24*scale,  24*scale);
  ctx.restore();

  ctx.save();
  ctx.translate((cannonX)*scale, (groundY-20)*scale);
  ctx.rotate(cannonRot);
  ctx.drawImage(images["cannon"], -32*scale, -16*scale, 48*scale,  32*scale);
  ctx.restore();

  ctx.drawImage(images["leg"], (cannonX-24)*scale, (groundY-28)*scale, 48*scale,  32*scale);

  for (var i=0; i<life; i++){
    ctx.drawImage(images["ball"], width+(-60-30*i)*scale, 0, 30*scale,  30*scale);
  }
}

function endGame() {
  let canvas = document.getElementById('game');
  let ctx = canvas.getContext('2d');
  let width = canvas.width;
  let height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  let fontSize = width/15;
  ctx.font =  fontSize+"px 'ＭＳ ゴシック'";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("ざーんねん", width*3.3/10, height/2);
  let scoreLength = score.toString().length;
  ctx.fillText(score, width/2-fontSize*scoreLength/4, height/2+fontSize);
}

function getDevice() {
  var device = ["iPhone", "iPad", "iPod", "Android"];
  for(var i=0; i<device.length; i++){
    if (navigator.userAgent.indexOf(device[i])>0){
      return "phone";
    }
  }
  return "pc";
}

function getRand(max, min){
  var rand = Math.floor( Math.random() * (max + 1 - min) ) + min ;
  return rand;
}

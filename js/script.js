//start game
var hard = document.getElementById("hard");
var medium = document.getElementById("medium");
var easy = document.getElementById("easy");





const can = document.getElementById("breakout");
const ctx = can.getContext("2d");
ctx.lineWidth = 0;


var reseted = true;

var life = LIFE;

var gameOver = false;

var gameWon = false;

var level = 1;

var score = 0;

var mouseX;

var scoreGain;

var powerUp = false;


var paddle = {
    x: can.width/2 - PADDLE_WIDTH/2,
    y: can.height - PADDLE_HEIGHT - PADDLE_BOT_MARGIN,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    speed: PADDLE_SPEED
}

var heartCor = [Math.random() * (can.width-30), paddle.y - Math.random() * 300];

var ball = {
    x: paddle.x + paddle.width/2,
    y: paddle.y - BALL_RADIUS,
    radius: BALL_RADIUS,
    speed: BALL_SPEED,
    dx: BALL_VX,
    dy: BALL_VY
}


var brick = {
    row: 1,
    collumn: BRICK_COLUMNS  ,
    margTop: BRICK_MARG_TOP,
    margLeft: BRICK_MARG_LEFT,
    width: BRICK_WIDTH,
    height: BRICK_HEIGHT,
    color: BRICK_COLOR,
    x: BRICK_X,
    y: BRICK_Y,
    score: 10
}

hard.addEventListener("click", function(){
    document.getElementById("load").setAttribute('class', 'hide');
    ball.speed *= 1.4;
    ball.dx *= 1.4;
    ball.dy *= 1.4;
    paddle.width *= 0.8;
    paddle.speed *= 1.4;
    brick.score = 20;
    scoreGain = 20;
    createBricks();
    loop();
})
medium.addEventListener("click", function(){
    document.getElementById("load").setAttribute('class', 'hide');
    brick.score = 15;
    scoreGain = 15;
    createBricks();
    loop();
})
easy.addEventListener("click", function(){
    document.getElementById("load").setAttribute('class', 'hide');
    ball.speed *= 0.7;
    ball.dx *= 0.7;
    ball.dy *= 0.7;
    paddle.width *= 1.3;
    scoreGain = 10;
    createBricks();
    loop();
})


var bricks = [];

function loop(){

    ctx.drawImage(BG_IMG, 0, 0, width = can.width, height = can.height);

    update()
    
    draw();

    if (!gameOver){
        if (!reseted){
            requestAnimationFrame(loop)
        }
        else{
            reseted = false;
            setTimeout(loop, 1000)
        }
    }
    else{
        gameIsOver();
    }
}


function draw(){

    drawBricks();

    drawBall();

    drawPaddle();

    drawStats();
    
    if (powerUp){
        ctx.drawImage(LIFE_IMG, heartCor[0], heartCor[1], width = 30, height = 30);
    }


}

function update(){
    movePaddle();
    moveBall();
    wallCollision();
    paddleColision();
    brickColision();
}

function drawPaddle(){
    ctx.fillStyle = 'black';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    ctx.strokeStyle = "blue";
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall(){
    ctx.beginPath();

    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = "yellow";
    ctx.fill()
    ctx.strokeStyle = 'red';
    ctx.stroke();

    ctx.closePath();
}

function createBricks(){
    bricks = [] // delete old bricks
    if (brick.row == 4){
        powerUp = true;
        setTimeout(function(){powerUp = false}, 15000);
    }
    for (let i = 0; i < brick.row; i++){
        for (let j = 0; j < brick.collumn; j++){
            let brickobj = {x: brick.x, y: brick.y, status: true, color: brick.color[i]};
            bricks.push(brickobj);
            brick.x += brick.width+brick.margLeft;
        }
        brick.x = BRICK_X;
        brick.y += brick.height+brick.margTop;
    }
    brick.y = BRICK_Y;
    brick.remain = bricks.length;
}

function drawBricks(){
    if (brick.remain == 0){
        if (brick.row == BRICK_ROW_WIN){
            gameOver = true;
            gameWon = true;
        }
        else{
            brick.row += 1;
            level += 1;
            brick.score += 5;
            reset();
            createBricks();
        }
    }
    for (let i = 0; i < bricks.length; i++){
        let b = bricks[i];
        if (b.status){
            ctx.fillStyle = b.color;
            ctx.fillRect(b.x, b.y, brick.width, brick.height);

            ctx.strokeStyle = "black";
            ctx.strokeRect(b.x, b.y, brick.width, brick.height);
        }
    }
}
function drawStats(){

    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 40, can.width, 2);
    ctx.closePath();

    ctx.fillStyle = "red";
    ctx.font = '25px one';
    ctx.fillText(score, 40, 23);
    ctx.fillText(level, can.width/2, 23);
    ctx.fillText(life, can.width-30, 23);
    
    ctx.drawImage(SCORE_IMG, 10, 3, width = 25, height = 25);
    ctx.drawImage(LEVEL_IMG, can.width/2-30, 3, width = 25, height = 25);
    ctx.drawImage(LIFE_IMG, can.width-55, 3, width = 25, height = 25);
}

var moveLeft = false;
var moveRight = false

document.addEventListener("mousemove", function(event){
    mouseX = event.clientX;
})
document.addEventListener("keydown", function(event){
    if (event.key == 'ArrowLeft'){
        moveLeft = true;
    }
    else if (event.key == 'ArrowRight'){
        moveRight = true;
    }
})

document.addEventListener("keyup", function(event){
    if (event.key == 'ArrowLeft'){
        moveLeft = false;
    }
    else if (event.key == 'ArrowRight'){
        moveRight = false;
    }
})

function movePaddle(){
    if (moveLeft && paddle.x > 0){
        paddle.x -= paddle.speed;
        mouseX = 0;
    }
    else if (moveRight && paddle.x + paddle.width < can.width){
        paddle.x += paddle.speed; 
        mouseX = 0; 
    }
    else {
        if (mouseX > 8 && mouseX < can.width+8){
            if (mouseX < paddle.width/2 + paddle.x){
                if (paddle.x + paddle.width/2 - mouseX <= paddle.speed){ //without this condition paddle will vibrate because
                    if (mouseX-paddle.width/2>=0){
                        paddle.x = mouseX-paddle.width/2                 // because  mouseX - can.width isn't evenly devided on paddle.speed
                    }
                }
                else{
                    if (paddle.x - paddle.speed >= 0){
                        paddle.x -= paddle.speed;
                    }
                }
            }
            else{
                if (mouseX - paddle.x-paddle.width/2 <= paddle.speed){
                    if (mouseX-paddle.x > paddle.width){
                        paddle.x = mouseX-paddle.width/2
                    }
                }
                else {
                    if (mouseX-paddle.x > paddle.width){
                        paddle.x += paddle.speed;
                    }
                }
            }
        }
    }
    if (paddle.x < 0){
        paddle.x = 0;
    }
    else if(paddle.y > can.width - paddle.width){
        paddle.y = can.width-paddle.width;
    }

}
function moveBall(){
    ball.x += ball.dx;
    ball.y += ball.dy;
}

function wallCollision(){
    if (ball.x-ball.radius <= 0){
        ball.dx = -ball.dx;
        ball.x = ball.radius; //ball will stay inside borders
        WALL_HIT.play();
    }
    if (ball.x+ball.radius >= can.width){
        ball.dx = -ball.dx;
        ball.x = can.width - ball.radius; //ball will stay inside borders
        WALL_HIT.play();
    }
    if (ball.y <= 42+ball.radius){
        ball.dy = -ball.dy;
        ball.y = ball.radius+42; //ball will stay inside borders
        WALL_HIT.play()
    }
    if (ball.y > can.height){
        life --;
        if (life < 1){
            gameOver = true;
        }
        LIFE_LOST.play();
        reset();
    }
}

function paddleColision(){
    if (ball.x > paddle.x-ball.radius && ball.x < paddle.x+ball.radius+paddle.width){
        if(ball.y >= paddle.y-ball.radius && ball.y-ball.radius <= paddle.y){
            let x = ball.x - (paddle.x+paddle.width/2);
            let y = paddle.height/2+ball.radius;
            let alpha  =  Math.atan(x/y)+Math.PI/2;
            ball.dx = -ball.speed*Math.cos(alpha);
            ball.dy = -ball.speed*Math.sin(alpha);
            ball.y = paddle.y - ball.radius; // ball won't go into the paddle
            PADDLE_HIT.play();

        }
    }

}

function brickColision(){
    for (let i = 0; i < bricks.length; i++){
        let b = bricks[i];
        if (b.status){
            // hitting brick top
            if (checkCol(ball.y, ball.x, ball.radius, b.y, b.x, brick.width)){
                ball.dy = -ball.dy;
                b.status = false;
                brick.remain -= 1;
                score += brick.score;
                ball.y = b.y - ball.radius;
                BRICK_HIT.play();
            }
            
            //hitting brick bottom
            else if(checkCol(-ball.y, ball.x, ball.radius, -(b.y+brick.height), b.x, brick.width)){
                ball.dy = -ball.dy;
                b.status = false;
                brick.remain -= 1;
                score += brick.score;
                ball.y = b.y+ball.radius+brick.height;
                BRICK_HIT.play();
            }

            //hitting brick left side
            else if (checkCol(ball.x, ball.y, ball.radius, b.x, b.y, brick.height)){
                ball.dx = -ball.dx;
                b.status = false;
                brick.remain -= 1;
                score += brick.score;
                ball.x = b.x - ball.radius;
                BRICK_HIT.play();
            }

            //hitting brick right side
            else if (checkCol(-ball.x, ball.y, ball.radius, -(b.x+brick.width), b.y, brick.height)) {
                ball.dx = -ball.dx;
                b.status = false;
                brick.remain -= 1;
                score += brick.score;
                ball.x = b.x + ball.radius + brick.width;
                BRICK_HIT.play();
            }

            // hitting brick bottom right corner
            else if (checkCorner(ball.x, ball.y, b.x+brick.width, b.y + brick.height, ball.radius)){
                let colDir = Math.atan(Math.abs((ball.x - b.x)/(ball.y - b.y - brick.height)));
                let speedDir = Math.atan(Math.abs(ball.dx / ball.dy));
                let newSpeedDir = 2*colDir - speedDir;
                ball.dx = ball.speed * Math.sin(newSpeedDir);
                ball.dy = ball.speed * Math.cos(newSpeedDir);
                brick.remain -= 1;
                score += brick.score;
                b.status = false;  
                BRICK_HIT.play();
            }

            //hitting brick top right corner
            else if (checkCorner(ball.x, ball.y, b.x+brick.width, b.y, ball.radius)){
                let colDir = 1/Math.atan(Math.abs((ball.x - b.x - brick.width)/(ball.y - b.y)));
                let speedDir = 1/Math.atan(Math.abs(ball.dx / ball.dy));
                let newSpeedDir = Math.PI / 2 + (2*colDir - speedDir);
                ball.dx = ball.speed * Math.sin(newSpeedDir);
                ball.dy = ball.speed * Math.cos(newSpeedDir);
                brick.remain -= 1;
                score += brick.score;
                b.status = false;  
                BRICK_HIT.play();
            }


            //hitting brick bottom left corner
            else if (checkCorner(ball.x, ball.y, b.x+brick.width, b.y, ball.radius)){
                let colDir = 1/Math.atan(Math.abs((ball.x - b.x)/(ball.y - b.y)));
                let speedDir = 1/Math.atan(Math.abs(ball.dx / ball.dy));
                let newSpeedDir = Math.PI * 3 / 2 + (2*colDir - speedDir);
                ball.dx = ball.speed * Math.sin(newSpeedDir);
                ball.dy = ball.speed * Math.cos(newSpeedDir);
                brick.remain -= 1;
                score += brick.score;
                b.status = false;  
                BRICK_HIT.play();
            }

            //hitting brick top left corner
            else if (checkCorner(ball.x, ball.y, b.x, b.y, ball.radius)){
                let colDir = 1/Math.atan(Math.abs((ball.x - b.x)/(ball.y - b.y)));
                let speedDir = 1/Math.atan(Math.abs(ball.dx / ball.dy));
                let newSpeedDir = Math.PI*3 / 2 - (2*colDir - speedDir);
                ball.dx = ball.speed * Math.sin(newSpeedDir);
                ball.dy = ball.speed * Math.cos(newSpeedDir);
                brick.remain -= 1;
                score += brick.score;
                b.status = false;
                BRICK_HIT.play();  
            }

        }
    }
    // getting power up
    if (powerUp){
        if(checkCorner(ball.x, ball.y, heartCor[0]+15, heartCor[1]+15, ball.radius+15)){
            life += 1;
            powerUp = false;
        }
    }
}

// checking if ball colides with any side of brick
function checkCol(y, x, r, bY, bX, bParam){
    if (x >= bX && x <= bX + bParam){
        if(y+r > bY && y-r < bY){
            return true;
        }
    }
    else{
        return false;
    }
}

function checkCorner (bX, bY, cX, cY, r){
    let a2 = Math.pow(bX - cX, 2);
    let b2 = Math.pow(bY - cY, 2);
    let d = Math.sqrt(a2 + b2);
    if (d < r){
        return true;
    }
    else{
        return false;
    }
}

function reset(){
    paddle.x = can.width/2 - paddle.width/2;
    ball.x = paddle.x + paddle.width/2;
    ball.y = paddle.y - ball.radius-1;
    reseted = true;
    mouseX = 0;
    

}
var paddle = {
    x: can.width/2 - PADDLE_WIDTH/2,
    y: can.height - PADDLE_HEIGHT - PADDLE_BOT_MARGIN,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    speed: PADDLE_SPEED
}

var ball = {
    x: paddle.x + paddle.width/2,
    y: paddle.y - BALL_RADIUS,
    radius: BALL_RADIUS,
    speed: BALL_SPEED,
    dx: BALL_VX,
    dy: BALL_VY
}

function gameIsOver(){
    document.getElementById('score').innerHTML = 'Your Score: ' +score;
    document.getElementById('gameOver').setAttribute('class', 'show');
    if (gameWon){
        document.getElementById('win').setAttribute('class', 'show');
    }
    else{
        document.getElementById('lose').setAttribute('class', 'show');
    }
}


var again = document.getElementById('playAgain');
again.addEventListener('click', function(){
    score = 0;
    brick.score = scoreGain;
    life = 3;
    brick.row = 1;
    document.getElementById('lose').setAttribute('class', 'hide');
    document.getElementById('win').setAttribute('class', 'hide');
    document.getElementById('gameOver').setAttribute('class', 'hide');
    gameOver = false;
    level = 1;
    reset();
    createBricks();
    loop();
})
var change = document.getElementById('change');
change.addEventListener('click', function(){
    score = 0;
    life = 3;
    brick.row = 1;
    document.getElementById('lose').setAttribute('class', 'hide');
    document.getElementById('win').setAttribute('class', 'hide');
    document.getElementById('gameOver').setAttribute('class', 'hide');
    document.getElementById('load').setAttribute('class', 'show');
    level = 1;
    gameOver = false;
})



















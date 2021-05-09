// canvas params
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;
var canvas = document.getElementById("breakout");
canvas.setAttribute('width', CANVAS_WIDTH);
canvas.setAttribute('height', CANVAS_HEIGHT);

// lives
const LIFE = 3;


// paddle parameters
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 10;
const PADDLE_BOT_MARGIN = 20;
const PADDLE_SPEED = 10;



// ball parameters
const BALL_RADIUS = 10;
const BALL_SPEED = 10;


// initial vx vy velocity
var x = PADDLE_WIDTH/2+BALL_RADIUS;
var y = PADDLE_HEIGHT/2+BALL_RADIUS;
var rand_alpha = Math.random()*(Math.PI - 2*Math.atan(y/x)) + Math.atan(y/x);
const BALL_VX = Math.cos(rand_alpha)*BALL_SPEED;
const BALL_VY = -Math.sin(rand_alpha)*BALL_SPEED;

// brick params
const BRICK_WIDTH = 80;
const BRICK_MARG_TOP = 0;
const BRICK_MARG_LEFT = 0;
const BRICK_HEIGHT = 30;
const BRICK_X = BRICK_MARG_LEFT;
const BRICK_Y = 70;
const BRICK_COLOR = ['#ff0000', '#ff4000', '#ff8000', '#ffbf00', '#ffff00', '#bfff00', '#00ff80'];
const BRICK_COLUMNS = parseInt((CANVAS_WIDTH-BRICK_X)/(BRICK_WIDTH+BRICK_MARG_LEFT));
const BRICK_ROW_WIN = 5; //parseInt((CANVAS_HEIGHT-6*BRICK_HEIGHT-BRICK_MARG_TOP)/BRICK_HEIGHT);

// import images 
const BG_IMG = new Image();
BG_IMG.src = "./images/bg2.png";

const LEVEL_IMG = new Image();
LEVEL_IMG.src = "./images/level.png";

const LIFE_IMG = new Image();
LIFE_IMG.src = "./images/life.png";

const SCORE_IMG = new Image();
SCORE_IMG.src = "./images/score.png";

const GAME_OVER_IMG = new Image();
GAME_OVER_IMG.src = './images/gameover.png'


// sounds
const WALL_HIT = new Audio();
WALL_HIT.src = "./sounds/wall.mp3";

const LIFE_LOST = new Audio();
LIFE_LOST.src = "./sounds/life_lost.mp3";

const PADDLE_HIT = new Audio();
PADDLE_HIT.src = "./sounds/paddle_hit.mp3";

const WIN = new Audio();
WIN.src = "./sounds/win.mp3";

const BRICK_HIT = new Audio();
BRICK_HIT.src = "./sounds/brick_hit.mp3";

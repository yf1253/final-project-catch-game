
// Home page with information about the game
let screen = "screen1";

// Starting point
let point = 0;

//preload images
let SleighLeft; //santa facing left 
let SleighRight; //santa facing right 
let giftImage; //Image gifts
let landscape; //Image winter landscape
let firstscreen; //starting screen
let gameoverscreen; //ending screen

//preload mp3
let ChristmasSong; 
let catchSound;
let loseSound;

//variables for falling gifts
let tGift;//time for new gifts coming
let timeGift = 3000; //3 seconds
let giftList = [];
//variable for sleigh
let sleigh; 

function preload(){
  SleighLeft = loadImage("images/santa.png");
  SleighRight = loadImage("images/sleighRight.png");
  giftImage = loadImage("images/giftG.png ");
  landscape = loadImage("images/landscape.png");
  firstscreen = loadImage("images/firstScreen.png");
  gameoverscreen = loadImage("images/gameover.png");
  ChristmasSong = loadSound('songs/christmas.mp3');
	catchSound = loadSound('songs/catch.wav');
  loseSound = loadSound('songs/ohno.mp3');
}

function setup() {
  createCanvas(1200, 800);
  sleigh = new santaSleigh (700,600,0,0);//create santa sleigh controlled by "sleigh"
}

function draw() {
  noStroke();
  fill(220);
  textAlign(CENTER, CENTER);

   //Text on home page
  if (screen == "screen1") {
    background(firstscreen);
    ChristmasSong.play();
    // textSize(20);
    // text("Santa has to catch the beers before they hit the ground", width / 2, 100);
    // textSize(15);
    // text("Press space to start the game", width / 2, height / 2);
    // textSize(15);
    // text("Use the w, a, s and d keys to control sleigh", width / 2, 200);
  }

  //The page for the game itself
  if (screen == "screen2") {
    ChristmasSong.stop();
    //ChristmasSong.setVolume(0.1);
    background(0, 150, 0);
    imageMode(CENTER); 
    image(landscape,600,400,1200,800);
    sleigh.display();
    fill(0, 0, 0);
    stroke(5);
    textSize(25);
    text("POINT : " + point, 100, 50);
    
  
    // Feature that keeps the gifts coming
    if (millis() > tGift) { 
      //set up parameters for copies of gifts
      let ArrayGifts = new gift(random(25, width-25), 0, random(0), random(0.7, 1.0), 30); 
      giftList.push(ArrayGifts);
      tGift = millis()+ timeGift; 
      console.log(tGift);
    }
    for (let fallingGift of giftList) {
      fallingGift.display();
      // Collision between Santa Claus and gift
      if (dist(fallingGift.x, fallingGift.y, sleigh.x, sleigh.y) < 100) {
        console.log(dist);
        fallingGift.hits += 1;
        point = point + 1;
        catchSound.play();
      }
    }

    giftList = giftList.filter(giftNoHits);
    sleigh.display();
        
    // if (gotmessage == "right") {
    //   if (sleigh.y > 50) {
    //   sleigh.speedY = -1; // w = 87
    //   }
    // }

  }
  if (screen == "screen3") {
    gameover();
  }
}

// Gameover text
function gameover() {
  loseSound.play();
  background(0, 0, 0);
  imageMode(CENTER); 
  image(gameoverscreen,600,400,1200,800);
  textSize(60);
  fill(150, 0, 0);
  //text("GAME OVER", 250, 175);
  noLoop(); // get rid of the echo sound
}

function giftNoHits(gift) {
  if (gift.hits == 0) {
    return true; // keep the gift
  } else {
    return false; // Do not keep
  }
}


class santaSleigh {
    constructor(x,y,speedX,speedY) {
    this.x = x; // x location of the sleigh
    this.y = y; // y location of the sleigh
    this.speedX = speedX; // x axis speed
    this.speedY = speedY; // y axis speed
    this.dir = 1; //sleigh direction
    }
    display(){
      // if direction is positive, sleigh facing left
      if (this.dir == 1){
      image(SleighLeft, this.x, this.y, 300, 150);
      this.x += this.speedX; //this.x = this.x + this.speedX
      this.y += this.speedY; //this.y = this.y + this.speedY
      }
      // if direction is negative, sleigh facing right
      if (this.dir == -1){
      image(SleighRight, this.x, this.y, 300, 150);
      this.x += this.speedX; //this.x = this.x + this.speedX
      this.y += this.speedY; //this.y = this.y + this.speedY
      } 
    }
  
    flyLeft(){
      this.dir = 1;
    }
    flyRight(){
      this.dir = -1;
    }
  }



// The game needs more than one gift, therefore constructor
class gift {
  constructor(x, y, xSpeed, ySpeed, giftSize) {
    // 
    this.x = x; // x location of the gift
    this.y = y; // y location of the gift
    this.size = giftSize; // the size of the gift
    this.xSpeed = xSpeed; // x axis speed
    this.ySpeed = ySpeed; // y axis speed
    this.hits = 0; //for setting game over when gift hits ground
  }
  display() {
    image(giftImage, this.x, this.y, 50, 50); //image(img, x, y, [width], [height])

    this.x = this.x + this.xSpeed;
    this.y = this.y + this.ySpeed;

   // Wrap around if the gift runs out of screen
    if (this.x > width + this.size / 2) {
      this.x = 0 - this.size / 2;
    }
    if (this.x < 0 - this.size / 2) {
      this.x = width + this.size / 2;
    }
    //If the gift hits the bottom of the screen, it's game over
    if (this.y > height + this.size / 2) {
      screen = "screen3";

    }
  }
}




// Arrow keys 

function keyPressed() {

  if (keyCode == UP_ARROW) {
    if (sleigh.y > 50) {
      sleigh.speedY = -1; // w = 87
    }
  }
  
  if (keyCode == DOWN_ARROW) {
    if (sleigh.y < height - 50){
      sleigh.speedY = 1; // s = 83
    }
  }
  
  if (keyCode == LEFT_ARROW) {
    if (sleigh.x > 50){
    sleigh.speedX = -1; // a = 65
    sleigh.flyLeft(); 
    }
  }
  
  if (keyCode == RIGHT_ARROW) {
    if (sleigh.x < width - 50) {
    sleigh.speedX = 1; // d = 68
    sleigh.flyRight();
    }
  }

  // start the game(scrren2) with spacebar
  if (keyCode == 32) { //spacebar key code
    if (screen == "screen1") {
      screen = "screen2";
      // reset the tGift equal to the current number of milliseconds
      tGift = millis();
    }
  }
}


function keyReleased() {
  if (keyCode == UP_ARROW) {
    sleigh.speedY = 0;
  }
  if (keyCode == DOWN_ARROW) {
    sleigh.speedY = 0;
  }
  if (keyCode == LEFT_ARROW) {
    sleigh.speedX = 0;
  }
  if (keyCode == RIGHT_ARROW) {
    sleigh.speedX = 0;
  }
}
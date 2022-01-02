var PLAY = 1;
var END = 0;
var gameState = PLAY;
 
var tails,sonic_exe;
var tailsImg,tailsfast,tails_superfast,tails_collide,tailsjump,sonic_exeImg;

var bloquinho;

var score;

var jump_sound,death_sound;

var background_exe,background_exeImg;

var coins;

var obstaculos;
var path,pathImg;

var ringsImg,ringsGroup;
var Drings,DringsGroup;

var GameoverImg, resetImg;

var invisiblePath;







function preload(){
 tailsImg = loadAnimation("tails_run1.png","tails_run2.png","tails_run3.png","tails_run4.png","tails_run5.png","tails_run6.png","tails_run7.png","tails_run8.png");
 tails_collide = loadImage("tails_ded.png");
 tailsfast = loadAnimation("tails_fast1.png","tails_fast2.png","tails_fast3.png","tails_fast4.png");
 tails_superfast = loadAnimation("tails_superfast1.png","tails_superfast2.png");

 sonic_exeImg = loadImage("sonic.exe_run.png");

 tailsjump =loadAnimation("tails_jump1.png","tails_jump2.png","tails_jump3.png");

 darkRingImg = loadAnimation("darkR_r1.png","darkR_r2.png","darkR_r3.png","darkR_r4.png","darkR_r5.png","darkR_r6.png","darkR_r7.png","darkR_r8.png","darkR_r9.png","darkR_r10.png","darkR_r11.png","darkR_r12.png","darkR_r13.png","darkR_r14.png","darkR_r15.png");
 ringsImg = loadAnimation("ring_r1.png","ring_r2.png","ring_r3.png","ring_r4.png","ring_r5.png","ring_r6.png","ring_r7.png","ring_r8.png","ring_r9.png","ring_r10.png","ring_r11.png","ring_r12.png","ring_r13.png","ring_r14.png","ring_r15.png");
  
  pathImg = loadImage("Path_1.png");
  GameoverImg = loadImage("Game_over.png");
  resetImg = loadImage("reset.png");

 jump_sound = loadSound("jump_s.mp3");
 death_sound = loadSound("bad_laugh.mp3");

 background_exeImg = loadImage("Background1.png");

}

function setup() {
 createCanvas(windowWidth,windowHeight);
 //background
 background_exe = createSprite(500,300);
 background_exe.addImage(background_exeImg);
 background_exe.velocityX = -0.5;
 //- (4  + 3* score/500);
 //---------------------------------------
 var message = "Não deixe ele te pegar :)";
 console.log(message);
//Player
 tails = createSprite(150,height-120,20,50);
 tails.addAnimation("run",tailsImg);
 tails.addAnimation("jumping",tailsjump);
 tails.addAnimation("fast",tailsfast);
 tails.addAnimation("superFast",tails_superfast);
 tails.addImage("ded",tails_collide);

 
 tails.scale = 1.2;

 //grupos
 ringsGroup = createGroup();
 DringsGroup = createGroup();
 
 
 //Sonic.exe
 sonic_exe = createSprite(50,height-120,20,50);
 sonic_exe.addImage("running",sonic_exeImg);

 sonic_exe.scale = 0.1;

 //path
 path = createSprite(200,height-40,400,20);
 path.addImage("path1",pathImg);
 path.x = path.width /2;

 //Gameover
  Gameover = createSprite(670,100);
  Gameover.addImage(GameoverImg);
  Gameover.scale = 1;

  //reset
  reset = createSprite(670,250);
  reset.addImage(resetImg);
  reset.scale = 0.1;
  
  //invisiblePath
  invisiblePath = createSprite(200,height-95,400,10);
  invisiblePath.visible = false;
  //bloquinho
  bloquinho = createSprite(500,height-110,15,15);
  bloquinho.visible = false;
  bloquinho.velocityX = -10
  
  //colider
  tails.setCollider("circle",0,0,15);
  sonic_exe.setCollider("circle",0,0,200);
  tails.debug = false;
  sonic_exe.debug = false;

  score = 0;
  coins = 0;

}

function draw() {
 background(180);


   if(gameState === PLAY){
    //background infinito
    if(background_exe.x < 200 ){
        background_exe.x = height/1;
    }


    Gameover.visible = false;
    reset.visible = false;

    //movimento do solo
    path.velocityX = - (4  + 3* score/200);
    
    //score por andar
    score = score + Math.round(getFrameRate()/60);
   
    //chão infinito
    if (path.x < 400){
        path.x = path.width/2;
    }

  if (keyDown("space")&& tails.y >= 570){
      tails.changeAnimation("jumping",tailsjump);
    tails.velocityY = -12;
    jump_sound.play();
  }

 //la gravidad
 tails.velocityY = tails.velocityY + 0.8
 //no cair
 tails.collide(invisiblePath);

 //não sei como eu fiz isso mais eu consegui
 //virar animação normal quando caair
 if (keyDown("space")){
    bloquinho = createSprite(400,height-110,15,15);
    bloquinho.visible = false;
    bloquinho.velocityX = -9; 
    bloquinho.lifetime = 30;
 }
 
 if (tails.isTouching(bloquinho)){
     tails.changeAnimation("run",tailsImg);
 }

 if (tails.isTouching(ringsGroup)){
    coins = coins + 1;
    ringsGroup.destroyEach();
  }

  if (tails.isTouching(DringsGroup)){
    coins = coins - 1;
    DringsGroup.destroyEach();
    sonic_exe.x = sonic_exe.x +20;
  }

  if (sonic_exe.isTouching(tails)){
     gameState = END;
     death_sound.play();
  }

  
  
  
 spawnRings();
 spawnDarkRings();
  
 



} //-------------------fim do game state = PLAY

if(gameState === END){
    tails.changeImage("ded",tails_collide);
    tails.velocityY = 0;
    
    Gameover.visible = true;
    reset.visible = true;
    
    ringsGroup.lifetime = -1;
    DringsGroup.lifetime = -1;
    
    ringsGroup.velocityX = 0;
    DringsGroup.velocityX = 0;
    
    path.velocityX = 0;
    background_exe.velocityX = 0;
  }
  
//reset
if(mousePressedOver(reset)){
  resetAll();
 }


 drawSprites();
 //texto do pontos
 textSize(20);
  fill(255);
  text("Score: "+ score, 1250,30);
  //texto do anel
  textSize(20);
  fill(255);
  text("Anéis: "+ coins, 1250,60);
}


function spawnRings(){
    if (frameCount % 170 === 0){
        var ring = createSprite(width,height-120,10,40);
        ring.velocityX = -(5 + 3* score/200);
        //- (4  + 3* score/500);
        ring.scale = 0.2;
        ring.lifetime = 300;
        ring.addAnimation("rings_r",ringsImg);
        ringsGroup.add(ring);
   }  
}



function spawnDarkRings(){
  if (frameCount % 270 === 0){
      var Darkring = createSprite(width,height-120,10,40);
      Darkring.velocityX = -(5 + 3* score/200);
      Darkring.scale = 0.2;
      Darkring.lifetime = 300;
      Darkring.addAnimation("DarkRings_r",darkRingImg);
      DringsGroup.add(Darkring);
 }  
}

function resetAll(){
  gameState = PLAY;
  ringsGroup.destroyEach();
  DringsGroup.destroyEach();
  score = 0;
  coins = 0;
  tails.changeAnimation("run",tailsImg);
  sonic_exe.x = 50;
}
let scene = 0;
let cloudX = 0;
let dinheiro = 0;
let mudas = 5;
let colhidos = 0;
let estoqueFeira = 0;
let comprouComida = false;
let comprouTrator = false;
let tratorAtivo = false;

let player = { x: 50, y: 0, w: 40, h: 60, speed: 5, onTrator: false };
let carros = [];

let canteiros = [];
let novaArea = [];

function setup() {
  createCanvas(800, 400);
  textAlign(CENTER, CENTER);
  textSize(24);
  player.y = height * 0.75 - player.h;
  initCanteiros();
  initCarros();
}

function initCanteiros() {
  canteiros = [];
  for (let i = 0; i < 6; i++) {
    canteiros.push({ x: 80 + i * 100, y: height * 0.75 - 30, estado: "vazio" }); // vazio, plantado, regado, pronto
  }
  novaArea = [];
  for (let i = 0; i < 12; i++) {
    novaArea.push({ x: 50 + i * 60, y: height * 0.75 - 30, estado: "vazio" });
  }
}

function initCarros() {
  carros = [];
  for (let i = 0; i < 5; i++) {
    carros.push({ x: random(width), y: height * 0.75 + 20, speed: random(2, 4), color: color(random(50, 255), random(50, 255), random(50, 255)) });
  }
}

function draw() {
  background(135, 206, 235);
  drawSun();
  drawCloud(cloudX, 80);
  drawCloud(cloudX + 200, 120);
  drawCloud(cloudX + 500, 60);
  cloudX -= 0.5;
  if (cloudX < -200) cloudX = width;

  if (scene === 0) {
    drawFazenda();
  } else if (scene === 1) {
    drawAnimacaoAndando();
  } else if (scene === 2) {
    drawCidade();
  }

  fill(0);
  textSize(16);
  if(scene !== 1) text("SETAS mover, ESPAÇO plantar, R regar, C colher", width / 2, height - 30);
  text("Mudas: " + mudas + " | Dinheiro: R$" + dinheiro, width / 2, 20);
}

//////////////////////////
// CENA 0 - FAZENDA
function drawFazenda() {
  fill(34, 139, 34);
  rect(0, height * 0.75, width, height * 0.25);

  fill(139, 69, 19);
  rect(0, height * 0.75 + 50, width, 40);

  drawArvore(50, height * 0.75 - 100);
  drawArvore(150, height * 0.75 - 110);
  drawArvore(700, height * 0.75 - 90);
  drawArvore(600, height * 0.75 - 120);

  drawCasa(100, height * 0.75 - 60);

  if (!tratorAtivo || !player.onTrator) {
    for (let c of canteiros) drawCanteiro(c);
  } else {
    for (let c of novaArea) drawCanteiro(c);
  }

  if (player.onTrator && comprouTrator) {
    drawTrator(player.x, player.y + 15);
  } else {
    drawJogador(player.x, player.y);
  }

  if (comprouTrator) {
    fill(0, 150, 0);
    rect(width - 150, height - 50, 140, 40, 10);
    fill(255);
    textSize(16);
    if(player.onTrator) {
      text("Sair do Trator (E)", width - 80, height - 30);
    } else if (dist(player.x, player.y, 300, height * 0.75 - 30) < 70) {
      text("Entrar no Trator (E)", width - 80, height - 30);
    }
  }

  fill(0);
  textSize(18);
  text("Pressione ENTER para ir para a cidade", width / 2, height - 10);
}

function drawArvore(x, y) {
  fill(101, 67, 33);
  rect(x - 5, y + 30, 10, 30);
  fill(34, 139, 34);
  ellipse(x, y + 20, 50, 50);
  ellipse(x - 15, y + 40, 40, 40);
  ellipse(x + 15, y + 40, 40, 40);
}

function drawCanteiro(c) {
  fill(139, 69, 19);
  rect(c.x, c.y + 30, 60, 10);
  switch (c.estado) {
    case "vazio":
      fill(50, 200, 50);
      rect(c.x + 10, c.y + 15, 40, 15);
      break;
    case "plantado":
      fill(0, 150, 0);
      rect(c.x + 20, c.y + 5, 20, 25);
      break;
    case "regado":
      fill(0, 200, 200);
      rect(c.x + 20, c.y + 5, 20, 25);
      break;
    case "pronto":
      fill(255, 200, 0);
      ellipse(c.x + 30, c.y + 15, 40, 40);
      break;
  }
}

function drawJogador(x, y) {
  // Corpo
  fill(200, 150, 100);
  rect(x - 10, y, 20, 50, 5);
  // Cabeça
  fill(255, 220, 180);
  ellipse(x, y - 15, 30, 30);
  // Olhos
  fill(0);
  ellipse(x - 7, y - 17, 6, 6);
  ellipse(x + 7, y - 17, 6, 6);
  // Boca
  noFill();
  stroke(0);
  arc(x, y - 5, 15, 10, 0, PI);
  noStroke();
}

function drawCasa(x, y) {
  fill(200, 100, 50);
  rect(x - 40, y, 80, 50);
  fill(150, 0, 0);
  triangle(x - 50, y, x, y - 40, x + 50, y);
}

function drawTrator(x, y) {
  fill(100, 100, 100);
  rect(x, y, 100, 40, 10);
  fill(150);
  rect(x + 70, y - 20, 30, 30, 5); // cabine
  fill(50);
  ellipse(x + 20, y + 40, 30, 30); // roda trás
  ellipse(x + 80, y + 40, 30, 30); // roda frente
  fill(80);
  rect(x + 95, y - 10, 10, 15, 3); // escapamento
}

/////////////////////////////
// CENA 1 - ANIMAÇÃO DE IR ANDANDO OU COM TRATOR
function drawAnimacaoAndando() {
  background(135, 206, 235);
  drawSun();
  drawCloud(cloudX, 80);
  drawCloud(cloudX + 200, 120);
  drawCloud(cloudX + 500, 60);
  cloudX -= 1;
  if (cloudX < -200) cloudX = width;

  fill(34, 139, 34);
  rect(0, height * 0.75, width, height * 0.25);
  drawCasa(100, height * 0.75 - 60);

  fill(139, 69, 19);
  rect(0, height * 0.75 + 50, width, 40);

  if (comprouTrator && tratorAtivo) {
    player.x += 5;
    drawTrator(player.x, player.y + 15);
  } else {
    player.x += 3;
    drawJogador(player.x, player.y);
  }

  if (player.x > width + 30) {
    scene = 2;
    player.x = 50;
    player.y = height * 0.75 - player.h;
    player.onTrator = false;
  }

  fill(0);
  textSize(24);
  text("Indo para a cidade...", width / 2, 50);
}

//////////////////////////////
// CENA 2 - CIDADE COM CARROS E PREDIOS
function drawCidade() {
  background(180, 200, 255);

  // Prédios no fundo
  for(let i=0; i<width; i+=120){
    fill(120 + noise(i*0.01)*80);
    rect(i, height * 0.75 - 120, 100, 120);
    fill(200);
    for(let y=height * 0.75 - 110; y<height * 0.75; y+=20){
      for(let x=i+10; x<i+90; x+=20){
        rect(x, y, 10, 10);
      }
    }
  }

  fill(80);
  rect(0, height * 0.75, width, height * 0.25);

  fill(50);
  rect(0, height * 0.75 - 50, width, 50);

  fill(255, 255, 0);
  for (let i = 0; i < width; i += 30) {
    rect(i + (frameCount % 30), height * 0.75 - 25, 15, 5);
  }

  // Carros andando
  for(let c of carros){
    fill(c.color);
    rect(c.x, c.y, 60, 30, 5);
    fill(0);
    ellipse(c.x + 10, c.y + 30, 15, 15);
    ellipse(c.x + 50, c.y + 30, 15, 15);
    c.x += c.speed;
    if(c.x > width + 60) c.x = -60;
  }

  // Feira
  fill(255, 0, 0);
  rect(600, 260, 120, 80, 10);
  fill(255, 255, 0);
  rect(620, 340, 20, 20);
  rect(660, 340, 20, 20);
  fill(0);
  textSize(16);
  text("FEIRA", 660, 250);
  textSize(14);
  text("B: Comprar 5 mudas (R$10)", 660, 290);
  text("M: Comprar comida (R$5)", 660, 310);
  if (!comprouTrator)
    text("T: Comprar trator (R$100)", 660, 330);
  else
    text("Você já comprou o trator!", 660, 330);

  // Botão para voltar pra fazenda
  fill(0, 150, 0);
  rect(50, height - 60, 140, 40, 10);
  fill(255);
  text("Voltar pra Fazenda (ENTER)", 120, height - 40);
}

function keyPressed() {
  if (scene === 0) {
    if (keyCode === LEFT_ARROW) {
      if(player.onTrator) {
        player.x = max(0, player.x - 7);
      } else {
        player.x = max(0, player.x - player.speed);
      }
    }
    else if (keyCode === RIGHT_ARROW) {
      if(player.onTrator) {
        player.x = min(width - player.w, player.x + 7);
      } else {
        player.x = min(width - player.w, player.x + player.speed);
      }
    }

    if (key === ' ' || key === 'Spacebar') { // plantar
      plantCanteiro();
    } else if (key === 'r' || key === 'R') { // regar
      regarCanteiro();
    } else if (key === 'c' || key === 'C') { // colher
      colherCanteiro();
    } else if (key === 'e' || key === 'E') { // entrar/sair trator
      if (comprouTrator && dist(player.x, player.y, 300, height * 0.75 - 30) < 70) {
        player.onTrator = !player.onTrator;
        tratorAtivo = player.onTrator;
      }
    } else if (keyCode === ENTER) {
      if(player.onTrator) player.onTrator = false; // sai do trator antes de sair
      scene = 1;
      player.x = 50;
    }
  } else if (scene === 2) {
    if (key === 'b' || key === 'B') {
      if(dinheiro >= 10){
        dinheiro -= 10;
        mudas += 5;
      }
    } else if (key === 'm' || key === 'M') {
      if(dinheiro >= 5){
        dinheiro -= 5;
        comprouComida = true;
      }
    } else if (key === 't' || key === 'T') {
      if(!comprouTrator && dinheiro >= 100){
        dinheiro -= 100;
        comprouTrator = true;
        mudas += 20; // bônus por comprar trator
      }
    } else if (keyCode === ENTER) {
      scene = 0;
      player.x = 50;
      player.y = height * 0.75 - player.h;
      player.onTrator = false;
      tratorAtivo = false;
    }
  }
}

function plantCanteiro() {
  let area = (tratorAtivo && player.onTrator) ? novaArea : canteiros;
  for (let c of area) {
    if (player.x > c.x - 20 && player.x < c.x + 60) {
      if (c.estado === "vazio" && mudas > 0) {
        c.estado = "plantado";
        mudas--;
        break;
      }
    }
  }
}

function regarCanteiro() {
  let area = (tratorAtivo && player.onTrator) ? novaArea : canteiros;
  for (let c of area) {
    if (player.x > c.x - 20 && player.x < c.x + 60) {
      if (c.estado === "plantado") {
        c.estado = "regado";
        break;
      }
    }
  }
}

function colherCanteiro() {
  let area = (tratorAtivo && player.onTrator) ? novaArea : canteiros;
  for (let c of area) {
    if (player.x > c.x - 20 && player.x < c.x + 60) {
      if (c.estado === "regado") {
        c.estado = "pronto";
        dinheiro += 5;
        break;
      }
    } else if (c.estado === "pronto") {
      c.estado = "vazio";
      dinheiro += 10;
      break;
    }
  }
}

function drawSun() {
  fill(255, 204, 0);
  ellipse(700, 100, 80, 80);
}

function drawCloud(x, y) {
  fill(255);
  ellipse(x, y, 60, 40);
  ellipse(x + 30, y + 10, 60, 40);
  ellipse(x + 60, y, 60, 40);
}

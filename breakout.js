var canvas = document.getElementById("myCanvas");	// poziva canvas tag iz html-a
var ctx = canvas.getContext("2d");					//	pravi variablu radi lakseg koriscenja
var ballRadius = 10;								// precnik lopte
var x = canvas.width/2;								// x pozicija za pozicioniranje lopte
var y = canvas.height-30;							// y pozicija za pozicioniranje lopte
var dx = 2;											// variabla koja se menja sa svakim iscrtavanjem, tj. pomera loptu za 2px
var dy = -2;										// variabla koja se menja sa svakim iscrtavanjem, tj. pomera loptu za 2px
var paddleHeight = 10;								// sirina odskocne ploce
var paddleWidth = 75;								// visina odskocne ploce
var paddleX = (canvas.width-paddleWidth)/2;			// pocenta pozicija x-sirina ploce
var rightPressed = false;							// definise variablu desno za pomeranje odskocne polce
var leftPressed = false;							// definise variablu levo za pomeranje odskocne polce
var brickRowCount = 3;                              // sledecih 7 variabli za cigle koje se ruse
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];                                    // dvodimenzionalni niz u kome cuvamo sve cigle
for(c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}
var score = 0;                                      // variabla cuva rezultat

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {				// funkicja prati ako je pritisnuto dugme na tastaturi
    if(e.keyCode == 39) {					// pita da li je pritisnuta strelica desno
        rightPressed = true;				// variabla koja cuva vrednost pritisnute tipke
    }
    else if(e.keyCode == 37) {				// pita da li je pritisnuta strelica levo
        leftPressed = true;					// variabla koja cuva vrednost pritisnute tipke
    }
}
function keyUpHandler(e) {					// funkcija prati ako je pusteno dugme na tastaturi
    if(e.keyCode == 39) {					// pita da li je pustena strelica desno
        rightPressed = false;				// variabla koja cuva vrednost pustene tipke
    }
    else if(e.keyCode == 37) {				// pita da li je pustena strelica levo
        leftPressed = false;				// variabla koja cuva vrednost pustene tipke
    }
}
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function drawBall() {
    ctx.beginPath();                            // pocetak iscrtavanja lopte
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);    // crta loptu i stavlja na pocetnu poziciju x : y
    ctx.fillStyle = "#0095DD";					// boja lopte
    ctx.fill();									// popunjava celu povrsinu lopte
    ctx.closePath();							// kraj iscrtavanja lopte
}
function drawPaddle() {							// kreiranje odskocne ploce
	ctx.beginPath();							// pocetak kreiranja
	ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight); // pocetna pozicija, sirina, visina
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}
function drawBricks() {                         // kreira sve cigle
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {                                  // variabla status - proverava da li je cigla pogodjena
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft; // pozicija x- pogledaj for petlju i c*
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop; // pozicija y- pogledaj for petlju i r*
                bricks[c][r].x = brickX;                                    // pozicija x svake cigle
                bricks[c][r].y = brickY;                                    // pozicija y svake cigle
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
function collisionDetection() {                         // funkcija proverava da li je doslo do sudara lopte i cigle
    for(c=0; c<brickColumnCount; c++) {                 // prolazi kroz dvodimenzionalni niz
        for(r=0; r<brickRowCount; r++) {                // tj. kroz svaku ciglu
            var b = bricks[c][r];
            if(b.status == 1) {                         // proverava da li cigla jos uvek postoji
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) { // proverava da li se x i y pozicija lopte nalazi na x i y poziciji SVAKE cigle
                    dy = -dy;                           // ako je ostvaren uslov, lopta menja pravac
                    b.status = 0;                       // ako je ostvaren uslov, cigla dobija status 0, i vise nece biti iscrtavana
                    score++;                            // povecava skor za 1 nakon svake pogodjene cigle
                    if(score == brickRowCount*brickColumnCount) {   // pita da li smo srusili sve cigle
                        alert("YOU WIN, CONGRATULATIONS!");         // ako jesmo kaze da smo pobedili
                        document.location.reload();                 // krece ispocetka
                    }
                }
            }
        }
    }
}
function drawScore() {                                  // funkcija koja iscrtava rezultat
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);   				// brise loptu da ne bi ostavljao trag
    drawBricks();                                                       // ponovo crta cigle
    drawBall();															// ponovo crta loptu sa novim koordinatama
    drawPaddle();														// ponovo crta odskocnu dasku sa novim koordinatama
    drawScore();                                                        // iscrtava rezultat
    collisionDetection();

    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {		// provera da li smo tigli do ivice (desne ili leve)
    	dx = -dx;														// ako jesmo menja variablu da odborjava suprotno + ili -
    }
    if(y + dy < ballRadius) {											// da li je lopta stigla do gornje ivice
    	dy = -dy;
	} 
	else if(y + dy > canvas.height-ballRadius) {						// da li je lopta stigla do donje ivice
    	if(x > paddleX && x < paddleX + paddleWidth) {					// da li je lopta stigla na poziciju X sirine daske
    		dy = -dy;													// ako jeste, odskoci
    	}
    	else {
    	    alert("GAME OVER");												// ako nije - Game Over -
    	    document.location.reload();
		}
	}

    if(rightPressed && paddleX < canvas.width-paddleWidth) {			// pita da li je pritisnuta tipka desno i da li je dosao do kraja prozora
        paddleX += 7;													// menja X poziciju odskocne daske
    }
    else if(leftPressed && paddleX > 0) {								// pita da li je pritisnuta tipka desno i da li je dosao do kraja prozora
        paddleX -= 7;													// menja X poziciju odskocne daske
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw);        // umsto setInterval(draw, 10); koristimo ovu funkciju unutar draw funkicje.
}

draw();                                 // Takodje moramo da pozovemo draw funkicju na kraju naseg programa tamo gde bi stajalo setInterval(draw, 10);
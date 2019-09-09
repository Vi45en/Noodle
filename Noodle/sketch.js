/******************* sketch.js ********************
 * 
 *************************************************/


//  Initialize drawing variables
var drawing = [];
var currentPath = [];
var index = 0;
var isDrawing = false;

const timeLimit = 25;
var x;
var socket = new WebSocket('ws://localhost:8080');
//var socket = new WebSocket('ws://doodle-workshop.eu-gb.mybluemix.net');
var winSong;
var loseSong;
var congratulationsSong;

var classes = [];
var index = 0;
var currentDraw = "";
var previousDraw = "";
var score = 0;

var isEraser = true;
var brushColor = 0;
var brushSize = 4;


function setup() {

	const pigInsideLengths = [];
	function setInsidePaths() {
		let insidePaths = Array.from(document.querySelectorAll('g:not(.pig-inside) path'));
		insidePaths.forEach((path) => {
			const totLen = path.getTotalLength();
			path.style.strokeDasharray = `0 ${totLen + 2}`;
			path.style.strokeDashoffset = '1px';
		});
		insidePaths = Array.from(document.querySelectorAll('g.pig-inside path'));
		insidePaths.forEach((path) => {
			const totLen = path.getTotalLength();
			path.style.strokeDasharray = `${totLen + 2} ${totLen + 2}`;
			path.style.strokeDashoffset = '1px';
			pigInsideLengths.push(totLen + 2.2);
		});
	}

	const pig = document.querySelector('.pig')
	function animate() {
		setInsidePaths();
		anime({
			targets: '.pig + g path',
			strokeDashoffset: [{
				value: (_, i) => `${pigInsideLengths[i]}px`,
				duration: 500,
				easing: 'easeOutQuad',
				delay: (_, i) => 1000 + i * 15
			},
			{
				value: 0,
				duration: 500,
				easing: 'easeOutQuad',
				delay: (_, i) => 8700 + i * 15
			}
			]
		});
		anime({
			targets: '.pig',
			strokeDashoffset: {
				value: [0, -319],
				duration: 1000,
				easing: 'easeOutQuad',
				delay: 1000
			},
			complete: () => {
				pig.style.strokeDasharray = '0 320';
				pig.style.strokeDashoffset = '1px';
			}
		});
		anime({
			targets: '.calculator + g path',
			strokeDasharray: {
				value: (el) => `${el.getTotalLength() + 1} ${el.getTotalLength() + 2}`,
				duration: 500,
				easing: 'easeOutQuad',
				delay: (_, i) => 1400 + i * 15
			},
			strokeDashoffset: {
				value: (el) => `${-el.getTotalLength() - 1}px`,
				duration: 500,
				easing: 'easeOutQuad',
				delay: (_, i) => 4900 + i * 15
			}
		});
		anime({
			targets: '.calculator',
			strokeDasharray: {
				value: ['0 252', '252 252'],
				easing: 'easeOutQuad',
				duration: 1000,
				delay: 1300
			},
			strokeDashoffset: {
				value: [0, -252],
				easing: 'easeOutQuad',
				duration: 1000,
				delay: 5300
			}
		});
		anime({
			targets: '.wallet',
			strokeDasharray: {
				value: ['0 240', '240 240'],
				easing: 'easeOutQuad',
				duration: 1000,
				delay: 5600
			},
			strokeDashoffset: {
				value: [0, -240],
				easing: 'easeOutQuad',
				duration: 1000,
				delay: 9600
			}
		});
		anime({
			targets: '.wallet + g path',
			strokeDasharray: {
				value: (el) => `${el.getTotalLength() + 1} ${el.getTotalLength() + 2}`,
				duration: 500,
				easing: 'easeOutQuad',
				delay: (_, i) => 5700 + i * 15
			},
			strokeDashoffset: {
				value: (el) => `${-el.getTotalLength() - 1}px`,
				duration: 500,
				easing: 'easeOutQuad',
				delay: (_, i) => 9200 + i * 15
			}
		});
		setTimeout(() => {
			anime({
				targets: '.pig',
				strokeDasharray: {
					value: ['0 318', '319 319'],
					easing: 'easeOutQuad',
					duration: 1000,
					delay: 900
				}
			});
		}, 9000);
	}

	function schedule() {
		animate();
		setTimeout(schedule, 12900);
	}
	//schedule();

	score = 0;

	socket.addEventListener('message', event => {
		console.log("Server is listening...");

		console.log(`Message from server: ${event.data}`)

		if (`${event.data}`.charAt(0) === '{') {
			console.log("classes are : ")
			var JSON_obj = JSON.parse(`${event.data}`);
			var classIndex = 0;
			while (classIndex < JSON_obj.classifiers[0].classes.length) {
				classes[classIndex] = JSON_obj.classifiers[0].classes[classIndex].class;
				classIndex++;
			}
			console.log(classes);
			document.getElementById('doodle_draw_main').innerHTML = " ";
		}

		// Change this to teh name of the real classifier

		else if (`${event.data}`.charAt(0) === '0' || `${event.data}` != "real_Test.zip") {
			// DEBUG: This is the wrong answer.
			console.log("This signature is fake!");
			document.getElementById('doodle_draw_main').innerHTML = "Fake Signature Detected!";
			document.getElementById('first_line').innerHTML = " ";
			loseSong.play();
		}

		else {
			// DEBUG: This is the correct answer.
			console.log("You guessed right!");
			document.getElementById('doodle_draw_main').innerHTML = "Signature is Authentic!";
			document.getElementById('first_line').innerHTML = " ";

			// score++;
			winSong.play();


			// console.log("Score : " + score);
			// if (score == 5) {
			// 	$('.badgeContainer').parent().fadeIn(500);
			// 	$('.questionView').parent().fadeOut(0);
			// 	$('.topbar').parent().fadeIn(0);
			// 	$('.buttonHolder').parent().fadeOut(0);
			// 	stroke(0);
			// 	// document.getElementById('saveButton').fadeOut();
			// }
		}

		// index = Math.floor((Math.random() * (classes.length - 1)) + 1);
		// currentDraw = classes[index];
		// previousDraw = currentDraw;
		// console.log("Doodle : " + currentDraw);
		// document.getElementById('doodle_draw').innerHTML = currentDraw;
		// document.getElementById('doodle_draw_main').innerHTML = currentDraw;

		// console.log("SCORE : " + score);
		// document.getElementById('doodle_index').innerHTML = score;
	});

	socket.send('class');
 	console.log("message sent")

	document.getElementById('canvascontainer').style.cursor = "url('https://raw.githubusercontent.com/mcnitt/simple-jquery-drawing-app/master/img/cursor.png'), crosshair";

	index++;
	console.log("class length : " + classes.length);

	index = Math.floor((Math.random() * (classes.length - 1)) + 1);
	currentDraw = classes[index];
	previousDraw = currentDraw;
	console.log("Doodle : " + currentDraw);
	// document.getElementById('doodle_draw').innerHTML = currentDraw;
	document.getElementById('doodle_draw_main').innerHTML = currentDraw;

	// Setting up canvas elements and other elements from the main page.
	canvas = createCanvas(800, 600);	
	document.getElementById("defaultCanvas0").style.backgroundImage = "url('http://www.samskirrow.com/background.png')";

	canvas.parent('canvascontainer');
	
	// var canvas2 = document.getElementById("defaultCanvas0"),
    // ctx = canvas2.getContext("2d");

	// // canvas.width = 903;
	// // canvas.height = 657;


	// var background = new Image();
	// background.src = "http://www.samskirrow.com/background.png";

	// Make sure the image is loaded first otherwise nothing will draw.
	background.onload = function(){
		ctx.drawImage(background,0,0);   
	}


	canvas.mousePressed(startPath);
	canvas.mouseReleased(endPath);

	var saveButton = select('#saveButton');
	saveButton.mousePressed(saveDrawing);

	var clearButton = select('#clearButton');
	clearButton.mousePressed(clearDrawing);

	var erasor_button = select('#eraser');
	erasor_button.mousePressed((function () {
		// location.reload();

		console.log("IsEraser : " + isEraser);

		if (isEraser) {
			// NOTE: This is eraser
			brushColor = 255;
			brushSize = 25;

			document.getElementById('eraser').innerHTML = "Pen";
			document.getElementById('canvascontainer').style.cursor = "url('double-sided-eraser.png'), crosshair";

			isEraser = false;
		}
		else {
			// NOTE: This is pen.
			brushColor = 0;
			brushSize = 4;

			document.getElementById('eraser').innerHTML = "Eraser";
			document.getElementById('canvascontainer').style.cursor = "url('https://raw.githubusercontent.com/mcnitt/simple-jquery-drawing-app/master/img/cursor.png'), crosshair";


			isEraser = true;
		}
	}));

	winSong = loadSound('win.mp3');
	loseSong = loadSound('lose.mp3');


	// console.log("This should be there only once.");
	$('.topbar').parent().fadeOut();
	$('.questionView').parent().fadeOut();
	$('.badgeContainer').parent().fadeOut();

	// Splashview button transition.
	$('.spashviewButton').click(function () {

		$('.splashscreen').parent().fadeOut(500);
		$('.questionView').parent().fadeIn(500);
		// startGame = true;
	});

	// Question View button transition.
	$('.questionViewButton').click(function () {
		$('.questionView').parent().fadeOut(500);
		$('.topbar').parent().fadeIn(500, startTimer());
	});


}

function startPath() {
	isDrawing = true;
	currentPath = [];
	drawing.push(currentPath);
}

function endPath() {
	isDrawing = false;
}

function draw() {
	background(255);

	if (isDrawing) {
		var point = {
			x: mouseX,
			y: mouseY,
			c: brushColor,
			s: brushSize
		}

		currentPath.push(point);
		// console.log("Point: " + point.x + " " + point.y + " " + point.c );
	}

	// stroke(0);

	// console.log('Stroke Color : ' + strokeColor);

	// strokeWeight(4);
	noFill();
	for (var i = 0; i < drawing.length; i++) {
		var path = drawing[i];
		beginShape();
		for (var j = 0; j < path.length; j++) {
			stroke(path[j].c);
			strokeWeight(path[j].s);
			// console.log("path[j].s : " + path[j].s);
			vertex(path[j].x, path[j].y)
		}
		endShape();
	}
}

function saveDrawing() {
	var canvas = $('canvas')[0];

	/* ------------------------------------------------------------- */

	// create an off-screen canvas
    var temp_canvas = document.createElement('canvas'),
        ctx = temp_canvas.getContext('2d');

    // set its dimension to target size
    temp_canvas.width = 32;
    temp_canvas.height = 32;

    // draw source image into the off-screen canvas:
    ctx.drawImage(canvas, 0, 0, 32, 32);

	console.log

    // encode image to data-uri with base64 version of compressed image
	// return canvas.toDataURL();
	
	/* --------------------------------------------------------------*/
	 	
	data = temp_canvas.toDataURL('image/png').replace(/data:image\/png;base64,/, '');
	
	socket.send(data);

	clearDrawing();
	clearInterval(x);

	brushColor = 0;
	brushSize = 4;

	document.getElementById('eraser').innerHTML = "Eraser";
	document.getElementById('canvascontainer').style.cursor = "url('https://raw.githubusercontent.com/mcnitt/simple-jquery-drawing-app/master/img/cursor.png'), crosshair";


	isEraser = true;

	loadQuestion();
}

function clearDrawing() {
	drawing = [];

}

function deleteDrawing(key) {
	var ref = database.ref(`drawings/${key}`).remove();
}

// Pads a zero in front of single digit numbers. This is for the time formatting.
function pad(d) {
	return (d < 10) ? '0' + d.toString() : d.toString();
}

function startTimer() {
	// Set the date we're counting down to
	var countDownTime = timeLimit;
	document.getElementById("timeLeft").innerHTML = pad(countDownTime);
	document.getElementById("clock-time").style.color = "rgb(69, 122, 190)";
	// clearInterval(x);


	// Update the count down every 1 second
	x = setInterval(function () {
		countDownTime--;

		if (countDownTime / timeLimit > 0.75) {
			document.getElementById("timeLeft").innerHTML = pad(countDownTime);
			document.getElementById("clock-time").style.color = "rgb(69, 122, 190)";
		}
		else if (countDownTime / timeLimit > 0.5) {
			document.getElementById("timeLeft").innerHTML = pad(countDownTime);
			document.getElementById("clock-time").style.color = "rgb(228, 223, 95)";
		}
		else if (countDownTime / timeLimit > 0.25) {
			document.getElementById("timeLeft").innerHTML = pad(countDownTime);
			document.getElementById("clock-time").style.color = "rgb(255, 208, 87)";
		}
		else if (countDownTime / timeLimit > 0) {
			document.getElementById("timeLeft").innerHTML = pad(countDownTime);
			document.getElementById("clock-time").style.color = "rgb(244, 118, 106)";
		}
		else {
			document.getElementById("timeLeft").innerHTML = pad(countDownTime);
			document.getElementById("clock-time").style.color = "#EEEff0";
			clearInterval(x);
			// IDEA: Insert popup for next question here.
			saveDrawing();
		}
	}, 1000);
}

function loadQuestion() {
	$('.topbar').parent().fadeOut(500);
	$('.questionView').parent().fadeIn(0);

	// console.log("SCORE : " + score);
	// document.getElementById('doodle_index').innerHTML = score + 1;
	// document.getElementById('doodle_draw_main').innerHTML = currentDraw;
}

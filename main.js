let prevx, prevy;
let dots = [];
let drawingEnabled = true;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(255,0); // Fondo blanco
	prevx = mouseX;
	prevy = mouseY;
}

function draw() {
	if (drawingEnabled) {
		let v = createVector(mouseX - prevx, mouseY - prevy);
		let numofpts = int(v.mag() / 4) + 1;
		let vs = v.div(numofpts);

		strokeWeight(0.25);
		stroke(0); // Línea negra
		for (let i = 0; i < numofpts; i += 1) {
			let sx = mouseX - (vs.x * i);
			let sy = mouseY - (vs.y * i);
			dots.push(new ColorDot(sx, sy, color(0)))
		}
	}

	for (let j = dots.length - 1; j >= 0; j--) {
		if (dots[j].isdone()) {
			dots.splice(j, 1);
			continue;
		}
		dots[j].display();
		dots[j].move();
	}

	prevx = mouseX;
	prevy = mouseY;
}

function mousePressed() {
	background(255,0);  // Limpia el canvas
	dots = [];        // Borra los puntos
	drawingEnabled = false; // Detiene el dibujo
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	background(255,0); // Reestablece el fondo blanco al redimensionar
}

class ColorDot {
	constructor(_x, _y, _c) {
		this.x = _x;
		this.y = _y;
		this.c = _c;
		this.d = 5;
		this.count = 0;
		this.lifespan = random(200, 400);
	}

	move() {
		this.theta = noise(this.x * 0.015, this.y * 0.015) * 4 * PI;
		let v = p5.Vector.fromAngle(this.theta, 1);
		this.x += v.x;
		this.y += v.y;
		this.d *= 0.98;
		this.count++;
	}

	display() {
		fill(255);       // Relleno blanco (igual al fondo)
		stroke(0);       // Borde negro
		ellipse(this.x, this.y, this.d, this.d);
	}

	isdone() {
		return this.count >= this.lifespan;
	}
}

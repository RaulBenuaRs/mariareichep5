let video;
let mic;
let micEnabled = false;
let prevFrame;
let smoothMicLevel = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);

    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide();

    userStartAudio().then(() => {
        console.log("🎤 Audio activado por el usuario");
    }).catch(err => {
        console.error("🚨 Error al iniciar el audio:", err);
        alert("Activa el micrófono en la configuración del navegador.");
    });

    mic = new p5.AudioIn();
    mic.start(() => {
        console.log("🎤 Micrófono detectado");
        micEnabled = true;
    }, () => {
        console.error("🚨 No se pudo acceder al micrófono.");
        alert("No se pudo acceder al micrófono. Verifica los permisos.");
    });

    prevFrame = createGraphics(width, height);
    prevFrame.background(255);

    frameRate(30);
}

function draw() {
    let targetMicLevel = micEnabled ? mic.getLevel() * 600 : 0;
    smoothMicLevel = lerp(smoothMicLevel, targetMicLevel, 0.15);

    prevFrame.fill(255, 20);
    prevFrame.rect(0, 0, width, height);

    video.loadPixels();

    if (video.pixels.length > 0) {
        drawReactiveLines();
    }

    image(prevFrame, 0, 0);
}

function drawReactiveLines() {
    for (let y = 0; y < height; y += 15) {
        prevFrame.beginShape();
        for (let x = 0; x < width; x += 8) {
            let index = (x + y * video.width) * 4;
            let r = video.pixels[index];
            let g = video.pixels[index + 1];
            let b = video.pixels[index + 2];
            let bright = (r + g + b) / 3;

            let lineWeight = map(bright, 0, 255, 0.8, 2.5) + smoothMicLevel * 0.08;
            prevFrame.strokeWeight(lineWeight);
            prevFrame.stroke(174, 134, 101); 

            let offset = map(bright, 0, 255, -5, 5) + smoothMicLevel * 0.5;
            prevFrame.vertex(x, y + offset);
        }
        prevFrame.endShape();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    prevFrame = createGraphics(windowWidth, windowHeight);
    prevFrame.background(255);
    video.size(windowWidth, windowHeight);
}

function keyPressed() {
    if (key === 'f' || key === 'F') {
        saveCanvas('RAULBENUA-MARIAREICHE', 'jpg');
    }
}

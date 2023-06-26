// By Mehdi Farahani
// Overlapping Images with Color and Opacity Change

var song;
var fft;
let particles = [];
let mainParticle;
let maxRadius = 350;
let minRadius = 10;
let font;
let img;
let imgWidth = 100;
let imgHeight = 100;

function preload() {
  song = loadSound('2.mp3');
  font = loadFont('MehrNastaliqWebRegular.ttf');
  img = loadImage('2-1.png');
}

function setup() {
  createCanvas(800, 800);
  angleMode(DEGREES);
  rectMode(CENTER);
  fft = new p5.FFT();
  
  mainParticle = new Particle();
}

function draw() {
  background(200);
  strokeWeight(2);
  stroke(255);
  noFill();

  translate(width / 20, height / 20);

  // analyze the audio frequencies
  fft.analyze();
  amp = fft.getEnergy(200, 200);

  var wave = fft.waveform();

  for (var t = -1; t <= 1; t += 2) {
    for (let i = 0; i <= 180; i++) {
      let index = floor(map(i, 0, 300, 0, wave.length - 1));
      let r = map(wave[index], -0, 0, minRadius, maxRadius);
      let x = r * sin(i) * t;
      let y = r * cos(i);
      point(x, y);
      vertex(x, y);
    }
  }

  mainParticle.update(amp > 220);
  mainParticle.show();

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update(amp > 220);
    particles[i].show();
    particles[i].checkOverlap(particles); // Check overlap with other particles
    if (particles[i].edges()) {
      particles.splice(i, 1);
    }
  }

  if (random() < 0.1) {
    var p = new Particle();
    particles.push(p);
  }
}

function mouseClicked() {
  if (song.isPlaying()) {
    song.pause();
    noLoop();
  } else {
    song.play();
    loop();
  }
}

class Particle {
  constructor() {
    this.pos = createVector(width / 2, height / 2); // Position at the center initially
    this.vel = p5.Vector.random2D().mult(random(0.5, 1.5));
    this.acc = createVector(0, 0);
    this.size = random(100, 13);
    this.rotationSpeed = random(-0.5, 0.5); // Random rotation speed
    this.angle = random(0, 360); // Random initial rotation angle
    this.color = color(random(255), random(255), random(255), 100); // Random color with opacity
  }

  show() {
    noStroke();
    fill(this.color);
    textSize(40);
    textFont(font);
    textAlign(CENTER, CENTER);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle); // Rotate image
    imageMode(CENTER);
    image(img, 0, 0, imgWidth, imgHeight);
    pop();
  }

  update(condition) {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.angle += this.rotationSpeed; // Update rotation angle

    if (condition) {
      this.pos.add(this.vel);
      this.pos.add(this.vel);
      this.pos.add(this.vel);
    }
  }

  edges() {
    if (
      this.pos.x < -imgWidth / 2 ||
      this.pos.x > width + imgWidth / 2 ||
      this.pos.y < -imgHeight / 2 ||
      this.pos.y > height + imgHeight / 2
    ) {
      return true;
    } else {
      return false;
    }
  }

  checkOverlap(others) {
    for (let other of others) {
      if (other !== this) {
        let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
        if (d < imgWidth) {
          this.changeColorOpacity(); // Change color and opacity
          break; // Break the loop if one overlap is detected
        }
      }
    }
  }

  changeColorOpacity() {
    this.color = color(random(255), random(255), random(255), random(100, 200)); // Change color and opacity
  }
}

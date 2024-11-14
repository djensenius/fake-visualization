let circles = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    noStroke();
    frameRate(10); // Slows down the drawing

    // Initialize circles
    for (let i = 0; i < 10000; i++) { // Increase the number of circles
        circles.push(new Circle());
    }
}

function draw() {
    background(50, 50, 50, 25); // Darker background with alpha for fading trail effect

    // Update and display circles
    for (let circle of circles) {
        circle.update();
        circle.display();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// Circle class
class Circle {
    constructor() {
        this.x = random(width);
        this.y = random(height);
        this.size = random(20, 100);
        this.xSpeed = random(-2, 2);
        this.ySpeed = random(-2, 2);
        this.color = color(random(100, 255), random(100, 255), random(100, 255), 150);
    }

    update() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;

        // Wrap around edges
        if (this.x > width) this.x = 0;
        if (this.x < 0) this.x = width;
        if (this.y > height) this.y = 0;
        if (this.y < 0) this.y = height;
    }

    display() {
        fill(this.color);
        ellipse(this.x, this.y, this.size);
    }
}
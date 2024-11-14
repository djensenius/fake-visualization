let circles = [];
let endpoint = 'http://127.0.0.1:3000'; // Replace with your actual endpoint
let latestTimestamp = '';
let totalUsers = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    noStroke();
    frameRate(10); // Slows down the drawing

    // Connect to the data stream
    connectToStream();
}

function draw() {
    background(50, 50, 50, 25); // Darker background with alpha for fading trail effect

    // Update and display circles
    for (let circle of circles) {
        circle.update();
        circle.display();
    }

    // Display latest data timestamp and total users
    fill(255);
    textSize(16);
    textAlign(LEFT, TOP);
    text(`Latest Data: ${latestTimestamp}`, 10, 10);
    text(`Total Users: ${totalUsers}`, 10, 30);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function connectToStream() {
    const eventSource = new EventSource(endpoint);

    eventSource.onmessage = function(event) {
        console.log('Received data:', event.data);
        const data = JSON.parse(event.data);
        circles = []; // Clear existing circles
        totalUsers = 0; // Reset total users
        for (let item of data) {
            let circle = new Circle(item);
            circles.push(circle);
            totalUsers += item.users; // Sum up total users
        }
        latestTimestamp = new Date().toLocaleString(); // Update latest timestamp
    };

    eventSource.onerror = function(error) {
        console.error('Error connecting to stream:', error);
        eventSource.close();
    };
}

// Circle class
class Circle {
    constructor(data) {
        this.x = random(width);
        this.y = random(height);
        this.size = map(data.users, 0, 10000, 20, 100); // Map users to size
        this.xSpeed = random(-2, 2);
        this.ySpeed = random(-2, 2);
        this.color = this.getColor(data.condition);
    }

    getColor(condition) {
        switch (condition) {
            case 'Sunny':
                return color(255, 204, 0, 150);
            case 'Cloudy':
                return color(200, 200, 200, 150);
            case 'Stormy':
                return color(50, 50, 150, 150);
            default:
                return color(100, 100, 100, 150);
        }
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
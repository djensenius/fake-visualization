let circles = [];
let endpoint = 'http://127.0.0.1:3000'; // Replace with your actual endpoint
let latestTimestamp = '';
let totalUsers = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    noStroke();
    frameRate(60); // Slows down the drawing

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
        updateCircles(data); // Update circles with new data
        totalUsers = data.reduce((sum, item) => sum + item.users, 0); // Sum up total users
        latestTimestamp = new Date().toLocaleString(); // Update latest timestamp
    };

    eventSource.onerror = function(error) {
        console.error('Error connecting to stream:', error);
        eventSource.close();
    };
}

function updateCircles(newData) {
    // Assuming newData is an array of objects with properties users and condition
    let tripledData = [];
    for (let i = 0; i < newData.length; i++) {
        // Push the same data three times to triple the circles
        tripledData.push(newData[i]);
        tripledData.push(newData[i]);
        tripledData.push(newData[i]);
    }

    for (let i = 0; i < tripledData.length; i++) {
        if (i < circles.length) {
            // Update existing circle
            circles[i].updateData(tripledData[i]);
        } else {
            // Create new circle if needed
            circles.push(new Circle(tripledData[i]));
        }
    }
    // Remove extra circles if tripledData has fewer elements
    circles.splice(tripledData.length);
}

// Circle class
class Circle {
    constructor(data) {
        this.x = random(width);
        this.y = random(height);
        this.size = map(data.users, 0, 10000, 10, 50); // Map users to size
        this.xSpeed = this.mapSpeed(data.temperature);
        this.ySpeed = this.mapSpeed(data.humidity);
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

    mapSpeed(value) {
        // Map the value to a speed range, e.g., 0 to 1
        let speed = map(value, 0, 100, 0, 0.3);
        // Randomly make it positive or negative
        return random() < 0.5 ? speed : -speed;
    }

    updateData(data) {
        this.size = map(data.users, 0, 10000, 10, 50); // Update size with smaller and closer range
        this.color = this.getColor(data.condition); // Update color
        this.xSpeed = this.mapSpeed(data.temperature); // Update x speed
        this.ySpeed = this.mapSpeed(data.humidity); // Update y speed
    }

    update() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.xSpeed *= -1;
        if (this.y < 0 || this.y > height) this.ySpeed *= -1;
    }

    display() {
        fill(this.color);
        ellipse(this.x, this.y, this.size);
    }
}
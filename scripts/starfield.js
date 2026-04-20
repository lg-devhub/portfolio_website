document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.createElement("canvas");
    canvas.id = "bg-starfield";
    document.body.prepend(canvas);

    const ctx = canvas.getContext("2d");
    let width, height;

    let stars = [];
    let asteroids = [];

    const numStars = 150;
    const maxAsteroids = 2; // Maximum asteroids on screen at once

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", resize);
    resize();

    // Check Theme
    function getThemeColor(alpha = 1) {
        const isLight = document.documentElement.classList.contains("light-theme");
        return isLight ? `rgba(20, 20, 20, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
    }

    class Star {
        constructor() {
            this.reset();
            // Randomize initial position anywhere
            this.x = Math.random() * width;
            this.y = Math.random() * height;
        }

        reset() {
            this.y = Math.random() * height;
            // Spawn offscreen right
            this.x = width + Math.random() * 200; 
            
            // Simulating depth with size and speed
            this.z = Math.random() * 2 + 0.1; // size between 0.1 and 2.1
            this.speed = this.z * 0.2; // bigger stars move faster
            this.alpha = Math.random() * 0.5 + 0.3; // opacity 0.3 - 0.8
        }

        update() {
            this.x -= this.speed;
            
            // Subtle slow vertical drift
            this.y += (Math.random() - 0.5) * 0.1; 

            // If it goes offscreen left, reset it to the right
            if (this.x < -10 || this.y < -10 || this.y > height + 10) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.z, 0, Math.PI * 2);
            ctx.fillStyle = getThemeColor(this.alpha);
            ctx.fill();
        }
    }

    class Asteroid {
        constructor() {
            this.reset();
            // Start completely offscreen so it doesn't just instantly spawn in middle
            this.active = false;
            this.timer = Math.random() * 200 + 50; 
        }

        reset() {
            // Spawn top-right or right edge
            if (Math.random() > 0.5) {
                this.x = Math.random() * width + 100;
                this.y = -50;
            } else {
                this.x = width + 50;
                this.y = Math.random() * height * 0.5;
            }
            
            // Very fast diagonal movement
            this.vx = - (Math.random() * 4 + 6);
            this.vy = (Math.random() * 3 + 4);
            
            this.length = Math.random() * 60 + 40; // Tail length
            this.thickness = Math.random() * 1.5 + 0.5;
            this.alpha = Math.random() * 0.5 + 0.5;
            
            this.active = true;
        }

        update() {
            if (!this.active) {
                this.timer--;
                if (this.timer <= 0) {
                    this.reset();
                }
                return;
            }

            this.x += this.vx;
            this.y += this.vy;

            // Kill if totally offscreen
            if (this.x < -this.length || this.y > height + this.length) {
                this.active = false;
                this.timer = Math.random() * 300 + 100; // Wait longer before respawning
            }
        }

        draw() {
            if (!this.active) return;
            
            const tailX = this.x - this.vx * (this.length / 10);
            const tailY = this.y - this.vy * (this.length / 10);

            const gradient = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
            gradient.addColorStop(0, getThemeColor(this.alpha));
            gradient.addColorStop(1, getThemeColor(0));

            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(tailX, tailY);
            ctx.lineWidth = this.thickness;
            ctx.strokeStyle = gradient;
            ctx.stroke();
            
            // Glowing head
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.thickness, 0, Math.PI * 2);
            ctx.fillStyle = getThemeColor(this.alpha + 0.2);
            
            // Add native canvas glow
            ctx.shadowBlur = 10;
            ctx.shadowColor = getThemeColor(1);
            ctx.fill();
            
            // Reset blur explicitly so stars don't lag
            ctx.shadowBlur = 0; 
        }
    }

    // Initialize Arrays
    for (let i = 0; i < numStars; i++) {
        stars.push(new Star());
    }
    for (let i = 0; i < maxAsteroids; i++) {
        asteroids.push(new Asteroid());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        stars.forEach(star => {
            star.update();
            star.draw();
        });

        asteroids.forEach(asteroid => {
            asteroid.update();
            asteroid.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
});

// jellyfish.js
// This code creates a jellyfish animation on an HTML canvas.
// It includes jellyfish that follow the mouse and random-moving jellyfish.
// The jellyfish have tentacles and a gradient effect.
// The animation also includes bubbles and a wave effect in the background.
// The jellyfish and bubbles are animated with random movement and scattering behavior.
// The code is designed to be used in a web environment with an HTML canvas element.
class Jellyfish {
  constructor(x, y, size, color, isFollower = false, canvas) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.size = size;
    this.color = color;
    this.isFollower = isFollower;
    this.trail = [];
    this.canvas = canvas;
  }

  update(mouse, jellyfishList) {
    if (this.isFollower && mouse.x !== null && mouse.y !== null) {
      this.x += (mouse.x - this.x) * 0.1;
      this.y += (mouse.y - this.y) * 0.1;
      this.trail.push(new Particle(this.x, this.y, this.size * 0.3, '255, 99, 132'));
      if (this.trail.length > 50) this.trail.shift();
    } else {
      // Find the mouse-following jellyfish
      const follower = jellyfishList.find(j => j.isFollower);
      if (follower) {
        const dx = this.x - follower.x;
        const dy = this.y - follower.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const scatterDistance = 100; // Scatter within 100px
        if (distance < scatterDistance && distance > 0) {
          // Calculate scattering velocity (away from follower)
          const scatterStrength = (1 - distance / scatterDistance) * 1;
          this.vx += (dx / distance) * scatterStrength;
          this.vy += (dy / distance) * scatterStrength;
          this.vx *= 0.95;
          this.vy *= 0.95;
        } else {
          // Small random velocity tweaks when not scattering
          this.vx += (Math.random() - 0.5) * 0.1;
          this.vy += (Math.random() - 0.5) * 0.1;
        }
      }

      // Check for collisions with other non-following jellyfish
      jellyfishList.forEach(other => {
        if (other !== this && !other.isFollower && !this.isFollower) {
          const dx = this.x - other.x;
          const dy = this.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = this.size + other.size;
          if (distance < minDistance && distance > 0) {
            // Collision detected, apply random bounce
            const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            const randomAngle = Math.random() * 2 * Math.PI;
            const newSpeed = currentSpeed * 0.8; // Preserve 80% of speed
            this.vx = Math.cos(randomAngle) * newSpeed;
            this.vy = Math.sin(randomAngle) * newSpeed;

            // Also bounce the other jellyfish
            const otherSpeed = Math.sqrt(other.vx * other.vx + other.vy * other.vy);
            const otherAngle = Math.random() * 2 * Math.PI;
            other.vx = Math.cos(otherAngle) * newSpeed;
            other.vy = Math.sin(otherAngle) * newSpeed;

            // Prevent overlap by pushing them apart
            const overlap = (minDistance - distance) / 2;
            const pushX = (dx / distance) * overlap;
            const pushY = (dy / distance) * overlap;
            this.x += pushX;
            this.y += pushY;
            other.x -= pushX;
            other.y -= pushY;
          }
        }
      });

      // Random movement
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off edges with random direction
      const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (this.x < this.size || this.x > this.canvas.width - this.size || 
          this.y < this.size || this.y > this.canvas.height - this.size) {
        // Generate a random angle for the new direction
        const randomAngle = Math.random() * 2 * Math.PI;
        // Preserve 80% of the current speed
        const newSpeed = currentSpeed * 0.8;
        this.vx = Math.cos(randomAngle) * newSpeed;
        this.vy = Math.sin(randomAngle) * newSpeed;
        // Ensure jellyfish stays within bounds
        this.x = Math.max(this.size, Math.min(this.canvas.width - this.size, this.x));
        this.y = Math.max(this.size, Math.min(this.canvas.height - this.size, this.y));
      }

      // Cap velocity magnitude to 2px/frame
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      const maxSpeed = 2;
      if (speed > maxSpeed) {
        const scale = maxSpeed / speed;
        this.vx *= scale;
        this.vy *= scale;
      }
    }
  }

  draw(ctx) {
    this.trail.forEach((particle, index) => {
      particle.update();
      particle.draw(ctx);
      if (particle.opacity <= 0) this.trail.splice(index, 1);
    });

    ctx.save();
    const jellyfishGradient = ctx.createRadialGradient(this.x, this.y, this.size * 0.3, this.x, this.y, this.size);
    jellyfishGradient.addColorStop(0, this.color);
    jellyfishGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = jellyfishGradient;
    ctx.fill();
    ctx.restore();

    const tentacleCount = 8;
    for (let i = 0; i < tentacleCount; i++) {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y + this.size * 0.5);
      const angle = Math.PI + (i - tentacleCount / 2) * 0.2;
      const tentacleLength = this.size * 2;
      for (let t = 0; t <= 1; t += 0.1) {
        const waveOffset = Math.sin(Date.now() * 0.004 + t * 10 + i) * 5;
        const endX = this.x + Math.cos(angle) * tentacleLength * t + waveOffset;
        const endY = this.y + Math.sin(angle) * tentacleLength * t + t * 20;
        ctx.lineTo(endX, endY);
      }
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.stroke();
    }
  }
}

class Bubble {
  constructor(x, y, radius, canvas) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.vy = -Math.random() * 2 - 1;
    this.canvas = canvas;
  }

  update() {
    this.y += this.vy;
    if (this.y + this.radius < 0) {
      this.y = this.canvas.height + this.radius;
      this.x = Math.random() * this.canvas.width;
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fill();
    ctx.closePath();
  }
}

class Particle {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.opacity = 1;
  }

  update() {
    this.size *= 0.95;
    this.opacity -= 0.02;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
    ctx.fill();
    ctx.closePath();
  }
}

export function initJellyfishAnimation() {
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Failed to get 2D context for canvas');
    return () => {};
  }

  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = '10';
  canvas.style.pointerEvents = 'none';

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  console.log('Canvas initialized:', canvas.width, canvas.height);

  const mouse = { x: null, y: null };

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const jellyfishList = [];
  // Mouse-following jellyfish
  jellyfishList.push(new Jellyfish(
    canvas.width / 2,
    canvas.height / 2,
    25,
    'rgba(255, 99, 132, 0.8)',
    true,
    canvas
  ));
  // Random-moving jellyfish
  const colors = ['rgba(100, 149, 237, 0.8)', 'rgba(152, 251, 152, 0.8)', 'rgba(255, 182, 193, 0.8)', 'rgba(135, 206, 250, 0.8)'];
  for (let i = 0; i < 4; i++) {
    jellyfishList.push(new Jellyfish(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      20,
      colors[i],
      false,
      canvas
    ));
  }

  const bubbles = [];
  for (let i = 0; i < 50; i++) {
    const radius = Math.random() * 5 + 2;
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    bubbles.push(new Bubble(x, y, radius, canvas));
  }

  function animate() {
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(0, 0, 50, 1)');
    gradient.addColorStop(1, 'rgba(0, 50, 100, 1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    bubbles.forEach((bubble) => {
      bubble.update();
      bubble.draw(ctx);
    });

    // First wave layer
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    const waveAmplitude1 = 15 + Math.sin(Date.now() * 0.0005) * 10;
    const waveOffsetY1 = canvas.height * 0.8 + Math.sin(Date.now() * 0.0003) * 50;
    for (let x = 0; x <= canvas.width; x += 5) {
      const y = waveOffsetY1 + Math.sin((x + Date.now() * 0.001) * 0.01) * waveAmplitude1;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fill();

    // Second wave layer
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    const waveAmplitude2 = 10 + Math.sin(Date.now() * 0.0004) * 8;
    const waveOffsetY2 = canvas.height * 0.82 + Math.sin(Date.now() * 0.0002) * 40;
    for (let x = 0; x <= canvas.width; x += 5) {
      const y = waveOffsetY2 + Math.sin((x + Date.now() * 0.0015) * 0.012) * waveAmplitude2;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fill();

    jellyfishList.forEach((jellyfish) => {
      jellyfish.update(mouse, jellyfishList);
      jellyfish.draw(ctx);
    });

    requestAnimationFrame(animate);
  }

  animate();

  return () => {
    canvas.remove();
    window.removeEventListener('resize', () => {});
    window.removeEventListener('mousemove', () => {});
  };
}
/**
 * Kinetic Auto-Battler Sandbox
 * Multi-shape rendering & improved UI/UX
 */

const canvas = document.getElementById('sandbox');
const ctx = canvas.getContext('2d');
const uiLayer = document.querySelector('.ui-layer');

canvas.width = innerWidth;
canvas.height = innerHeight;

const colors = ['#00ff99', '#00ccff', '#ff0055', '#ffcc00', '#cc00ff'];
const shapes = ['circle', 'square', 'triangle', 'star', 'heart'];

// --- Utility Functions ---

function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function rotate(velocity, angle) {
    return {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };
}

function resolveCollision(entity1, entity2) {
    const xVelocityDiff = entity1.velocity.x - entity2.velocity.x;
    const yVelocityDiff = entity1.velocity.y - entity2.velocity.y;
    const xDist = entity2.x - entity1.x;
    const yDist = entity2.y - entity1.y;

    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
        const angle = -Math.atan2(yDist, xDist);
        const m1 = entity1.mass;
        const m2 = entity2.mass;

        const u1 = rotate(entity1.velocity, angle);
        const u2 = rotate(entity2.velocity, angle);

        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m2 - m1) / (m1 + m2) + u1.x * 2 * m1 / (m1 + m2), y: u2.y };

        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        entity1.velocity.x = vFinal1.x;
        entity1.velocity.y = vFinal1.y;
        entity2.velocity.x = vFinal2.x;
        entity2.velocity.y = vFinal2.y;

        const now = Date.now();
        if (now - entity1.lastHitTime > 300 && now - entity2.lastHitTime > 300) {
            entity1.takeDamage(entity2.attackPower);
            entity2.takeDamage(entity1.attackPower);
        }
    }
}

// --- KineticEntity Class ---

class KineticEntity {
    constructor(x, y, radius, color, name = "Unknown", shape = "circle") {
        this.id = Math.random().toString(36).substr(2, 9);
        this.name = name;
        this.shape = shape;
        this.x = x;
        this.y = y;
        this.velocity = {
            x: (Math.random() - 0.5) * 8,
            y: (Math.random() - 0.5) * 8
        };
        this.radius = radius;
        this.color = color;
        this.mass = radius;
        
        this.maxHp = radius * 5;
        this.hp = this.maxHp;
        this.attackPower = radius * 1.5;
        this.critChance = Math.random() * 0.3;
        this.lastHitTime = 0;
        this.isFlashing = false;
    }

    takeDamage(baseDamage) {
        let finalDamage = baseDamage;
        if (Math.random() < this.critChance) finalDamage *= 2; 

        this.hp -= finalDamage;
        this.lastHitTime = Date.now();
        
        this.isFlashing = true;
        setTimeout(() => this.isFlashing = false, 100);
    }

    drawShape() {
        ctx.beginPath();
        const r = this.radius;

        switch(this.shape) {
            case 'square':
                ctx.rect(-r * 0.8, -r * 0.8, r * 1.6, r * 1.6);
                break;
            case 'triangle':
                ctx.moveTo(0, -r);
                ctx.lineTo(r * 0.866, r * 0.5);
                ctx.lineTo(-r * 0.866, r * 0.5);
                break;
            case 'star':
                for (let i = 0; i < 5; i++) {
                    ctx.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI) * r, -Math.sin((18 + i * 72) / 180 * Math.PI) * r);
                    ctx.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * (r * 0.4), -Math.sin((54 + i * 72) / 180 * Math.PI) * (r * 0.4));
                }
                break;
            case 'heart':
                const topCurveHeight = r * 0.3;
                ctx.moveTo(0, topCurveHeight);
                ctx.bezierCurveTo(0, -r*0.5, -r, -r*0.5, -r, topCurveHeight);
                ctx.bezierCurveTo(-r, r*0.8, 0, r, 0, r);
                ctx.bezierCurveTo(0, r, r, r*0.8, r, topCurveHeight);
                ctx.bezierCurveTo(r, -r*0.5, 0, -r*0.5, 0, topCurveHeight);
                break;
            case 'circle':
            default:
                ctx.arc(0, 0, r, 0, Math.PI * 2, false);
                break;
        }

        ctx.fillStyle = this.isFlashing ? '#ffffff' : this.color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = this.isFlashing ? 3 : 1;
        ctx.stroke();
        ctx.closePath();
    }

    draw() {
        // Isolate canvas state to draw shapes properly from their center
        ctx.save();
        ctx.translate(this.x, this.y);
        this.drawShape();
        ctx.restore();

        // HP Bar
        const hpPercentage = Math.max(0, this.hp / this.maxHp);
        const barWidth = this.radius * 2;
        const barHeight = 4;
        const barX = this.x - this.radius;
        const barY = this.y - this.radius - 20;

        ctx.fillStyle = '#ff0055';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        ctx.fillStyle = '#00ff99';
        ctx.fillRect(barX, barY, barWidth * hpPercentage, barHeight);

        // Improved Text Rendering (Outline + Fill for High Contrast)
        ctx.font = "bold 13px 'Segoe UI', Arial, sans-serif";
        ctx.textAlign = "center";
        
        // 1. Draw heavy black stroke first
        ctx.lineWidth = 4;
        ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
        ctx.strokeText(this.name, this.x, barY - 8);
        
        // 2. Draw crisp white text on top
        ctx.fillStyle = "white";
        ctx.fillText(this.name, this.x, barY - 8);
    }

    update(entities) {
        this.draw();

        if (this.x - this.radius <= 0 || this.x + this.radius >= innerWidth) {
            this.velocity.x = -this.velocity.x;
            this.x = Math.max(this.radius, Math.min(this.x, innerWidth - this.radius));
        }
        if (this.y - this.radius <= 0 || this.y + this.radius >= innerHeight) {
            this.velocity.y = -this.velocity.y;
            this.y = Math.max(this.radius, Math.min(this.y, innerHeight - this.radius));
        }

        for (let i = 0; i < entities.length; i++) {
            if (this === entities[i]) continue;
            if (distance(this.x, this.y, entities[i].x, entities[i].y) < this.radius + entities[i].radius) {
                resolveCollision(this, entities[i]);
            }
        }

        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

// --- State & Initialization ---

let entities = [];

function spawnEntity(x, y, name, color, shape) {
    const radius = randomIntFromRange(25, 45);
    const hasOverlap = entities.some(e => distance(x, y, e.x, e.y) < radius + e.radius);
    
    if (!hasOverlap) {
        entities.push(new KineticEntity(x, y, radius, color, name, shape));
        uiLayer.classList.add('hidden');
    }
}

// --- Event Listeners ---

// UI Toggle Logic
const panel = document.getElementById('control-panel');
const toggleBtn = document.getElementById('toggle-panel-btn');

toggleBtn.addEventListener('click', () => {
    panel.classList.toggle('minimized');
    toggleBtn.textContent = panel.classList.contains('minimized') ? '+' : '−';
});

// Spawn Button
document.getElementById('spawn-btn').addEventListener('click', () => {
    const nameInput = document.getElementById('entity-name').value || "Gladiator";
    const colorInput = document.getElementById('entity-color').value;
    const shapeInput = document.getElementById('entity-shape').value;
    
    spawnEntity(innerWidth / 2, innerHeight / 2, nameInput, colorInput, shapeInput);
});

// Random Spawn via Click
window.addEventListener('mousedown', (e) => {
    if(e.target.closest('.control-panel')) return;
    
    const randomNames = ["Drone", "Scrapper", "Bot", "Vanguard", "Sentinel"];
    const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    const randomColorInput = colors[Math.floor(Math.random() * colors.length)];

    spawnEntity(e.clientX, e.clientY, randomName, randomColorInput, randomShape);
});

window.addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
});

// --- Animation Loop ---

function animate() {
    requestAnimationFrame(animate);
    
    ctx.fillStyle = 'rgba(13, 14, 21, 0.4)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    entities.forEach(entity => entity.update(entities));
    entities = entities.filter(entity => entity.hp > 0);
}

animate();
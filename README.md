📑 1. Project Abstract
The Kinetic Auto-Battler Arena is a highly performant, zero-player 2D physics sandbox built entirely with Vanilla JavaScript and the HTML5 Canvas API. It combines realistic elastic collision mechanics with RPG-lite auto-battler features, allowing users to spawn dynamic geometric entities that bounce, collide, and battle within an interactive arena. The project serves as a showcase of advanced client-side rendering, applied mathematics, and modern Object-Oriented Programming (OOP) without the use of external frameworks.

🎯 2. Problem Statement
Building performant 2D physics simulations and games typically relies on heavy external libraries (like Matter.js) or full game engines (Unity, Godot). This project challenges that dependency by demonstrating how to build a highly optimized, lightweight physics engine and state management system from scratch using pure frontend web technologies. It solves the architectural challenge of managing complex entity lifecycles and collision math while completely avoiding beginner-level "spaghetti code."

⚙️ 3. System Modules & Features
Elastic Physics Engine: Implements perfectly elastic collisions by mapping 1D Newtonian momentum formulas to a 2D coordinate system, transferring kinetic energy realistically based on an object's mass and velocity.

Game State & Combat Logic: Entities autonomously manage their own lifecycle, including health points, attack power scaling, critical hit chances, and damage cooldowns to prevent frame-overlap instant-death.

Interactive UI Control Panel: Features a collapsible, glassmorphism-styled UI allowing users to customize gladiator names, shapes, and aura colors before injecting them into the simulation.

Multi-Shape Rendering Engine: Utilizes advanced HTML5 Canvas API drawing methods to render Circles, Squares, Triangles, Stars, and Hearts seamlessly.

Performance Optimization: Leverages requestAnimationFrame, circular bounding boxes for rapid hit-detection, and automated garbage collection for defeated entities to maintain a buttery-smooth 60 FPS.

💻 4. Technology Stack
This project was developed utilizing a lightweight, pure frontend architecture to ensure maximum speed and cross-browser compatibility.

Markup & Structure: HTML5 (Canvas API)

Styling & UI: CSS3 (Glassmorphism, CSS Transitions, Flexbox)

Logic & Physics: Vanilla JavaScript (ES6+ Classes, Math Object)

Version Control: Git & GitHub

🚀 5. Local Execution (Setup Instructions)
Since this project relies on a serverless frontend architecture, installation is straightforward and requires no database configuration, build tools, or package managers.


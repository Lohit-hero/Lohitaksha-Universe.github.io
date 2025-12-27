// ===========================================
// Card Reveal Functionality (Data Block Access)
// ===========================================
window.toggleReveal = function(element) {
    const toggleIcon = element.querySelector('.reveal-toggle');
    const content = element.nextElementSibling;
    
    if (content && toggleIcon) {
        // Toggle the visibility classes for CSS transition
        const isHidden = content.classList.contains('hidden-content');
        
        if (isHidden) {
            content.classList.remove('hidden-content');
            content.classList.add('visible-content');
        } else {
            content.classList.add('hidden-content');
            content.classList.remove('visible-content');
        }
        
        // Toggle icon rotation
        toggleIcon.classList.toggle('rotated');
    }
};

// ===========================================
// Initialization and Three.js Background
// ===========================================

window.onload = function() {
    // 1. Initialize Reveal State 
    // This ensures all hidden sections are ready for the CSS transition
    document.querySelectorAll('.hidden-content').forEach(content => {
        content.classList.add('hidden-content');
        content.classList.remove('visible-content');
    });

    // 2. Typing Effect Setup
    const introSpan = document.createElement('span');
    introSpan.id = 'typing-intro';
    const introText = "ACCESSING DATA STREAM: PORTFOLIO LOADED..."; // 45 characters
    introSpan.textContent = introText;

    const welcomeHeader = document.querySelector('#profile h1');
    const welcomeTextContainer = welcomeHeader.querySelector('span:first-child');
    if (welcomeTextContainer) {
        // Apply classes for the blinking cursor effect
        introSpan.classList.add('border-r-4', 'border-cyan-400', 'animate-pulse');
        // Clear the placeholder text and insert the span for animation
        welcomeTextContainer.textContent = ''; 
        welcomeTextContainer.appendChild(introSpan);
    }
    
    // 3. Three.js Setup (Background AI Core/Starfield)
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg-canvas'), antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x03001C, 1); // Deep Space Black-Blue

    // Starfield
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 5000;
    const posArray = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 2000;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starsMaterial = new THREE.PointsMaterial({
        color: 0x00ffff, 
        size: 1.5,
        sizeAttenuation: true
    });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Central AI Core Planet (Wireframe/Neon look)
    const planetGeometry = new THREE.SphereGeometry(100, 64, 64);
    const planetMaterial = new THREE.MeshLambertMaterial({
        color: 0x00FFFF, 
        emissive: 0x00FFFF,
        emissiveIntensity: 0.3,
        wireframe: true,
    });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    scene.add(planet);

    // Galaxy/Nebula Glow Effect (Shader-based)
    const galaxyMaterial = new THREE.ShaderMaterial({
        uniforms: {
            color1: { value: new THREE.Color(0x03001C) }, 
            color2: { value: new THREE.Color(0xFF00FF) }, // Magenta Edge Glow
            time: { value: 0 }
        },
        vertexShader: `
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 color1;
            uniform vec3 color2;
            uniform float time;
            varying vec3 vNormal;
            void main() {
                vec3 finalColor = mix(color1, color2, pow(dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0) + sin(time * 0.1));
                gl_FragColor = vec4(finalColor, 1.0);
            }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.7,
    });
    const galaxyMesh = new THREE.Mesh(new THREE.SphereGeometry(150, 32, 32), galaxyMaterial);
    scene.add(galaxyMesh);

    // Lighting 
    const ambientLight = new THREE.AmbientLight(0x00ffff, 0.1);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xFF00FF, 1.5, 1000); 
    pointLight.position.set(200, 200, 200);
    scene.add(pointLight);

    // Camera position
    camera.position.z = 250;

    // Mouse interaction for camera control
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    const toRadians = (angle) => angle * (Math.PI / 180);

    document.addEventListener('mousedown', (e) => { isDragging = true; });
    document.addEventListener('mouseup', (e) => { isDragging = false; });
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaMove = {
                x: e.clientX - previousMousePosition.x,
                y: e.clientY - previousMousePosition.y
            };
            // Reduced speed for a more stable feel
            planet.rotation.y += toRadians(deltaMove.x * 0.3); 
            planet.rotation.x += toRadians(deltaMove.y * 0.3);
            galaxyMesh.rotation.y += toRadians(deltaMove.x * 0.3);
            galaxyMesh.rotation.x += toRadians(deltaMove.y * 0.3);
        }
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation loop
    const animate = function(time) {
        requestAnimationFrame(animate);

        // Update time uniform for the shader glow
        galaxyMaterial.uniforms.time.value = time * 0.001;

        // Auto-rotate everything for perpetual cosmic movement
        stars.rotation.y += 0.0005;
        stars.rotation.x += 0.0005;
        planet.rotation.y += 0.001;
        galaxyMesh.rotation.y += 0.0005;

        renderer.render(scene, camera);
    };

    animate();
};

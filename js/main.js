// Base positions for clusters
const basePositions = {
  about: { x: -120, y: -90 },
  projects: { x: 100, y: -40 },
  contact: { x: -20, y: 80 },
  links: { x: -10, y: 120 }
};

const dotsPerCluster = 30;
let globalClusterData = null;

// Create dot-based header text
function createHeaderText() {
  const headerText = document.getElementById('header-text');
  if (!headerText) return;
  
  const text = 'AMALGAH.NET';
  const letterWidth = 30;
  const letterHeight = 60;
  const spacing = 10;
  let totalWidth = text.length * (letterWidth + spacing) - spacing;
  
  headerText.style.width = totalWidth + 'px';
  
  const letterPaths = {
      'A': [[0.5, 0], [0, 1], [0.2, 0.6], [0.8, 0.6], [1, 1], [0.5, 0]],
      'M': [[0, 1], [0, 0], [0.5, 0.5], [1, 0], [1, 1]],
      'L': [[0, 0], [0, 1], [1, 1]],
      'G': [[0.75, 0], [0.25, 0], [0, 0.25], [0, 0.75], [0.25, 1], [0.75, 1], [1, 0.75], [1, 0.5], [0.5, 0.5]],
      'H': [[0, 0], [0, 1], [0, 0.5], [1, 0.5], [1, 0], [1, 1]],
      '.': [[0.5, 0.9], [0.5, 1]],
      'N': [[0, 1], [0, 0], [1, 1], [1, 0]], 
      'E': [[0, 0], [0, 1], [1, 1], [0, 1], [0, 0.5], [0.8, 0.5], [0, 0.5], [0, 0], [1, 0]],  // Capital E
      'T': [[0.5, 0], [0.5, 1], [0.5, 0], [0, 0], [1, 0]]
  };
  
  const dotsPerLine = 8;
  let headerDots = [];
  
  for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const pathKey = char.match(/[a-z]/) ? char : char.toUpperCase();
      const path = letterPaths[pathKey] || [];
      const startX = i * (letterWidth + spacing);
      
      if (path.length === 0) continue;
      
      for (let j = 0; j < path.length - 1; j++) {
          const [x1, y1] = path[j];
          const [x2, y2] = path[j + 1];
          
          for (let d = 0; d <= dotsPerLine; d++) {
              const t = d / dotsPerLine;
              const x = x1 + (x2 - x1) * t;
              const y = y1 + (y2 - y1) * t;
              
              const dot = document.createElement('div');
              dot.className = 'header-dot';
              dot.style.left = (startX + x * letterWidth) + 'px';
              dot.style.top = (y * letterHeight) + 'px';
              headerDots.push(dot);
          }
      }
  }
  
  headerDots = shuffleArray(headerDots);
  headerDots.forEach(dot => headerText.appendChild(dot));
  
  headerDots.forEach((dot, index) => {
      gsap.to(dot, {
          scale: 1,
          delay: 0.01 * index,
          duration: 0.1,
          ease: "power1.out"
      });
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generateDots() {
  const clusters = document.querySelectorAll('.cluster');
  if (clusters.length === 0) return [];
  
  let clusterData = [];
  clusters.forEach((cluster) => {
      const dotsContainer = cluster.querySelector('.dots');
      const text = cluster.querySelector('.text');
      if (!dotsContainer || !text) return;
      
      dotsContainer.innerHTML = '';
      const textWidth = text.offsetWidth;
      const textHeight = text.offsetHeight;
      const transform = `translate(-${textWidth/2}px, -${textHeight/2}px)`;
      text.style.transform = transform;
      text.dataset.originalTransform = transform;
      
      const clusterDots = [];
      for (let i = 0; i < dotsPerCluster; i++) {
          let dot = document.createElement('div');
          dot.className = 'dot';
          let angle = Math.random() * 2 * Math.PI;
          let minRadius = Math.max(textWidth, textHeight) / 2 + 10;
          let radius = minRadius + Math.random() * 40;
          let x = Math.cos(angle) * radius;
          let y = Math.sin(angle) * radius;
          
          dot.style.transform = `translate(${x}px, ${y}px)`;
          dot.dataset.originalX = x;
          dot.dataset.originalY = y;
          dotsContainer.appendChild(dot);
          
          clusterDots.push({
              element: dot,
              originalX: x,
              originalY: y,
              currentX: x,
              currentY: y,
              speedX: (Math.random() - 0.5) * 2,
              speedY: (Math.random() - 0.5) * 2
          });
      }
      
      clusterData.push({
          element: cluster,
          dots: clusterDots,
          isHovered: false
      });
  });
  
  return clusterData;
}

function clusterPositions() {
  const container = document.querySelector('.container');
  if (!container) return;
  
  const containerRect = container.getBoundingClientRect();
  const centerX = containerRect.width / 2;
  const centerY = containerRect.height / 2;
  
  document.querySelectorAll('.cluster').forEach(cluster => {
      const id = cluster.id;
      if (!basePositions[id]) return;
      
      let x = centerX + basePositions[id].x + (Math.random() - 0.5) * 20;
      let y = centerY + basePositions[id].y + (Math.random() - 0.5) * 20;
      
      gsap.set(cluster, { 
          left: x,
          top: y,
          opacity: 0,
          scale: 0.5
      });
  });
}

function animateClustersEntrance() {
  const clusters = document.querySelectorAll('.cluster');
  if (clusters.length === 0) return;
  
  gsap.to(clusters, {
      opacity: 1,
      scale: 1,
      duration: 1,
      stagger: 0.2,
      ease: "back.out(1.7)"
  });
}

function animateAllDots(clusterData) {
  function animate() {
      clusterData.forEach(cluster => {
          cluster.dots.forEach(dot => {
              const range = cluster.isHovered ? 15 : 5;
              const speed = cluster.isHovered ? 0.08 : 0.03;
              
              dot.currentX += dot.speedX * speed;
              dot.currentY += dot.speedY * speed;
              
              const distX = dot.currentX - dot.originalX;
              const distY = dot.currentY - dot.originalY;
              
              if (Math.abs(distX) > range) {
                  dot.speedX *= -1;
                  dot.currentX = dot.originalX + (range * Math.sign(distX));
              }
              
              if (Math.abs(distY) > range) {
                  dot.speedY *= -1;
                  dot.currentY = dot.originalY + (range * Math.sign(distY));
              }
              
              dot.element.style.transform = `translate(${dot.currentX}px, ${dot.currentY}px)`;
          });
      });
      requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

function setupHoverEvents(clusterData) {
  clusterData.forEach(cluster => {
      const element = cluster.element;
      const text = element.querySelector('.text');
      
      element.addEventListener("mouseenter", () => {
          cluster.isHovered = true;
          gsap.to(text, { scale: 1.2, duration: 0.3 });
          const dots = element.querySelectorAll('.dot');
          gsap.to(dots, { opacity: 1, duration: 0.5 });
      });

      element.addEventListener("mouseleave", () => {
          cluster.isHovered = false;
          gsap.to(text, { scale: 1, duration: 0.3 });
          const dots = element.querySelectorAll('.dot');
          gsap.to(dots, { opacity: 0.7, duration: 0.5 });
      });
  });
}

function init() {
  createHeaderText();
  clusterPositions();
  globalClusterData = generateDots();
  
  if (globalClusterData.length > 0) {
      setupHoverEvents(globalClusterData);
      setTimeout(animateClustersEntrance, 100);
      animateAllDots(globalClusterData);
  }
}

function handleResize() {
  clusterPositions();
  
  document.querySelectorAll('.cluster').forEach(cluster => {
      gsap.to(cluster, {
          opacity: 1,
          scale: 1,
          duration: 0.5
      });
  });
  
  if (globalClusterData) {
      globalClusterData.forEach(cluster => {
          const text = cluster.element.querySelector('.text');
          if (!text) return;
          
          const textWidth = text.offsetWidth;
          const textHeight = text.offsetHeight;
          const transform = `translate(-${textWidth/2}px, -${textHeight/2}px)`;
          text.style.transform = transform;
          text.dataset.originalTransform = transform;
      });
  }
}

window.addEventListener('load', init);

let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(handleResize, 200);
});
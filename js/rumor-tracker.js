// Rumor Ingress & Spread Tracker Canvas-based Visual Network Graph
let animationFrameId = null;

export function renderRumorTracker(canvasId, nodeNames = []) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  
  // Cancel previous animation frame if running
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  // Adjust canvas resolution for high-DPI displays
  const resizeCanvas = () => {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  };
  
  resizeCanvas();

  // Nodes setup (horizontal zig-zag positions in % values)
  const defaultNodes = [
    { label: "Origin", platform: "Facebook Post", shares: "14K", date: "June 10", xPct: 0.12, yPct: 0.5 },
    { label: "WhatsApp Groups", platform: "Group Forwards", shares: "120K", date: "June 11", xPct: 0.32, yPct: 0.3 },
    { label: "Twitter Trend", platform: "Hashtag Campaign", shares: "310K", date: "June 11", xPct: 0.52, yPct: 0.7 },
    { label: "News Blogs", platform: "Syndicated Reposts", shares: "98K", date: "June 12", xPct: 0.72, yPct: 0.3 },
    { label: "Fact Check", platform: "TruthLens Verification", shares: "Verified", date: "June 13", xPct: 0.9, yPct: 0.5 }
  ];

  // Map input nodes names if provided
  const nodes = defaultNodes.map((node, idx) => {
    if (nodeNames[idx]) {
      node.label = nodeNames[idx].split(":")[0] || nodeNames[idx];
      node.platform = nodeNames[idx].split(":")[1] || node.platform;
    }
    return node;
  });

  let hoverIdx = -1;
  let flowOffset = 0;

  // Track mouse coordinates for hover tooltip triggers
  const getMousePos = (e) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseMove = (e) => {
    const pos = getMousePos(e);
    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;
    
    let activeIdx = -1;
    nodes.forEach((n, index) => {
      const nx = n.xPct * w;
      const ny = n.yPct * h;
      const dist = Math.sqrt((pos.x - nx) ** 2 + (pos.y - ny) ** 2);
      if (dist < 28) { // Hover radius check
        activeIdx = index;
      }
    });

    if (activeIdx !== hoverIdx) {
      hoverIdx = activeIdx;
      canvas.style.cursor = hoverIdx > -1 ? "pointer" : "default";
    }
  };

  canvas.addEventListener("mousemove", handleMouseMove);

  // Drawing loop
  const draw = () => {
    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;
    
    // Clear canvas
    ctx.clearRect(0, 0, w, h);

    // Retrieve active theme variables dynamically
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    const gridColor = currentTheme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(15,23,42,0.02)";
    const lineColor = currentTheme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.06)";
    const textColor = currentTheme === "dark" ? "#94a3b8" : "#475569";
    const primaryGlow = currentTheme === "dark" ? "rgba(37, 99, 235, 0.4)" : "rgba(37, 99, 235, 0.15)";
    
    // 1. Draw Tech grid lines background
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // 2. Draw connections
    ctx.lineWidth = 3;
    for (let i = 0; i < nodes.length - 1; i++) {
      const n1 = nodes[i];
      const n2 = nodes[i + 1];
      const x1 = n1.xPct * w;
      const y1 = n1.yPct * h;
      const x2 = n2.xPct * w;
      const y2 = n2.yPct * h;

      // Base line
      ctx.strokeStyle = lineColor;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Flow particle lines (pulsing dash)
      ctx.strokeStyle = "var(--primary-color)";
      ctx.lineWidth = 3.5;
      ctx.setLineDash([15, 35]);
      ctx.lineDashOffset = -flowOffset;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash
      ctx.lineWidth = 3;
    }

    flowOffset += 0.8; // Speed of light particles

    // 3. Draw Nodes
    nodes.forEach((n, idx) => {
      const nx = n.xPct * w;
      const ny = n.yPct * h;
      const isHovered = (idx === hoverIdx);

      // Node shadow glow
      ctx.shadowColor = isHovered ? "var(--primary-color)" : primaryGlow;
      ctx.shadowBlur = isHovered ? 20 : 10;

      // Node core circle
      ctx.fillStyle = isHovered ? "var(--primary-color)" : "var(--card-bg)";
      ctx.strokeStyle = isHovered ? "#fff" : "var(--primary-color)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(nx, ny, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset shadow

      // Center symbol / icon index
      ctx.fillStyle = isHovered ? "#fff" : "var(--text-primary)";
      ctx.font = "bold 13px var(--font-heading)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      let badgeSymbol = (idx + 1).toString();
      if (idx === nodes.length - 1) badgeSymbol = "✓"; // Fact check done checkmark
      ctx.fillText(badgeSymbol, nx, ny);

      // Labels below/above nodes
      ctx.fillStyle = currentTheme === "dark" ? "#f8fafc" : "#0f172a";
      ctx.font = "bold 12px var(--font-heading)";
      
      const labelY = ny + (n.yPct > 0.5 ? -32 : 36);
      ctx.fillText(n.label, nx, labelY);
      
      ctx.fillStyle = textColor;
      ctx.font = "500 10px var(--font-body)";
      ctx.fillText(n.platform, nx, labelY + (n.yPct > 0.5 ? -12 : 12));
    });

    // 4. Draw Hover Tooltip Info
    if (hoverIdx > -1) {
      const n = nodes[hoverIdx];
      const nx = n.xPct * w;
      const ny = n.yPct * h;
      const tooltipW = 150;
      const tooltipH = 70;
      
      // Calculate layout coordinates so tooltip stays within viewport
      let tx = nx + 25;
      let ty = ny - 35;
      if (tx + tooltipW > w) tx = nx - tooltipW - 25;
      if (ty + tooltipH > h) ty = h - tooltipH - 10;
      if (ty < 10) ty = 10;

      // Draw glass card tooltip
      ctx.fillStyle = currentTheme === "dark" ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)";
      ctx.strokeStyle = "var(--primary-color)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(tx, ty, tooltipW, tooltipH, 8);
      ctx.fill();
      ctx.stroke();

      // Tooltip Text details
      ctx.textAlign = "left";
      ctx.fillStyle = currentTheme === "dark" ? "#f8fafc" : "#0f172a";
      ctx.font = "bold 11px var(--font-heading)";
      ctx.fillText(n.platform, tx + 12, ty + 18);
      
      ctx.fillStyle = textColor;
      ctx.font = "500 10px var(--font-body)";
      ctx.fillText(`Date: ${n.date}`, tx + 12, ty + 36);
      ctx.fillText(`Shares/Forwards: ${n.shares}`, tx + 12, ty + 50);
    }

    animationFrameId = requestAnimationFrame(draw);
  };

  // Start animation loop
  draw();
  
  // Resize listener
  window.addEventListener("resize", resizeCanvas);
}

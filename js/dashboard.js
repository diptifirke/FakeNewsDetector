import { auth } from "./firebase-config.js";

// Procedural Weekly Leaderboard Data
const leaderboard = [
  { rank: 1, name: "🏆 Dipti", points: 450, count: 12, badge: "Expert Fact Checker" },
  { rank: 2, name: "Amit Sharma", points: 380, count: 10, badge: "Hoax Deflector" },
  { rank: 3, name: "Sneha Patel", points: 310, count: 8, badge: "Fact Checker" },
  { rank: 4, name: "Raj Malhotra", points: 280, count: 7, badge: "Truth Beginner" },
  { rank: 5, name: "Kiran Rao", points: 190, count: 5, badge: "Truth Beginner" }
];

// Badge configs
const badges = [
  { id: "truth_beginner", name: "Truth Beginner", desc: "Signed up and ran initial verification checks.", icon: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`, active: true },
  { id: "fact_checker", name: "Fact Checker", desc: "Verify 5 claims and earned 300+ truth points.", icon: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`, active: true },
  { id: "expert_investigator", name: "Expert Investigator", desc: "Unlock by earning 500+ truth points.", icon: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="8" r="7"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/></svg>`, active: false },
  { id: "hoax_deflector", name: "Hoax Deflector", desc: "Analyze 3 articles classified as Fake News.", icon: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`, active: true },
  { id: "whitelist_guru", name: "Whitelist Guru", desc: "Unlock by reviewing 10 whitelisted sources.", icon: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`, active: false },
  { id: "leaderboard_legend", name: "Leaderboard Legend", desc: "Unlock by reaching Rank 1 in weekly charts.", icon: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`, active: false }
];

document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("user-login-changed", (e) => {
    updateProfileForUser(e.detail.user);
  });
});

// Render dashboard bar charts and lists
export function renderDashboardStats() {
  // 1. Ingest statistics counters
  let totalScans = 6;
  let fakeScans = 3;
  let credibleScans = 2;
  let avgCredibility = 46;

  try {
    const raw = localStorage.getItem("truthlens_db_history");
    if (raw) {
      const history = JSON.parse(raw);
      totalScans = history.length + 6; // Include default baseline
      fakeScans = history.filter(h => h.verdict === "fake").length + 3;
      credibleScans = history.filter(h => h.verdict === "credible").length + 2;
      
      const sum = history.reduce((acc, curr) => acc + curr.credibility, 0) + 182; // include baseline
      avgCredibility = Math.round(sum / totalScans);
    }
  } catch (err) {}

  document.getElementById("dash-stat-total").textContent = totalScans;
  document.getElementById("dash-stat-fake").textContent = fakeScans;
  document.getElementById("dash-stat-credible").textContent = credibleScans;
  document.getElementById("dash-stat-avg").textContent = `${avgCredibility}%`;

  // 2. Bar Chart generator
  const chartBox = document.getElementById("dashboard-chart-bars");
  if (chartBox) {
    const barValues = [40, 70, 30, 95, 55, 25, 65]; // Daily activity
    // Set heights dynamically based on scans
    if (totalScans > 6) {
      barValues[3] = Math.min(100, 65 + (totalScans - 6) * 8);
    }
    
    chartBox.innerHTML = "";
    barValues.forEach((val, idx) => {
      const col = document.createElement("div");
      col.style.display = "flex";
      col.style.flexDirection = "column";
      col.style.alignItems = "center";
      col.style.width = "10%";
      col.style.height = "100%";
      col.style.justifyContent = "flex-end";
      col.style.gap = "8px";

      col.innerHTML = `
        <div style="width:100%; height:${val}%; background:var(--primary-color); border-radius:4px; transition: height 1s ease-out; position:relative; cursor:pointer;" class="chart-bar" title="Articles analyzed: ${Math.round(val / 10)}">
          <div class="bar-tooltip" style="position:absolute; top:-30px; left:50%; transform:translateX(-50%); background:var(--bg-secondary); border:1px solid var(--card-border); padding:2px 6px; font-size:10px; border-radius:4px; display:none; white-space:nowrap; z-index:5;">${Math.round(val / 10)} articles</div>
        </div>
      `;
      chartBox.appendChild(col);
    });

    // Add tooltip listeners
    document.querySelectorAll(".chart-bar").forEach(bar => {
      bar.addEventListener("mouseenter", () => {
        bar.querySelector(".bar-tooltip").style.display = "block";
      });
      bar.addEventListener("mouseleave", () => {
        bar.querySelector(".bar-tooltip").style.display = "none";
      });
    });
  }

  // 3. Saved Articles board list
  const savedBox = document.getElementById("dashboard-saved-list");
  if (savedBox) {
    savedBox.innerHTML = `
      <div class="card" style="padding:12px 16px; display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.02); margin-bottom:8px;">
        <div>
          <span style="font-size:11px; color:var(--danger-color); font-weight:700;">⚠ FAKE NEWS</span>
          <h4 style="font-size:14px; font-weight:600; margin-top:2px;">Miracle cancer cure botanical herb...</h4>
        </div>
        <span style="font-size:12px; color:var(--text-muted);">Saved 1d ago</span>
      </div>
      <div class="card" style="padding:12px 16px; display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.02);">
        <div>
          <span style="font-size:11px; color:var(--accent-color); font-weight:700;">✓ CREDIBLE</span>
          <h4 style="font-size:14px; font-weight:600; margin-top:2px;">Macro indices: emerging market growth...</h4>
        </div>
        <span style="font-size:12px; color:var(--text-muted);">Saved 3d ago</span>
      </div>
    `;
  }
}

// Render profile data & leaderboards
export function renderProfileDetails() {
  // Leaderboard lists
  const tableBody = document.getElementById("profile-leaderboard-body");
  if (tableBody) {
    tableBody.innerHTML = "";
    
    // Sort leaderboard in descending order
    let list = [...leaderboard];
    const savedUser = localStorage.getItem("truthlens_user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      // Merge or update user rankings
      const idx = list.findIndex(l => l.name === user.displayName || l.name.includes("Dipti"));
      if (idx > -1) {
        list[idx].points = user.points;
      }
    }
    
    list.sort((a, b) => b.points - a.points);

    list.forEach((user, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="font-weight:700;">#${idx + 1}</td>
        <td style="font-weight:600;">${user.name} <span style="font-size:11px; font-weight:normal; color:var(--accent-color); display:block;">${user.badge}</span></td>
        <td style="color:var(--primary-color); font-weight:700;">${user.points} XP</td>
        <td style="font-weight:600;">${user.count} logs</td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // Badges grid
  renderBadgesContainer();
}

function renderBadgesContainer() {
  const container = document.getElementById("profile-badges-container");
  if (!container) return;

  container.innerHTML = "";
  
  // Dynamic user badges check
  let userBadges = ["truth_beginner", "fact_checker", "hoax_deflector"];
  const savedUser = localStorage.getItem("truthlens_user");
  if (savedUser) {
    userBadges = JSON.parse(savedUser).badges || userBadges;
  }

  badges.forEach(b => {
    const isActive = userBadges.includes(b.id);
    const div = document.createElement("div");
    div.className = `badge-item ${isActive ? 'active' : ''}`;
    div.style.opacity = isActive ? "1" : "0.5";

    div.innerHTML = `
      <div class="badge-icon-container">
        ${b.icon}
      </div>
      <h4 class="badge-title">${b.name}</h4>
      <p style="font-size:10px; color:var(--text-muted); margin-top:4px; line-height:1.3;">${b.desc}</p>
    `;
    container.appendChild(div);
  });
}

// Update profile metrics upon authentication logs
function updateProfileForUser(user) {
  const profileName = document.getElementById("profile-username");
  const profileBadge = document.getElementById("profile-badge-title");
  const profilePoints = document.getElementById("profile-reward-points");
  const mainAvatar = document.getElementById("profile-main-avatar");

  if (user) {
    if (profileName) profileName.textContent = user.displayName || user.email.split("@")[0];
    if (profileBadge) profileBadge.textContent = user.level || "Expert Fact Checker";
    if (profilePoints) profilePoints.textContent = `${user.points || 450} pts`;
    if (mainAvatar) mainAvatar.textContent = (user.displayName || user.email || "D").charAt(0).toUpperCase();
  } else {
    if (profileName) profileName.textContent = "Guest User";
    if (profileBadge) profileBadge.textContent = "Novice Fact Checker";
    if (profilePoints) profilePoints.textContent = "0 pts";
    if (mainAvatar) mainAvatar.textContent = "?";
  }
  
  // Re-run grids
  renderBadgesContainer();
}

// Community Verification Discussions & Voting Consensus
const defaultComments = [
  { user: "Sneha Patel", avatar: "S", verdict: "misleading", time: "2 hours ago", comment: "The draft paper indeed indicates continuous assessments but nowhere did it mention ending traditional evaluations completely. Extremely sensationalized headline.", link: "https://moe.gov.in/policy-draft" },
  { user: "Amit Sharma", avatar: "A", verdict: "reliable", time: "5 hours ago", comment: "CSO reports confirm the 6.8% expansion metrics. Fully validated by major banking institutions.", link: "https://rbi.org.in/statistics" },
  { user: "Kiran Rao", avatar: "K", verdict: "misleading", time: "1 day ago", comment: "Cancer botanical claims are dangerous. There are zero clinical trial registrations matching this clinic name on ClinicalTrials.gov.", link: "https://clinicaltrials.gov" }
];

let voteReliable = 72;
let voteMisleading = 28;

export function initCommunityVotes() {
  renderVotesDonutChart();
  populateClaimDropdown();
  renderComments();
}

document.addEventListener("DOMContentLoaded", () => {
  setupCommunityForms();
});

// Render circular consensus donut chart on Canvas
function renderVotesDonutChart() {
  const canvas = document.getElementById("community-votes-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = rect.height * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  const w = canvas.width / window.devicePixelRatio;
  const h = canvas.height / window.devicePixelRatio;
  const cx = w / 2;
  const cy = h / 2;
  const radius = 55;

  ctx.clearRect(0, 0, w, h);

  // Angles calculation
  const total = voteReliable + voteMisleading;
  const reliableAngle = (voteReliable / total) * Math.PI * 2;
  
  // Draw Reliable slice (Green)
  ctx.lineWidth = 14;
  ctx.strokeStyle = "#10B981";
  ctx.beginPath();
  ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + reliableAngle);
  ctx.stroke();

  // Draw Misleading slice (Red)
  ctx.strokeStyle = "#EF4444";
  ctx.beginPath();
  ctx.arc(cx, cy, radius, -Math.PI / 2 + reliableAngle, -Math.PI / 2 + Math.PI * 2);
  ctx.stroke();

  // Draw Center text percentage
  const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
  ctx.fillStyle = currentTheme === "dark" ? "#f8fafc" : "#0f172a";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 20px var(--font-heading)";
  ctx.fillText(`${Math.round((voteReliable / total) * 100)}%`, cx, cy - 4);
  
  ctx.fillStyle = "#94a3b8";
  ctx.font = "500 9px var(--font-body)";
  ctx.fillText("CONSENSUS", cx, cy + 14);
}

// Populate claims target choices
function populateClaimDropdown() {
  const select = document.getElementById("community-claim-select");
  if (!select) return;

  select.innerHTML = `
    <option value="cancer">Extraordinary cancer cure discovery claims</option>
    <option value="education">AI replacing grade evaluations in schools</option>
    <option value="economy">Emerging markets GDP expansion ratings</option>
  `;
}

// Draw comments list
function renderComments() {
  const container = document.getElementById("community-comments-list");
  if (!container) return;

  container.innerHTML = "";
  
  let comments = [...defaultComments];
  try {
    const raw = localStorage.getItem("truthlens_db_comments");
    if (raw) comments = JSON.parse(raw);
  } catch (err) {}

  comments.forEach(c => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.padding = "16px";
    card.style.background = "var(--input-bg)";
    card.style.border = "1px solid var(--input-border)";
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.gap = "8px";

    const badgeClass = c.verdict === "reliable" ? "badge-yes" : "badge-no";
    const badgeText = c.verdict === "reliable" ? "Vote: Reliable" : "Vote: Misleading";

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div style="display:flex; align-items:center; gap:8px;">
          <div class="avatar" style="width:28px; height:28px; font-size:12px; font-weight:700;">${c.avatar}</div>
          <span style="font-size:13px; font-weight:600; color:var(--text-primary);">${c.user}</span>
        </div>
        <span style="font-size:11px; color:var(--text-muted);">${c.time}</span>
      </div>
      <p style="font-size:13px; line-height:1.5; color:var(--text-secondary);">${c.comment}</p>
      ${c.link ? `
        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--divider-color); padding-top:8px; margin-top:4px;">
          <a href="${c.link}" target="_blank" style="font-size:11px; color:var(--primary-color); text-decoration:none; font-weight:600;">Linked Proof ↗</a>
          <span class="badge-status-pill ${badgeClass}" style="font-size:10px; padding:2px 8px;">${badgeText}</span>
        </div>
      ` : ""}
    `;
    container.appendChild(card);
  });
}

function setupCommunityForms() {
  const form = document.getElementById("community-submit-form");
  let chosenVerdict = "reliable"; // default

  // Listen to vote button taps
  const btnReliable = document.querySelector(".btn-vote-reliable");
  const btnMisleading = document.querySelector(".btn-vote-misleading");

  if (btnReliable && btnMisleading) {
    btnReliable.addEventListener("click", () => {
      chosenVerdict = "reliable";
      btnReliable.style.backgroundColor = "rgba(16, 185, 129, 0.15)";
      btnMisleading.style.backgroundColor = "transparent";
    });

    btnMisleading.addEventListener("click", () => {
      chosenVerdict = "misleading";
      btnMisleading.style.backgroundColor = "rgba(239, 68, 68, 0.15)";
      btnReliable.style.backgroundColor = "transparent";
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const link = document.getElementById("community-evidence-link").value.trim();
      const txt = document.getElementById("community-comment-text").value.trim();
      
      if (!txt) {
        alert("Please write a small description explaining your vote.");
        return;
      }

      // Check user login session
      let userName = "Guest Investigator";
      let userAvatar = "G";
      const savedUser = localStorage.getItem("truthlens_user");
      if (savedUser) {
        const u = JSON.parse(savedUser);
        userName = u.displayName || u.email.split("@")[0];
        userAvatar = userName.charAt(0).toUpperCase();
        
        // Add XP reward for contributing
        u.points += 50; // 50 XP per discussion contribution!
        if (u.points >= 500) {
          u.level = "Expert Investigator";
          if (!u.badges.includes("expert_investigator")) {
            u.badges.push("expert_investigator");
          }
        }
        localStorage.setItem("truthlens_user", JSON.stringify(u));
        // Update user state
        const sidebarUsername = document.getElementById("sidebar-user-name");
        const sidebarUserPoints = document.getElementById("sidebar-user-points");
        if (sidebarUsername && sidebarUserPoints) {
          sidebarUsername.innerText = u.displayName;
          sidebarUserPoints.innerText = `${u.points} XP • ${u.level}`;
        }
      }

      // Save Comment record
      const commentRecord = {
        user: userName,
        avatar: userAvatar,
        verdict: chosenVerdict,
        time: "Just now",
        comment: txt,
        link: link || null
      };

      let currentComments = [];
      try {
        const raw = localStorage.getItem("truthlens_db_comments");
        if (raw) currentComments = JSON.parse(raw);
        else currentComments = [...defaultComments];
      } catch (err) {
        currentComments = [...defaultComments];
      }

      currentComments.unshift(commentRecord);
      localStorage.setItem("truthlens_db_comments", JSON.stringify(currentComments));

      // Update calculations
      if (chosenVerdict === "reliable") {
        voteReliable += 1;
      } else {
        voteMisleading += 1;
      }

      // Recalculate percent displays
      const total = voteReliable + voteMisleading;
      document.getElementById("community-reliable-label").textContent = `Reliable: ${Math.round((voteReliable / total) * 100)}%`;
      document.getElementById("community-misleading-label").textContent = `Misleading: ${Math.round((voteMisleading / total) * 100)}%`;

      // Re-draw chart & list
      renderVotesDonutChart();
      renderComments();

      // Reset
      form.reset();
      btnReliable.style.backgroundColor = "transparent";
      btnMisleading.style.backgroundColor = "transparent";
      alert("consensus published! Earned +50 truth points.");
    });
  }
}

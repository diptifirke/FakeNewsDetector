// Verification Log Search & Chronological Timeline History
const baselineHistory = [
  { id: "h-cancer", title: "Miracle cure for cancer discovered in one day by scientists", date: "Jun 14, 2026", verdict: "fake", percentage: 87, credibility: 18, isMedia: false },
  { id: "h-education", title: "New Government Policy announces curriculum exams replaced by AI", date: "Jun 13, 2026", verdict: "misleading", percentage: 58, credibility: 48, isMedia: true },
  { id: "h-economy", title: "Macroeconomics: Emerging markets list GDP growth updates for India", date: "Jun 08, 2026", verdict: "credible", percentage: 92, credibility: 92, isMedia: false }
];

document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("init-history-logs", renderHistoryTimeline);
  window.addEventListener("history-updated", renderHistoryTimeline);

  setupHistoryFilters();
});

// Load logs and render timeline list
export function renderHistoryTimeline() {
  const container = document.getElementById("history-timeline-container");
  if (!container) return;

  container.innerHTML = "";

  // Retrieve current logs or fall back to baseline
  let logs = [];
  try {
    const raw = localStorage.getItem("truthlens_db_history");
    if (raw) {
      logs = JSON.parse(raw);
    } else {
      logs = [...baselineHistory];
      localStorage.setItem("truthlens_db_history", JSON.stringify(logs));
    }
  } catch (err) {
    logs = [...baselineHistory];
  }

  if (logs.length === 0) {
    container.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:32px;">No verification records found. Run analysis from the Detector page to populate history.</p>`;
    return;
  }

  // Get search and filter settings
  const searchInput = document.getElementById("history-search-input");
  const filterSelect = document.getElementById("history-filter-select");

  const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
  const filter = filterSelect ? filterSelect.value : "all";

  // Filter logs array
  const filtered = logs.filter(log => {
    const matchesSearch = log.title.toLowerCase().includes(query);
    const matchesVerdict = (filter === "all") || (log.verdict === filter);
    return matchesSearch && matchesVerdict;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:32px;">No matches found matching criteria.</p>`;
    return;
  }

  filtered.forEach(log => {
    const item = document.createElement("div");
    item.className = "timeline-item";

    const badgeClass = log.verdict === "fake" ? "fake" : (log.verdict === "credible" ? "credible" : "");
    const badgeColor = log.verdict === "fake" ? "var(--danger-color)" : (log.verdict === "credible" ? "var(--accent-color)" : "var(--warning-color)");
    const statusText = log.verdict.toUpperCase();

    item.innerHTML = `
      <div class="timeline-badge ${badgeClass}"></div>
      <div class="timeline-panel card">
        <div class="timeline-date">${log.date}</div>
        <h4 style="font-family:var(--font-heading); font-size:15px; font-weight:700; margin-bottom:8px;">${log.title}</h4>
        
        <div style="display:flex; gap:16px; align-items:center; flex-wrap:wrap; margin-bottom:12px;">
          <span class="badge-status-pill ${log.verdict === 'fake' ? 'badge-no' : (log.verdict === 'credible' ? 'badge-yes' : 'badge-partial')}" style="font-size:11px; font-weight:700;">
            VERDICT: ${statusText}
          </span>
          <span style="font-size:12px; color:var(--text-muted);">
            Fake Probability: <strong style="color:${badgeColor};">${log.percentage}%</strong>
          </span>
          <span style="font-size:12px; color:var(--text-muted);">
            Credibility Index: <strong>${log.credibility}/100</strong>
          </span>
          ${log.isMedia ? `<span class="badge-status-pill badge-yes" style="font-size:10px; padding:2px 8px;">Forensics Run</span>` : ""}
        </div>

        <div style="display:flex; justify-content:flex-end; gap:12px; border-top:1px solid var(--divider-color); padding-top:12px;">
          <button class="btn btn-secondary btn-sm btn-reanalyze-history" data-title="${log.title}" style="padding:4px 10px; font-size:11px;">Reanalyze</button>
          <button class="btn btn-secondary btn-sm btn-delete-history" data-id="${log.id}" style="padding:4px 10px; font-size:11px; border-color:rgba(239,68,68,0.2); color:var(--danger-color);">Delete</button>
        </div>
      </div>
    `;
    container.appendChild(item);
  });

  // Bind history interactions
  bindHistoryActions();
}

function bindHistoryActions() {
  // Delete action listener
  document.querySelectorAll(".btn-delete-history").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const logId = e.currentTarget.getAttribute("data-id");
      if (confirm("Are you sure you want to delete this verification log entry?")) {
        try {
          let logs = JSON.parse(localStorage.getItem("truthlens_db_history")) || [];
          logs = logs.filter(l => l.id !== logId);
          localStorage.setItem("truthlens_db_history", JSON.stringify(logs));
          
          // Re-render
          renderHistoryTimeline();
        } catch (err) {
          console.error("Delete failed: ", err);
        }
      }
    });
  });

  // Re-analyze redirect actions
  document.querySelectorAll(".btn-reanalyze-history").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const textVal = e.currentTarget.getAttribute("data-title");
      window.location.hash = "#detect";
      
      const mainDetectArea = document.getElementById("detect-main-input");
      if (mainDetectArea) {
        mainDetectArea.value = textVal;
        
        // Trigger analysis click event programmatically
        const detectTriggerBtn = document.getElementById("detect-trigger-btn");
        if (detectTriggerBtn) detectTriggerBtn.click();
      }
    });
  });
}

function setupHistoryFilters() {
  const searchInput = document.getElementById("history-search-input");
  const filterSelect = document.getElementById("history-filter-select");
  const clearBtn = document.getElementById("history-clear-btn");

  if (searchInput) {
    searchInput.addEventListener("input", renderHistoryTimeline);
  }
  if (filterSelect) {
    filterSelect.addEventListener("change", renderHistoryTimeline);
  }
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      if (filterSelect) filterSelect.value = "all";
      renderHistoryTimeline();
    });
  }
}

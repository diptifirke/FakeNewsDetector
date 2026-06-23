import { db, auth } from "./firebase-config.js";
import { renderRumorTracker } from "./rumor-tracker.js";

// Mock Database of analysis templates
const templates = {
  cancer: {
    title: "Miracle cure for cancer discovered in one day by scientists.",
    summary: "A viral social media claim alleges that research scientists have discovered a 'one-day miracle cure' for all types of cancer, using an undisclosed botanical extract. The post has been shared over 500,000 times, urging users to bypass chemotherapy.",
    verdict: "fake",
    percentage: 87,
    confidence: "High",
    reasons: [
      "Sensationalized and emotional language detected.",
      "Zero citations or links to peer-reviewed scientific journals.",
      "Extraordinary claims of 'one-day' reversal lack medical viability.",
      "Direct contradiction with World Health Organization data."
    ],
    credibility: {
      source: 15,
      emotional: 90,
      evidence: 10,
      consistency: 20,
      overall: 18
    },
    annotatedText: `Social media channels are abuzz with the rumor that <span class="claim-highlight danger-claim" data-claim-id="c1">scientists discovered a miracle cure for cancer in one day</span>. This report states that a simple herb can eliminate all tumors instantly, suggesting that <span class="claim-highlight danger-claim" data-claim-id="c2">pharmaceutical companies are hiding this research to sell expensive treatments</span>. The claims contain no formal hospital listings, but state that <span class="claim-highlight" data-claim-id="c3">millions have already been cured in secret clinics</span>.`,
    claims: {
      c1: {
        tag: "⚠ Extraordinary Claim",
        text: "Scientists discovered a miracle cure for cancer in one day.",
        explanation: "No medical literature supports the existence of an overnight cure for all cancers. Clinical trials take years to verify safety and efficacy.",
        sources: "WHO, Mayo Clinic, PubMed Central"
      },
      c2: {
        tag: "⚠ Emotional Manipulation",
        text: "Pharmaceutical companies are hiding this research.",
        explanation: "Classic conspiracy narrative. Major oncology research is open-access and published internationally across academic networks.",
        sources: "Oncology Alliance, Nature Journal"
      },
      c3: {
        tag: "⚠ No Evidence",
        text: "Millions have already been cured in secret clinics.",
        explanation: "There are no logged admissions or authenticated patient files corroborating treatments from the mentioned secret clinics.",
        sources: "CDC, National Cancer Institute"
      }
    },
    bias: {
      pol: -20, // moderate left/right lean
      click: 85, // Clickbait
      emo: 90 // Emotion level
    },
    biasLabels: {
      pol: "Sensational / Leaning Left",
      click: "Extremely High",
      emo: "Very High"
    },
    facts: [
      { stmt: "Cancer cure exists in a botanical herb", status: "False", desc: "No pharmaceutical records or clinical tests indicate a single botanical herb cures all cancers.", ref: "National Cancer Institute" },
      { stmt: "Oncology teams hid reports", status: "False", desc: "Peer journals like Nature and Lancet publish international results without corporate gatekeeping.", ref: "Nature Oncology" }
    ],
    compare: [
      { source: "BBC News", status: "No Coverage", similarity: "No", link: "https://bbc.com" },
      { source: "Reuters", status: "Fact-Check: Debunked", similarity: "No", link: "https://reuters.com" },
      { source: "CNN Health", status: "No Coverage", similarity: "No", link: "https://cnn.com" }
    ],
    rumor: {
      firstDate: "June 10, 2026",
      speed: "Critical",
      shares: "542,000+",
      platforms: "WhatsApp Groups, Facebook Posts, Twitter Trends",
      nodes: ["Origin: Facebook Post", "WhatsApp Forward Spreads", "Twitter Trend: #MiracleHerb", "News Blog Coverage", "TruthLens AI Analysis"]
    }
  },
  education: {
    title: "New Government Policy announces radical school curriculum changes for 2026.",
    summary: "An online news blog reported that starting next semester, traditional grading systems will be completely abolished and replaced by artificial intelligence evaluations, stating this is part of the New Education Policy.",
    verdict: "misleading",
    percentage: 58,
    confidence: "Medium",
    reasons: [
      "Partially true baseline details with highly distorted interpretations.",
      "Official government draft mentions AI assistance, not total replacement of grading.",
      "Out of context quotations from the Minister of Education."
    ],
    credibility: {
      source: 60,
      emotional: 55,
      evidence: 65,
      consistency: 50,
      overall: 48
    },
    annotatedText: `According to recent educational circulars, the <span class="claim-highlight" data-claim-id="e1">government is planning to abolish all school exams starting 2026</span>. Further statements suggest that <span class="claim-highlight" data-claim-id="e2">AI bots will grade every student's personality instead of papers</span>, raising concerns among teacher unions who claim <span class="claim-highlight" data-claim-id="e3">thousands of teacher positions will be terminated immediately</span>.`,
    claims: {
      e1: {
        tag: "⚠ Partially True",
        text: "Government planning to abolish all exams.",
        explanation: "The government is reforming evaluation metrics to include continuous assessments, but traditional written exams are not being abolished.",
        sources: "Ministry of Education Draft, National Council Reports"
      },
      e2: {
        tag: "⚠ Misleading Interpret",
        text: "AI bots will grade every student.",
        explanation: "AI tools are proposed for administrative feedback and digital literacy logs, not for scoring final school rankings.",
        sources: "Digital Literacy Initiative Document"
      },
      e3: {
        tag: "⚠ No Evidence",
        text: "Thousands of teacher positions will be terminated.",
        explanation: "Curriculum expansion plans indicate a need for more trained personnel, showing no planned employee layoffs.",
        sources: "Government Employment Registry"
      }
    },
    bias: {
      pol: -10,
      click: 60,
      emo: 50
    },
    biasLabels: {
      pol: "Slight Left Leaning",
      click: "Medium Clickbait",
      emo: "Moderate"
    },
    facts: [
      { stmt: "Abolition of written school examinations", status: "Partially True", desc: "Written tests are being combined with project portfolios, but not deleted.", ref: "Ministry of Education" },
      { stmt: "Teacher job terminations due to AI grading", status: "False", desc: "No staffing reductions are written into the official policy drafts.", ref: "National Labor Board" }
    ],
    compare: [
      { source: "BBC News", status: "Covers reforms", similarity: "Partially", link: "https://bbc.com" },
      { source: "Reuters", status: "Policy analysis active", similarity: "Mostly", link: "https://reuters.com" },
      { source: "CNN", status: "No active report", similarity: "No", link: "https://cnn.com" }
    ],
    rumor: {
      firstDate: "June 12, 2026",
      speed: "Moderate",
      shares: "125,000+",
      platforms: "News Blogs, Twitter Discussions",
      nodes: ["Draft Policy Leak", "Blog Editorial: 'No More Exams'", "Twitter Outrage", "Teacher Forums", "Fact Checked"]
    }
  },
  economy: {
    title: "India ranks among top economic growth indexes in 2025 reports.",
    summary: "Official macroeconomic indices published by global agencies confirm that India's GDP expansion has topped the list of major emerging markets in 2025, recording a 6.8% fiscal expansion.",
    verdict: "credible",
    percentage: 92,
    confidence: "High",
    reasons: [
      "Consistent with data sheets from International Monetary Fund (IMF).",
      "Contains references to audited banking spreadsheets.",
      "Neutral and objective language styling throughout."
    ],
    credibility: {
      source: 95,
      emotional: 15,
      evidence: 90,
      consistency: 95,
      overall: 92
    },
    annotatedText: `Reports show that <span class="claim-highlight" data-claim-id="y1">India recorded a 6.8% GDP expansion in fiscal year 2025</span>. Analysts agree that <span class="claim-highlight" data-claim-id="y2">this makes it the fastest-growing major emerging economy</span>. The performance was driven by digital service exports and infrastructure projects, which <span class="claim-highlight" data-claim-id="y3">global agencies like the IMF verified in their annual reports</span>.`,
    claims: {
      y1: {
        tag: "✓ Verified Statement",
        text: "India recorded 6.8% GDP expansion.",
        explanation: "Matches official figures issued by the Central Statistics Office and confirmed by global banking channels.",
        sources: "Central Statistics Office, Reserve Bank Statement"
      },
      y2: {
        tag: "✓ Verified Statement",
        text: "Fastest-growing major emerging economy.",
        explanation: "Comparative global data puts the nation at the lead of the G20 growth indices for the matching quarter.",
        sources: "World Bank G20 growth charts"
      },
      y3: {
        tag: "✓ Verified Statement",
        text: "IMF verified in their annual reports.",
        explanation: "Confirmed in the IMF World Economic Outlook database publication.",
        sources: "IMF Outlook Portal"
      }
    },
    bias: {
      pol: 0,
      click: 15,
      emo: 10
    },
    biasLabels: {
      pol: "Neutral / Unbiased",
      click: "Very Low",
      emo: "Low/Objective"
    },
    facts: [
      { stmt: "India GDP growth reached 6.8%", status: "True", desc: "Corroborated by primary datasets published by global economic platforms.", ref: "World Bank" },
      { stmt: "IMF confirmed the statistics", status: "True", desc: "WEO database includes the exact matching figures.", ref: "IMF World Economic Outlook" }
    ],
    compare: [
      { source: "BBC Business", status: "Reporting growth", similarity: "Yes", link: "https://bbc.com" },
      { source: "Reuters Economics", status: "Report matches", similarity: "Yes", link: "https://reuters.com" },
      { source: "CNN Business", status: "GDP overview active", similarity: "Yes", link: "https://cnn.com" }
    ],
    rumor: {
      firstDate: "June 08, 2026",
      speed: "Low",
      shares: "45,000+",
      platforms: "Finance Journals, News Portals",
      nodes: ["CSO Statement Release", "Bloomberg Wire", "Financial Newspapers", "Global Analysis", "TruthLens AI Logged"]
    }
  }
};

// State tracker for currently loaded result
export let activeReport = null;

// Initialize components when DOM loads
document.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  setupIngestion();
  setupClickableClaims();
  setupFilePickers();
  setupTrendingNews();
  
  // Listen for login changes to save analyses
  window.addEventListener("user-login-changed", () => {
    // If user signs in, we can sync reports if necessary
  });
});

// Setup Hero tabs
function setupTabs() {
  const tabs = document.querySelectorAll(".hero-tab-btn");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      
      const targetPane = tab.getAttribute("data-tab");
      document.querySelectorAll(".tab-pane").forEach(pane => {
        pane.classList.remove("active");
        if (pane.id === targetPane) pane.classList.add("active");
      });
    });
  });
}

// Setup input boxes and media buttons
function setupFilePickers() {
  const mediaBtn = document.getElementById("detect-media-upload-btn");
  const detectPicker = document.getElementById("detect-file-picker");
  const fileNameSpan = document.getElementById("uploaded-file-name");

  if (mediaBtn && detectPicker) {
    mediaBtn.addEventListener("click", () => detectPicker.click());
    detectPicker.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        fileNameSpan.textContent = `Attached: ${e.target.files[0].name}`;
      }
    });
  }

  // Home dragzones
  document.querySelectorAll(".file-upload-dragzone").forEach(zone => {
    const fileInput = zone.querySelector("input[type='file']");
    zone.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        zone.querySelector(".upload-title").textContent = `Selected: ${e.target.files[0].name}`;
        zone.style.borderColor = "var(--primary-color)";
      }
    });
  });
}

// Ingestion controller linking buttons to scanner processes
function setupIngestion() {
  const triggerHome = document.getElementById("home-trigger-analyze-btn");
  const triggerDetect = document.getElementById("detect-trigger-btn");

  const runScanningProcess = (rawInputText, fileObject = null) => {
    // Navigate to detect page
    window.location.hash = "#detect";
    
    // Fill main input if text exists
    const detectArea = document.getElementById("detect-main-input");
    if (detectArea && rawInputText) detectArea.value = rawInputText;
    
    // Hide results, show loader
    const results = document.getElementById("detect-results-container");
    const loader = document.getElementById("detect-loader-card");
    const inputCard = document.getElementById("detect-input-card");
    
    if (results) results.style.display = "none";
    if (loader) loader.style.display = "block";
    
    // Hide details panel
    document.getElementById("claim-detail-panel").style.display = "none";

    // Cycle through mock loading state messages
    const statuses = [
      "Parsing metadata & ingestion headers...",
      "Analyzing semantic markers & lexical complexity...",
      "Matching factual statements against whitelists...",
      "Generating forensic overlays and neural graphs..."
    ];
    let step = 0;
    const loaderText = document.getElementById("loader-status-text");
    const interval = setInterval(() => {
      if (loaderText && statuses[step]) {
        loaderText.textContent = statuses[step];
        step++;
      }
    }, 600);

    setTimeout(() => {
      clearInterval(interval);
      if (loader) loader.style.display = "none";
      
      // Determine what analysis template to render based on text keywords
      let parsedKey = "cancer"; // default mock
      const lowercase = (rawInputText || "").toLowerCase();
      if (lowercase.includes("education") || lowercase.includes("school") || lowercase.includes("exam") || lowercase.includes("policy")) {
        parsedKey = "education";
      } else if (lowercase.includes("economy") || lowercase.includes("gdp") || lowercase.includes("india") || lowercase.includes("money")) {
        parsedKey = "economy";
      }

      // If user uploaded a media file (or selected file tab), trigger forensic deepfake display
      const activeTab = document.querySelector(".hero-tab-btn.active")?.getAttribute("data-tab");
      const isMediaUpload = (activeTab === "tab-image" || activeTab === "tab-video" || fileObject || lowercase.includes("deepfake") || lowercase.includes("screenshot"));

      displayScanReport(parsedKey, isMediaUpload);
      if (results) results.style.display = "flex";
      
      // Save query to history
      saveReportToHistory(templates[parsedKey], isMediaUpload);
    }, 2800);
  };

  if (triggerHome) {
    triggerHome.addEventListener("click", () => {
      const activeTab = document.querySelector(".hero-tab-btn.active")?.getAttribute("data-tab");
      let text = "";
      let file = null;

      if (activeTab === "tab-text") {
        text = document.getElementById("home-text-input").value;
      } else if (activeTab === "tab-url") {
        text = document.getElementById("home-url-input").value;
      } else if (activeTab === "tab-pdf") {
        const picker = document.getElementById("pdf-file-picker");
        if (picker.files.length > 0) file = picker.files[0];
        text = file ? `PDF Report: ${file.name}` : "PDF document verification";
      } else if (activeTab === "tab-image") {
        const picker = document.getElementById("image-file-picker");
        if (picker.files.length > 0) file = picker.files[0];
        text = file ? `Screenshot Verification: ${file.name}` : "Screenshot deepfake validation";
      } else if (activeTab === "tab-video") {
        const picker = document.getElementById("video-file-picker");
        if (picker.files.length > 0) file = picker.files[0];
        text = file ? `Video Deepfake Analysis: ${file.name}` : "Video deepfake check";
      }

      if (!text && !file) {
        alert("Please enter news content or attach a file to begin.");
        return;
      }
      runScanningProcess(text, file);
    });
  }

  if (triggerDetect) {
    triggerDetect.addEventListener("click", () => {
      const text = document.getElementById("detect-main-input").value;
      const filePicker = document.getElementById("detect-file-picker");
      let file = filePicker.files.length > 0 ? filePicker.files[0] : null;

      if (!text && !file) {
        alert("Please paste text or attach media before running scanner.");
        return;
      }
      runScanningProcess(text, file);
    });
  }
}

// Display analysis details
function displayScanReport(key, isMediaUpload = false) {
  const data = templates[key];
  if (!data) return;
  activeReport = data;

  // Ingest simple summary
  document.getElementById("detect-res-summary").textContent = data.summary;
  
  // Custom reason bullets
  const bulletContainer = document.getElementById("detect-res-reasons");
  bulletContainer.innerHTML = "";
  data.reasons.forEach(r => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.gap = "8px";
    li.style.alignItems = "flex-start";
    li.innerHTML = `<span style="color:${data.verdict === 'fake' ? 'var(--danger-color)' : 'var(--accent-color)'}; font-weight:700;">✓</span><span>${r}</span>`;
    bulletContainer.appendChild(li);
  });

  // Circle progress animations
  const circleGauge = document.getElementById("result-circular-gauge");
  const pctOverlay = document.getElementById("result-gauge-pct");
  const statusOverlay = document.getElementById("result-gauge-status");
  const confidenceBadge = document.getElementById("result-confidence-badge");
  
  // Set gauge color status classes
  circleGauge.className = `circular-gauge ${data.verdict}`;
  pctOverlay.textContent = `${data.percentage}%`;
  
  // Localize verdict status tags
  if (data.verdict === "fake") {
    statusOverlay.textContent = "Fake News";
    statusOverlay.className = "gauge-status status-fake";
    confidenceBadge.className = "badge-status-pill badge-no";
    confidenceBadge.textContent = "High Risk";
  } else if (data.verdict === "credible") {
    statusOverlay.textContent = "Credible";
    statusOverlay.className = "gauge-status status-credible";
    confidenceBadge.className = "badge-status-pill badge-yes";
    confidenceBadge.textContent = "Verified";
  } else {
    statusOverlay.textContent = "Misleading";
    statusOverlay.className = "gauge-status status-misleading";
    confidenceBadge.className = "badge-status-pill badge-partial";
    confidenceBadge.textContent = "Under Review";
  }

  // Animate circle dash offset (circumference of 140 width diameter is approx 440)
  const offset = 440 - (440 * data.percentage) / 100;
  const progressCircle = circleGauge.querySelector(".progress-circle");
  setTimeout(() => {
    progressCircle.style.strokeDashoffset = offset;
  }, 100);

  // Deepfake Forensic Heatmap display
  const mediaCard = document.getElementById("detect-media-analysis-card");
  if (isMediaUpload) {
    mediaCard.style.display = "block";
    const forensicImg = document.getElementById("detect-forensic-image");
    const container = document.getElementById("detect-forensic-container");
    
    // Choose visual forensic sample based on verdict
    if (data.verdict === "fake") {
      // Mock forensic visual
      forensicImg.src = "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=600";
      container.classList.add("has-heatmap");
      document.getElementById("detect-media-forensic-reasons").innerHTML = `
        <span style="font-size:13px; font-weight:600; color:var(--danger-color);">⚠ Alert: High Deepfake Probability (82%)</span>
        <span style="font-size:12px; color:var(--text-secondary);">✓ Inconsistent facial mesh borders around mouth and jawline.</span>
        <span style="font-size:12px; color:var(--text-secondary);">✓ Chromatic aberration indicating synthetic generator patterns.</span>
      `;
    } else {
      forensicImg.src = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600";
      container.classList.remove("has-heatmap");
      document.getElementById("detect-media-forensic-reasons").innerHTML = `
        <span style="font-size:13px; font-weight:600; color:var(--accent-color);">✓ Alert: Low Synthesis Probability (6%)</span>
        <span style="font-size:12px; color:var(--text-secondary);">✓ Structural metadata indicates verified capture device origins.</span>
      `;
    }
  } else {
    mediaCard.style.display = "none";
  }

  // Credibility progress vector widths
  document.getElementById("metric-val-source").textContent = `${data.credibility.source}/100`;
  document.getElementById("metric-bar-source").style.width = `${data.credibility.source}%`;

  document.getElementById("metric-val-emotional").textContent = `${data.credibility.emotional}/100`;
  document.getElementById("metric-bar-emotional").style.width = `${data.credibility.emotional}%`;

  document.getElementById("metric-val-evidence").textContent = `${data.credibility.evidence}/100`;
  document.getElementById("metric-bar-evidence").style.width = `${data.credibility.evidence}%`;

  document.getElementById("metric-val-consistency").textContent = `${data.credibility.consistency}/100`;
  document.getElementById("metric-bar-consistency").style.width = `${data.credibility.consistency}%`;

  document.getElementById("metric-val-overall").textContent = `${data.credibility.overall}/100`;
  document.getElementById("metric-bar-overall").style.width = `${data.credibility.overall}%`;

  // Annotated suspicious content injections
  document.getElementById("detect-annotated-content").innerHTML = data.annotatedText;
  setupClickableClaims(); // Re-bind dynamic highlights

  // Bias orient gauges needle adjustments (range: -90deg left to +90deg right)
  const calculateRotation = (val) => {
    // Map -100..+100 range or 0..100 range to -90..+90 degrees
    return (val / 100) * 90;
  };
  
  document.getElementById("bias-needle-pol").style.transform = `translateX(-50%) rotate(${calculateRotation(data.bias.pol)}deg)`;
  document.getElementById("bias-label-pol").textContent = data.biasLabels.pol;

  document.getElementById("bias-needle-click").style.transform = `translateX(-50%) rotate(${calculateRotation(data.bias.click * 2 - 100)}deg)`;
  document.getElementById("bias-label-click").textContent = data.biasLabels.click;

  document.getElementById("bias-needle-emo").style.transform = `translateX(-50%) rotate(${calculateRotation(data.bias.emo * 2 - 100)}deg)`;
  document.getElementById("bias-label-emo").textContent = data.biasLabels.emo;

  // Fact table rows
  const factBody = document.getElementById("detect-fact-table-body");
  factBody.innerHTML = "";
  data.facts.forEach(f => {
    const tr = document.createElement("tr");
    let badge = `<span class="badge-status-pill badge-partial">Partially True</span>`;
    if (f.status === "True") badge = `<span class="badge-status-pill badge-yes">True</span>`;
    if (f.status === "False") badge = `<span class="badge-status-pill badge-no">False</span>`;

    tr.innerHTML = `
      <td style="font-weight:600;">"${f.stmt}"</td>
      <td>${badge}</td>
      <td>${f.desc}</td>
      <td style="font-weight:600; color:var(--primary-color);">${f.ref}</td>
    `;
    factBody.appendChild(tr);
  });

  // Outlets table rows
  const compareBody = document.getElementById("detect-compare-table-body");
  compareBody.innerHTML = "";
  data.compare.forEach(c => {
    const tr = document.createElement("tr");
    let matchBadge = `<span class="badge-status-pill badge-no">No Cover</span>`;
    if (c.similarity === "Yes") matchBadge = `<span class="badge-status-pill badge-yes">Matching Stance</span>`;
    if (c.similarity === "Mostly") matchBadge = `<span class="badge-status-pill badge-yes">Mostly Consistent</span>`;
    if (c.similarity === "Partially") matchBadge = `<span class="badge-status-pill badge-partial">Different Context</span>`;

    tr.innerHTML = `
      <td class="source-item">
        <div class="source-logo">${c.source.charAt(0)}</div>
        <span>${c.source}</span>
      </td>
      <td>${c.status}</td>
      <td>${matchBadge}</td>
      <td><a href="${c.link}" target="_blank" style="color:var(--primary-color); text-decoration:none; font-weight:600;">Read Outlet Cover ↗</a></td>
    `;
    compareBody.appendChild(tr);
  });

  // Render Spread tracker SVG/Canvas graph
  renderRumorTracker("results-rumor-canvas", data.rumor.nodes);

  // Set spread numerical labels
  document.getElementById("rumor-first-date").textContent = data.rumor.firstDate;
  document.getElementById("rumor-speed-idx").textContent = data.rumor.speed;
  document.getElementById("rumor-shares-count").textContent = data.rumor.shares;
  document.getElementById("rumor-platforms").textContent = data.rumor.platforms;
}

// Bind click listener to spans in highlights text
function setupClickableClaims() {
  const highlights = document.querySelectorAll(".claim-highlight");
  const detailPanel = document.getElementById("claim-detail-panel");
  const detailTag = document.getElementById("claim-detail-tag");
  const detailText = document.getElementById("claim-detail-text");
  const detailExplanation = document.getElementById("claim-detail-explanation");
  const detailSources = document.getElementById("claim-detail-sources");

  highlights.forEach(claim => {
    claim.addEventListener("click", (e) => {
      const claimId = e.currentTarget.getAttribute("data-claim-id");
      if (!activeReport || !activeReport.claims[claimId]) return;

      const claimData = activeReport.claims[claimId];

      // Fill panel fields
      detailText.textContent = `"${claimData.text}"`;
      detailExplanation.textContent = claimData.explanation;
      detailSources.textContent = claimData.sources;
      
      // Assign tag styling
      detailTag.textContent = claimData.tag;
      if (claimData.tag.includes("Extraordinary") || claimData.tag.includes("No Evidence")) {
        detailTag.className = "claim-tag tag-warning";
        detailPanel.className = "claim-card-detail";
      } else if (claimData.tag.includes("Manipulation") || claimData.tag.includes("False")) {
        detailTag.className = "claim-tag tag-danger";
        detailPanel.className = "claim-card-detail danger";
      } else {
        detailTag.className = "claim-tag tag-warning";
        detailPanel.className = "claim-card-detail";
      }

      // Display panel
      detailPanel.style.display = "block";
      detailPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });
}

// Save analysis records to db (mock / live history database)
function saveReportToHistory(report, isMedia) {
  // Save query to localStorage under history lists
  const record = {
    id: "history-" + Date.now(),
    title: report.title,
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    verdict: report.verdict,
    percentage: report.percentage,
    credibility: report.credibility.overall,
    isMedia: isMedia
  };

  let historyData = [];
  try {
    const raw = localStorage.getItem("truthlens_db_history");
    if (raw) historyData = JSON.parse(raw);
  } catch (err) {
    historyData = [];
  }

  // Prepend
  historyData.unshift(record);
  localStorage.setItem("truthlens_db_history", JSON.stringify(historyData));

  // If live user logged in, increment points
  const savedUser = localStorage.getItem("truthlens_user");
  if (savedUser) {
    const user = JSON.parse(savedUser);
    user.points += 20; // 20 points per scan
    if (user.points >= 500) {
      user.level = "Expert Investigator";
      if (!user.badges.includes("expert_investigator")) {
        user.badges.push("expert_investigator");
      }
    }
    localStorage.setItem("truthlens_user", JSON.stringify(user));
    // Dispatch auth update
    auth.currentUser = user;
    const sidebarUsername = document.getElementById("sidebar-user-name");
    const sidebarUserPoints = document.getElementById("sidebar-user-points");
    if (sidebarUsername && sidebarUserPoints) {
      sidebarUsername.innerText = user.displayName;
      sidebarUserPoints.innerText = `${user.points} XP • ${user.level}`;
    }
  }

  // Fire event to refresh history list
  window.dispatchEvent(new CustomEvent("history-updated"));
}

const trendingItems = [
  { headline: "Celebrity Death Rumor: Popular Actor passes away overnight", status: "fake", probability: 98, key: "cancer", verifiedSources: "Reuters, BBC News" },
  { headline: "India ranks among top economic growth indexes in 2025 reports", status: "credible", probability: 8, key: "economy", verifiedSources: "IMF Outlook Portal" },
  { headline: "New Government Policy announces curriculum exams replaced by AI", status: "misleading", probability: 58, key: "education", verifiedSources: "Ministry of Education" }
];

export function setupTrendingNews() {
  const grid = document.getElementById("trending-news-grid");
  const refreshBtn = document.getElementById("btn-refresh-trending");
  if (!grid) return;

  const renderGrid = () => {
    grid.innerHTML = "";
    trendingItems.forEach(item => {
      const card = document.createElement("div");
      card.className = "card";
      
      const badgeClass = item.status === "fake" ? "badge-no" : (item.status === "credible" ? "badge-yes" : "badge-partial");
      const badgeColor = item.status === "fake" ? "var(--danger-color)" : (item.status === "credible" ? "var(--accent-color)" : "var(--warning-color)");
      const statusText = item.status.toUpperCase();

      card.innerHTML = `
        <span class="badge-status-pill ${badgeClass}" style="margin-bottom:12px; display:inline-block;">${statusText}</span>
        <h4 style="font-family:var(--font-heading); font-size:15px; font-weight:700; margin-bottom:8px; line-height:1.4;">${item.headline}</h4>
        <div style="font-size:12px; color:var(--text-muted); margin-bottom:12px;">
          <span>Fake Probability: <strong style="color:${badgeColor};">${item.probability}%</strong></span>
        </div>
        <div style="font-size:11px; color:var(--text-muted); margin-bottom:16px;">
          <span>Sources: <strong>${item.verifiedSources}</strong></span>
        </div>
        <button class="btn btn-secondary btn-sm btn-trending-inspect" data-headline="${item.headline}" style="width:100%; padding:8px; font-size:12px;">
          Verify Claim
        </button>
      `;
      grid.appendChild(card);
    });

    // Bind verify claim triggers
    document.querySelectorAll(".btn-trending-inspect").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const headline = e.currentTarget.getAttribute("data-headline");
        const detectArea = document.getElementById("detect-main-input");
        if (detectArea) {
          detectArea.value = headline;
          window.location.hash = "#detect";
          // Trigger analysis programmatically
          const trigger = document.getElementById("detect-trigger-btn");
          if (trigger) trigger.click();
        }
      });
    });
  };

  window.addEventListener("init-trending-news", renderGrid);

  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
      refreshBtn.disabled = true;
      refreshBtn.innerHTML = `<span class="loader-spinner" style="width:12px; height:12px; border-width:2px; display:inline-block; vertical-align:middle; margin-right:6px;"></span> Refreshing...`;
      
      setTimeout(() => {
        // Mock add a new item
        if (trendingItems.length === 3) {
          trendingItems.unshift({
            headline: "Election Fraud Rumor: Voting machines hacked in state elections",
            status: "misleading",
            probability: 67,
            key: "education",
            verifiedSources: "Election Commission, Reuters"
          });
        }
        renderGrid();
        refreshBtn.disabled = false;
        refreshBtn.innerHTML = `
          <svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; stroke-width:2; fill:none;"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          Refresh List
        `;
      }, 1200);
    });
  }
}

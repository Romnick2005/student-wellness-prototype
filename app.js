// ============================================================================
// IN-MEMORY DATA STORE (Replaces PostgreSQL — Zero External DB Required)
// Matches Thesis Chapter IV Data Dictionary & ERD
// ============================================================================
const state = {
  currentUser: null,
  campusZones: [
    { zone_id: "ZN-01", zone_name: "Main Library", camera_node_code: "EDGE-LIB-01", is_active: true },
    { zone_id: "ZN-02", zone_name: "Study Hall A", camera_node_code: "EDGE-STD-02", is_active: true },
    { zone_id: "ZN-03", zone_name: "Student Lounge", camera_node_code: "EDGE-LNG-03", is_active: true },
    { zone_id: "ZN-04", zone_name: "Canteen Annex", camera_node_code: "EDGE-CNT-04", is_active: false }
  ],
  affectLogs: [
    {
      log_id: "LOG-1001",
      zone_id: "Main Library",
      timestamp: "2026-11-25 09:10:14",
      anonymous_session_hash: "sha256:9f82c1a...e41b",
      neutral_score: 0.7420,
      anxiety_score: 0.1210,
      sadness_score: 0.0640,
      stress_score: 0.0730,
      interaction_density: 6
    },
    {
      log_id: "LOG-1002",
      zone_id: "Study Hall A",
      timestamp: "2026-11-25 09:12:45",
      anonymous_session_hash: "sha256:3b71d09...882c",
      neutral_score: 0.2150,
      anxiety_score: 0.4820,
      sadness_score: 0.1130,
      stress_score: 0.1900,
      interaction_density: 2
    },
    {
      log_id: "LOG-1003",
      zone_id: "Student Lounge",
      timestamp: "2026-11-25 09:15:02",
      anonymous_session_hash: "sha256:7c44e91...109a",
      neutral_score: 0.6890,
      anxiety_score: 0.1050,
      sadness_score: 0.0920,
      stress_score: 0.1140,
      interaction_density: 8
    }
  ],
  distressAlerts: [
    {
      alert_id: "ALT-201",
      zone_id: "Study Hall A",
      triggered_at: "2026-11-25 09:13:00",
      severity_level: "High",
      distress_indicator_type: "Sustained High Anxiety & Low Interaction Density",
      status: "Pending",
      counselor_notes: ""
    },
    {
      alert_id: "ALT-202",
      zone_id: "Main Library",
      triggered_at: "2026-11-25 08:40:22",
      severity_level: "Moderate",
      distress_indicator_type: "Elevated Stress Spike (Exam Week Baseline)",
      status: "Pending",
      counselor_notes: ""
    }
  ],
  wellnessReports: [
    {
      report_id: "RPT-501",
      zone_id: "Main Library",
      period: "2026-11-18 to 2026-11-25",
      overall_wellness_index: "84.50%",
      dominant_affect_trend: "Neutral / Calm",
      anomaly_flag: "No",
      generated_by: "Dr. Elena Reyes"
    },
    {
      report_id: "RPT-502",
      zone_id: "Study Hall A",
      period: "2026-11-18 to 2026-11-25",
      overall_wellness_index: "68.20%",
      dominant_affect_trend: "Elevated Anxiety",
      anomaly_flag: "Yes",
      generated_by: "Dr. Elena Reyes"
    }
  ]
};

// ============================================================================
// NAVIGATION & AUTHENTICATION FLOW (Clickable Storyboard Connections)
// ============================================================================
const loginForm = document.getElementById("login-form");
const roleSelect = document.getElementById("role-select");
const emailInput = document.getElementById("email-input");

roleSelect.addEventListener("change", () => {
  emailInput.value =
    roleSelect.value === "System Admin"
      ? "admin@htc-gensan.edu.ph"
      : "counselor@htc-gensan.edu.ph";
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const role = roleSelect.value;
  state.currentUser = {
    name: role === "System Admin" ? "Romnick S. Bagus" : "Dr. Elena Reyes",
    role: role
  };

  document.getElementById("current-user-name").textContent = state.currentUser.name;
  document.getElementById("current-user-role").textContent = state.currentUser.role;

  // Role-based access control (Use Case Diagram: Admin vs Guidance)
  document.querySelectorAll(".admin-only").forEach((el) => {
    el.style.display = role === "System Admin" ? "flex" : "none";
  });

  document.getElementById("screen-login").classList.remove("active");
  document.getElementById("screen-login").classList.add("hidden");
  document.getElementById("app-shell").classList.remove("hidden");

  renderAll();
});

document.getElementById("logout-btn").addEventListener("click", () => {
  document.getElementById("app-shell").classList.add("hidden");
  document.getElementById("screen-login").classList.remove("hidden");
  document.getElementById("screen-login").classList.add("active");
});

// Sidebar Navigation Links
document.querySelectorAll(".nav-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById(btn.dataset.target).classList.add("active");
  });
});

// ============================================================================
// SIMULATE EDGE ONNX INFERENCE (Zero Video Retention Pipeline)
// ============================================================================
document.getElementById("simulate-stream-btn").addEventListener("click", () => {
  const activeZones = state.campusZones.filter((z) => z.is_active);
  if (activeZones.length === 0) {
    alert("No active camera nodes available. Enable a node in Edge Nodes & Privacy.");
    return;
  }

  const randomZone = activeZones[Math.floor(Math.random() * activeZones.length)];
  const neutral = +(Math.random() * 0.5 + 0.2).toFixed(4);
  const anxiety = +(Math.random() * 0.45).toFixed(4);
  const sadness = +(Math.random() * 0.2).toFixed(4);
  const stress = +(1 - (neutral + anxiety + sadness)).toFixed(4);
  const density = Math.floor(Math.random() * 10) + 1;
  const hash = "sha256:" + Math.random().toString(16).substring(2, 10) + "...";

  const now = new Date().toISOString().replace("T", " ").substring(0, 19);

  state.affectLogs.unshift({
    log_id: "LOG-" + (1000 + state.affectLogs.length + 1),
    zone_id: randomZone.zone_name,
    timestamp: now,
    anonymous_session_hash: hash,
    neutral_score: neutral,
    anxiety_score: anxiety,
    sadness_score: Math.max(0, sadness),
    stress_score: Math.max(0, stress),
    interaction_density: density
  });

  // Trigger Distress Alert if Anxiety > 0.38
  if (anxiety > 0.38) {
    state.distressAlerts.unshift({
      alert_id: "ALT-" + (200 + state.distressAlerts.length + 1),
      zone_id: randomZone.zone_name,
      triggered_at: now,
      severity_level: "High",
      distress_indicator_type: `Automated Anxiety Threshold Breach (${(anxiety * 100).toFixed(1)}%)`,
      status: "Pending",
      counselor_notes: ""
    });
  }

  renderAll();
});

// Generate New Wellness Report
document.getElementById("generate-report-btn").addEventListener("click", () => {
  const zone = state.campusZones[Math.floor(Math.random() * state.campusZones.length)];
  const score = (Math.random() * 20 + 75).toFixed(2) + "%";

  state.wellnessReports.unshift({
    report_id: "RPT-" + (500 + state.wellnessReports.length + 1),
    zone_id: zone.zone_name,
    period: "2026-11-25 (Snapshot)",
    overall_wellness_index: score,
    dominant_affect_trend: parseFloat(score) > 80 ? "Neutral / Positive" : "Mild Stress",
    anomaly_flag: parseFloat(score) <= 80 ? "Yes" : "No",
    generated_by: state.currentUser.name
  });

  renderReports();
});

// ============================================================================
// RENDER FUNCTIONS
// ============================================================================
function renderAll() {
  renderDashboard();
  renderAlerts();
  renderReports();
  renderZones();
}

function renderDashboard() {
  const activeCount = state.campusZones.filter((z) => z.is_active).length;
  const pendingCount = state.distressAlerts.filter((a) => a.status === "Pending").length;
  const latestDensity = state.affectLogs[0]?.interaction_density || 0;

  document.getElementById("kpi-nodes").textContent = `${activeCount} / ${state.campusZones.length}`;
  document.getElementById("kpi-alerts").textContent = pendingCount;
  document.getElementById("alert-badge").textContent = pendingCount;
  document.getElementById("kpi-density").textContent = latestDensity;

  const tbody = document.getElementById("telemetry-table-body");
  tbody.innerHTML = state.affectLogs
    .slice(0, 8)
    .map(
      (log) => `
      <tr>
        <td>${log.timestamp}</td>
        <td><strong>${log.zone_id}</strong></td>
        <td><code>${log.anonymous_session_hash}</code></td>
        <td>${(log.neutral_score * 100).toFixed(1)}%</td>
        <td>${(log.anxiety_score * 100).toFixed(1)}%</td>
        <td>${(log.sadness_score * 100).toFixed(1)}%</td>
        <td>${(log.stress_score * 100).toFixed(1)}%</td>
        <td>${log.interaction_density} ROIs</td>
      </tr>
    `
    )
    .join("");
}

function renderAlerts() {
  const container = document.getElementById("alerts-container");
  container.innerHTML = state.distressAlerts
    .map(
      (alert, index) => `
      <div class="alert-card">
        <div class="alert-top">
          <span><strong>${alert.alert_id}</strong> • ${alert.zone_id} (${alert.triggered_at})</span>
          <span class="${alert.severity_level === "High" ? "sev-high" : "sev-mod"}">${alert.severity_level} Severity</span>
        </div>
        <p style="margin-bottom: 0.75rem;">${alert.distress_indicator_type}</p>
        <p style="font-size: 0.85rem; color: var(--muted); margin-bottom: 0.75rem;">
          Status: <strong>${alert.status}</strong> ${alert.counselor_notes ? `— Note: "${alert.counselor_notes}"` : ""}
        </p>
        ${
          alert.status === "Pending"
            ? `<button class="btn-primary" onclick="acknowledgeAlert(${index})">Acknowledge & Log Note</button>`
            : ""
        }
      </div>
    `
    )
    .join("");
}

window.acknowledgeAlert = function (index) {
  const note = prompt("Enter guidance counselor intervention note:", "Scheduled proactive wellness check-in for zone.");
  if (note !== null) {
    state.distressAlerts[index].status = "Acknowledged";
    state.distressAlerts[index].counselor_notes = note;
    renderAll();
  }
};

function renderReports() {
  const tbody = document.getElementById("reports-table-body");
  tbody.innerHTML = state.wellnessReports
    .map(
      (r) => `
      <tr>
        <td><strong>${r.report_id}</strong></td>
        <td>${r.zone_id}</td>
        <td>${r.period}</td>
        <td>${r.overall_wellness_index}</td>
        <td>${r.dominant_affect_trend}</td>
        <td>${r.anomaly_flag}</td>
        <td>${r.generated_by}</td>
      </tr>
    `
    )
    .join("");
}

function renderZones() {
  const tbody = document.getElementById("zones-table-body");
  tbody.innerHTML = state.campusZones
    .map(
      (z, idx) => `
      <tr>
        <td>${z.zone_id}</td>
        <td><strong>${z.zone_name}</strong></td>
        <td><code>${z.camera_node_code}</code></td>
        <td>RAM Purge Active</td>
        <td>${z.is_active ? "🟢 Active" : "🔴 Offline"}</td>
        <td>
          <button class="btn-secondary" onclick="toggleZone(${idx})">
            ${z.is_active ? "Disable Node" : "Enable Node"}
          </button>
        </td>
      </tr>
    `
    )
    .join("");
}

window.toggleZone = function (idx) {
  state.campusZones[idx].is_active = !state.campusZones[idx].is_active;
  renderAll();
};
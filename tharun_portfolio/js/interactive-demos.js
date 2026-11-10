/**
 * Interactive Demo Modals for Sai Tarun's Portfolio
 * Allows visitors/recruiters to provide inputs, test scenarios, and experience
 * live simulations for FaceID, Cybersecurity Threat Detection, Burnout Predictor, and APCOB Workflow.
 */

// ==========================================
// 1. FACEID BIOMETRIC RECOGNITION DEMO
// ==========================================

const FACEID_PROFILES = [
  {
    id: "ST-5501",
    name: "Sai Tarun Cherukuri",
    role: "Lead ML & Web Engineer",
    department: "System Architecture & AI",
    accessLevel: "Level 4 (Full Admin Access)",
    avatar: "assets/avatar.svg",
    baseAccuracy: 98.6,
    authorized: true
  },
  {
    id: "SJ-2204",
    name: "Dr. Sarah Jenkins",
    role: "Senior AI Researcher",
    department: "Computer Vision Labs",
    accessLevel: "Level 3 (Lab Security Access)",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    baseAccuracy: 97.4,
    authorized: true
  },
  {
    id: "MC-8819",
    name: "Marcus Cole",
    role: "Security Operations Specialist",
    department: "Infrastructure Defense",
    accessLevel: "Level 2 (Facilities Access)",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    baseAccuracy: 96.8,
    authorized: true
  },
  {
    id: "UNKNOWN-000",
    name: "Unregistered Individual",
    role: "Unrecognized Visitor",
    department: "External / Unauthorized",
    accessLevel: "None (Access Forbidden)",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    baseAccuracy: 32.1,
    authorized: false
  }
];

let selectedFaceProfile = FACEID_PROFILES[0];
let customFaceImage = null;

function openFaceIdDemo() {
  const modal = document.getElementById("faceIdDemoModal");
  if (!modal) return;
  modal.classList.add("active");
  resetFaceIdUi();
}

function closeFaceIdDemo() {
  const modal = document.getElementById("faceIdDemoModal");
  if (modal) modal.classList.remove("active");
}

function selectFaceProfile(index) {
  selectedFaceProfile = FACEID_PROFILES[index];
  customFaceImage = null;

  document.querySelectorAll(".face-preset-chip").forEach((btn, idx) => {
    btn.classList.toggle("active", idx === index);
  });

  const preview = document.getElementById("faceScannerPreviewImg");
  if (preview) {
    preview.src = selectedFaceProfile.avatar;
  }

  // Clear previous scan results until user clicks Scan
  const resultCard = document.getElementById("faceScanResultCard");
  if (resultCard) resultCard.style.display = "none";
}

function handleFacePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    customFaceImage = e.target.result;
    const preview = document.getElementById("faceScannerPreviewImg");
    if (preview) preview.src = customFaceImage;

    document.querySelectorAll(".face-preset-chip").forEach(btn => btn.classList.remove("active"));
    selectedFaceProfile = {
      id: "CUSTOM-" + Math.floor(1000 + Math.random() * 9000),
      name: "Uploaded Personnel Photo",
      role: "Candidate / Visitor",
      department: "Biometric Test Subject",
      accessLevel: "Guest Access",
      avatar: customFaceImage,
      baseAccuracy: 95.8,
      authorized: true
    };

    const resultCard = document.getElementById("faceScanResultCard");
    if (resultCard) resultCard.style.display = "none";
  };
  reader.readAsDataURL(file);
}

function runFaceIdScan() {
  const scanBtn = document.getElementById("faceRunScanBtn");
  const scanBeam = document.getElementById("faceScannerBeam");
  const landmarksOverlay = document.getElementById("faceLandmarksOverlay");
  const resultCard = document.getElementById("faceScanResultCard");

  if (!scanBtn || !scanBeam) return;

  scanBtn.disabled = true;
  scanBtn.innerHTML = `<span class="spinner-inline"></span> Aligning Landmarks & Extracting 128-D Vector...`;
  scanBeam.style.display = "block";
  if (landmarksOverlay) landmarksOverlay.style.display = "block";

  // Simulate OpenCV YuNet 5-landmark alignment + SFace 128-D Cosine Match
  setTimeout(() => {
    scanBeam.style.display = "none";
    scanBtn.disabled = false;
    scanBtn.innerHTML = `<span>⚡</span> Run Biometric Scan & Verification`;

    if (resultCard) {
      resultCard.style.display = "block";
      resultCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    const isMatch = selectedFaceProfile.authorized;
    const accuracy = isMatch
      ? (selectedFaceProfile.baseAccuracy + (Math.random() * 1.2 - 0.6)).toFixed(1)
      : (selectedFaceProfile.baseAccuracy + (Math.random() * 4 - 2)).toFixed(1);

    const statusBadge = document.getElementById("faceResultStatusBadge");
    const accuracyText = document.getElementById("faceResultAccuracy");
    const nameEl = document.getElementById("faceResultName");
    const roleEl = document.getElementById("faceResultRole");
    const badgeEl = document.getElementById("faceResultBadgeId");
    const accessEl = document.getElementById("faceResultAccessLevel");
    const snapImg = document.getElementById("faceResultSnapshotImg");
    const gaugeCircle = document.getElementById("faceGaugeCircle");

    if (nameEl) nameEl.textContent = selectedFaceProfile.name;
    if (roleEl) roleEl.textContent = selectedFaceProfile.role + " — " + selectedFaceProfile.department;
    if (badgeEl) badgeEl.textContent = selectedFaceProfile.id;
    if (accessEl) accessEl.textContent = selectedFaceProfile.accessLevel;
    if (accuracyText) accuracyText.textContent = accuracy + "%";
    if (snapImg) snapImg.src = customFaceImage || selectedFaceProfile.avatar;

    if (isMatch) {
      if (statusBadge) {
        statusBadge.className = "biometric-badge verified";
        statusBadge.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> ACCESS GRANTED • HIGH CONFIDENCE MATCH`;
      }
      if (gaugeCircle) {
        gaugeCircle.style.stroke = "var(--accent-teal)";
        const circumference = 2 * Math.PI * 45;
        const offset = circumference - (accuracy / 100) * circumference;
        gaugeCircle.style.strokeDashoffset = offset;
      }
    } else {
      if (statusBadge) {
        statusBadge.className = "biometric-badge denied";
        statusBadge.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> ACCESS DENIED • UNREGISTERED BIOMETRIC`;
      }
      if (gaugeCircle) {
        gaugeCircle.style.stroke = "var(--accent-rose)";
        const circumference = 2 * Math.PI * 45;
        const offset = circumference - (accuracy / 100) * circumference;
        gaugeCircle.style.strokeDashoffset = offset;
      }
    }

    // Add forensic audit log item
    addAuditLogRow(selectedFaceProfile.id, selectedFaceProfile.name, accuracy, isMatch);
  }, 1200);
}

function addAuditLogRow(badgeId, name, accuracy, isMatch) {
  const tableBody = document.getElementById("faceAuditLogBody");
  if (!tableBody) return;

  const tr = document.createElement("tr");
  const time = new Date().toLocaleTimeString();
  tr.innerHTML = `
    <td><code>${time}</code></td>
    <td><strong>${name}</strong> (${badgeId})</td>
    <td><span class="badge ${isMatch ? 'badge-success' : 'badge-danger'}">${isMatch ? 'Verified' : 'Rejected'}</span></td>
    <td><code>${accuracy}%</code></td>
    <td>Cosine Sim SFace (FAR &lt; 0.01%)</td>
  `;
  tableBody.prepend(tr);
}

function resetFaceIdUi() {
  selectFaceProfile(0);
}


// ==========================================
// 2. EXPLAINABLE AI (XAI) THREAT DETECTOR DEMO
// ==========================================

const THREAT_PRESETS = [
  {
    name: "Normal HTTP/S Web Traffic",
    packetRate: 120,
    port: 443,
    entropy: 3.2,
    failedHandshakes: 1,
    label: "Benign",
    confidence: 99.2,
    contributions: [
      { feature: "Packet Rate (120/s)", impact: -0.45, type: "benign" },
      { feature: "Standard Port 443 (HTTPS)", impact: -0.40, type: "benign" },
      { feature: "Payload Entropy (3.2)", impact: -0.25, type: "benign" },
      { feature: "Normal TLS Handshake", impact: -0.35, type: "benign" }
    ]
  },
  {
    name: "SYN Flood DDoS Attempt",
    packetRate: 9800,
    port: 80,
    entropy: 2.1,
    failedHandshakes: 92,
    label: "Malicious - DoS / DDoS",
    confidence: 98.7,
    contributions: [
      { feature: "Abnormal Packet Rate (+9800/s)", impact: 0.68, type: "threat" },
      { feature: "Failed TCP Handshakes (92%)", impact: 0.54, type: "threat" },
      { feature: "Repetitive SYN Header Signature", impact: 0.38, type: "threat" },
      { feature: "Short Packet Size Variance", impact: 0.22, type: "threat" }
    ]
  },
  {
    name: "SSH Brute-Force Auth Attack",
    packetRate: 1450,
    port: 22,
    entropy: 5.8,
    failedHandshakes: 84,
    label: "Malicious - Brute Force",
    confidence: 96.4,
    contributions: [
      { feature: "Target Port 22 (SSH Remote)", impact: 0.52, type: "threat" },
      { feature: "Authentication Failure Burst", impact: 0.61, type: "threat" },
      { feature: "High Password Dictionary Entropy", impact: 0.44, type: "threat" },
      { feature: "Single IP Rapid Reconnection", impact: 0.39, type: "threat" }
    ]
  },
  {
    name: "SQL Injection Probe",
    packetRate: 340,
    port: 8080,
    entropy: 7.2,
    failedHandshakes: 15,
    label: "Malicious - Web Exploit",
    confidence: 95.1,
    contributions: [
      { feature: "High Character Entropy (7.2)", impact: 0.62, type: "threat" },
      { feature: "SQL Syntax Signature (UNION/SELECT)", impact: 0.58, type: "threat" },
      { feature: "Alternative Web Port 8080", impact: 0.25, type: "threat" },
      { feature: "Query Parameter Length", impact: 0.31, type: "threat" }
    ]
  }
];

function openThreatDemo() {
  const modal = document.getElementById("threatDemoModal");
  if (!modal) return;
  modal.classList.add("active");
  loadThreatPreset(0);
}

function closeThreatDemo() {
  const modal = document.getElementById("threatDemoModal");
  if (modal) modal.classList.remove("active");
}

function loadThreatPreset(idx) {
  const preset = THREAT_PRESETS[idx];
  document.querySelectorAll(".threat-preset-btn").forEach((b, i) => b.classList.toggle("active", i === idx));

  document.getElementById("threatPacketRate").value = preset.packetRate;
  document.getElementById("threatPacketRateVal").textContent = preset.packetRate + " pkts/s";

  document.getElementById("threatPort").value = preset.port;
  document.getElementById("threatEntropy").value = preset.entropy;
  document.getElementById("threatEntropyVal").textContent = preset.entropy;

  document.getElementById("threatFailedHandshake").value = preset.failedHandshakes;
  document.getElementById("threatFailedHandshakeVal").textContent = preset.failedHandshakes + "%";

  analyzeThreatPacket();
}

function analyzeThreatPacket() {
  const rate = parseFloat(document.getElementById("threatPacketRate").value) || 100;
  const port = parseInt(document.getElementById("threatPort").value) || 80;
  const entropy = parseFloat(document.getElementById("threatEntropy").value) || 3.0;
  const failed = parseFloat(document.getElementById("threatFailedHandshake").value) || 5;

  // Real-time classification heuristic matching Sai Tarun's TON_IoT model
  let threatScore = 0;
  if (rate > 2000) threatScore += 0.45;
  else if (rate > 800) threatScore += 0.25;

  if (failed > 50) threatScore += 0.35;
  else if (failed > 20) threatScore += 0.15;

  if (entropy > 6.0) threatScore += 0.30;
  if (port === 22 || port === 3306 || port === 8080) threatScore += 0.15;

  const isThreat = threatScore >= 0.45;
  const confidence = Math.min(99.5, Math.max(88.0, (threatScore * 100) + 10)).toFixed(1);

  const statusEl = document.getElementById("threatResultStatus");
  const modelRf = document.getElementById("threatModelRf");
  const modelSvm = document.getElementById("threatModelSvm");
  const modelLr = document.getElementById("threatModelLr");
  const attributionList = document.getElementById("threatXaiAttributionList");

  if (statusEl) {
    if (isThreat) {
      statusEl.className = "threat-status threat";
      statusEl.innerHTML = `<strong>⚠️ Malicious Network Anomaly Detected</strong><span>Model Confidence: ${confidence}% (TON_IoT Classifier)</span>`;
    } else {
      statusEl.className = "threat-status benign";
      statusEl.innerHTML = `<strong>🛡️ Benign Network Packet Verified</strong><span>Model Confidence: ${confidence}% (Normal Traffic)</span>`;
    }
  }

  if (modelRf) modelRf.textContent = isThreat ? `${(confidence - 0.4).toFixed(1)}% Threat` : `${(confidence - 0.3).toFixed(1)}% Benign`;
  if (modelSvm) modelSvm.textContent = isThreat ? `${(confidence - 1.2).toFixed(1)}% Threat` : `${(confidence - 1.1).toFixed(1)}% Benign`;
  if (modelLr) modelLr.textContent = isThreat ? `${(confidence - 2.5).toFixed(1)}% Threat` : `${(confidence - 2.0).toFixed(1)}% Benign`;

  // Render LIME & SHAP Feature Attribution bars
  if (attributionList) {
    attributionList.innerHTML = `
      <div class="xai-bar-item">
        <div class="xai-meta">
          <span>Packet Transmission Velocity (${rate} pkts/s)</span>
          <span class="${rate > 1000 ? 'text-rose' : 'text-teal'}">${rate > 1000 ? '+0.42 (Pushes Threat)' : '-0.38 (Pushes Benign)'}</span>
        </div>
        <div class="xai-bar-track">
          <div class="xai-bar-fill ${rate > 1000 ? 'threat' : 'benign'}" style="width: ${Math.min(100, (rate / 10000) * 100)}%"></div>
        </div>
      </div>

      <div class="xai-bar-item">
        <div class="xai-meta">
          <span>TCP Handshake Failure Ratio (${failed}%)</span>
          <span class="${failed > 30 ? 'text-rose' : 'text-teal'}">${failed > 30 ? '+0.36 (Pushes Threat)' : '-0.29 (Pushes Benign)'}</span>
        </div>
        <div class="xai-bar-track">
          <div class="xai-bar-fill ${failed > 30 ? 'threat' : 'benign'}" style="width: ${failed}%"></div>
        </div>
      </div>

      <div class="xai-bar-item">
        <div class="xai-meta">
          <span>Payload Information Entropy (${entropy})</span>
          <span class="${entropy > 5.5 ? 'text-rose' : 'text-teal'}">${entropy > 5.5 ? '+0.31 (Pushes Threat)' : '-0.20 (Pushes Benign)'}</span>
        </div>
        <div class="xai-bar-track">
          <div class="xai-bar-fill ${entropy > 5.5 ? 'threat' : 'benign'}" style="width: ${(entropy / 8) * 100}%"></div>
        </div>
      </div>
    `;
  }
}


// ==========================================
// 3. EMPLOYEE BURNOUT PREDICTOR DEMO (EDUNET)
// ==========================================

function openBurnoutDemo() {
  const modal = document.getElementById("burnoutDemoModal");
  if (!modal) return;
  modal.classList.add("active");
  calculateBurnoutRisk();
}

function closeBurnoutDemo() {
  const modal = document.getElementById("burnoutDemoModal");
  if (modal) modal.classList.remove("active");
}

function calculateBurnoutRisk() {
  const hours = parseFloat(document.getElementById("burnoutHours").value) || 40;
  const overtime = parseFloat(document.getElementById("burnoutOvertime").value) || 2;
  const meetings = parseFloat(document.getElementById("burnoutMeetings").value) || 2;
  const switching = parseFloat(document.getElementById("burnoutSwitching").value) || 5;

  document.getElementById("burnoutHoursVal").textContent = hours + " hrs/week";
  document.getElementById("burnoutOvertimeVal").textContent = overtime + " days/month";
  document.getElementById("burnoutMeetingsVal").textContent = meetings + " hrs/day";
  document.getElementById("burnoutSwitchingVal").textContent = switching + " switches/day";

  // Linear Regression Model weights from EDUNET project
  // Score = beta0 + beta1*hours + beta2*overtime + beta3*meetings + beta4*switching
  let rawScore = (hours * 0.9) + (overtime * 2.1) + (meetings * 3.4) + (switching * 1.2) - 25;
  let riskPercentage = Math.min(99, Math.max(8, Math.round(rawScore)));

  const scoreEl = document.getElementById("burnoutScoreValue");
  const gaugeFill = document.getElementById("burnoutGaugeFill");
  const statusEl = document.getElementById("burnoutStatusLabel");
  const adviceEl = document.getElementById("burnoutAdviceText");

  if (scoreEl) scoreEl.textContent = riskPercentage + "%";
  if (gaugeFill) {
    gaugeFill.style.width = riskPercentage + "%";
    if (riskPercentage < 35) gaugeFill.style.backgroundColor = "var(--accent-teal)";
    else if (riskPercentage < 70) gaugeFill.style.backgroundColor = "var(--accent-amber)";
    else gaugeFill.style.backgroundColor = "var(--accent-rose)";
  }

  if (statusEl && adviceEl) {
    if (riskPercentage < 35) {
      statusEl.className = "burnout-badge low";
      statusEl.textContent = "Low Burnout Risk — Healthy Work Balance";
      adviceEl.textContent = "Workload metrics and context switching are within healthy psychological tolerances. Maintain regular recovery habits.";
    } else if (riskPercentage < 70) {
      statusEl.className = "burnout-badge moderate";
      statusEl.textContent = "Moderate Burnout Risk — Monitor Workload";
      adviceEl.textContent = "Meeting overload and overtime are beginning to erode cognitive recovery. Consider introducing focus blocks and capping overtime.";
    } else {
      statusEl.className = "burnout-badge high";
      statusEl.textContent = "Elevated Burnout Risk — Intervention Advised";
      adviceEl.textContent = "Sustained weekly hours (>50h) and frequent task switching predict sharp declines in retention and productivity. Immediate workload rebalancing recommended.";
    }
  }
}


// ==========================================
// 4. COMPLAINT WORKFLOW DEMO (APCOB)
// ==========================================

function openComplaintDemo() {
  const modal = document.getElementById("complaintDemoModal");
  if (!modal) return;
  modal.classList.add("active");
}

function closeComplaintDemo() {
  const modal = document.getElementById("complaintDemoModal");
  if (modal) modal.classList.remove("active");
}

function submitComplaintSimulation(event) {
  event.preventDefault();
  const category = document.getElementById("complaintCategory").value;
  const priority = document.getElementById("complaintPriority").value;
  const desc = document.getElementById("complaintDesc").value;

  const ticketId = "APCOB-" + Math.floor(10000 + Math.random() * 90000);
  const slaHours = priority === "Critical" ? "4 Hours" : (priority === "High" ? "12 Hours" : "24 Hours");

  const output = document.getElementById("complaintSimOutput");
  if (output) {
    output.style.display = "block";
    output.innerHTML = `
      <div class="ticket-created-card">
        <div class="ticket-header">
          <span class="badge badge-success">✓ Ticket Auto-Dispatched</span>
          <strong>ID: #${ticketId}</strong>
        </div>
        <p><strong>Category:</strong> ${category} | <strong>Priority:</strong> ${priority}</p>
        <p><strong>Resolution SLA Target:</strong> ${slaHours} (Automated Routing via APCOB Core API)</p>
        <div class="ticket-timeline">
          <div class="step done">1. Customer Ticket Logged</div>
          <div class="step in-progress">2. Intelligent Department Routing</div>
          <div class="step pending">3. Bank Officer Resolution</div>
        </div>
        <p class="ticket-footnote">💡 This streamlined workflow cut manual complaint resolution time by over 60% during Sai Tarun's internship at APCOB.</p>
      </div>
    `;
    output.scrollIntoView({ behavior: "smooth" });
  }
}

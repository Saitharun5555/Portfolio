/**
 * Admin Panel & Personal Editing Functionality for Sai Tarun Cherukuri
 * Handles PIN authentication, profile photo updates, project CRUD operations,
 * and data import/export.
 */

let appData = loadPortfolioData();
let isAdminActive = false;
let editingProjectId = null;

// Initialize Admin UI and listeners
function initAdmin() {
  // Check session storage for existing login in this session
  if (sessionStorage.getItem("sai_admin_authenticated") === "true") {
    isAdminActive = true;
    showAdminToolbar();
    enableAdminEditMode();
  }

  // Global keyboard shortcut to open Admin Modal: Ctrl + Shift + A
  window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
      e.preventDefault();
      toggleAdminModal();
    }
  });

  // Admin lock trigger button
  const adminTriggerBtn = document.getElementById("adminTriggerBtn");
  if (adminTriggerBtn) {
    adminTriggerBtn.addEventListener("click", () => {
      if (isAdminActive) {
        showToast("Admin mode is already unlocked! Check the top toolbar.", "info");
      } else {
        openAdminLoginModal();
      }
    });
  }

  // Setup file picker for profile picture direct upload
  setupAvatarUpload();

  // Setup Project Modal form submission
  setupProjectForm();

  // Setup Profile Edit form submission
  setupProfileForm();
}

/**
 * Opens Admin Login Modal
 */
function openAdminLoginModal() {
  const modal = document.getElementById("adminLoginModal");
  const pinInput = document.getElementById("adminPinInput");
  const errEl = document.getElementById("adminPinError");
  if (errEl) errEl.textContent = "";
  if (pinInput) {
    pinInput.value = "";
    setTimeout(() => pinInput.focus(), 150);
  }
  if (modal) modal.classList.add("active");
}

/**
 * Closes Admin Login Modal
 */
function closeAdminLoginModal() {
  const modal = document.getElementById("adminLoginModal");
  if (modal) modal.classList.remove("active");
}

/**
 * Validates PIN and logs in
 */
function attemptAdminLogin() {
  const pinInput = document.getElementById("adminPinInput");
  const errEl = document.getElementById("adminPinError");
  const enteredPin = (pinInput ? pinInput.value : "").trim();
  const currentPin = appData.profile.adminPin || "1234";

  if (enteredPin === currentPin) {
    isAdminActive = true;
    sessionStorage.setItem("sai_admin_authenticated", "true");
    closeAdminLoginModal();
    showAdminToolbar();
    enableAdminEditMode();
    renderAll();
    showToast("Welcome back, Sai Tarun! Admin Mode is now ACTIVE.", "success");
  } else {
    if (errEl) errEl.textContent = "Incorrect PIN. Default is 1234 (case-sensitive).";
    if (pinInput) {
      pinInput.classList.add("shake-animation");
      setTimeout(() => pinInput.classList.remove("shake-animation"), 500);
    }
  }
}

/**
 * Logs out of Admin Mode
 */
function logoutAdmin() {
  isAdminActive = false;
  sessionStorage.removeItem("sai_admin_authenticated");
  hideAdminToolbar();
  disableAdminEditMode();
  renderAll();
  showToast("Admin mode locked. Viewing public portfolio.", "info");
}

/**
 * Displays floating top Admin Toolbar
 */
function showAdminToolbar() {
  let bar = document.getElementById("adminFloatingBar");
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "adminFloatingBar";
    bar.className = "admin-floating-bar";
    bar.innerHTML = `
      <div class="admin-bar-content">
        <div class="admin-bar-badge">
          <span class="pulse-dot"></span>
          <strong>Admin Active</strong>
          <span class="admin-hint">(Sai Tarun's Edit Mode)</span>
        </div>
        <div class="admin-bar-actions">
          <button class="btn btn-sm btn-outline-admin" onclick="openProfileEditModal()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Edit Profile & Photo
          </button>
          <button class="btn btn-sm btn-primary-admin" onclick="openAddProjectModal()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add New Project
          </button>
          <button class="btn btn-sm btn-outline-admin" onclick="exportDataBackup()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export JSON
          </button>
          <button class="btn btn-sm btn-outline-admin" onclick="openPinChangeModal()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Change PIN
          </button>
          <button class="btn btn-sm btn-danger-admin" onclick="logoutAdmin()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Lock Admin
          </button>
        </div>
      </div>
    `;
    document.body.prepend(bar);
  }
  bar.style.display = "block";
  document.body.classList.add("admin-logged-in");
}

function hideAdminToolbar() {
  const bar = document.getElementById("adminFloatingBar");
  if (bar) bar.style.display = "none";
  document.body.classList.remove("admin-logged-in");
}

function enableAdminEditMode() {
  document.body.classList.add("admin-mode-active");
  const avatarWrapper = document.getElementById("avatarWrapper");
  if (avatarWrapper) {
    avatarWrapper.classList.add("editable");
  }
}

function disableAdminEditMode() {
  document.body.classList.remove("admin-mode-active");
  const avatarWrapper = document.getElementById("avatarWrapper");
  if (avatarWrapper) {
    avatarWrapper.classList.remove("editable");
  }
}

/**
 * Setup profile picture upload from file system or URL
 */
function setupAvatarUpload() {
  const avatarInput = document.getElementById("avatarFileInput");
  if (avatarInput) {
    avatarInput.addEventListener("change", function(e) {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        showToast("Please select a valid image file (PNG, JPG, WebP)", "error");
        return;
      }

      // Read file and convert to compressed base64
      const reader = new FileReader();
      reader.onload = function(evt) {
        compressImage(evt.target.result, 400, 400, 0.85, function(compressedDataUrl) {
          appData.profile.avatarUrl = compressedDataUrl;
          savePortfolioData(appData);
          renderHero();
          showToast("Profile picture updated successfully!", "success");
        });
      };
      reader.readAsDataURL(file);
    });
  }
}

/**
 * Utility to compress image before localStorage save so it never exceeds quota
 */
function compressImage(base64Src, maxWidth, maxHeight, quality, callback) {
  const img = new Image();
  img.onload = function() {
    let width = img.width;
    let height = img.height;

    if (width > height) {
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);
    const dataUrl = canvas.toDataURL("image/jpeg", quality);
    callback(dataUrl);
  };
  img.src = base64Src;
}

/**
 * Opens Profile & Photo Editor Modal
 */
function openProfileEditModal() {
  if (!isAdminActive) {
    openAdminLoginModal();
    return;
  }
  const modal = document.getElementById("profileEditModal");
  if (!modal) return;

  document.getElementById("editName").value = appData.profile.name || "";
  document.getElementById("editTitle").value = appData.profile.title || "";
  document.getElementById("editTagline").value = appData.profile.tagline || "";
  document.getElementById("editBio").value = appData.profile.bio || "";
  document.getElementById("editEmail").value = appData.profile.email || "";
  document.getElementById("editPhone").value = appData.profile.phone || "";
  document.getElementById("editLocation").value = appData.profile.location || "";
  document.getElementById("editGithub").value = appData.profile.github || "";
  document.getElementById("editLinkedin").value = appData.profile.linkedin || "";
  document.getElementById("editStatusBadge").value = appData.profile.statusBadge || "";
  document.getElementById("editPhotoUrl").value = appData.profile.avatarUrl.startsWith("data:") ? "" : appData.profile.avatarUrl;

  const preview = document.getElementById("profileModalAvatarPreview");
  if (preview) preview.src = appData.profile.avatarUrl;

  modal.classList.add("active");
}

function closeProfileEditModal() {
  const modal = document.getElementById("profileEditModal");
  if (modal) modal.classList.remove("active");
}

function setupProfileForm() {
  const form = document.getElementById("profileEditForm");
  if (!form) return;

  form.addEventListener("submit", function(e) {
    e.preventDefault();
    appData.profile.name = document.getElementById("editName").value.trim();
    appData.profile.title = document.getElementById("editTitle").value.trim();
    appData.profile.tagline = document.getElementById("editTagline").value.trim();
    appData.profile.bio = document.getElementById("editBio").value.trim();
    appData.profile.email = document.getElementById("editEmail").value.trim();
    appData.profile.phone = document.getElementById("editPhone").value.trim();
    appData.profile.location = document.getElementById("editLocation").value.trim();
    appData.profile.github = document.getElementById("editGithub").value.trim();
    appData.profile.linkedin = document.getElementById("editLinkedin").value.trim();
    appData.profile.statusBadge = document.getElementById("editStatusBadge").value.trim();

    const photoUrlInput = document.getElementById("editPhotoUrl").value.trim();
    if (photoUrlInput) {
      appData.profile.avatarUrl = photoUrlInput;
    }

    savePortfolioData(appData);
    renderAll();
    closeProfileEditModal();
    showToast("Profile details updated successfully!", "success");
  });
}

/**
 * Projects CRUD Management
 */
function openAddProjectModal() {
  if (!isAdminActive) {
    openAdminLoginModal();
    return;
  }
  editingProjectId = null;
  const modal = document.getElementById("projectModal");
  const modalTitle = document.getElementById("projectModalTitle");
  if (modalTitle) modalTitle.textContent = "Add New Project";

  // Reset form
  document.getElementById("projTitle").value = "";
  document.getElementById("projCategory").value = "web";
  document.getElementById("projTags").value = "HTML5, CSS3, JavaScript";
  document.getElementById("projDescription").value = "";
  document.getElementById("projLiveUrl").value = "";
  document.getElementById("projGithubUrl").value = appData.profile.github || "https://github.com/saitarun5555";
  document.getElementById("projImageUrl").value = "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80";

  if (modal) modal.classList.add("active");
}

function openEditProjectModal(projId) {
  if (!isAdminActive) {
    openAdminLoginModal();
    return;
  }
  const proj = appData.projects.find((p) => p.id === projId);
  if (!proj) return;

  editingProjectId = projId;
  const modal = document.getElementById("projectModal");
  const modalTitle = document.getElementById("projectModalTitle");
  if (modalTitle) modalTitle.textContent = `Edit: ${proj.title}`;

  document.getElementById("projTitle").value = proj.title || "";
  document.getElementById("projCategory").value = proj.category || "web";
  document.getElementById("projTags").value = Array.isArray(proj.tags) ? proj.tags.join(", ") : proj.tags;
  document.getElementById("projDescription").value = proj.description || "";
  document.getElementById("projLiveUrl").value = proj.liveUrl || "";
  document.getElementById("projGithubUrl").value = proj.githubUrl || "";
  document.getElementById("projImageUrl").value = proj.image || "";

  if (modal) modal.classList.add("active");
}

function closeProjectModal() {
  const modal = document.getElementById("projectModal");
  if (modal) modal.classList.remove("active");
  editingProjectId = null;
}

function setupProjectForm() {
  const form = document.getElementById("projectEditForm");
  if (!form) return;

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const title = document.getElementById("projTitle").value.trim();
    const category = document.getElementById("projCategory").value;
    const tagsRaw = document.getElementById("projTags").value;
    const tags = tagsRaw.split(",").map((t) => t.trim()).filter(Boolean);
    const description = document.getElementById("projDescription").value.trim();
    const liveUrl = document.getElementById("projLiveUrl").value.trim();
    const githubUrl = document.getElementById("projGithubUrl").value.trim();
    const image = document.getElementById("projImageUrl").value.trim() || "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80";

    const categoryLabel = category === "web" ? "Web Development" : (category === "ml" ? "Machine Learning / AI" : "Other Project");
    const accent = category === "web" ? "teal" : "indigo";

    if (editingProjectId) {
      // Update existing
      const idx = appData.projects.findIndex((p) => p.id === editingProjectId);
      if (idx !== -1) {
        appData.projects[idx] = {
          ...appData.projects[idx],
          title,
          category,
          categoryLabel,
          tags,
          description,
          liveUrl,
          githubUrl,
          image,
          accent
        };
        showToast(`Project "${title}" updated!`, "success");
      }
    } else {
      // Create new
      const newProject = {
        id: "proj-" + Date.now(),
        title,
        category,
        categoryLabel,
        featured: true,
        tags,
        description,
        liveUrl,
        githubUrl,
        image,
        accent
      };
      appData.projects.unshift(newProject);
      showToast(`Project "${title}" added successfully!`, "success");
    }

    savePortfolioData(appData);
    renderProjects();
    closeProjectModal();
  });
}

function deleteProject(projId) {
  if (!isAdminActive) return;
  const proj = appData.projects.find((p) => p.id === projId);
  if (!proj) return;

  if (confirm(`Are you sure you want to delete the project "${proj.title}"?`)) {
    appData.projects = appData.projects.filter((p) => p.id !== projId);
    savePortfolioData(appData);
    renderProjects();
    showToast(`Deleted "${proj.title}".`, "info");
  }
}

/**
 * Change Admin PIN Modal
 */
function openPinChangeModal() {
  const currentPin = appData.profile.adminPin || "1234";
  const newPin = prompt("Enter your new secret Admin PIN (digits or characters):", currentPin);
  if (newPin !== null) {
    const trimmed = newPin.trim();
    if (trimmed.length < 3) {
      showToast("PIN should be at least 3 characters long.", "error");
      return;
    }
    appData.profile.adminPin = trimmed;
    savePortfolioData(appData);
    showToast("Admin PIN updated successfully! Remember your new PIN.", "success");
  }
}

/**
 * Export portfolio data backup as a downloadable JSON file
 */
function exportDataBackup() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appData, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `SaiTarun_Portfolio_Data_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast("Portfolio backup JSON downloaded!", "success");
}

/**
 * Reset portfolio to original resume state
 */
function handleResetDefaults() {
  if (confirm("Reset all customizations back to Sai Tarun's original resume data?")) {
    appData = resetPortfolioData();
    renderAll();
    showToast("Portfolio reset to initial resume data.", "info");
  }
}

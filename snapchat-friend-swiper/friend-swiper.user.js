// ==UserScript==
// @name         Snapchat Web Friend Swiper
// @namespace    florida-orange-pressure.snapchat-friend-swiper
// @version      1.0.0
// @description  Tinder-style swipe UI over Snapchat Web for reviewing and unfriending contacts. Requires a one-time calibration step because Snapchat's DOM/class names are not publicly documented and change often.
// @match        https://web.snapchat.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const STORAGE_KEY = "sfs-calibration:" + location.hostname;
  const MAX_REMOVALS_PER_SESSION_DEFAULT = 50;
  const ACTION_DELAY_MS = [1500, 3000];
  const WAIT_FOR_UI_TIMEOUT_MS = 4000;
  const WAIT_FOR_UI_POLL_MS = 100;

  // ---------------------------------------------------------------------
  // storage
  // ---------------------------------------------------------------------

  function loadCalibration() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function saveCalibration(cal) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cal));
  }

  function clearCalibration() {
    localStorage.removeItem(STORAGE_KEY);
  }

  // ---------------------------------------------------------------------
  // styling
  // ---------------------------------------------------------------------

  const style = document.createElement("style");
  style.textContent = `
    .sfs-ui, .sfs-ui * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .sfs-launcher {
      position: fixed; bottom: 24px; right: 24px; z-index: 2147483000;
      width: 56px; height: 56px; border-radius: 50%; background: #111;
      color: #fffc00; font-size: 26px; display: flex; align-items: center;
      justify-content: center; cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,.4);
      border: 2px solid #fffc00; user-select: none;
    }
    .sfs-overlay {
      position: fixed; inset: 0; z-index: 2147483100; background: rgba(10,10,12,.92);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      color: #fff; padding: 24px; overflow: auto;
    }
    .sfs-panel {
      background: #17171a; border-radius: 16px; padding: 24px; max-width: 460px;
      width: 100%; box-shadow: 0 10px 40px rgba(0,0,0,.5); position: relative;
    }
    .sfs-panel h2 { margin: 0 0 8px; font-size: 18px; }
    .sfs-panel p { margin: 0 0 12px; font-size: 14px; line-height: 1.5; color: #cfcfd4; }
    .sfs-panel input[type=text] {
      width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid #333;
      background: #0d0d0f; color: #fff; font-size: 14px; margin-bottom: 12px;
    }
    .sfs-panel label.sfs-check { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #cfcfd4; margin-bottom: 12px; }
    .sfs-btn {
      padding: 10px 16px; border-radius: 8px; border: none; font-size: 14px; font-weight: 600;
      cursor: pointer; margin-right: 8px; margin-top: 4px;
    }
    .sfs-btn-primary { background: #fffc00; color: #111; }
    .sfs-btn-secondary { background: #2a2a2e; color: #fff; }
    .sfs-btn-danger { background: #ff3b30; color: #fff; }
    .sfs-btn:disabled { opacity: .4; cursor: not-allowed; }
    .sfs-close { position: absolute; top: 12px; right: 16px; cursor: pointer; color: #888; font-size: 20px; }
    .sfs-highlight {
      position: fixed; z-index: 2147483200; pointer-events: none;
      border: 2px solid #fffc00; background: rgba(255,252,0,.15); border-radius: 4px;
      transition: all 40ms linear;
    }
    .sfs-pick-banner {
      position: fixed; top: 16px; left: 50%; transform: translateX(-50%);
      z-index: 2147483200; background: #111; color: #fffc00; padding: 10px 18px;
      border-radius: 999px; font-size: 14px; box-shadow: 0 4px 14px rgba(0,0,0,.5);
      border: 1px solid #fffc00;
    }
    .sfs-card-stack { position: relative; width: 320px; height: 420px; }
    .sfs-card {
      position: absolute; inset: 0; background: #17171a; border-radius: 20px;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      box-shadow: 0 10px 30px rgba(0,0,0,.5); touch-action: none; cursor: grab;
      border: 1px solid #2a2a2e; padding: 24px; text-align: center;
    }
    .sfs-card img { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-bottom: 16px; background: #2a2a2e; }
    .sfs-card .sfs-name { font-size: 20px; font-weight: 700; }
    .sfs-card .sfs-sub { font-size: 12px; color: #888; margin-top: 6px; }
    .sfs-badge {
      position: absolute; top: 24px; padding: 6px 14px; border-radius: 8px; font-weight: 800;
      font-size: 16px; border: 3px solid; opacity: 0; text-transform: uppercase; letter-spacing: 1px;
    }
    .sfs-badge-remove { left: 24px; color: #ff3b30; border-color: #ff3b30; transform: rotate(-12deg); }
    .sfs-badge-keep { right: 24px; color: #34c759; border-color: #34c759; transform: rotate(12deg); }
    .sfs-controls { display: flex; gap: 16px; margin-top: 20px; }
    .sfs-round-btn {
      width: 52px; height: 52px; border-radius: 50%; border: none; font-size: 22px;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
    }
    .sfs-progress { font-size: 13px; color: #999; margin-top: 14px; }
    .sfs-log { font-size: 12px; color: #999; margin-top: 10px; max-height: 90px; overflow: auto; width: 320px; }
    .sfs-log div { padding: 2px 0; border-bottom: 1px solid #222; }
  `;
  document.documentElement.appendChild(style);

  // ---------------------------------------------------------------------
  // element picker (click-to-select, swallows the real click)
  // ---------------------------------------------------------------------

  function pickElement(promptText) {
    return new Promise((resolve) => {
      const banner = document.createElement("div");
      banner.className = "sfs-ui sfs-pick-banner";
      banner.textContent = promptText + " (Esc to skip)";
      document.body.appendChild(banner);

      const highlight = document.createElement("div");
      highlight.className = "sfs-ui sfs-highlight";
      highlight.style.display = "none";
      document.body.appendChild(highlight);

      function cleanup() {
        document.removeEventListener("mousemove", onMove, true);
        document.removeEventListener("click", onClick, true);
        document.removeEventListener("keydown", onKey, true);
        banner.remove();
        highlight.remove();
      }

      function onMove(e) {
        const el = document.elementFromPoint(e.clientX, e.clientY);
        if (!el || el.closest(".sfs-ui")) {
          highlight.style.display = "none";
          return;
        }
        const r = el.getBoundingClientRect();
        highlight.style.display = "block";
        highlight.style.left = r.left + "px";
        highlight.style.top = r.top + "px";
        highlight.style.width = r.width + "px";
        highlight.style.height = r.height + "px";
      }

      function onClick(e) {
        const el = document.elementFromPoint(e.clientX, e.clientY);
        if (!el || el.closest(".sfs-ui")) return;
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        cleanup();
        resolve(el);
      }

      function onKey(e) {
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          cleanup();
          resolve(null);
        }
      }

      document.addEventListener("mousemove", onMove, true);
      document.addEventListener("click", onClick, true);
      document.addEventListener("keydown", onKey, true);
    });
  }

  // ---------------------------------------------------------------------
  // selector derivation
  // ---------------------------------------------------------------------

  function cssEscape(s) {
    return CSS && CSS.escape ? CSS.escape(s) : s.replace(/([^a-zA-Z0-9_-])/g, "\\$1");
  }

  function uniqueSelectorFor(el, maxDepth = 8) {
    const parts = [];
    let node = el;
    for (let i = 0; i < maxDepth && node && node.nodeType === 1; i++) {
      if (node.id) {
        parts.unshift("#" + cssEscape(node.id));
        break;
      }
      const parent = node.parentElement;
      if (!parent) {
        parts.unshift(node.tagName.toLowerCase());
        break;
      }
      const sameTagSiblings = Array.from(parent.children).filter((c) => c.tagName === node.tagName);
      const idx = sameTagSiblings.indexOf(node) + 1;
      parts.unshift(`${node.tagName.toLowerCase()}:nth-of-type(${idx})`);
      node = parent;
    }
    return parts.join(" > ");
  }

  // Derives a selector that should match every friend row, by finding the
  // classes shared across siblings of the same tag under the clicked row's
  // parent. Snapchat's class names are likely generated/hashed, so this
  // relies on repetition rather than any known naming scheme.
  function deriveRowSelector(rowEl) {
    const container = rowEl.parentElement;
    if (!container) return null;
    const siblings = Array.from(container.children).filter((c) => c.tagName === rowEl.tagName);
    let common = new Set(rowEl.classList);
    for (const sib of siblings) {
      const classes = new Set(sib.classList);
      common = new Set([...common].filter((c) => classes.has(c)));
    }
    const classPart = common.size ? "." + [...common].map(cssEscape).join(".") : "";
    const rowSelector = rowEl.tagName.toLowerCase() + classPart;
    const containerSelector = uniqueSelectorFor(container);
    return { containerSelector, rowSelector, matchCount: siblings.length };
  }

  // Path from an ancestor down to a descendant, expressed as nth-of-type
  // steps, so it can be replayed against a *different* row of the same shape.
  function relativePath(ancestor, descendant) {
    const path = [];
    let node = descendant;
    while (node && node !== ancestor) {
      const parent = node.parentElement;
      if (!parent) return null;
      const sameTag = Array.from(parent.children).filter((c) => c.tagName === node.tagName);
      const idx = sameTag.indexOf(node) + 1;
      path.unshift(`${node.tagName.toLowerCase()}:nth-of-type(${idx})`);
      node = parent;
    }
    if (node !== ancestor) return null;
    return path.join(" > ");
  }

  function resolveRelative(root, path) {
    if (!path) return null;
    try {
      return root.querySelector(":scope > " + path);
    } catch {
      return null;
    }
  }

  // ---------------------------------------------------------------------
  // calibration wizard
  // ---------------------------------------------------------------------

  async function runCalibrationWizard() {
    alert(
      "Snapchat Friend Swiper setup:\n\n" +
        "You'll be asked to click on a few parts of ONE friend row in your list. " +
        "These clicks are intercepted by the script and never reach Snapchat's real buttons, " +
        "so nothing will actually happen on Snapchat during this step.\n\n" +
        "Make sure your friends/chat list is visible on screen before continuing."
    );

    const rowEl = await pickElement("Click on any ONE friend's row");
    if (!rowEl) return null;
    const rowInfo = deriveRowSelector(rowEl);
    if (!rowInfo) {
      alert("Could not determine that element's parent list. Try clicking directly on a friend row.");
      return null;
    }

    const nameEl = await pickElement("Now click that same friend's NAME text");
    if (!nameEl) return null;
    const nameRelPath = relativePath(rowEl, nameEl);

    let avatarRelPath = null;
    const avatarEl = await pickElement("Optional: click that friend's avatar image");
    if (avatarEl) avatarRelPath = relativePath(rowEl, avatarEl);

    const initiatorEl = await pickElement(
      "Click the control you'd normally click to start removing this friend (a … menu, trash icon, etc.)"
    );
    if (!initiatorEl) return null;
    const initiatorRelPath = relativePath(rowEl, initiatorEl);

    const menuItemMatchText = (
      window.prompt(
        "Open that menu manually on Snapchat right now (for real), read the exact text of the " +
          "'remove friend' option, then CLOSE the menu WITHOUT clicking it. Type that exact text below.\n\n" +
          "Leave blank if the control you picked directly removes the friend with no menu."
      ) || ""
    ).trim();

    const confirmButtonMatchText = (
      window.prompt(
        "If removing a friend shows a confirmation dialog, type the exact text of its confirm button " +
          "(e.g. 'Remove'). Leave blank if there is no confirmation dialog."
      ) || ""
    ).trim();

    const calibration = {
      containerSelector: rowInfo.containerSelector,
      rowSelector: rowInfo.rowSelector,
      nameRelPath,
      avatarRelPath,
      initiatorRelPath,
      menuItemMatchText,
      confirmButtonMatchText,
      calibratedAt: new Date().toISOString(),
    };

    saveCalibration(calibration);
    return calibration;
  }

  // ---------------------------------------------------------------------
  // live row queries
  // ---------------------------------------------------------------------

  function getContainer(cal) {
    try {
      return document.querySelector(cal.containerSelector);
    } catch {
      return null;
    }
  }

  function getAllRows(cal) {
    const container = getContainer(cal);
    if (!container) return [];
    try {
      return Array.from(container.querySelectorAll(":scope > " + cal.rowSelector));
    } catch {
      return [];
    }
  }

  function readRow(cal, rowEl) {
    const nameEl = resolveRelative(rowEl, cal.nameRelPath);
    const name = nameEl ? nameEl.textContent.trim() : null;
    const avatarEl = cal.avatarRelPath ? resolveRelative(rowEl, cal.avatarRelPath) : null;
    const avatarUrl = avatarEl && avatarEl.tagName === "IMG" ? avatarEl.src : null;
    return { name, avatarUrl };
  }

  async function scrollToLoadAllRows(cal, onProgress) {
    const container = getContainer(cal);
    if (!container) return [];
    const seen = new Map();
    let lastHeight = -1;
    let stableCount = 0;
    for (let i = 0; i < 60 && stableCount < 3; i++) {
      for (const rowEl of getAllRows(cal)) {
        const { name, avatarUrl } = readRow(cal, rowEl);
        if (name && !seen.has(name)) seen.set(name, { name, avatarUrl });
      }
      if (onProgress) onProgress(seen.size);
      container.scrollTop = container.scrollHeight;
      await sleep(250);
      if (container.scrollHeight === lastHeight) stableCount++;
      else stableCount = 0;
      lastHeight = container.scrollHeight;
    }
    container.scrollTop = 0;
    return Array.from(seen.values());
  }

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function randomDelay() {
    const [min, max] = ACTION_DELAY_MS;
    return min + Math.random() * (max - min);
  }

  async function waitFor(predicate, timeout = WAIT_FOR_UI_TIMEOUT_MS) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const result = predicate();
      if (result) return result;
      await sleep(WAIT_FOR_UI_POLL_MS);
    }
    return null;
  }

  function findByText(text) {
    if (!text) return null;
    const needle = text.trim().toLowerCase();
    const candidates = document.querySelectorAll("button, [role=menuitem], [role=button], a, div, span");
    for (const el of candidates) {
      const own = Array.from(el.childNodes)
        .filter((n) => n.nodeType === 3)
        .map((n) => n.textContent.trim())
        .join(" ")
        .trim();
      const full = el.textContent.trim();
      if (own.toLowerCase() === needle || full.toLowerCase() === needle) {
        if (el.offsetParent !== null) return el;
      }
    }
    return null;
  }

  // ---------------------------------------------------------------------
  // removal execution, with fresh re-resolution + name verification
  // ---------------------------------------------------------------------

  async function removeFriend(cal, expectedName, log) {
    const rows = getAllRows(cal);
    const matches = rows.filter((r) => readRow(cal, r).name === expectedName);

    if (matches.length === 0) {
      const container = getContainer(cal);
      if (container) {
        for (let i = 0; i < 15; i++) {
          container.scrollTop += container.clientHeight;
          await sleep(200);
          const again = getAllRows(cal).filter((r) => readRow(cal, r).name === expectedName);
          if (again.length > 0) return doRemoveOnRow(cal, again[0], expectedName, log);
        }
      }
      log(`SKIPPED "${expectedName}": could not locate row on screen.`);
      return false;
    }

    if (matches.length > 1) {
      log(`SKIPPED "${expectedName}": ambiguous, ${matches.length} rows share this name.`);
      return false;
    }

    return doRemoveOnRow(cal, matches[0], expectedName, log);
  }

  async function doRemoveOnRow(cal, rowEl, expectedName, log) {
    rowEl.scrollIntoView({ block: "center" });
    await sleep(200);

    const check = readRow(cal, rowEl);
    if (check.name !== expectedName) {
      log(`SKIPPED "${expectedName}": row now shows "${check.name}" (list likely scrolled/recycled).`);
      return false;
    }

    const initiator = resolveRelative(rowEl, cal.initiatorRelPath);
    if (!initiator) {
      log(`SKIPPED "${expectedName}": remove control not found on this row.`);
      return false;
    }
    initiator.click();

    if (cal.menuItemMatchText) {
      const menuItem = await waitFor(() => findByText(cal.menuItemMatchText));
      if (!menuItem) {
        log(`SKIPPED "${expectedName}": menu item "${cal.menuItemMatchText}" never appeared.`);
        document.body.click();
        return false;
      }
      menuItem.click();
    }

    if (cal.confirmButtonMatchText) {
      const confirmBtn = await waitFor(() => findByText(cal.confirmButtonMatchText));
      if (!confirmBtn) {
        log(`UNCERTAIN "${expectedName}": confirm button "${cal.confirmButtonMatchText}" never appeared.`);
        return false;
      }
      confirmBtn.click();
    }

    log(`REMOVED "${expectedName}".`);
    return true;
  }

  // ---------------------------------------------------------------------
  // swiper UI
  // ---------------------------------------------------------------------

  function buildOverlay() {
    const overlay = document.createElement("div");
    overlay.className = "sfs-ui sfs-overlay";
    overlay.innerHTML = `
      <div class="sfs-panel" style="max-width:360px;">
        <span class="sfs-close">&times;</span>
        <h2>Friend Swiper</h2>
        <div class="sfs-card-stack" id="sfs-stack"></div>
        <div class="sfs-controls">
          <button class="sfs-round-btn sfs-btn-danger" id="sfs-remove" title="Remove">&times;</button>
          <button class="sfs-round-btn sfs-btn-secondary" id="sfs-undo" title="Undo">&#8630;</button>
          <button class="sfs-round-btn" style="background:#34c759;color:#fff" id="sfs-keep" title="Keep">&check;</button>
        </div>
        <div class="sfs-progress" id="sfs-progress"></div>
        <div class="sfs-log" id="sfs-log"></div>
      </div>
    `;
    document.body.appendChild(overlay);
    return overlay;
  }

  async function startSwiper(cal) {
    const overlay = buildOverlay();
    const stack = overlay.querySelector("#sfs-stack");
    const progressEl = overlay.querySelector("#sfs-progress");
    const logEl = overlay.querySelector("#sfs-log");
    const closeBtn = overlay.querySelector(".sfs-close");

    let closed = false;
    closeBtn.addEventListener("click", () => {
      closed = true;
      overlay.remove();
    });

    function log(msg) {
      const line = document.createElement("div");
      line.textContent = msg;
      logEl.prepend(line);
    }

    stack.innerHTML = `<div style="color:#999;padding-top:150px;text-align:center;">Loading friends…</div>`;
    const dryRun = !window.confirm(
      "Dry run is recommended for the first pass: swipes will be logged but nothing will actually be removed on Snapchat.\n\n" +
        "Click OK to run for real (actually remove friends), or Cancel to stay in dry-run mode."
    );

    const maxRemovals = MAX_REMOVALS_PER_SESSION_DEFAULT;

    const friends = await scrollToLoadAllRows(cal, (n) => {
      if (!closed) stack.innerHTML = `<div style="color:#999;padding-top:150px;text-align:center;">Loading friends… (${n} found)</div>`;
    });

    if (closed) return;

    if (friends.length === 0) {
      stack.innerHTML = `<div style="color:#ff3b30;padding-top:120px;text-align:center;">
        No friends detected. The saved calibration may no longer match this page.<br><br>
        Try recalibrating from the launcher menu.</div>`;
      return;
    }

    let index = 0;
    let removedCount = 0;
    const history = [];

    function updateProgress() {
      progressEl.textContent = `${index}/${friends.length} reviewed • ${removedCount} removed${dryRun ? " (dry run)" : ""}`;
    }

    function renderCard() {
      stack.innerHTML = "";
      if (index >= friends.length) {
        stack.innerHTML = `<div style="color:#fff;padding-top:150px;text-align:center;">All done.<br>${removedCount} removed.</div>`;
        updateProgress();
        return;
      }
      const friend = friends[index];
      const card = document.createElement("div");
      card.className = "sfs-card";
      card.innerHTML = `
        <div class="sfs-badge sfs-badge-remove">Remove</div>
        <div class="sfs-badge sfs-badge-keep">Keep</div>
        ${friend.avatarUrl ? `<img src="${friend.avatarUrl}">` : `<div style="width:120px;height:120px;border-radius:50%;background:#2a2a2e;margin-bottom:16px;"></div>`}
        <div class="sfs-name">${escapeHtml(friend.name)}</div>
        <div class="sfs-sub">Drag left to remove, right to keep</div>
      `;
      stack.appendChild(card);
      attachDrag(card);
      updateProgress();
    }

    function escapeHtml(s) {
      const d = document.createElement("div");
      d.textContent = s;
      return d.innerHTML;
    }

    function attachDrag(card) {
      let startX = 0;
      let dx = 0;
      let dragging = false;
      const removeBadge = card.querySelector(".sfs-badge-remove");
      const keepBadge = card.querySelector(".sfs-badge-keep");

      card.addEventListener("pointerdown", (e) => {
        dragging = true;
        startX = e.clientX;
        card.setPointerCapture(e.pointerId);
        card.style.cursor = "grabbing";
      });

      card.addEventListener("pointermove", (e) => {
        if (!dragging) return;
        dx = e.clientX - startX;
        card.style.transform = `translateX(${dx}px) rotate(${dx / 20}deg)`;
        const t = Math.min(Math.abs(dx) / 100, 1);
        if (dx < 0) {
          removeBadge.style.opacity = t;
          keepBadge.style.opacity = 0;
        } else {
          keepBadge.style.opacity = t;
          removeBadge.style.opacity = 0;
        }
      });

      function endDrag() {
        if (!dragging) return;
        dragging = false;
        card.style.cursor = "grab";
        if (Math.abs(dx) > 100) {
          decide(dx < 0 ? "remove" : "keep");
        } else {
          card.style.transform = "";
          removeBadge.style.opacity = 0;
          keepBadge.style.opacity = 0;
        }
        dx = 0;
      }

      card.addEventListener("pointerup", endDrag);
      card.addEventListener("pointercancel", endDrag);
    }

    async function decide(action) {
      if (closed) return;
      const friend = friends[index];
      history.push({ friend, action });

      if (action === "remove") {
        if (removedCount >= maxRemovals) {
          const cont = window.confirm(
            `You've hit the safety cap of ${maxRemovals} removals for this session. Continue anyway?`
          );
          if (!cont) {
            closed = true;
            overlay.remove();
            return;
          }
        }
        if (dryRun) {
          log(`(dry run) would remove "${friend.name}".`);
        } else {
          await removeFriend(cal, friend.name, log);
          await sleep(randomDelay());
        }
        removedCount++;
      } else {
        log(`Kept "${friend.name}".`);
      }

      index++;
      if (!closed) renderCard();
    }

    overlay.querySelector("#sfs-remove").addEventListener("click", () => decide("remove"));
    overlay.querySelector("#sfs-keep").addEventListener("click", () => decide("keep"));
    overlay.querySelector("#sfs-undo").addEventListener("click", () => {
      if (history.length === 0 || index === 0) return;
      index--;
      history.pop();
      if (!closed) renderCard();
      log(`Undid last decision (does not un-remove an already removed friend on Snapchat).`);
    });

    document.addEventListener("keydown", function onKey(e) {
      if (closed) {
        document.removeEventListener("keydown", onKey);
        return;
      }
      if (e.key === "ArrowLeft") decide("remove");
      else if (e.key === "ArrowRight") decide("keep");
      else if (e.key === "Escape") {
        closed = true;
        overlay.remove();
        document.removeEventListener("keydown", onKey);
      }
    });

    renderCard();
  }

  // ---------------------------------------------------------------------
  // launcher
  // ---------------------------------------------------------------------

  function buildLauncher() {
    const btn = document.createElement("div");
    btn.className = "sfs-ui sfs-launcher";
    btn.textContent = "\u{1F447}";
    btn.title = "Friend Swiper";
    document.body.appendChild(btn);

    btn.addEventListener("click", async () => {
      let cal = loadCalibration();
      if (cal) {
        const choice = window.confirm(
          "Found a saved friend-list calibration.\n\nOK = start swiping\nCancel = recalibrate first"
        );
        if (!choice) {
          cal = await runCalibrationWizard();
          if (!cal) return;
        }
      } else {
        cal = await runCalibrationWizard();
        if (!cal) return;
      }
      startSwiper(cal);
    });
  }

  buildLauncher();
})();

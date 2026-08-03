/* Bento layout editor — desktop-window style controls:
   drag a card to move it (live preview of where it lands),
   pull the right/bottom edge or corner to resize (snaps to grid),
   click a card for precise sliders.
   "Save layout" stores everything in localStorage; the homepage
   (js/main.js) reads it automatically. */

(function () {
  const board = document.getElementById("board");
  const inspector = document.getElementById("inspector");
  const inspTitle = document.getElementById("inspTitle");
  const csSlider = document.getElementById("csSlider");
  const rsSlider = document.getElementById("rsSlider");
  const rSlider = document.getElementById("rSlider");
  const csVal = document.getElementById("csVal");
  const rsVal = document.getElementById("rsVal");
  const rVal = document.getElementById("rVal");
  const toast = document.getElementById("toast");

  const GAP = 14;   // must match the grid gap in style.css
  const ROW = 105;  // must match grid-auto-rows in style.css

  // current layout = defaults from widgets.js merged with saved overrides
  const saved = JSON.parse(localStorage.getItem("im_bento") || "{}");
  const savedOrder = saved.order || [];
  const savedProps = saved.props || {};

  const props = {};
  WIDGETS.forEach(function (w) {
    const o = savedProps[w.id] || {};
    props[w.id] = {
      cs: o.cs !== undefined ? o.cs : w.cs,
      rs: o.rs !== undefined ? o.rs : w.rs,
      r: o.r !== undefined ? o.r : w.r
    };
  });

  const list = [...WIDGETS].sort(function (a, b) {
    const ia = savedOrder.indexOf(a.id), ib = savedOrder.indexOf(b.id);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });

  let selected = null; // { el, w }

  function colWidth() {
    return (board.clientWidth - GAP * 5) / 6;
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(function () { toast.classList.remove("show"); }, 1800);
  }

  function apply(el, id) {
    const p = props[id];
    el.style.gridColumn = "span " + p.cs;
    el.style.gridRow = "span " + p.rs;
    el.style.borderRadius = p.r + "px";
  }

  function syncSliders(id) {
    const p = props[id];
    csSlider.value = p.cs; csVal.textContent = p.cs + " / 6";
    rsSlider.value = p.rs; rsVal.textContent = p.rs;
    rSlider.value = p.r; rVal.textContent = p.r + "px";
  }

  function select(el, w) {
    document.querySelectorAll(".widget.selected").forEach(function (s) {
      s.classList.remove("selected");
    });
    el.classList.add("selected");
    selected = { el: el, w: w };
    inspector.classList.add("show");
    inspTitle.textContent = w.title;
    syncSliders(w.id);
  }

  list.forEach(function (w, i) {
    const el = document.createElement("div");
    el.className = "widget v-" + (w.variant || "dark");
    el.dataset.id = w.id;
    el.style.setProperty("--wa", w.accent);
    el.innerHTML =
      '<div class="w-blob"></div><div class="w-num">' + String(i + 1).padStart(2, "0") + "</div>" +
      '<div class="w-top"><span class="chip">' + (w.tag || "Topic") + '</span><span class="arrow">↗</span></div>' +
      '<div class="w-bottom"><h3>' + w.title + "</h3><p>" + w.subtitle + "</p></div>" +
      '<div class="rz rz-r"></div><div class="rz rz-b"></div><div class="rz rz-c"></div>';
    apply(el, w.id);
    board.appendChild(el);

    // ---------- move: drag the card like a desktop window ----------
    el.addEventListener("pointerdown", function (e) {
      if (e.target.closest(".rz")) return; // resizing, not moving
      if (e.button !== 0) return;
      e.preventDefault();
      select(el, w);

      const startX = e.clientX, startY = e.clientY;
      let clone = null, offX = 0, offY = 0;

      function onMove(ev) {
        // only start "lifting" the window after a small movement
        if (!clone) {
          if (Math.abs(ev.clientX - startX) < 6 && Math.abs(ev.clientY - startY) < 6) return;
          const rect = el.getBoundingClientRect();
          offX = startX - rect.left;
          offY = startY - rect.top;
          clone = el.cloneNode(true);
          clone.classList.add("drag-clone");
          clone.classList.remove("selected");
          clone.style.width = rect.width + "px";
          clone.style.height = rect.height + "px";
          clone.style.left = rect.left + "px";
          clone.style.top = rect.top + "px";
          document.body.appendChild(clone);
          el.classList.add("drag-origin");
        }
        clone.style.left = (ev.clientX - offX) + "px";
        clone.style.top = (ev.clientY - offY) + "px";

        // live preview: move the dimmed original to where the card would land
        const under = document.elementFromPoint(ev.clientX, ev.clientY);
        const target = under && under.closest(".board .widget");
        if (target && target !== el) {
          const r = target.getBoundingClientRect();
          const after =
            (ev.clientX - r.left) / r.width + (ev.clientY - r.top) / r.height > 1;
          board.insertBefore(el, after ? target.nextSibling : target);
        }
      }

      function onUp() {
        window.removeEventListener("pointermove", onMove);
        if (clone) {
          clone.remove();
          el.classList.remove("drag-origin");
        }
      }

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp, { once: true });
    });

    // ---------- resize: pull the edges / corner ----------
    bindResize(el, w, "r"); // right edge  -> width
    bindResize(el, w, "b"); // bottom edge -> height
    bindResize(el, w, "c"); // corner      -> both
  });

  function bindResize(el, w, mode) {
    const handle = el.querySelector(".rz-" + mode);
    handle.addEventListener("pointerdown", function (e) {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      select(el, w);

      const col = colWidth();
      const start = {
        x: e.clientX, y: e.clientY,
        cs: props[w.id].cs, rs: props[w.id].rs
      };

      function onMove(ev) {
        if (mode === "r" || mode === "c") {
          const px = start.cs * (col + GAP) - GAP + (ev.clientX - start.x);
          props[w.id].cs = Math.max(1, Math.min(6, Math.round((px + GAP) / (col + GAP))));
        }
        if (mode === "b" || mode === "c") {
          const px = start.rs * (ROW + GAP) - GAP + (ev.clientY - start.y);
          props[w.id].rs = Math.max(1, Math.min(4, Math.round((px + GAP) / (ROW + GAP))));
        }
        apply(el, w.id);
        syncSliders(w.id);
      }

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", function () {
        window.removeEventListener("pointermove", onMove);
      }, { once: true });
    });
  }

  // ---------- inspector sliders (precision) ----------
  csSlider.addEventListener("input", function () {
    if (!selected) return;
    props[selected.w.id].cs = +csSlider.value;
    csVal.textContent = csSlider.value + " / 6";
    apply(selected.el, selected.w.id);
  });
  rsSlider.addEventListener("input", function () {
    if (!selected) return;
    props[selected.w.id].rs = +rsSlider.value;
    rsVal.textContent = rsSlider.value;
    apply(selected.el, selected.w.id);
  });
  rSlider.addEventListener("input", function () {
    if (!selected) return;
    props[selected.w.id].r = +rSlider.value;
    rVal.textContent = rSlider.value + "px";
    apply(selected.el, selected.w.id);
  });

  function currentOrder() {
    return [...board.querySelectorAll(".widget")].map(function (el) {
      return el.dataset.id;
    });
  }

  // ---------- toolbar ----------
  document.getElementById("btnSave").addEventListener("click", function () {
    localStorage.setItem("im_bento", JSON.stringify({ order: currentOrder(), props: props }));
    showToast("Layout saved — the homepage now uses it.");
  });

  document.getElementById("btnReset").addEventListener("click", function () {
    localStorage.removeItem("im_bento");
    location.reload();
  });

  document.getElementById("btnExport").addEventListener("click", function () {
    const lines = currentOrder().map(function (id) {
      const p = props[id];
      return id + ":  cs: " + p.cs + ", rs: " + p.rs + ", r: " + p.r;
    });
    lines.unshift("order: " + currentOrder().join(" → "));
    navigator.clipboard.writeText(lines.join("\n")).then(function () {
      showToast("Copied! Paste the values into js/widgets.js.");
    });
  });
})();

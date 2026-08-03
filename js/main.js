/* Builds the homepage bento grid from WIDGETS (js/widgets.js).
   Layout saved in dev.html (order + sizes) and the animation picked
   on animations.html are applied automatically. */

(function () {
  const board = document.getElementById("board");
  if (!board) return;

  const saved = JSON.parse(localStorage.getItem("im_bento") || "{}");
  const order = saved.order || [];
  const props = saved.props || {};
  const savedAnim = localStorage.getItem("im_anim") || "anim-lift";

  // apply saved ordering (widgets not in the saved order go last)
  const list = [...WIDGETS].sort(function (a, b) {
    const ia = order.indexOf(a.id), ib = order.indexOf(b.id);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });

  list.forEach(function (w, i) {
    const o = props[w.id] || {};
    const cs = o.cs !== undefined ? o.cs : w.cs;
    const rs = o.rs !== undefined ? o.rs : w.rs;
    const r = o.r !== undefined ? o.r : w.r;

    const a = document.createElement("a");
    a.href = w.link;
    a.className = "widget v-" + (w.variant || "dark") +
      (w.media ? " has-media" : "") +
      (savedAnim !== "anim-none" ? " " + savedAnim : "");
    a.style.gridColumn = "span " + cs;
    a.style.gridRow = "span " + rs;
    a.style.borderRadius = r + "px";
    a.style.setProperty("--wa", w.accent);

    let inner = "";
    if (w.media && w.media.toLowerCase().endsWith(".mp4")) {
      inner += '<div class="w-media"><video src="' + w.media + '" autoplay muted loop playsinline></video></div>';
    } else if (w.media) {
      inner += '<div class="w-media"><img src="' + w.media + '" alt="' + w.title + '"></div>';
    } else {
      inner += '<div class="w-blob"></div><div class="w-num">' + String(i + 1).padStart(2, "0") + "</div>";
    }

    inner +=
      '<div class="w-top"><span class="chip">' + (w.tag || "Topic") + '</span><span class="arrow">↗</span></div>' +
      '<div class="w-bottom"><h3>' + w.title + "</h3><p>" + w.subtitle + "</p></div>";

    a.innerHTML = inner;
    board.appendChild(a);
  });

  // plate counter in the index row above the grid
  const count = document.getElementById("plateCount");
  if (count) {
    count.textContent = String(WIDGETS.length).padStart(2, "0") + " sections";
  }
})();

/* language dropdown open/close */
(function () {
  const dd = document.getElementById("langDropdown");
  if (!dd) return;
  dd.querySelector("button").addEventListener("click", function (e) {
    e.stopPropagation();
    dd.classList.toggle("open");
  });
  document.addEventListener("click", function () {
    dd.classList.remove("open");
  });
})();

/* Docs shell. Each page is just <main class="docs-main">…</main> plus
   <body data-root="../" data-page="components/tag">. This script adds the header,
   the sidebar (from NAV, below) and a code panel under every .demo.
   To add a page: write the HTML file, then add one line to NAV. */
const NAV = [
  ["Overview", [
    ["index", "Introduction"],
    ["principles", "Principles"],
    ["using", "Using the system"],
  ]],
  ["Foundations", [
    ["foundations/logo", "Logo"],
    ["foundations/color", "Color"],
    ["foundations/type", "Typography"],
    ["foundations/layout", "Layout & spacing"],
    ["foundations/rules", "Rules & corners"],
    ["foundations/motion", "Motion"],
    ["foundations/data", "Data & charts"],
  ]],
  ["Components", [
    ["components/header", "Header"],
    ["components/footer", "Footer"],
    ["components/section-head", "Section heading"],
    ["components/tag", "Tag"],
    ["components/button", "Button"],
    ["components/tile", "Tile"],
    ["components/card", "Card"],
    ["components/specs", "Spec list"],
    ["components/paper", "Paper"],
    ["components/band", "Band"],
    ["components/block-title", "Block title"],
    ["components/stat", "Stat"],
    ["components/table", "Table"],
    ["components/meter", "Meter"],
    ["components/content-switcher", "Content switcher"],
    ["components/toggle", "Toggle"],
    ["components/text-input", "Text input"],
    ["components/buttons-small", "Label & icon buttons"],
    ["components/tooltip", "Tooltip"],
    ["components/section-nav", "Section nav"],
    ["components/inline-notification", "Inline notification"],
  ]],
  ["Sites", [
    ["sites/artdept", "Jonesco Art Dept."],
    ["sites/jonesco", "jonesco.com"],
    ["sites/financial-dashboard", "Financial Dashboard"],
  ]],
  ["Reference", [
    ["changelog", "Changelog"],
  ]],
  ["Resources", [
    ["resources/style-specimens", "Style specimens"],
  ]],
];

(function () {
  const root = document.body.dataset.root || "";
  const page = document.body.dataset.page || "index";
  const main = document.querySelector(".docs-main");
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // header
  const header = document.createElement("header");
  header.className = "sys-header";
  header.innerHTML = `<div class="sys-bar docs-bar"><a class="sys-brand" href="${root}index.html"><img class="docs-mark" src="${root}icons/jonesco-system.svg" alt=""><span>Jonesco System</span></a>
    <nav class="sys-nav"><a href="${root}foundations/logo.html">Foundations</a><a href="${root}components/header.html">Components</a><a class="opt" href="https://github.com/jonesco/system">GitHub</a></nav>
    <button class="docs-menu-btn" type="button" aria-expanded="false" aria-controls="docs-side">Menu</button></div>`;

  // sidebar; on phones it's the menu, opened from the header
  const side = document.createElement("aside");
  side.className = "docs-side";
  side.id = "docs-side";
  side.innerHTML = NAV.map(([group, items]) => `<div class="docs-group"><h4>${group}</h4>` + items.map(([href, label]) =>
    `<a href="${root}${href}.html"${href === page ? ' aria-current="page"' : ""}>${label}</a>`).join("") + `</div>`).join("") +
    `<a class="docs-side-ext" href="https://github.com/jonesco/system">GitHub</a>`;

  const shell = document.createElement("div");
  shell.className = "docs-shell";
  main.before(header);
  main.before(shell);
  shell.append(side, main);

  // keep the sidebar's scroll position from page to page; bring the current item into view if it's off-screen
  const KEY = "docs-side-scroll";
  try { const y = sessionStorage.getItem(KEY); if (y !== null) side.scrollTop = +y; } catch (e) {}
  const cur = side.querySelector('[aria-current="page"]');
  if (cur) { const s = side.getBoundingClientRect(), c = cur.getBoundingClientRect();
    if (c.top < s.top || c.bottom > s.bottom) side.scrollTop += c.top - s.top - s.height / 3; }
  const save = () => { try { sessionStorage.setItem(KEY, side.scrollTop); } catch (e) {} };
  side.addEventListener("click", save);
  addEventListener("pagehide", save);

  // phone menu: the button swaps Menu/Close, Escape or a wider window closes it, the page behind doesn't scroll
  const btn = header.querySelector(".docs-menu-btn");
  const setMenu = (open) => {
    document.documentElement.classList.toggle("docs-menu-open", open);
    btn.setAttribute("aria-expanded", open);
    btn.textContent = open ? "Close" : "Menu";
    // open at the top, or with the current page a third of the way down if it would be below the fold
    if (open) side.scrollTop = cur && cur.offsetTop + cur.offsetHeight > side.clientHeight ? cur.offsetTop - side.clientHeight / 3 : 0;
  };
  btn.addEventListener("click", () => setMenu(btn.getAttribute("aria-expanded") !== "true"));
  addEventListener("keydown", (e) => { if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") { setMenu(false); btn.focus(); } });
  matchMedia("(min-width: 861px)").addEventListener("change", (m) => { if (m.matches) setMenu(false); });

  // previous / next page, in NAV order
  const flat = NAV.flatMap(([, items]) => items);
  const at = flat.findIndex(([href]) => href === page);
  const step = (i, dir) => flat[i] ? `<a class="docs-step docs-step--${dir}" href="${root}${flat[i][0]}.html"><small>${dir === "prev" ? "Previous" : "Next"}</small>${flat[i][1]}</a>` : "<span></span>";
  const pager = document.createElement("nav");
  pager.className = "docs-pager";
  pager.setAttribute("aria-label", "Pages");
  if (at >= 0) { pager.innerHTML = step(at - 1, "prev") + step(at + 1, "next"); main.append(pager); }

  // code panel under each live example, generated from its own markup
  document.querySelectorAll(".demo").forEach((d) => {
    const stage = d.querySelector(".demo-stage");
    if (!stage || d.dataset.nocode !== undefined) return;
    const lines = stage.innerHTML.replace(/^\n+|\s+$/g, "").split("\n");
    const pad = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
    const pre = document.createElement("pre");
    pre.innerHTML = "<code>" + esc(lines.map((l) => l.slice(pad)).join("\n")) + "</code>";
    d.append(pre);
  });

  // examples work: a content switcher selects what you click, a toggle flips
  document.querySelectorAll(".demo-stage").forEach((st) => st.addEventListener("click", (e) => {
    const opt = e.target.closest(".sys-content-switcher > button, .sys-switch > button");
    if (opt) {
      const tabs = opt.getAttribute("role") === "tab";
      [...opt.parentElement.children].forEach((b) => b.setAttribute(tabs ? "aria-selected" : "aria-pressed", String(b === opt)));
    }
    const tog = e.target.closest(".sys-toggle");
    if (tog && !tog.disabled) tog.setAttribute("aria-checked", String(tog.getAttribute("aria-checked") !== "true"));
  }));

  const foot = document.createElement("div");
  foot.className = "docs-foot";
  foot.innerHTML = `Jonesco System · v3.2.0 · <a href="${root}changelog.html">Changelog</a>`;
  main.append(foot);
})();

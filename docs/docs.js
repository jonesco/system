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
    ["components/specs", "Spec list"],
    ["components/paper", "Paper"],
    ["components/band", "Band"],
    ["components/block-title", "Block title"],
    ["components/stat", "Stat"],
    ["components/meter", "Meter"],
    ["components/switch", "Switch"],
    ["components/buttons-small", "Label & icon buttons"],
    ["components/section-nav", "Section nav"],
  ]],
  ["Sites", [
    ["sites/artdept", "Jonesco Art Dept."],
    ["sites/jonesco", "jonesco.com"],
    ["sites/financial-dashboard", "Financial Dashboard"],
  ]],
  ["Reference", [
    ["changelog", "Changelog"],
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
  header.innerHTML = `<div class="sys-bar" style="padding:0 24px"><a class="sys-brand" href="${root}index.html"><span>Jonesco System</span></a>
    <nav class="sys-nav"><a href="${root}foundations/color.html">Foundations</a><a href="${root}components/header.html">Components</a><a class="opt" href="https://github.com/jonesco/system">GitHub</a></nav></div>`;

  // sidebar
  const side = document.createElement("aside");
  side.className = "docs-side";
  side.innerHTML = NAV.map(([group, items]) => `<h4>${group}</h4>` + items.map(([href, label]) =>
    `<a href="${root}${href}.html"${href === page ? ' aria-current="page"' : ""}>${label}</a>`).join("")).join("");

  const shell = document.createElement("div");
  shell.className = "docs-shell";
  main.before(header);
  main.before(shell);
  shell.append(side, main);

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

  const foot = document.createElement("div");
  foot.className = "docs-foot";
  foot.innerHTML = `Jonesco System · v1.3.1 · <a href="${root}changelog.html">Changelog</a>`;
  main.append(foot);
})();

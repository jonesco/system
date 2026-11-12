/* Introduction banner: a magenta dot grid where bigger dots draw the J© mark.
   Dots spring to their home; the pointer pushes them, a click or tap sends a ripple,
   scrolling drags the field and lets it settle. Static under prefers-reduced-motion. */
(() => {
  const canvas = document.querySelector(".intro-dots canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const ink = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#e4148c";
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // the release number sits in the bottom right corner, on a patch kept clear of dots
  const tag = canvas.parentElement.querySelector(".intro-dots__v");
  if (tag) tag.textContent = "v" + (document.documentElement.dataset.version || "");

  // J© mark, logos/jonesco-j-black.svg: 224.457 x 166.797, offset by (-623.488, -522.441)
  const MARK = [
  'M 623.488281 658.867188 L 628.832031 658.867188 C 638.695312 658.867188 642.191406 654.757812 642.191406 646.535156 L 642.191406 530.621094 L 667.675781 530.621094 L 667.675781 649.414062 C 667.675781 668.320312 660.070312 681.0625 631.914062 681.0625 L 623.488281 681.0625 Z M 623.488281 658.867188 ',
  'M 762.097656 542.203125 C 727.210938 542.203125 700.902344 569.558594 700.902344 605.835938 C 700.902344 642.117188 727.210938 669.472656 762.097656 669.472656 C 796.988281 669.472656 823.300781 642.117188 823.300781 605.835938 C 823.300781 569.558594 796.988281 542.203125 762.097656 542.203125 M 762.097656 689.238281 C 713.417969 689.238281 676.707031 653.382812 676.707031 605.835938 C 676.707031 558.292969 713.417969 522.441406 762.097656 522.441406 C 810.78125 522.441406 847.492188 558.292969 847.492188 605.835938 C 847.492188 653.382812 810.78125 689.238281 762.097656 689.238281 ',
  'M 764.746094 651.273438 C 739.441406 651.273438 721.074219 632.167969 721.074219 605.839844 C 721.074219 578.664062 738.46875 560.402344 764.351562 560.402344 C 784.472656 560.402344 798.796875 572.660156 801.726562 592.390625 L 802.085938 594.796875 L 782.632812 594.796875 L 782.296875 593.109375 C 780.640625 584.835938 773.933594 579.898438 764.351562 579.898438 C 751.617188 579.898438 743.703125 589.6875 743.703125 605.445312 C 743.703125 620.703125 752.554688 631.78125 764.746094 631.78125 C 774.695312 631.78125 781.25 626.679688 782.269531 618.140625 L 782.496094 616.289062 L 802.730469 616.289062 L 802.304688 618.75 C 798.964844 638.203125 783.871094 651.273438 764.746094 651.273438 ',
  'M 839.109375 545.910156 C 843.78125 545.910156 847.945312 542.539062 847.945312 537.28125 C 847.945312 532.050781 843.78125 528.652344 839.109375 528.652344 C 834.433594 528.652344 830.273438 532.050781 830.273438 537.28125 C 830.273438 542.539062 834.433594 545.910156 839.109375 545.910156 M 845.667969 537.28125 C 845.667969 541.257812 842.734375 544.097656 839.109375 544.097656 C 835.433594 544.097656 832.550781 541.257812 832.550781 537.28125 C 832.550781 533.304688 835.433594 530.46875 839.109375 530.46875 C 842.734375 530.46875 845.667969 533.304688 845.667969 537.28125 M 841.761719 538.726562 C 841.621094 539.886719 840.714844 540.5625 839.433594 540.5625 C 837.785156 540.5625 836.691406 539.050781 836.691406 537.191406 C 836.691406 535.257812 837.644531 533.910156 839.386719 533.910156 C 840.574219 533.910156 841.527344 534.515625 841.761719 535.675781 L 843.574219 535.675781 C 843.226562 533.328125 841.503906 532.097656 839.386719 532.097656 C 836.339844 532.097656 834.503906 534.28125 834.503906 537.234375 C 834.503906 540.121094 836.457031 542.375 839.433594 542.375 C 841.480469 542.375 843.246094 541.027344 843.644531 538.726562 Z M 841.761719 538.726562 ',
  ].map(d => new Path2D(d));
  const MW = 224.457, MH = 166.797;

  const SPRING = 0.07, DAMP = 0.84;
  let PITCH = 11, R_MIN = 1.2, R_MAX = 4.5, PUSH = 110;   // CSS px, set from the width in build()
  let W = 0, H = 0, ring = null, dots = [], ripples = [], pointer = null, running = false, frame = 0;

  function build() {
    const box = canvas.getBoundingClientRect();
    W = box.width; H = box.height;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    PITCH = Math.max(7, Math.min(11, W / 80)); R_MIN = PITCH * 0.11; R_MAX = PITCH * 0.414; PUSH = PITCH * 10;

    // soft mask of the mark, so dot size ramps at its edges like a halftone
    const m = document.createElement("canvas"); m.width = Math.ceil(W); m.height = Math.ceil(H);
    const mc = m.getContext("2d");
    const s = Math.min(H * 0.78 / MH, W * 0.7 / MW);
    mc.filter = `blur(${Math.max(2, PITCH * 0.35)}px)`;
    const pad = (H - MH * s) / 2;   // same margin on the left as above and below
    ring = { x: pad + (762.098 - 623.488) * s, y: pad + (605.836 - 522.441) * s };   // center of the ©
    mc.translate(pad, pad); mc.scale(s, s); mc.translate(-623.488, -522.441);
    MARK.forEach(p => mc.fill(p));
    const alpha = mc.getImageData(0, 0, m.width, m.height).data;

    const cols = Math.floor(W / PITCH), rows = Math.floor(H / PITCH);
    const ox = (W - (cols - 1) * PITCH) / 2, oy = (H - (rows - 1) * PITCH) / 2;
    // the label sits three rows of dots in from the right and bottom, centered in a patch of whole grid cells cleared for it
    let clear = null;
    if (tag && tag.textContent.length > 1) {
      tag.style.left = tag.style.top = "0px"; tag.style.right = tag.style.bottom = "auto";
      const t = tag.getBoundingClientRect();
      const n = Math.ceil((t.width + PITCH * 1.2) / PITCH), m = Math.ceil((t.height + PITCH * 0.8) / PITCH);   // columns and rows to clear
      const i1 = cols - 4, i0 = i1 - n + 1, j1 = rows - 4, j0 = j1 - m + 1;
      clear = { i0, i1, j0, j1 };
      // centered between the nearest dots left on each side
      const cx = ox + ((i0 - 1) + (i1 + 1)) / 2 * PITCH, cy = oy + ((j0 - 1) + (j1 + 1)) / 2 * PITCH;
      tag.style.left = (cx - t.width / 2) + "px"; tag.style.top = (cy - t.height / 2) + "px";
    }
    dots = [];
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const x = ox + i * PITCH, y = oy + j * PITCH;
      if (clear && i >= clear.i0 && i <= clear.i1 && j >= clear.j0 && j <= clear.j1) continue;
      const a = alpha[((Math.round(y) * m.width + Math.round(x)) << 2) + 3] / 255;
      dots.push({ hx: x, hy: y, x, y, vx: 0, vy: 0, r: R_MIN + (R_MAX - R_MIN) * a * a * (3 - 2 * a) });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = ink;
    ctx.beginPath();
    for (const d of dots) { ctx.moveTo(d.x + d.r, d.y); ctx.arc(d.x, d.y, d.r, 0, 6.2832); }
    ctx.fill();
  }

  function step() {
    frame++;
    ripples = ripples.filter(r => (r.t += 1) < 90);
    let moving = ripples.length > 0 || pointer;
    for (const d of dots) {
      let fx = (d.hx - d.x) * SPRING, fy = (d.hy - d.y) * SPRING;
      if (pointer) {
        const dx = d.hx - pointer.x, dy = d.hy - pointer.y, dist = Math.hypot(dx, dy);
        if (dist < PUSH && dist > 0.01) {
          const f = (1 - dist / PUSH) ** 2 * 26;   // target offset, eased in by the spring
          fx += (dx / dist) * f * SPRING; fy += (dy / dist) * f * SPRING;
        }
      }
      for (const r of ripples) {
        const dx = d.hx - r.x, dy = d.hy - r.y, dist = Math.hypot(dx, dy) || 1;
        const band = dist - r.t * 7;                 // ring travels 7px a frame
        if (Math.abs(band) < 28) {
          const f = Math.cos(band / 28 * Math.PI / 2) * 2.2 * (1 - r.t / 90);
          fx += (dx / dist) * f; fy += (dy / dist) * f;
        }
      }
      d.vx = (d.vx + fx) * DAMP; d.vy = (d.vy + fy) * DAMP;
      d.x += d.vx; d.y += d.vy;
      if (Math.abs(d.vx) + Math.abs(d.vy) > 0.02 || Math.abs(d.x - d.hx) + Math.abs(d.y - d.hy) > 0.2) moving = true;
    }
    draw();
    if (moving) requestAnimationFrame(step); else running = false;
  }
  const wake = () => { if (!still && !running && visible) { running = true; requestAnimationFrame(step); } };

  const local = e => { const b = canvas.getBoundingClientRect(); return { x: e.clientX - b.left, y: e.clientY - b.top }; };
  canvas.addEventListener("pointermove", e => { pointer = local(e); wake(); });
  canvas.addEventListener("pointerleave", () => { pointer = null; wake(); });
  canvas.addEventListener("pointerdown", e => { const p = local(e); ripples.push({ ...p, t: 0 }); wake(); });

  // scrolling drags the field; dots further from the top lag more, then spring home
  let lastY = scrollY;
  addEventListener("scroll", () => {
    const dy = Math.max(-40, Math.min(40, scrollY - lastY)); lastY = scrollY;
    if (!visible) return;
    for (const d of dots) d.vy += dy * 0.12 * (0.4 + d.hy / H) * (0.6 + d.r / R_MAX);
    wake();
  }, { passive: true });

  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) wake(); }).observe(canvas);
  new ResizeObserver(() => { build(); draw(); }).observe(canvas);

  build(); draw();
  document.fonts.ready.then(() => { build(); draw(); });   // the clear patch follows the label once Trade Gothic is in
  if (!still) { ripples.push({ ...ring, t: 0 }); wake(); }   // one ring on arrival, out of the ©
})();

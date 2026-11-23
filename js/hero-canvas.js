/* ==========================================================================
   WeMM-Video — Full-Page Living WebGL Wave & Acoustic Light Field
   Single persistent GPU fragment shader spanning the entire document.
   Responds gently to scroll progress (u_scroll) so every section floats over
   a unified, breathing audio-visual wave backdrop with zero flicker.
   ========================================================================== */

(function () {
  function initWebGLWave(canvas) {
    const gl =
      canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "high-performance" }) ||
      canvas.getContext("experimental-webgl", { alpha: false, antialias: false });
    if (!gl) return null;

    const vertSrc = `
      attribute vec2 a_pos;
      void main() {
        gl_Position = vec4(a_pos, 0.0, 1.0);
      }
    `;

    const fragSrc = `
      precision highp float;
      uniform vec2 u_res;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform float u_scroll;
      uniform float u_intensity;

      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.52;
        mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
        for (int i = 0; i < 5; i++) {
          v += a * noise(p);
          p = rot * p * 2.03 + vec2(17.1, 31.7);
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 p = (gl_FragCoord.xy - 0.5 * u_res.xy) / min(u_res.x, u_res.y);

        // Smooth scroll-driven vertical parallax & subtle palette drift
        float sc = clamp(u_scroll, 0.0, 1.0);
        float t = u_time * 0.14;
        vec2 m = (u_mouse - 0.5) * 0.22;

        // Rotate wave plane slightly as user scrolls through chapters
        float angle = -0.18 + sc * 0.34;
        float ca = cos(angle), sa = sin(angle);
        vec2 pr = mat2(ca, -sa, sa, ca) * p;
        pr.y -= sc * 0.95;

        // Domain-warped fluid velocity field (cinema liquid-light waves)
        vec2 q = vec2(
          fbm(pr * 1.35 + vec2(t * 0.85, -t * 0.45) + m * 0.6),
          fbm(pr * 1.35 + vec2(-t * 0.55, t * 0.72) + vec2(4.3, 1.9))
        );

        vec2 r = vec2(
          fbm(pr * 1.85 + 2.15 * q + vec2(1.7, 9.2) + t * 0.32),
          fbm(pr * 1.85 + 2.15 * q + vec2(8.3, 2.8) - t * 0.28)
        );

        float f = fbm(pr * 1.45 + 1.95 * r);

        // Acoustic harmonic silk-light ribbons sweeping smoothly across the viewport
        float w1 = sin(pr.x * 2.6 + r.x * 3.8 - t * 1.35 + pr.y * 1.1);
        float w2 = sin(pr.x * 3.9 - r.y * 3.1 + t * 1.05 - pr.y * 1.45);
        float ribbon1 = exp(-pow(abs(pr.y + sc * 0.95 - w1 * 0.24 - 0.05), 1.45) * 4.8);
        float ribbon2 = exp(-pow(abs(pr.y + sc * 0.95 - w2 * 0.20 + 0.17), 1.55) * 5.6);

        // Tint the white surface where the moving ribbons and mist overlap.
        float energy = mix(1.0, 0.64, smoothstep(0.0, 0.16, sc)) * u_intensity;
        float mist = smoothstep(0.32, 0.82, f);
        float tint = (0.24 * mist + 0.47 * ribbon1 + 0.29 * ribbon2) * energy;
        vec3 col = mix(vec3(1.0), vec3(0.82, 0.93, 0.86), clamp(tint, 0.0, 1.0));
        col += (hash(gl_FragCoord.xy) - 0.5) / 255.0;

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function compile(type, src) {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    }

    const vs = compile(gl.VERTEX_SHADER, vertSrc);
    const fs = compile(gl.FRAGMENT_SHADER, fragSrc);
    if (!vs || !fs) return null;

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(prog, "a_pos");
    const resLoc = gl.getUniformLocation(prog, "u_res");
    const timeLoc = gl.getUniformLocation(prog, "u_time");
    const mouseLoc = gl.getUniformLocation(prog, "u_mouse");
    const scrollLoc = gl.getUniformLocation(prog, "u_scroll");
    const intensityLoc = gl.getUniformLocation(prog, "u_intensity");

    return { gl, prog, buf, posLoc, resLoc, timeLoc, mouseLoc, scrollLoc, intensityLoc };
  }

  function initFallback2D(canvas) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    return {
      draw(t, scroll) {
        const w = canvas.width;
        const h = canvas.height;
        const energy = 1 - Math.min(0.42, scroll * 2.2);

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);

        const orbs = [
          { x: 0.30 + Math.sin(t * 0.28) * 0.10, y: 0.38 - scroll * 0.2, r: 0.48, c: `rgba(56, 150, 88, ${(0.12 * energy).toFixed(3)})` },
          { x: 0.72 + Math.cos(t * 0.22) * 0.10, y: 0.30 + scroll * 0.12, r: 0.50, c: `rgba(97, 165, 120, ${(0.10 * energy).toFixed(3)})` },
          { x: 0.52 + Math.sin(t * 0.19) * 0.12, y: 0.68 - scroll * 0.15, r: 0.44, c: `rgba(129, 183, 144, ${(0.07 * energy).toFixed(3)})` }
        ];
        orbs.forEach((o) => {
          const g = ctx.createRadialGradient(o.x * w, o.y * h, 0, o.x * w, o.y * h, o.r * Math.max(w, h));
          g.addColorStop(0, o.c);
          g.addColorStop(1, "rgba(255, 255, 255, 0)");
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, w, h);
        });

        // Soft flowing silk wave ribbons
        for (let k = 0; k < 4; k++) {
          ctx.beginPath();
          const baseY = h * (0.28 + k * 0.16);
          for (let x = 0; x <= w; x += 18) {
            const nx = x / w;
            const y =
              baseY +
              Math.sin(nx * 5.2 + t * (0.7 + k * 0.15) + scroll * 4.0) * (28 + k * 8) +
              Math.cos(nx * 3.1 - t * 0.45 + k) * 18;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = k % 2 === 0
            ? `rgba(56, 150, 88, ${(0.07 * energy).toFixed(3)})`
            : `rgba(97, 165, 120, ${(0.10 * energy).toFixed(3)})`;
          ctx.lineWidth = 2.0;
          ctx.stroke();
        }
      }
    };
  }

  function mountFullPageWaves() {
    const canvas = document.getElementById("ambient-wave-canvas");
    if (!canvas) return;

    const webgl = initWebGLWave(canvas);
    const fallback = webgl ? null : initFallback2D(canvas);
    if (!webgl && !fallback) return;

    const intensity = parseFloat(canvas.getAttribute("data-intensity") || "1.0");
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;
    let mouseX = 0.5;
    let mouseY = 0.5;
    let targetScroll = 0.0;
    let smoothScroll = 0.0;
    const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      const w = Math.max(320, Math.min(1600, Math.floor(window.innerWidth * dpr)));
      const h = Math.max(240, Math.min(1000, Math.floor(window.innerHeight * dpr)));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    function updateScrollTarget() {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      targetScroll = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    }

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("scroll", updateScrollTarget, { passive: true });
    window.addEventListener(
      "pointermove",
      (e) => {
        targetMouseX = e.clientX / Math.max(1, window.innerWidth);
        targetMouseY = 1.0 - e.clientY / Math.max(1, window.innerHeight);
      },
      { passive: true }
    );

    resize();
    updateScrollTarget();

    const start = performance.now();
    let hidden = false;
    document.addEventListener("visibilitychange", () => {
      hidden = document.hidden;
    });

    function frame(now) {
      if (!hidden) {
        const t = reducedMotion ? 2.4 : (now - start) / 1000;
        mouseX += (targetMouseX - mouseX) * 0.04;
        mouseY += (targetMouseY - mouseY) * 0.04;
        smoothScroll += (targetScroll - smoothScroll) * 0.07;

        if (webgl) {
          const { gl, prog, buf, posLoc, resLoc, timeLoc, mouseLoc, scrollLoc, intensityLoc } = webgl;
          gl.viewport(0, 0, canvas.width, canvas.height);
          gl.useProgram(prog);
          gl.bindBuffer(gl.ARRAY_BUFFER, buf);
          gl.enableVertexAttribArray(posLoc);
          gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
          gl.uniform2f(resLoc, canvas.width, canvas.height);
          gl.uniform1f(timeLoc, t);
          gl.uniform2f(mouseLoc, mouseX, mouseY);
          gl.uniform1f(scrollLoc, smoothScroll);
          gl.uniform1f(intensityLoc, intensity);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        } else if (fallback) {
          fallback.draw(t, smoothScroll);
        }
      }
      if (!reducedMotion) {
        requestAnimationFrame(frame);
      }
    }

    requestAnimationFrame(frame);
  }

  document.addEventListener("DOMContentLoaded", mountFullPageWaves);
})();

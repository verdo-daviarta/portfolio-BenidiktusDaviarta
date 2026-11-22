"use client";

import { useEffect, useRef } from "react";
import { auroraFragmentShader, auroraVertexShader } from "./aurora-shaders";
import styles from "./aurora-background.module.css";

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
}

function createRenderer(gl: WebGLRenderingContext) {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, auroraVertexShader);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, auroraFragmentShader);
  const program = vertex && fragment ? gl.createProgram() : null;

  if (!program || !vertex || !fragment) {
    if (vertex) gl.deleteShader(vertex);
    if (fragment) gl.deleteShader(fragment);
    return null;
  }

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.detachShader(program, vertex);
  gl.detachShader(program, fragment);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  const triangle = gl.createBuffer();
  if (!triangle) {
    gl.deleteProgram(program);
    return null;
  }

  const position = gl.getAttribLocation(program, "a_position");
  const time = gl.getUniformLocation(program, "u_time");
  const mouse = gl.getUniformLocation(program, "u_mouse");
  const velocity = gl.getUniformLocation(program, "u_velocity");
  const resolution = gl.getUniformLocation(program, "u_resolution");
  const interaction = gl.getUniformLocation(program, "u_interaction");

  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, triangle);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.disable(gl.DITHER);

  return {
    resize(width: number, height: number) {
      gl.viewport(0, 0, width, height);
      gl.uniform2f(resolution, width, height);
    },
    draw(
      t: number,
      x: number,
      y: number,
      vx: number,
      vy: number,
      energy: number,
    ) {
      gl.uniform1f(time, t);
      gl.uniform2f(mouse, x, y);
      gl.uniform2f(velocity, vx, vy);
      gl.uniform1f(interaction, energy);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    dispose() {
      gl.disableVertexAttribArray(position);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.useProgram(null);
      gl.deleteBuffer(triangle);
      gl.deleteProgram(program);
    },
  };
}

const clampUnit = (value: number) => Math.max(0, Math.min(1, value));

const foreground =
  "a, button, input, textarea, select, dialog, img, video, iframe, h1, h2, h3, h4, p, dt, dd";

export function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = canvasRef.current;
    if (!element) return;
    const canvas = element;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const forcedColors = window.matchMedia("(forced-colors: active)");
    const touch = window.matchMedia("(hover: none) and (pointer: coarse)");
    const context = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    if (!context) return;
    const gl = context;

    let renderer: ReturnType<typeof createRenderer> = null;
    let frame = 0;
    let lastFrame = 0;
    let lastDraw = 0;
    let nextDraw = 0;
    let slowFrames = 0;
    let lowPower = false;
    let needsResize = true;
    let cssWidth = 1;
    let cssHeight = 1;

    let phase = 0;
    let energy = 0;
    let mouseX = 0.5;
    let mouseY = 0.5;
    let velocityX = 0;
    let velocityY = 0;
    let pointerX = 0.5;
    let pointerY = 0.5;
    let pointerVX = 0;
    let pointerVY = 0;
    let lastMove = -Infinity;

    function resetPointer() {
      lastMove = -Infinity;
      pointerVX = 0;
      pointerVY = 0;
    }

    function onPointerMove(event: PointerEvent) {
      if (
        event.pointerType !== "mouse" ||
        touch.matches ||
        reducedMotion.matches ||
        forcedColors.matches ||
        document.hidden ||
        !renderer
      )
        return;

      if (event.target instanceof Element && event.target.closest(foreground)) {
        resetPointer();
        return;
      }

      const x = clampUnit(event.clientX / cssWidth);
      const y = 1 - clampUnit(event.clientY / cssHeight);
      const now = performance.now();
      const elapsed = now - lastMove;
      if (elapsed < 150) {
        const seconds = Math.max(8, elapsed) / 1000;
        const dx = (x - pointerX) / seconds;
        const dy = (y - pointerY) / seconds;
        const limit = Math.max(1.65, Math.hypot(dx, dy));
        pointerVX = dx / limit;
        pointerVY = dy / limit;
      }
      pointerX = x;
      pointerY = y;
      lastMove = now;
    }

    function onPointerOut(event: PointerEvent) {
      if (!event.relatedTarget) resetPointer();
    }

    function requestDraw() {
      if (!frame && renderer && !document.hidden && !forcedColors.matches) {
        frame = requestAnimationFrame(draw);
      }
    }

    function stop() {
      cancelAnimationFrame(frame);
      frame = lastFrame = lastDraw = nextDraw = 0;
      slowFrames = 0;
    }

    function draw(now: number) {
      frame = 0;
      if (!renderer || document.hidden || forcedColors.matches) return;

      const still = reducedMotion.matches;
      if (!still && !touch.matches && !lowPower && lastFrame) {
        slowFrames =
          now - lastFrame > 23 ? slowFrames + 1 : Math.max(0, slowFrames - 2);
        if (slowFrames >= 40) {
          lowPower = true;
          needsResize = true;
        }
      }
      lastFrame = now;

      const small = touch.matches || lowPower;
      const interval = 1000 / (small ? 30 : 60);
      if (!still && !needsResize && now + 0.75 < nextDraw) {
        requestDraw();
        return;
      }
      nextDraw = Math.max(nextDraw + interval, now);
      if (!lastDraw) nextDraw = now + interval;
      const dt = lastDraw ? Math.min(0.05, (now - lastDraw) / 1000) : 0;
      lastDraw = now;

      if (needsResize) {
        cssWidth = Math.max(1, canvas.clientWidth);
        cssHeight = Math.max(1, canvas.clientHeight);
        const pixelBudget = small ? 320_000 : 960_000;
        const ratio = Math.min(
          window.devicePixelRatio || 1,
          small ? 0.85 : 1.25,
          Math.sqrt(pixelBudget / (cssWidth * cssHeight)),
        );
        const width = Math.max(1, Math.floor(cssWidth * ratio));
        const height = Math.max(1, Math.floor(cssHeight * ratio));
        if (canvas.width !== width) canvas.width = width;
        if (canvas.height !== height) canvas.height = height;
        renderer.resize(width, height);
        needsResize = false;
      }

      if (still) {
        renderer.draw(phase, 0.5, 0.5, 0, 0, 0);
      } else {
        const active = now - lastMove < 105;
        const positionEase = 1 - Math.exp(-dt * 5);
        const velocityEase = 1 - Math.exp(-dt * (active ? 9 : 3.3));
        const energyEase = 1 - Math.exp(-dt * (active ? 7 : 2));
        const speed = Math.hypot(pointerVX, pointerVY);

        mouseX += ((active ? pointerX : 0.5) - mouseX) * positionEase;
        mouseY += ((active ? pointerY : 0.5) - mouseY) * positionEase;
        velocityX += ((active ? pointerVX : 0) - velocityX) * velocityEase;
        velocityY += ((active ? pointerVY : 0) - velocityY) * velocityEase;
        energy += ((active ? 0.25 + 0.75 * speed : 0) - energy) * energyEase;

        phase += dt * (1 + 2.1 * energy * Math.hypot(velocityX, velocityY));
        renderer.draw(phase, mouseX, mouseY, velocityX, velocityY, energy);
        requestDraw();
      }

      if (!canvas.hasAttribute("data-ready"))
        canvas.setAttribute("data-ready", "");
    }

    function resize() {
      needsResize = true;
      requestDraw();
    }

    function syncPlayback() {
      stop();
      resetPointer();
      energy = velocityX = velocityY = 0;
      mouseX = mouseY = 0.5;
      resize();
    }

    function onContextLost(event: Event) {
      event.preventDefault();
      stop();
      renderer = null;
      canvas.removeAttribute("data-ready");
    }

    function onContextRestored() {
      renderer = createRenderer(gl);
      syncPlayback();
    }

    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerout", onPointerOut, { passive: true });
    window.addEventListener("blur", resetPointer);
    document.addEventListener("visibilitychange", syncPlayback);
    for (const preference of [reducedMotion, forcedColors, touch]) {
      preference.addEventListener("change", syncPlayback);
    }
    onContextRestored();

    return () => {
      stop();
      observer.disconnect();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("blur", resetPointer);
      document.removeEventListener("visibilitychange", syncPlayback);
      for (const preference of [reducedMotion, forcedColors, touch]) {
        preference.removeEventListener("change", syncPlayback);
      }
      if (!gl.isContextLost()) renderer?.dispose();
      canvas.removeAttribute("data-ready");
    };
  }, []);

  return (
    <div className={styles.backdrop} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}

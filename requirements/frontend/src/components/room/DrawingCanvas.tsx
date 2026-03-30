import { useEffect, useRef, useState } from "react";
import type { DrawPayload, Stroke, StrokeAppendPayload, Point } from "../../../shared/ws.payloads";
import {
  emitStrokeAppend,
  emitStrokeStart,
  onInitDrawing,
  onStrokeAppend,
  onStrokeStart,
} from "../../api/drawingSocket";

type Props = {
  isDrawer: boolean;
  roomId: number;
  drawerId: number;
  color?: `#${string}`;
  strokeWidth?: number;
};

function drawStroke(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  stroke: Stroke
) {
  const pts = stroke.points;
  if (pts.length < 2) return;

  const rect = canvas.getBoundingClientRect();

  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = stroke.width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();
  ctx.moveTo(pts[0].x * rect.width, pts[0].y * rect.height);

  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i].x * rect.width, pts[i].y * rect.height);
  }
  ctx.stroke();
}

function redrawAll(canvas: HTMLCanvasElement, strokes: Stroke[]) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const rect = canvas.getBoundingClientRect();
  ctx.clearRect(0, 0, rect.width, rect.height);

  for (const s of strokes) drawStroke(ctx, canvas, s);
}

function pointFromPointerEvent(
  canvas: HTMLCanvasElement,
  e: React.PointerEvent<HTMLCanvasElement>
): Point {
  const rect = canvas.getBoundingClientRect();
  const px = e.clientX - rect.left;
  const py = e.clientY - rect.top;

  return {
    x: rect.width ? px / rect.width : 0,
    y: rect.height ? py / rect.height : 0,
  };
}

export function DrawingCanvas({
  isDrawer,
  roomId,
  drawerId,
  color = "#111",
  strokeWidth = 3,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const strokesRef = useRef<Stroke[]>([]);
  const activeStrokeIdRef = useRef<string | null>(null);
  const pendingPointsRef = useRef<Point[]>([]);
  const rafFlushRef = useRef<number | null>(null);

  // Low-load tuning knobs, very extra
  const MAX_POINTS_PER_PACKET = 20; // cap packet size
  const MIN_DIST_PX = 1.5; // ignore tiny pointer jitter (CSS pixels)
  const lastSentPointRef = useRef<Point | null>(null);


  useEffect(() => {
    strokesRef.current = strokes;
    const canvas = canvasRef.current;
    if (!canvas) return;
    redrawAll(canvas, strokes);
  }, [strokes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));

      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      redrawAll(canvas, strokesRef.current);
    };

    resize();
    const observer = new ResizeObserver(() => {
      resize();
    });
    observer.observe(canvas);
    window.addEventListener("resize", resize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    const offInit = onInitDrawing((payload) => {
      if (payload.room_id !== roomId) return;
	  console.log("[wss] init drawing received:", payload);
      setStrokes(payload.strokes);
    });

    const offStart = onStrokeStart((payload: DrawPayload) => {
		console.log("[wss] stroke start received:", payload);
      if (payload.room_id !== roomId) return;
      const s = payload.strokes?.[0];
      if (!s) return;
      setStrokes((prev) => [...prev, s]);
    });

    const offAppend = onStrokeAppend((payload: StrokeAppendPayload) => {
      if (payload.room_id !== roomId) return;
      console.log("[wss] stroke append received:", payload);

      if (!payload.id || payload.points.length === 0) return;

      setStrokes((prev) =>
        prev.map((s) =>
          s.id === payload.id ? { ...s, points: [...s.points, ...payload.points] } : s
        )
      );
    });

    return () => {
      offInit();
      offStart();
      offAppend();
    };
  }, [roomId]);

  function flushPendingPoints() {
    rafFlushRef.current = null;

    const id = activeStrokeIdRef.current;
    if (!id) return;

    const pts = pendingPointsRef.current;
    if (pts.length === 0) return;

    pendingPointsRef.current = [];

    const payload: StrokeAppendPayload = {
      room_id: roomId,
      id,
      points: pts,
    };

    emitStrokeAppend(payload);
  }

  function scheduleFlush() {
    if (rafFlushRef.current != null) return;
    rafFlushRef.current = window.requestAnimationFrame(flushPendingPoints);
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawer) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.setPointerCapture(e.pointerId);

    //const id = crypto.randomUUID(); //doesn't work with HTTP
	const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    activeStrokeIdRef.current = id;
    lastSentPointRef.current = null;

    const p = pointFromPointerEvent(canvas, e);
    const stroke: Stroke = { id, color, width: strokeWidth, points: [p] };

    setStrokes((prev) => [...prev, stroke]);

    const payload: DrawPayload = {
      room_id: roomId,
      drawer: drawerId,
      strokes: [stroke],
    };

    emitStrokeStart(payload);
  }

  function distPx(a: Point, b: Point, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect();
    const dx = (a.x - b.x) * rect.width;
    const dy = (a.y - b.y) * rect.height;
    return Math.hypot(dx, dy);
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawer) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const id = activeStrokeIdRef.current;
    if (!id) return;

    const p = pointFromPointerEvent(canvas, e);

    const last = lastSentPointRef.current;
    if (last && distPx(last, p, canvas) < MIN_DIST_PX) return;
    lastSentPointRef.current = p;

    // local update (smooth)
    setStrokes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, points: [...s.points, p] } : s))
    );

    // batched network update
    pendingPointsRef.current.push(p);

    // Flush if packet is getting large, otherwise once per frame.
    if (pendingPointsRef.current.length >= MAX_POINTS_PER_PACKET) {
      flushPendingPoints();
      return;
    }

    scheduleFlush();
  }

  function onPointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawer) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    // IMPORTANT: flush last points
    flushPendingPoints();
    activeStrokeIdRef.current = null;
    lastSentPointRef.current = null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded cursor-crosshair touch-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    />
  );
}

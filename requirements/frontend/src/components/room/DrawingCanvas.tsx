import { useEffect, useRef, useState } from "react";
import { socket } from "../../api/socket";
import { WS_EVENTS } from "../../../shared/ws.events";
import type { DrawPayload, Stroke, Point } from "../../../shared/ws.payloads";
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
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    const offInit = onInitDrawing((payload) => {
		
      if (payload.room_id !== roomId) return;
	  console.log("[ws] init drawing received:", payload);
      setStrokes(payload.strokes);
    });

    const offStart = onStrokeStart((payload: DrawPayload) => {
		console.log("[ws] stroke start received:", payload);
      if (payload.room_id !== roomId) return;
      const s = payload.strokes?.[0];
      if (!s) return;
      setStrokes((prev) => [...prev, s]);
    });

    const offAppend = onStrokeAppend((payload: DrawPayload) => {
      if (payload.room_id !== roomId) return;
		console.log("[ws] stroke append received:", payload);
      const patches = payload.strokes ?? [];
      if (patches.length === 0) return;

      const patchMap = new Map(patches.map((p) => [p.id, p]));

      setStrokes((prev) => {
        const next = prev.map((s) => {
          const patch = patchMap.get(s.id);
          if (!patch) return s;
          patchMap.delete(s.id);
          return { ...s, points: [...s.points, ...patch.points] };
        });

        for (const remaining of patchMap.values()) next.push(remaining);

        return next;
      });
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

    const patchStroke: Stroke = {
      id,
      color,
      width: strokeWidth,
      points: pts,
    };

    const payload: DrawPayload = {
      room_id: roomId,
      drawer: drawerId,
      width: strokeWidth,
      color,
      strokes: [patchStroke],
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

    const id = crypto.randomUUID();
    activeStrokeIdRef.current = id;

    const p = pointFromPointerEvent(canvas, e);
    const stroke: Stroke = { id, color, width: strokeWidth, points: [p] };

    setStrokes((prev) => [...prev, stroke]);

    const payload: DrawPayload = {
      room_id: roomId,
      drawer: drawerId,
      width: strokeWidth,
      color,
      strokes: [stroke],
    };

    emitStrokeStart(payload);
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawer) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const id = activeStrokeIdRef.current;
    if (!id) return;

    const p = pointFromPointerEvent(canvas, e);

    setStrokes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, points: [...s.points, p] } : s))
    );

    pendingPointsRef.current.push(p);
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

    flushPendingPoints();
    activeStrokeIdRef.current = null;
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

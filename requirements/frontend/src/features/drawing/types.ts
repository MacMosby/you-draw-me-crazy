// types.ts
<<<<<<< HEAD
=======
import type { StrokeId } from "./protocol";

export type Stroke = {
  id: StrokeId;
  points: Array<[number, number]>; // normalized
};

export type DrawingState = {
  strokes: Record<StrokeId, Stroke>;
  order: StrokeId[]; // render order
};
>>>>>>> aca3e26 (add: set up for svg dravwing)

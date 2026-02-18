// types.ts
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> 8677b65 (add: set up for svg dravwing)
import type { StrokeId } from "./protocol";

export type Stroke = {
  id: StrokeId;
  points: Array<[number, number]>; // normalized
};

export type DrawingState = {
  strokes: Record<StrokeId, Stroke>;
  order: StrokeId[]; // render order
<<<<<<< HEAD
};
>>>>>>> aca3e26 (add: set up for svg dravwing)
=======
>>>>>>> c20143a (sync: WIP local storage and drawing wip)
=======
};
>>>>>>> 8677b65 (add: set up for svg dravwing)
=======
>>>>>>> 0d34e02 (sync: WIP local storage and drawing wip)

import Draggabilly, { Position } from "draggabilly";
import { debounce } from "lodash";

window.addEventListener("DOMContentLoaded", () => {
  const box1 = document.querySelector("#box1") as HTMLDivElement;
  const box2 = document.querySelector("#box2") as HTMLDivElement;

  const drag1 = new Draggabilly(box1);

  let points: Position[] = [];
  let requestID: number;
  let active = false;

  const handler = () => {
    points.push({ ...drag1.position });
    if (!active) {
      action();
    }
  };

  drag1.on("dragStart", handler);
  drag1.on("dragMove",handler);

  function moveBox() {
    active = true;
    const point = points.shift();
    if (point == null) return false;
    const { x, y } = point;
    const current = drag1.position;
    const distance = Math.sqrt(
      Math.pow(Math.abs(current.x - x), 2) +
        Math.pow(Math.abs(current.y - y), 2)
    );
    if (distance < 120) {
      points.unshift(point);
      return true;
    }
    Object.assign(box2.style, {
      left: `${point.x}px`,
      top: `${point.y}px`,
    });
    return points.length;
  }

  function animate() {
    if (!moveBox()) {
      active = false;
      return cancelAnimationFrame(requestID);
    }
    moveBox();
    requestID = requestAnimationFrame(animate);
  }

  const action = debounce(animate, 300, {
    maxWait: 300,
  });
});

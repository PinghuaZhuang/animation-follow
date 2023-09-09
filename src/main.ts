import Draggabilly, { Position } from "draggabilly";
// import { debounce } from "lodash";
// @ts-ignore
// import TWEEN from "@tweenjs/tween.js";

window.addEventListener("DOMContentLoaded", () => {
  const box1 = document.querySelector("#box1") as HTMLDivElement;
  const box2 = document.querySelector("#box2") as HTMLDivElement;

  const OFFSET = 120;

  const drag1 = new Draggabilly(box1, {
    containment: document.body,
  });

  let points: Position[] = [];
  let requestID: number;
  let requestID2: number;
  // let requestID3: number | null;
  let active = false;

  const handler = () => {
    if (!active) {
      animate();
    }
  };

  drag1.on("dragStart", () => {
    recordPoints();
    handler();
  });
  drag1.on("dragMove", handler);
  drag1.on("dragEnd", () => {
    requestAnimationFrame(() => cancelAnimationFrame(requestID2));
  });

  function moveBox() {
    active = true;
    const point = points[0];
    if (point == null) return false;
    const activePoint = drag1.position;
    const rect = box2.getBoundingClientRect();
    const staicPoint = { x: rect.left, y: rect.top };
    const distance = getDistance(staicPoint, activePoint);

    if (distance < OFFSET) {
      return false;
    }

    // 在这里计算出最后离开的坐标, 利用 tween.js 计算出简易动画
    // let i = 0;
    // let length = points.length;
    // requestID3 = null;
    // do {
    //   const _point = points[i];
    //   const d = getDistance(drag1.position, point);
    //   if (requestID3 == null && i > 0 && d >= OFFSET) {
    //     const tween = new TWEEN.Tween({ ...staicPoint }, false)
    //       .to({ ..._point }, 300)
    //       .onUpdate(setStyle)
    //       .onComplete(() => {
    //         tween.stop();
    //         requestAnimationFrame(() => {
    //           cancelAnimationFrame(requestID3!);
    //           points.splice(0, i);
    //           animate();
    //         });
    //       })
    //       .start();
    //     function move2RecentPoint(time: number) {
    //       tween.update(time);
    //       requestID3 = requestAnimationFrame(move2RecentPoint);
    //     }
    //     requestID3 = requestAnimationFrame(move2RecentPoint);
    //     return false;
    //   }
    // } while (i++ < length);

    points.shift();
    setStyle(point);
    return length;
  }

  function animate() {
    if (!moveBox()) {
      active = false;
      return cancelAnimationFrame(requestID);
    }
    moveBox();
    requestID = requestAnimationFrame(animate);
  }

  function recordPoints() {
    points.push({ ...drag1.position });
    requestID2 = requestAnimationFrame(recordPoints);
  }

  function setStyle(_point: Position) {
    Object.assign(box2.style, {
      left: `${_point.x}px`,
      top: `${_point.y}px`,
    });
  }
});

function getDistance(point1: Position, point2: Position) {
  return Math.sqrt(
    Math.pow(Math.abs(point1.x - point2.x), 2) +
      Math.pow(Math.abs(point1.y - point2.y), 2)
  );
}

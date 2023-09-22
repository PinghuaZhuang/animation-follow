import Draggabilly, { Position } from "draggabilly";
import { debounce } from "lodash";
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
  let active = false;

  function moveBox() {
    active = true;
    const point = points[0];
    if (point == null) return false;
    const activePoint = drag1.position;
    const rect = box2.getBoundingClientRect();
    const staicPoint = { x: rect.left, y: rect.top };

    // 如果下一个位置靠的很近,就直接跳过
    if (isNear(staicPoint, point)) {
      points.shift();
      return moveBox();
    }

    const distance = getDistance(staicPoint, activePoint);

    // 如果当前位置里目标元素太近不移动
    if (distance <= OFFSET) {
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
    setStyle(box2, point);
    return true;
  }

  function animate() {
    if (!moveBox()) {
      active = false;
      return;
    }
    requestID = requestAnimationFrame(animate);
  }

  const action = debounce(
    () => {
      if (active) return;
      cancelAnimationFrame(requestID);
      animate();
    },
    100,
    {
      maxWait: 100,
    }
  );

  function recordPoints() {
    points.push({ ...drag1.position });
    requestID2 = requestAnimationFrame(recordPoints);
  }

  const handler = () => {
    action();
  };

  drag1.on("dragStart", () => {
    recordPoints();
    handler();
  });
  drag1.on("dragMove", handler);
  drag1.on("dragEnd", () => {
    requestAnimationFrame(() => cancelAnimationFrame(requestID2));
  });
});

function setStyle(target: HTMLElement, _point: Position) {
  Object.assign(target.style, {
    left: `${_point.x}px`,
    top: `${_point.y}px`,
  });
}

function getDistance(point1: Position, point2: Position) {
  return Math.sqrt(
    Math.pow(Math.abs(point1.x - point2.x), 2) +
      Math.pow(Math.abs(point1.y - point2.y), 2)
  );
}

function isNear(point1: Position, point2: Position) {
  return getDistance(point1, point2) < 1;
}

// function isEqualPoint(point1: Position, point2: Position) {
//   return (
//     Math.abs(point1.x - point2.x) <= 0.3 && Math.abs(point1.y - point2.y) <= 0.3
//   );
// }

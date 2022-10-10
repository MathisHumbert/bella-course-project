export let bodyScrollBar;

export function initSmoothScrollbar() {
  bodyScrollBar = Scrollbar.init(document.querySelector('#viewport'), {
    damping: 0.07,
  });

  // remove horizontal scrollbar
  bodyScrollBar.track.xAxis.element.remove();

  // Tell ScrollTrigger to use these proxy getter/setter methods for the "body" element:
  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
      if (arguments.length) {
        bodyScrollBar.scrollTop = value; // setter
      }
      return bodyScrollBar.scrollTop; // getter
    },
  });

  bodyScrollBar.addListener(ScrollTrigger.update);
}

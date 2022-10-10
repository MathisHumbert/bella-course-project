import { bodyScrollBar } from './smoothScrollbar.js';

export default function initScrollTo() {
  gsap.utils.toArray('.fixed-nav a').forEach((link) => {
    const target = link.getAttribute('href');
    link.addEventListener('click', (e) => {
      e.preventDefault();
      // gsap.to(window, {
      //   duration: 1.5,
      //   scrollTo: target,
      //   ease: 'power2.out',
      // }); without smool scrollbar
      bodyScrollBar.scrollIntoView(document.querySelector(target), {
        damping: 0.07,
        offsetTop: 100,
      });
    });
  });
}

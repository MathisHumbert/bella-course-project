export default function initNavigation() {
  const mainNavLinks = gsap.utils.toArray('.main-nav a');

  mainNavLinks.forEach((link) => {
    link.addEventListener('mouseleave', () => {
      link.classList.add('animate-out');
      setTimeout(() => {
        link.classList.remove('animate-out');
      }, 300);
    });
  });

  function navAnimation(direction) {
    return gsap.to(mainNavLinks, {
      duration: 0.3,
      stagger: {
        each: 0.05,
        from: direction === 1 ? 'start' : 'end',
      },
      autoAlpha: direction === 1 ? 0 : 1,
      y: direction === 1 ? 20 : 0,
      ease: 'power4.out',
    });
  }

  ScrollTrigger.create({
    start: '100',
    end: 'bottom bottom-=20',
    toggleClass: {
      targets: 'body',
      className: 'has-scrolled',
    },
    onEnter: ({ direction }) => navAnimation(direction),
    onLeaveBack: ({ direction }) => navAnimation(direction),
  });
}

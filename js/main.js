gsap.registerPlugin(ScrollTrigger);

function initNavigation() {
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

function initHeaderTilt() {
  document.querySelector('header').addEventListener('mousemove', moveImages);

  function moveImages(e) {
    const { offsetX, offsetY, target } = e;
    const { clientWidth, clientHeight } = target;

    // get 0 0 in the center,
    const xPos = offsetX / clientWidth - 0.5;
    const yPos = offsetY / clientHeight - 0.5;

    const leftImages = gsap.utils.toArray('.hg__left .hg__image');
    const rightImages = gsap.utils.toArray('.hg__right .hg__image');

    const modifier = (index) => index * 1.2 + 0.5;

    leftImages.forEach((image, index) => {
      gsap.to(image, {
        duration: 1.2,
        x: xPos * 20 * modifier(index),
        y: yPos * 30 * modifier(index),
        rotationY: xPos * 40,
        rotationX: xPos * 10,
        ease: 'power3.out',
      });
    });

    rightImages.forEach((image, index) => {
      gsap.to(image, {
        duration: 1.2,
        x: xPos * 20 * modifier(index),
        y: -yPos * 30 * modifier(index),
        rotationY: xPos * 40,
        rotationX: xPos * 10,
        ease: 'power3.out',
      });
    });

    gsap.to('.decor__circle', {
      duration: 1.7,
      x: 100 * xPos,
      y: 100 * yPos,
      ease: 'power4.out',
    });
  }
}

function init() {
  initNavigation();
  initHeaderTilt();
}

window.addEventListener('load', function () {
  init();
});

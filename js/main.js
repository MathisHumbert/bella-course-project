gsap.registerPlugin(ScrollTrigger);

/* 
======
NAVIGATION
======
*/
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

/* 
======
HEADER
======
*/
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

/* 
======
REVEAL GALLERY
======
*/
const sections = document.querySelectorAll('.rg__column');

function initHoverReveal() {
  sections.forEach((section) => {
    // to get access via target to this element in the createHoverReveal we point it to section
    section.imageBlock = section.querySelector('.rg__image');
    section.image = section.querySelector('.rg__image img');
    section.mask = section.querySelector('.rg__image--mask');
    section.text = section.querySelector('.rg__text');
    section.textCopy = section.querySelector('.rg__text--copy');
    section.textMask = section.querySelector('.rg__text--mask');
    section.textP = section.querySelector('.rg__text--copy p');

    gsap.set([section.imageBlock, section.textMask], { yPercent: -101 });
    gsap.set([section.mask, section.textP], { yPercent: 100 });
    gsap.set(section.image, { scale: 1.2 });

    section.addEventListener('mouseenter', createHoverReveal);
    section.addEventListener('mouseleave', createHoverReveal);
  });
}

function createHoverReveal(e) {
  const { imageBlock, mask, text, textCopy, textMask, textP, image } = e.target;

  const tl = gsap.timeline({
    defaults: {
      duration: 0.7,
      ease: 'power4.out',
    },
  });

  if (e.type === 'mouseenter') {
    tl.to([mask, imageBlock, textMask, textP], { yPercent: 0 })
      .to(
        text,
        {
          y: () => -textCopy.clientHeight / 2,
        },
        0
      )
      .to(image, { duration: 1.1, scale: 1 }, 0);
  } else {
    tl.to([mask, textP], { yPercent: 100 })
      .to([imageBlock, textMask], { yPercent: -101 }, 0)
      .to(text, { y: 0 }, 0)
      .to(image, { duration: 1.1, scale: 1.2 }, 0);
  }

  return tl;
}

/* 
======
PORTFOLIO HOVER
======
*/
function initPortfolioHover() {
  const allLinks = gsap.utils.toArray('.portfolio__categories a');
  const pageBackground = document.querySelector('.fill-background');
  const largeImage = document.querySelector('.portfolio__image--l');
  const smallImage = document.querySelector('.portfolio__image--s');
  const lInside = document.querySelector('.portfolio__image--l .image_inside');
  const sInside = document.querySelector('.portfolio__image--s .image_inside');

  allLinks.forEach((link) => {
    link.addEventListener('mouseenter', createPortoflioHover);
    link.addEventListener('mouseleave', createPortoflioHover);
    link.addEventListener('mousemove', createPortoflioMove);
  });

  function createPortoflioHover(e) {
    if (e.type == 'mouseenter') {
      const { color, imagelarge, imagesmall } = e.target.dataset;
      const allSiblings = allLinks.filter((item) => item !== e.target);

      const tl = gsap.timeline();
      tl.set(lInside, { backgroundImage: `url(${imagelarge})` })
        .set(sInside, { backgroundImage: `url(${imagesmall})` })
        .to([largeImage, smallImage], { duration: 1, autoAlpha: 1 })
        .to(allSiblings, { color: '#fff', autoAlpha: 0.2 }, 0)
        .to(e.target, { color: '#fff', autoAlpha: 1 }, 0)
        .to(pageBackground, { backgroundColor: color, ease: 'none' }, 0);
    } else {
      const tl = gsap.timeline();
      tl.to([largeImage, smallImage], { duration: 1, autoAlpha: 0 })
        .to(allLinks, { color: '#000', autoAlpha: 1 }, 0)
        .to(pageBackground, { backgroundColor: '#acb7ae', ease: 'none' }, 0);
    }
  }

  function createPortoflioMove(e) {
    const { clientY, clientX } = e;
    const imageY =
      document.querySelector('.portfolio__categories').clientHeight - clientY;
    // const imageX =
    //   document.querySelector('.portfolio__categories').clientWidth - clientX;

    gsap.to(largeImage, {
      duration: 1.2,
      y: -imageY / 6,
      // x: -imageX / 5,
      ease: 'power3.out',
    });

    gsap.to(smallImage, {
      duration: 1.5,
      y: -imageY / 3,
      // x: -imageX / 5,
      ease: 'power3.out',
    });
  }
}

/* 
======
INIT FUNCTION
======
*/
function init() {
  initNavigation();
  initHeaderTilt();
  initPortfolioHover();
}

/* 
======
HELPER FUNCTIONS
======
*/
function resetProps(elements) {
  // stop all tweens in progress
  gsap.killTweensOf('*');

  if (elements.length) {
    // doesn't work on tweens in progress
    elements.forEach(
      (element) => element && gsap.set(element, { clearProps: 'all' })
    );
  }
}

/* 
======
MEDIA QUERIES
======
*/
window.addEventListener('load', function () {
  init();
});

// define a breakpoint
const mq = window.matchMedia('(min-width: 768px)');

handleWidthChange(mq);

// add change listener to this breakpoint
mq.addListener(handleWidthChange);

function handleWidthChange(mq) {
  // on desktop
  if (mq.matches) {
    initHoverReveal();
  }
  // on mobile
  else {
    sections.forEach((section) => {
      section.removeEventListener('mouseenter', createHoverReveal);
      section.removeEventListener('mouseleave', createHoverReveal);

      const { imageBlock, mask, text, textCopy, textMask, textP, image } =
        section;
      resetProps([imageBlock, mask, text, textCopy, textMask, textP, image]);
    });
  }
}

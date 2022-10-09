gsap.registerPlugin(ScrollTrigger);
let bodyScrollBar;
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
PARALLAX IMAGES AND PIN STEPS
======
*/
function initImageParallax() {
  gsap.utils.toArray('.with-parallax').forEach((section) => {
    const image = section.querySelector('img');
    gsap.to(image, {
      yPercent: 20,
      // top: '20%'
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        scrub: 1,
      },
    });
  });
}

function initPinSteps() {
  ScrollTrigger.create({
    trigger: '.fixed-nav',
    start: 'top center',
    endTrigger: '#stage4',
    end: 'center center',
    pin: true,
    pinReparent: true, // to make sure it works with smooth scroll
  });

  const navLinks = gsap.utils.toArray('.fixed-nav li');

  const getVh = () => {
    const vh = Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    );
    return vh;
  };

  const updateBodyColor = (color) => {
    // using gsap
    // gsap.to('.fill-background', { backgroundColor: color, ease: 'none' });

    document.documentElement.style.setProperty('--bcg-fill-color', color);
  };

  gsap.utils.toArray('.stage').forEach((stage, index) => {
    ScrollTrigger.create({
      trigger: stage,
      start: 'top center',
      // function base value that update when ScrollTrigger refresh
      end: () => `+=${stage.clientHeight + getVh() / 10}`,
      toggleClass: {
        targets: navLinks[index],
        className: 'is-active',
      },
      onEnter: () => updateBodyColor(stage.dataset.color),
      onEnterBack: () => updateBodyColor(stage.dataset.color),
    });
  });

  ScrollTrigger.create({
    trigger: '#stage1',
    start: 'top center',
    end: 'top center',
    onLeaveBack: () => updateBodyColor('#acb7ae'),
  });
}

function initScrollTo() {
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

/* 
======
SMOOTH SCROOLING USING SMOOTH SCROLLBAR
======
*/
function initSmoothScrollbar() {
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

/* 
======
LOADER
======
*/
const loader = document.querySelector('.loader');
const loaderInner = document.querySelector('.loader .inner');
const progressBar = document.querySelector('.loader .progress');
const loaderMask = document.querySelector('.loader__mask');

// show loader on page
gsap.set(loader, { autoAlpha: 1 });

// scale loader down
gsap.set(loaderInner, { scaleY: 0.005, transformOrigin: 'bottom' });

// make a tween taht scales the loader
const progressTween = gsap.to(progressBar, {
  scaleX: 0,
  ease: 'none',
  transformOrigin: 'right',
  paused: true,
});

// setup variables
let loadedImageCount = 0;
let imageCount;
const container = document.querySelector('#main');

// seup Images loaded
const imgLoaded = imagesLoaded(container);
imageCount = imgLoaded.images.length;

// set the nitial progress to 0
updateProgress(0);

// tirggered after each item is loaded
imgLoaded.on('progress', () => {
  // increase the number of loaded images
  loadedImageCount++;

  // update progress
  updateProgress(loadedImageCount);
});

//  do whatever you want when all images are loaded
imgLoaded.on('done', () => {
  // init loader animation onComplete
  gsap.set(progressTween, { autoAlpha: 0, onComplete: initPageTransitions });
});

function updateProgress(value) {
  gsap.to(progressTween, {
    progress: value / imageCount,
    duration: 0.3,
    ease: 'power1.out',
  });
}

function initLoader() {
  const tlLoader = gsap.timeline();
  const tlLoaderIn = gsap.timeline({
    defaults: { duration: 1.1, ease: 'power2.out' },
    onComplete: () =>
      document.querySelector('body').classList.remove('is-loading'),
  });
  const tlLoaderOut = gsap.timeline({
    defaults: { duration: 1.2, ease: 'power2.inOut' },
    delay: 1,
  });

  const image = document.querySelector('.loader__image img');
  const mask = document.querySelector('.loader__image--mask');
  const line1 = document.querySelector(
    '.loader__title--mask:nth-child(1) span'
  );
  const line2 = document.querySelector(
    '.loader__title--mask:nth-child(2) span'
  );
  const lines = document.querySelectorAll('.loader__title--mask');
  const loader = document.querySelector('.loader');
  const loaderContent = document.querySelector('.loader__content');

  tlLoaderIn
    .set([loader, loaderContent], { autoAlpha: 1 })
    .to(
      loaderInner,
      { scaleY: 1, transformOrigin: 'bottom', ease: 'power2.inOut' },
      0.2
    )
    .addLabel('revealImage')
    .from(mask, { yPercent: 100 }, 'revealImage-=0.6')
    .from(image, { yPercent: -50 }, 'revealImage-=0.6')
    .from([line1, line2], { yPercent: 100, stagger: 0.1 }, 'revealImage-=0.4');

  tlLoaderOut
    .to(lines, { yPercent: -400, stagger: 0.2 })
    .to([loader, loaderContent], { yPercent: -100 }, 0)
    .from('#main', { y: 150 }, 0);

  tlLoader.add(tlLoaderIn).add(tlLoaderOut);
}

/* 
======
PAGE TRANSITION
======
*/

function initPageTransitions(params) {
  // do something before the transition starts
  barba.hooks.before(() => {
    document.querySelector('html').classList.add('is-transitioning');
  });

  // do something after the transition finishes
  barba.hooks.after(() => {
    document.querySelector('html').classList.remove('is-transitioning');
  });

  // scroll to the top of the page
  barba.hooks.enter(() => {
    window.scrollTo(0, 0);
  });

  barba.init({
    transitions: [
      {
        once() {
          // go something once on the initial page load
          initLoader();
        },
        async leave({ current }) {
          // animate loading screen in
          await pageTransitionIn(current);
        },
        enter({ next }) {
          // animate loading screen away
          pageTransitionOut(next);
        },
      },
    ],
  });
}

function pageTransitionIn({ container }) {
  console.log('pageTransitionIn');
  const tl = gsap.timeline({
    defaults: {
      duration: 0.7,
      ease: 'power1.inOut',
    },
  });
  tl.set(loaderInner, { autoAlpha: 0 })
    .fromTo(loader, { yPercent: -100 }, { yPercent: 0 })
    .fromTo(loaderMask, { yPercent: 80 }, { yPercent: 0 }, 0)
    .to(container, { y: 150 }, 0);

  return tl;
}

function pageTransitionOut({ container }) {
  console.log('pageTransitionOut');
  const tl = gsap.timeline({
    defaults: {
      duration: 0.7,
      ease: 'power1.inOut',
    },
  });
  tl.to(loader, { yPercent: 100 })
    .to(loaderMask, { yPercent: -80 }, 0)
    .from(container, { y: -150 }, 0);

  return tl;
}

/* 
======
INIT FUNCTION
======
*/
function init() {
  initSmoothScrollbar();
  initNavigation();
  initHeaderTilt();
  initPortfolioHover();
  initImageParallax();
  initPinSteps();
  initScrollTo();
}

window.addEventListener('load', function () {
  init();
});

/* 
======
SMOOTH SCROOLING USING GSAP
======
*/
// let container = document.querySelector('#scroll-container');
// let height;

// function setHeight() {
//   height = container.clientHeight;
//   document.body.style.height = `${height}px`;
// }

// // this code will run BEFORE the refresh == on the first page load
// ScrollTrigger.addEventListener('refreshInit', setHeight);

// // gsap smooth scrolling
// gsap.to(container, {
//   y: () => -(height - document.documentElement.clientHeight),
//   ease: 'none',
//   scrollTrigger: {
//     trigger: document.body,
//     start: 'top top',
//     end: 'bottom bottom',
//     scrub: 1,
//     invalidateOnRefresh: true,
//   },
// });

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

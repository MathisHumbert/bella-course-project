import { initSmoothScrollbar } from './content/smoothScrollbar.js';
import initScrollTo from './content/scrollTo.js';
import initNavigation from './content/navigation.js';
import initHeaderTilt from './content/headerTitl.js';
import { initHoverReveal, createHoverReveal } from './content/hoverReveal.js';
import initPortfolioHover from './content/portfolioHover.js';
import initImageParallax from './content/imageParallax.js';
import initPinSteps from './content/pinSteps.js';

gsap.registerPlugin(ScrollTrigger);

// define a breakpoint
const mq = window.matchMedia('(min-width: 768px)');

const loader = document.querySelector('.loader');
const loaderInner = document.querySelector('.loader .inner');
const progressBar = document.querySelector('.loader .progress');
const loaderMask = document.querySelector('.loader__mask');
const sections = document.querySelectorAll('.rg__column');

// show loader on page
function init() {
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
}

init();

function pageTransitionIn({ container }) {
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
  const tl = gsap.timeline({
    defaults: {
      duration: 0.7,
      ease: 'power1.inOut',
    },
    onComplete: () => initContent(),
  });
  tl.to(loader, { yPercent: 100 })
    .to(loaderMask, { yPercent: -80 }, 0)
    .from(container, { y: -150 }, 0);

  return tl;
}

function initPageTransitions() {
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

function initLoader() {
  const tlLoader = gsap.timeline();
  const tlLoaderIn = gsap.timeline({
    defaults: { duration: 1.1, ease: 'power2.out' },
    onComplete: () => initContent(),
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

function initContent() {
  document.querySelector('body').classList.remove('is-loading');
  initSmoothScrollbar();
  initNavigation();
  initHeaderTilt();
  handleWidthChange(mq);
  initPortfolioHover();
  initImageParallax();
  initPinSteps();
  initScrollTo();
}

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
  // gsap.killTweensOf('*');

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

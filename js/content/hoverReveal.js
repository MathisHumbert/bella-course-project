const sections = document.querySelectorAll('.rg__column');

export function initHoverReveal() {
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

export function createHoverReveal(e) {
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

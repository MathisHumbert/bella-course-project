export default function initPortfolioHover() {
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

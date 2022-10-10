export default function initImageParallax() {
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

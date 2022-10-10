export default function initPinSteps() {
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
    console.log(color);
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

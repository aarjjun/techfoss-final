import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded",()=>{
    console.log("Script is executing...");

    
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time)=>{
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    const cards = gsap.utils.toArray(".card");
    const rotation = [-12,10,-5,5,-5,-2];

    cards.forEach((card,index)=>{
      gsap.set(card,{
        y: window.innerHeight,
        rotate: rotation[index]
      })
    })

    ScrollTrigger.create({
      trigger: ".sticky-cards",
      start: "top top",
      end: `+=${window.innerHeight * 8}`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
   
      onUpdate: (self)=>{
        const progress = self.progress;
        const totalCards = cards.length;
        const progressPerCard = 1 / totalCards;

        cards.forEach((card,index)=>{
          const cardStart = progressPerCard * index;
          let cardProgress = (progress - cardStart) / progressPerCard;
          cardProgress = Math.min(Math.max(cardProgress,0),1);

          let yPos = window.innerHeight * (1-cardProgress);
          let xPos = 0;

          if ( cardProgress === 1 && index < totalCards - 1){
            const remainingProgress = (progress - (cardStart + progressPerCard)) / (1 - (cardStart + progressPerCard));


            if (remainingProgress > 0){
              const distanceMultiplier = 1 - index * 0.5;

              xPos = -window.innerWidth *0.3 * distanceMultiplier * remainingProgress;
              yPos = -window.innerHeight * 0.3 * distanceMultiplier * remainingProgress;
            }
          }

          gsap.to(card,{
            y: yPos,
            x: xPos,
            duration: 0.5,
            ease: "none",
          })
        })
      }
    })


    
  })
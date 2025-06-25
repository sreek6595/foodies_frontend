import React, { useEffect } from 'react';

const Statssection = () => {
  useEffect(() => {
    // Adding functionality for purecounter
    const counters = document.querySelectorAll('.purecounter');
    counters.forEach((counter) => {
      const updateCounter = () => {
        const target = +counter.getAttribute('data-purecounter-end');
        const duration = +counter.getAttribute('data-purecounter-duration');
        let start = +counter.getAttribute('data-purecounter-start') || 0;
        const step = (target - start) / duration;

        const counterInterval = setInterval(() => {
          start += step;
          if (start >= target) {
            counter.innerText = target;
            clearInterval(counterInterval);
          } else {
            counter.innerText = Math.ceil(start);
          }
        }, 1000 / 60); // Update the counter every frame
      };
      updateCounter();
    });
  }, []);

  return (
    <section id="stats" className="bg-dark py-16 relative">
      <img
        src="public/stats-bg.jpg"
        alt="Background"
        className="absolute inset-0 object-cover w-full h-full opacity-100"
        data-aos="fade-in"
      />
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Stats Item 1
          <div className="stats-item text-center w-full h-full" data-aos="fade-up" data-aos-delay="100">
            <span
              className="purecounter text-4xl font-bold text-white block"
              data-purecounter-start="0"
              data-purecounter-end="232"
              data-purecounter-duration="1"
            ></span>
            <p className="text-white">Clients</p>
          </div> */}
          {/* Stats Item 2

          <div className="stats-item text-center w-full h-full" data-aos="fade-up" data-aos-delay="200">
            <span
              className="purecounter text-4xl font-bold text-white block"
              data-purecounter-start="0"
              data-purecounter-end="521"
              data-purecounter-duration="1"
            ></span>
            <p className="text-white">Projects</p>
          </div> */}
          {/* Stats Item 3
          <div className="stats-item text-center w-full h-full" data-aos="fade-up" data-aos-delay="300">
            <span
              className="purecounter text-4xl font-bold text-white block"
              data-purecounter-start="0"
              data-purecounter-end="1453"
              data-purecounter-duration="1"
            ></span>
            <p className="text-white">Hours Of Support</p>
          </div> */}
          {/* Stats Item 4
          <div className="stats-item text-center w-full h-full" data-aos="fade-up" data-aos-delay="400">
            <span
              className="purecounter text-4xl font-bold text-white block"
              data-purecounter-start="0"
              data-purecounter-end="32"
              data-purecounter-duration="1"
            ></span>
            <p className="text-white">Workers</p>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default Statssection;

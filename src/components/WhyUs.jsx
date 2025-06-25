import React from 'react';

const WhyUs = () => {
  return (
    <>
      {/* Why Us Section */}
      <section id="why-us" className="bg-light py-16">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Why Choose Yummy */}
            <div className="bg-white shadow-lg rounded-lg p-6 md:w-1/3" data-aos="fade-up" data-aos-delay="100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Foodies Corner</h3>
              <p className="text-gray-700 mb-6">
              </p>
              <div className="text-center">
                <a href="#" className="text-red-500 font-semibold hover:text-red-700 flex items-center justify-center">
                  <span></span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Icon Boxes */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Icon Box 1 */}
              <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center" data-aos="fade-up" data-aos-delay="200">
                <i className="bi bi-clipboard-data text-red-500 text-3xl mb-4" />
                <h4 className="text-lg font-semibold">🍽️ Wide Range of Cuisines
                </h4>
                <p className="text-gray-600 mt-2">From local delights to international flavors, explore a diverse menu that caters to every craving.</p>
              </div>
              {/* Icon Box 2 */}
              <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center" data-aos="fade-up" data-aos-delay="300">
                <i className="bi bi-gem text-red-500 text-3xl mb-4" />
                <h4 className="text-lg font-semibold">⚡ Seamless Ordering Process</h4>
                <p className="text-gray-600 mt-2">Enjoy an intuitive, user-friendly interface that makes browsing, ordering, and tracking food quick and easy.</p>
              </div>
              {/* Icon Box 3 */}
              <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center" data-aos="fade-up" data-aos-delay="400">
                <i className="bi bi-inboxes text-red-500 text-3xl mb-4" />
                <h4 className="text-lg font-semibold">🚚 Real-Time Order Tracking</h4>
                <p className="text-gray-600 mt-2">Stay informed every step of the way with live tracking for your orders-know exactly when your food will arrive.</p>
              </div>
              {/* Icon Box 4 */}
              <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center" data-aos="fade-up" data-aos-delay="400">
                <i className="bi bi-inboxes text-red-500 text-3xl mb-4" />
                <h4 className="text-lg font-semibold">🤝 Support for Local Businesses</h4>
                <p className="text-gray-600 mt-2">By ordering through Foodies Corner, you're helping local restaurants grow and thrive.</p>
              </div>
              {/* Icon Box 5 */}
              <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center" data-aos="fade-up" data-aos-delay="400">
                <i className="bi bi-inboxes text-red-500 text-3xl mb-4" />
                <h4 className="text-lg font-semibold">🎯 Commitment to Quality</h4>
                <p className="text-gray-600 mt-2">We’re dedicated to delivering top-notch service, fresh food, and a reliable experience every time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="bg-dark py-16">
        <img src="assets/img/stats-bg.jpg" alt="Stats Background" className="absolute inset-0 object-cover w-full h-full opacity-30" data-aos="fade-in" />
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Stats Item 1 */}
            <div className="stats-item text-center w-full h-full" data-aos="fade-up" data-aos-delay="100">
              <span className="text-4xl font-bold text-white block">232</span>
              <p className="text-white">Clients</p>
            </div>
            {/* Stats Item 2 */}
            <div className="stats-item text-center w-full h-full" data-aos="fade-up" data-aos-delay="200">
              <span className="text-4xl font-bold text-white block">521</span>
              <p className="text-white">Projects</p>
            </div>
            {/* Stats Item 3 */}
            <div className="stats-item text-center w-full h-full" data-aos="fade-up" data-aos-delay="300">
              <span className="text-4xl font-bold text-white block">1453</span>
              <p className="text-white">Hours Of Support</p>
            </div>
            {/* Stats Item 4 */}
            <div className="stats-item text-center w-full h-full" data-aos="fade-up" data-aos-delay="400">
              <span className="text-4xl font-bold text-white block">32</span>
              <p className="text-white">Workers</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WhyUs;

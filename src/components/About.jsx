import { CheckCircle, PlayCircle } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="bg-white py-16">
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900">About Us</h2>
          <p className="text-lg text-gray-600">
            <span className="font-semibold text-red-500">Learn More</span> About Us
          </p>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left Side */}
          <div className="md:w-2/3">
            <img src="public/about.jpg" alt="About Us" className="rounded-lg shadow-lg w-full mb-6" />
            {/* <div className="bg-red-500 text-white text-center py-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">Book a Table</h3>
              <p className="text-lg">+1 5589 55488 55</p>
            </div> */}
          </div>

          {/* Right Side */}
          <div className="md:w-1/3 text-gray-700">
            <p className="italic mb-4">
            Welcome to Foodie’s Corner, where passion for food meets culinary excellence! We are dedicated to bringing you the finest flavors, handcrafted with love and the freshest ingredients.

At Foodie’s Corner, we believe that great food is more than just a meal—it’s an experience. Whether you’re craving comforting classics or exploring bold, innovative dishes, our menu is designed to delight every palate.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center">
                <CheckCircle className="text-green-500 mr-2" />
                Founded with a love for great food and hospitality.
              </li>
              <li className="flex items-center">
                <CheckCircle className="text-green-500 mr-2" />
                Passion for Food: At Foodies Corner, we are driven by a deep love for food and a desire to bring unique culinary experiences to our community.

</li>
              <li className="flex items-center">
                <CheckCircle className="text-green-500 mr-2" />
                Connecting Food Enthusiasts: We bridge the gap between passionate food lovers and local restaurants, creating a vibrant hub for discovering, ordering, and enjoying great food.              </li>
            </ul>
            

            {/* Video Play Button */}
            <div className="relative mt-6">
              <img src="public/about-2.jpg" alt="Video Thumbnail" className="rounded-lg shadow-lg w-full" />
              <a
                href="https://youtu.be/L5GQdVFGMBQ?si=tX5XBmfhaRVpIQwl"
                className="absolute inset-0 flex items-center justify-center text-red-500 hover:text-red-700 transition"
              >
                <PlayCircle size={50} className="bg-white rounded-full p-2 shadow-lg" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

import { PlayCircle } from "lucide-react";
import { motion } from "framer-motion";

const Herosection = () => {
  // Function to open YouTube video in a new tab
  const handleWatchVideo = () => {
    const newTab = window.open("https://www.youtube.com/watch?v=iQK82jQj3Bk", "_blank");
    if (!newTab) {
      alert("Pop-up blocked! Please allow pop-ups for this site.");
    }
  };

  return (
    <section id="hero" className="bg-gray-100 py-16">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8">
          {/* Left Content */}
          <div className="text-center md:text-left md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Enjoy Your Healthy<br />Delicious Food
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              We are the right choice for that.
            </p>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
              {/* <a
                href="#book-a-table"
                className="bg-red-500 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-red-600 transition"
              >
                Book a Table
              </a> */}
              {/* <button
                onClick={handleWatchVideo}
                className="flex items-center text-red-500 text-lg font-medium hover:text-red-600 transition"
              >
                <PlayCircle size={28} className="mr-2" />
                Watch Video
              </button> */}
            </div>
          </div>

          {/* Right Image with Floating Animation and No Background */}
          <motion.div
            className="md:w-1/2 flex justify-center"
            animate={{ y: [0, -15, 0] }} // Moves up and down
            transition={{
              duration: 3,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            <img
              src="/hero-img.png"
              alt="Delicious Food"
              className="w-full max-w-md mx-auto md:max-w-none"
              style={{ background: "transparent" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Herosection;

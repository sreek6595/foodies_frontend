const Footer = () => {
    return (
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
            {/* Address */}
            <div className="flex items-start space-x-3">
              <i className="bi bi-geo-alt text-2xl text-blue-400"></i>
              <div>
                <h4 className="text-lg font-semibold">Address</h4>
                <p>A108 Adam Street</p>
                <p>New York, NY 535022</p>
              </div>
            </div>
  
            {/* Contact */}
            <div className="flex items-start space-x-3">
              <i className="bi bi-telephone text-2xl text-blue-400"></i>
              <div>
                <h4 className="text-lg font-semibold">Contact</h4>
                <p>
                  <strong>Phone:</strong> +1 5589 55488 55
                </p>
                <p>
                  <strong>Email:</strong> info@example.com
                </p>
              </div>
            </div>
  
            {/* Opening Hours */}
            <div className="flex items-start space-x-3">
              <i className="bi bi-clock text-2xl text-blue-400"></i>
              <div>
                <h4 className="text-lg font-semibold">Opening Hours</h4>
                <p>
                  <strong>Mon-Sat:</strong> 11AM - 11PM
                </p>
                <p>
                  <strong>Sunday:</strong> Closed
                </p>
              </div>
            </div>
  
            {/* Social Links */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Follow Us</h4>
              <div className="flex space-x-4">
                {[
                  { icon: "bi-twitter-x", link: "#" },
                  { icon: "bi-facebook", link: "#" },
                  { icon: "bi-instagram", link: "#" },
                  { icon: "bi-linkedin", link: "#" },
                ].map((social, index) => (
                  <a key={index} href={social.link} className="text-xl text-blue-400 hover:text-blue-500">
                    <i className={`bi ${social.icon}`}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>
  
          {/* Copyright */}
          <div className="text-center mt-6 border-t border-gray-700 pt-4 text-sm">
            <p>
              © <strong className="px-1">Yummy</strong> All Rights Reserved
            </p>
            <p>
              Designed by{" "}
              <a href="https://bootstrapmade.com/" className="text-blue-400 hover:underline">
                BootstrapMade
              </a>{" "}
              Distributed by{" "}
              <a href="https://themewagon.com" className="text-blue-400 hover:underline">
                ThemeWagon
              </a>
            </p>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  
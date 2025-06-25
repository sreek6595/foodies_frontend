import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState({ loading: false, message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: "" });

    try {
      // Simulating API call
      setTimeout(() => {
        setStatus({ loading: false, message: "Your message has been sent. Thank you!" });
        setFormData({ name: "", email: "", subject: "", message: "" });
      }, 1500);
    } catch (error) {
      setStatus({ loading: false, message: "Something went wrong. Try again." });
    }
  };

  return (
    <section id="contact" className="py-12 bg-gray-100">
      {/* Section Title */}
      <div className="container mx-auto text-center mb-8">
        <h2 className="text-3xl font-bold">Contact</h2>
        <p className="text-lg text-gray-700">
          <span className="font-semibold">Need Help?</span> <span className="text-blue-500">Contact Us</span>
        </p>
      </div>

      {/* Google Map */}
      <div className="container mx-auto mb-8">
        <iframe
          className="w-full h-96 rounded-lg shadow-lg"
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12097.433213460943!2d-74.0062269!3d40.7101282!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xb89d1fe6bc499443!2sDowntown+Conference+Center!5e0!3m2!1sen!2sus!4v1539943755621"
          frameBorder="0"
          allowFullScreen=""
        ></iframe>
      </div>

      {/* Contact Details */}
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[
          { icon: "bi-geo-alt", title: "Address", text: "Downtown. Conference Center 157 William St, New York, NY 10038" },
          { icon: "bi-telephone", title: "Call Us", text: "8304965128" },
          { icon: "bi-envelope", title: "Email Us", text: "info@example.com" },
          { icon: "bi-clock", title: "Opening Hours", text: "Mon-Sat: 11AM - 11PM; Sunday: Closed" },
        ].map((item, index) => (
          <div key={index} className="flex items-center bg-white p-4 rounded-lg shadow-md">
            <i className={`bi ${item.icon} text-blue-500 text-3xl mr-4`}></i>
            <div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-gray-600">{item.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Form */}
      
    </section>
  );
};

export default Contact;

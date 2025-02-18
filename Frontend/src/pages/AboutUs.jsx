import React from "react";
import { Car, Shield, MapPin, Users, Target, Clock, CreditCard, Leaf, Phone, Mail, ArrowLeft } from "lucide-react";

function AboutUs() {
  // Data arrays for stats and features
  const stats = [
    { icon: Car, value: "100M+", label: "Rides Completed" },
    { icon: Users, value: "4.9/5", label: "Average Rating" },
    { icon: MapPin, value: "100+", label: "cOUNTRIES Covered" },
    { icon: Shield, value: "1000+", label: "Verified Drivers" },
  ];

  const features = [
    {
      icon: Shield,
      title: "Safety First",
      description: "Comprehensive safety measures and 24/7 support for peace of mind",
    },
    {
      icon: Users,
      title: "Verified Captains",
      description: "Thoroughly vetted and trained professional drivers",
    },
    {
      icon: Clock,
      title: "Real-time Tracking",
      description: "Monitor your ride in real-time with precise GPS tracking",
    },
    {
      icon: CreditCard,
      title: "Affordable Prices",
      description: "Competitive rates with transparent pricing",
    },
    {
      icon: Leaf,
      title: "Eco-friendly",
      description: "Committed to reducing carbon footprint",
    },
    {
      icon: Target,
      title: "Smart Matching",
      description: "Advanced algorithms for optimal driver-passenger matching",
    },
  ];

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-16 md:py-24">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80')] mix-blend-overlay opacity-20 bg-cover bg-center"></div>
        
        {/* Back Button */}
        <button 
          onClick={handleBack}
          className="absolute top-6 left-6 z-20 flex items-center space-x-2 text-white hover:text-blue-200 transition-colors duration-300 bg-blue-800/50 px-4 py-2 rounded-full backdrop-blur-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-blue-200 via-white to-blue-200 text-transparent bg-clip-text font-sans">
            About Us
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-blue-100 to-blue-50 text-transparent bg-clip-text">
            Revolutionizing Urban Mobility
          </h2>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto px-4 text-blue-50 font-light">
            Connect with a community of millions of DriveSphere users experiencing safe and comfortable rides every day.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-blue-50 rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
              <stat.icon className="w-10 h-10 md:w-12 md:h-12 text-blue-600 mx-auto mb-4" strokeWidth={1.5} />
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{stat.value}</h3>
              <p className="text-sm md:text-base text-gray-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-gradient-to-b from-gray-50 to-blue-50 py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 text-transparent bg-clip-text">
            Our Mission
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto px-4 leading-relaxed font-light">
            To transform urban transportation by providing safe, reliable, and sustainable mobility solutions that connect people and communities worldwide.
          </p>
        </div>
      </div>

      {/* Why Choose Section */}
      <div className="container mx-auto px-4 py-16 md:py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 text-transparent bg-clip-text">
          Why Choose DriveSphere
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-blue-50 rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
              <feature.icon className="w-10 h-10 text-blue-600 mb-4" strokeWidth={1.5} />
              <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gradient-to-t from-gray-50 to-blue-50 py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 text-transparent bg-clip-text">
            Get in Touch
          </h2>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-12">
            <div className="flex items-center bg-blue-50 px-6 py-4 rounded-full shadow-md hover:shadow-lg transition-shadow">
              <Mail className="w-6 h-6 text-blue-600 mr-3" strokeWidth={1.5} />
              <span className="text-lg font-medium text-gray-800">support@driversphere.com</span>
            </div>
            <div className="flex items-center bg-blue-50 px-6 py-4 rounded-full shadow-md hover:shadow-lg transition-shadow">
              <Phone className="w-6 h-6 text-blue-600 mr-3" strokeWidth={1.5} />
              <span className="text-lg font-medium text-gray-800">+91-9999057399</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center border-t border-gray-200 py-8 bg-white">
        <p className="text-sm text-gray-600 mb-4">© 2025 DriveSphere Rides. All rights reserved.</p>
        <div className="flex justify-center items-center space-x-6 text-sm">
          <a href="/privacy-policy" className="text-blue-600 hover:text-blue-800 transition-colors font-medium">
            Privacy Policy
          </a>
          <span className="text-gray-300">•</span>
          <a href="/terms-of-service" className="text-blue-600 hover:text-blue-800 transition-colors font-medium">
            Terms of Service
          </a>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;

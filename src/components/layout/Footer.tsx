import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram,
  Youtube,
  Clock,
  Shield,
  Award,
  Users,
  Ambulance,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <footer className="relative bg-gradient-to-br from-blue-50 via-white to-cyan-50 text-gray-800 overflow-hidden border-t border-gray-200">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Trust Indicators */}
        <div className="border-b border-gray-200">
          <div className="px-4 md:px-6 lg:px-8 py-8">
            <motion.div 
              className="grid md:grid-cols-4 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div 
                className="flex items-center space-x-3"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <Shield className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">100% Secure</p>
                  <p className="text-sm text-gray-600">SSL Encrypted</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-center space-x-3"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Award className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Certified Platform</p>
                  <p className="text-sm text-gray-600">NABH Approved</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-center space-x-3"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Users className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">10,000+ Patients</p>
                  <p className="text-sm text-gray-600">Trusted by Nabha</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-center space-x-3"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <div className="p-3 bg-red-500/20 rounded-lg">
                  <Ambulance className="h-6 w-6 text-red-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">24/7 Emergency</p>
                  <p className="text-sm text-gray-600">Always Available</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="px-4 md:px-6 lg:px-8 py-16">
          <motion.div 
            className="grid md:grid-cols-4 gap-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Brand Section */}
            <motion.div className="space-y-6" variants={itemVariants}>
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 10, 0],
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                  className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl"
                >
                  <Heart className="h-8 w-8 text-white" fill="currentColor" />
                </motion.div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">TeleMed</h3>
                  <p className="text-sm text-gray-600">HealthBridge Nabha</p>
                </div>
              </div>
              <p className="text-gray-700">
                Bridging healthcare gaps with technology. Your trusted partner for quality healthcare services in Nabha and surrounding areas.
              </p>
              <div className="flex space-x-3">
                <motion.div whileHover={{ scale: 1.2, rotate: 360 }} transition={{ duration: 0.3 }}>
                  <Button size="icon" variant="outline" className="border-gray-300 hover:bg-gray-100 text-gray-700">
                    <Facebook className="h-4 w-4" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.2, rotate: 360 }} transition={{ duration: 0.3 }}>
                  <Button size="icon" variant="outline" className="border-white/20 hover:bg-white/10">
                    <Twitter className="h-4 w-4" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.2, rotate: 360 }} transition={{ duration: 0.3 }}>
                  <Button size="icon" variant="outline" className="border-white/20 hover:bg-white/10">
                    <Instagram className="h-4 w-4" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.2, rotate: 360 }} transition={{ duration: 0.3 }}>
                  <Button size="icon" variant="outline" className="border-white/20 hover:bg-white/10">
                    <Youtube className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div className="space-y-4" variants={itemVariants}>
              <h4 className="text-lg font-semibold text-gray-800">Quick Links</h4>
              <ul className="space-y-3">
                {['About Us', 'Our Services', 'Find Doctors', 'Book Appointment', 'Health Blog', 'Career'].map((link, index) => (
                  <motion.li 
                    key={link}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-2">
                      <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                      <span>{link}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Services */}
            <motion.div className="space-y-4" variants={itemVariants}>
              <h4 className="text-lg font-semibold text-gray-800">Our Services</h4>
              <ul className="space-y-3">
                {['Video Consultation', 'Online Pharmacy', 'Lab Tests', 'Health Records', 'Emergency Services', 'Health Insurance'].map((service, index) => (
                  <motion.li 
                    key={service}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-2">
                      <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                      <span>{service}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div className="space-y-4" variants={itemVariants}>
              <h4 className="text-lg font-semibold text-gray-800">Contact Us</h4>
              <div className="space-y-4">
                <motion.div 
                  className="flex items-start space-x-3"
                  whileHover={{ scale: 1.05 }}
                >
                  <MapPin className="h-5 w-5 text-blue-400 mt-1" />
                  <div>
                    <p className="text-gray-600">Civil Hospital Road,</p>
                    <p className="text-gray-600">Nabha, Punjab 147201</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center space-x-3"
                  whileHover={{ scale: 1.05 }}
                >
                  <Phone className="h-5 w-5 text-blue-400" />
                  <p className="text-gray-600">+91 1765-XXXXXX</p>
                </motion.div>
                
                <motion.div 
                  className="flex items-center space-x-3"
                  whileHover={{ scale: 1.05 }}
                >
                  <Mail className="h-5 w-5 text-blue-400" />
                  <p className="text-gray-600">support@telemed-nabha.in</p>
                </motion.div>
                
                <motion.div 
                  className="flex items-center space-x-3"
                  whileHover={{ scale: 1.05 }}
                >
                  <Clock className="h-5 w-5 text-blue-400" />
                  <p className="text-gray-600">24/7 Available</p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* App Download Section */}
        <div className="border-t border-gray-200">
          <div className="px-4 md:px-6 lg:px-8 py-8">
            <motion.div 
              className="flex flex-col md:flex-row items-center justify-between"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <Smartphone className="h-8 w-8 text-blue-400" />
                <div>
                  <p className="font-semibold text-gray-800">Download Our App</p>
                  <p className="text-sm text-gray-600">Available on Android & iOS</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.09l-.05-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                    </svg>
                    App Store
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 20.5v-17c0-.83.67-1.5 1.5-1.5H18c.83 0 1.5.67 1.5 1.5v17c0 .83-.67 1.5-1.5 1.5H4.5c-.83 0-1.5-.67-1.5-1.5zM6.5 18h11v-13h-11v13zm2.5-6.5l2.5 3.15L14.5 11l4 5h-12l2-2.5z"/>
                    </svg>
                    Google Play
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200">
          <div className="px-4 md:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
              <p>© {currentYear} TeleMed HealthBridge. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-blue-600 transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
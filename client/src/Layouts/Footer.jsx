import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const FooterLink = ({ to, children }) => (
  <Link
    to={to}
    className="text-sm text-white hover:text-gray-200 transition-colors duration-300 block py-1 font-semibold"
  >
    {children}
  </Link>
);

const SocialIcon = ({ Icon, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition-all duration-300"
  >
    <Icon size={18} />
  </a>
);

const ContactItem = ({ Icon, children }) => (
  <div className="flex items-center space-x-3 text-white">
    <Icon size={16} className="text-white" />
    <span className="text-sm font-semibold">{children}</span>
  </div>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-red-600 text-white rounded-t-3xl border-t font-inter">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">PRIMETIME LIMITED</h2>
              <p className="mt-2 text-sm font-light text-white leading-relaxed">
                Your trusted partner in premium automotive and electronics. 
                Delivering quality products and exceptional service since 2010.
              </p>
            </div>
            <div className="flex space-x-4">
              <SocialIcon Icon={FaTwitter} href="https://twitter.com" />
              <SocialIcon Icon={FaFacebookF} href="https://facebook.com" />
              <SocialIcon Icon={FaInstagram} href="https://instagram.com" />
              <SocialIcon Icon={FaLinkedinIn} href="https://linkedin.com" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <nav className="space-y-1">
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/products">Our Products</FooterLink>
              <FooterLink to="/services">Services</FooterLink>
              <FooterLink to="/contact">Contact Us</FooterLink>
              <FooterLink to="/blog">Blog & News</FooterLink>
              <FooterLink to="/careers">Careers</FooterLink>
            </nav>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Customer Service</h3>
            <nav className="space-y-1">
              <FooterLink to="/shipping">Shipping Information</FooterLink>
              <FooterLink to="/returns">Returns & Refunds</FooterLink>
              <FooterLink to="/warranty">Warranty Policy</FooterLink>
              <FooterLink to="/faq">FAQ</FooterLink>
              <FooterLink to="/terms">Terms & Conditions</FooterLink>
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
            </nav>
          </div>

          {/* Newsletter & Contact */}
          <div className="space-y-6">
            

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Contact Info</h3>
              <div className="space-y-2">
                <ContactItem Icon={FaPhoneAlt}>+265 999 999 999</ContactItem>
                <ContactItem Icon={MdEmail}>info@primetimelimited.com</ContactItem>
                <ContactItem Icon={FaMapMarkerAlt}>
                  Area 47, Lilongwe, Malawi
                </ContactItem>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-white">
              © {currentYear} Primetime Limited. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm text-white">
              <a href="/terms" className="hover:text-gray-200">Terms</a>
              <span>•</span>
              <a href="/privacy" className="hover:text-gray-200">Privacy</a>
              <span>•</span>
              <a href="/cookies" className="hover:text-gray-200">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
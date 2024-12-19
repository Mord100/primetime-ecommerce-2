import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const Category = ({ title, links }) => (
    <div>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ul className="space-y-1">
        {links.map((link, index) => (
          <li key={index} className="text-sm text-gray-700 hover:text-black transition">
            {link}
          </li>
        ))}
      </ul>
    </div>
  )

  const SocialLink = ({ href, icon: Icon }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black transition">
      <Icon size={24} />
    </a>
  )

  return (
    <footer className="md:px-32 px-4 pb-8 border-gray-300">
      <div className="max-w-7xl py-16 border-t mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <Category
          title="Primetime Limited"
          links={['']}
        />
        <Category
          title="Customer Service"
          links={['Financing Options', 'Test Drive Booking', 'Vehicle Maintenance', 'Trade-In Program', 'Extended Warranty']}
        />
        <Category
          title="About Primetime Limited"
          links={['Our Story', 'Showroom Locations', 'Career Opportunities', 'Press Releases', 'Sustainability Efforts']}
        />
        <Category
          title="Resources"
          links={['Car Buying Guide', 'Vehicle Comparisons', 'Auto News', 'FAQ', 'Contact Us']}
        />
      </div>
      <div className="mt-12 border-t border-gray-300 pt-8 text-center">
        <div className="flex justify-center space-x-6 mb-4">
          <SocialLink href="https://facebook.com" icon={FaFacebook} />
          <SocialLink href="https://twitter.com" icon={FaTwitter} />
          <SocialLink href="https://instagram.com" icon={FaInstagram} />
          <SocialLink href="https://tiktok.com" icon={FaTiktok} />
        </div>
        <p className="text-sm text-gray-600">
          © {currentYear} Primetime Limited • <a href="/terms" className="hover:underline">Terms of Service</a> • <a href="/privacy" className="hover:underline">Privacy Policy</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

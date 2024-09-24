import React from 'react'
import { Link } from 'react-router-dom'
import { FaTwitter, FaFacebookF, FaInstagram } from 'react-icons/fa'

const FooterLink = ({ to, children }) => (
  <Link
    to={to}
    className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-300 hover:underline"
  >
    {children}
  </Link>
)

const SocialIcon = ({ Icon, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-gray-600 transition-colors duration-300 transform hover:scale-110"
  >
    <Icon size={20} />
  </a>
)

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white text-gray-600 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">PRIMETIME LIMITED</h2>
            <p className="text-sm text-gray-600">Quality e-commerce solutions</p>
            <div className="flex space-x-4">
              <SocialIcon Icon={FaTwitter} href="https://twitter.com" />
              <SocialIcon Icon={FaFacebookF} href="https://facebook.com" />
              <SocialIcon Icon={FaInstagram} href="https://instagram.com" />
            </div>
          </div>

          <nav className="grid grid-cols-2 gap-4">
            <FooterLink to="/about">About</FooterLink>
            <FooterLink to="/products">Products</FooterLink>
            <FooterLink to="/contact">Contact</FooterLink>
            <FooterLink to="/terms">Terms</FooterLink>
            <FooterLink to="/privacy">Privacy</FooterLink>
          </nav>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Newsletter</h3>
            <p className="text-sm text-gray-600">Stay updated with our latest offers</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-4 py-2 text-sm border border-gray-300 rounded-l-md"
              />
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-[#00315a] rounded-r-md hover:bg-[#f24c1c]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-400">
          <p>© {currentYear} Primetime Limited. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
import { FaTwitter, FaFacebookF, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-gray-600 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">PRIMETIME LIMITED</h2>
            <p className="mt-2 text-sm">Quality e-commerce solutions</p>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {['About', 'Products', 'Contact', 'Terms', 'Privacy'].map((item) => (
              <Link key={item} to="#" className="text-sm hover:text-gray-800 transition-colors">
                {item}
              </Link>
            ))}
          </nav>

          <div className="flex space-x-4">
            {[FaTwitter, FaFacebookF, FaInstagram].map((Icon, index) => (
              <a key={index} href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-400">
          <p>© {currentYear} Primetime Limited. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

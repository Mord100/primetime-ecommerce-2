import React, { useEffect, useState } from 'react';
import { 
  User, Mail, Calendar, Edit, LogOut, 
  Shield, Settings, CreditCard 
} from 'lucide-react';
import Layout from '../Layouts/Layouts'; 
import PromoSlider from '../components/Slider';

const Account = ({logoutHandler}) => {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('profile');

  useEffect(() => {
    // Get user info from localStorage
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  // Format date to be more readable
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Logout handler
  const handleLogout = () => {
    logoutHandler(); // Use the logoutHandler prop for logout functionality
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading user information...</p>
      </div>
    );
  }

  return (
    <Layout>
      {/* <PromoSlider /> */}
      <div className="container mx-auto px-4 md:px-32 py-40">
        <div className="grid md:grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <div className="md:col-span-3 bg-white shadow-md rounded-lg p-4">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-gray-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                {user.isAdmin && (
                  <span className="px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded-full inline-flex items-center">
                    <Shield className="w-3 h-3 mr-1" /> Admin
                  </span>
                )}
              </div>
            </div>

            <nav className="space-y-2">
              {[
                { 
                  icon: <User className="w-5 h-5 mr-3" />, 
                  label: 'Profile', 
                  section: 'profile' 
                },
                { 
                  icon: <Settings className="w-5 h-5 mr-3" />, 
                  label: 'Account Settings', 
                  section: 'settings' 
                },
                { 
                  icon: <CreditCard className="w-5 h-5 mr-3" />, 
                  label: 'Billing', 
                  section: 'billing' 
                },
              ].map((item) => (
                <button
                  key={item.section}
                  onClick={() => setActiveSection(item.section)}
                  className={`w-full flex items-center px-4 py-2 rounded-md text-left ${
                    activeSection === item.section 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}

              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 rounded-md text-left text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-9 bg-white shadow-md rounded-lg">
            {activeSection === 'profile' && (
              <div className="p-6">
                <div className="flex items-center justify-between border-b pb-4 mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Profile Information</h2>
                  <button className="flex items-center text-blue-600 hover:text-blue-800">
                    <Edit className="w-5 h-5 mr-2" />
                    Edit Profile
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { 
                      icon: <User className="w-6 h-6 text-gray-500" />, 
                      label: 'Full Name', 
                      value: user.name 
                    },
                    { 
                      icon: <Mail className="w-6 h-6 text-gray-500" />, 
                      label: 'Email Address', 
                      value: user.email 
                    },
                    { 
                      icon: <Calendar className="w-6 h-6 text-gray-500" />, 
                      label: 'Member Since', 
                      value: formatDate(user.createdAt) 
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                      <div className="p-3 bg-white rounded-full shadow-sm">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">{item.label}</p>
                        <p className="text-lg font-semibold text-gray-800">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'settings' && (
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-800 border-b pb-4 mb-6">
                  Account Settings
                </h2>
                <p className="text-gray-500">Settings content coming soon...</p>
              </div>
            )}

            {activeSection === 'billing' && (
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-800 border-b pb-4 mb-6">
                  Billing Information
                </h2>
                <p className="text-gray-500">Billing content coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Account;
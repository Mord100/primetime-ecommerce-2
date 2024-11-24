import React, { useEffect, useState } from 'react';
import { User, Mail, Calendar } from 'lucide-react';
import Layout from '../Layouts/Layouts'; 

const Account = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user info from localStorage
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Loading user information...</p>
      </div>
    );
  }

  // Format date to be more readable
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Layout> 
      <div className="w-full max-w-2xl mx-auto bg-white my-20 rounded-lg shadow-lg">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Account Information</h2>
            {user.isAdmin && (
              <span className="px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded-full">
                Admin
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Name */}
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <User className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-lg text-gray-900">{user.name}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Mail className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-lg text-gray-900">{user.email}</p>
            </div>
          </div>

          {/* Member Since */}
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Member Since</p>
              <p className="text-lg text-gray-900">{formatDate(user.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Account;
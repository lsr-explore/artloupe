'use client';

import Link from 'next/link';
import { useState } from 'react';

// Mock user for development - we'll replace this with Auth0 later
const MOCK_USER = {
  id: '1',
  name: 'Admin User',
  email: 'admin@artloupe.com',
  role: 'admin',
};

const AdminHome = () => {
  const [user] = useState(MOCK_USER); // Mock user for now
  const [isLoading] = useState(false);

  if (isLoading)
    return (
      <div className='flex items-center justify-center min-h-screen'>
        Loading...
      </div>
    );

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-6'>
            <div className='flex items-center'>
              <h1 className='text-3xl font-bold text-gray-900'>
                artloupe Admin
              </h1>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='text-sm text-gray-700'>
                Welcome, {user.name}
              </span>
              <button
                type='button'
                className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'>
                Logout (Mock)
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
        <div className='px-4 py-6 sm:px-0'>
          {/* Stats Cards */}
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
            <div className='bg-white overflow-hidden shadow rounded-lg'>
              <div className='p-5'>
                <div className='flex items-center'>
                  <div className='flex-shrink-0'>
                    <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center'>
                      <span className='text-white text-sm font-bold'>🎨</span>
                    </div>
                  </div>
                  <div className='ml-5 w-0 flex-1'>
                    <dl>
                      <dt className='text-sm font-medium text-gray-500 truncate'>
                        Total Artworks
                      </dt>
                      <dd className='text-lg font-medium text-gray-900'>6</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className='bg-white overflow-hidden shadow rounded-lg'>
              <div className='p-5'>
                <div className='flex items-center'>
                  <div className='flex-shrink-0'>
                    <div className='w-8 h-8 bg-green-500 rounded-full flex items-center justify-center'>
                      <span className='text-white text-sm font-bold'>🤖</span>
                    </div>
                  </div>
                  <div className='ml-5 w-0 flex-1'>
                    <dl>
                      <dt className='text-sm font-medium text-gray-500 truncate'>
                        AI Analyses
                      </dt>
                      <dd className='text-lg font-medium text-gray-900'>0</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className='bg-white overflow-hidden shadow rounded-lg'>
              <div className='p-5'>
                <div className='flex items-center'>
                  <div className='flex-shrink-0'>
                    <div className='w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center'>
                      <span className='text-white text-sm font-bold'>👥</span>
                    </div>
                  </div>
                  <div className='ml-5 w-0 flex-1'>
                    <dl>
                      <dt className='text-sm font-medium text-gray-500 truncate'>
                        Active Users
                      </dt>
                      <dd className='text-lg font-medium text-gray-900'>1</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className='bg-white overflow-hidden shadow rounded-lg'>
              <div className='p-5'>
                <div className='flex items-center'>
                  <div className='flex-shrink-0'>
                    <div className='w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center'>
                      <span className='text-white text-sm font-bold'>⚙️</span>
                    </div>
                  </div>
                  <div className='ml-5 w-0 flex-1'>
                    <dl>
                      <dt className='text-sm font-medium text-gray-500 truncate'>
                        System Status
                      </dt>
                      <dd className='text-lg font-medium text-green-600'>
                        Online
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Management Cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            <Link href='/artworks' className='block'>
              <div className='bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer'>
                <div className='flex items-center mb-4'>
                  <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                    <span className='text-2xl'>🎨</span>
                  </div>
                  <h2 className='text-xl font-semibold ml-4'>
                    Manage Artworks
                  </h2>
                </div>
                <p className='text-gray-600'>
                  View, edit, and manage the artwork collection from the
                  Metropolitan Museum of Art API.
                </p>
              </div>
            </Link>

            <Link href='/ai-config' className='block'>
              <div className='bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer'>
                <div className='flex items-center mb-4'>
                  <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
                    <span className='text-2xl'>🤖</span>
                  </div>
                  <h2 className='text-xl font-semibold ml-4'>
                    AI Configuration
                  </h2>
                </div>
                <p className='text-gray-600'>
                  Configure OpenAI settings and local AI model connections for
                  artwork analysis.
                </p>
              </div>
            </Link>

            <Link href='/users' className='block'>
              <div className='bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer'>
                <div className='flex items-center mb-4'>
                  <div className='w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center'>
                    <span className='text-2xl'>👥</span>
                  </div>
                  <h2 className='text-xl font-semibold ml-4'>
                    User Management
                  </h2>
                </div>
                <p className='text-gray-600'>
                  Manage user accounts, permissions, and authentication
                  settings.
                </p>
              </div>
            </Link>

            <Link href='/database' className='block'>
              <div className='bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer'>
                <div className='flex items-center mb-4'>
                  <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center'>
                    <span className='text-2xl'>🗄️</span>
                  </div>
                  <h2 className='text-xl font-semibold ml-4'>Database</h2>
                </div>
                <p className='text-gray-600'>
                  Monitor Supabase database, run migrations, and view analytics.
                </p>
              </div>
            </Link>

            <Link href='/api-status' className='block'>
              <div className='bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer'>
                <div className='flex items-center mb-4'>
                  <div className='w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center'>
                    <span className='text-2xl'>📊</span>
                  </div>
                  <h2 className='text-xl font-semibold ml-4'>API Status</h2>
                </div>
                <p className='text-gray-600'>
                  Monitor external API connections (Met Museum, OpenAI) and
                  system health.
                </p>
              </div>
            </Link>

            <div className='bg-white p-6 rounded-lg shadow'>
              <div className='flex items-center mb-4'>
                <div className='w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center'>
                  <span className='text-2xl'>⚙️</span>
                </div>
                <h2 className='text-xl font-semibold ml-4'>System Settings</h2>
              </div>
              <p className='text-gray-600'>
                Configure application settings, environment variables, and
                deployment options.
              </p>
            </div>
          </div>

          {/* Development Notice */}
          <div className='mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <span className='text-yellow-400 text-xl'>⚠️</span>
              </div>
              <div className='ml-3'>
                <h3 className='text-sm font-medium text-yellow-800'>
                  Development Mode
                </h3>
                <div className='mt-2 text-sm text-yellow-700'>
                  <p>
                    You&apos;re currently running in development mode with mock
                    authentication. Auth0 integration will be added later.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminHome;

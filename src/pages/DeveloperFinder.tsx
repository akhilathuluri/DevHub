import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Search, MapPin, Github, ExternalLink, Loader2 } from 'lucide-react';

interface GithubUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
}

const DeveloperFinder = () => {
  const [location, setLocation] = useState('');
  const [users, setUsers] = useState<GithubUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const searchDevelopers = async (pageNum = 1, newSearch = false) => {
    if (!location.trim()) {
      setError('Please enter a location');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      if (newSearch) {
        setUsers([]);
        setPage(1);
        pageNum = 1;
      }

      const response = await axios.get(
        `https://api.github.com/search/users?q=location:${encodeURIComponent(location)}&page=${pageNum}&per_page=12`
      );

      const userResults = response.data.items;
      
      if (userResults.length === 0) {
        setHasMore(false);
        if (pageNum === 1) {
          setError(`No developers found in ${location}`);
        }
        setLoading(false);
        return;
      }

      // Get detailed information for each user
      const detailedUsers = await Promise.all(
        userResults.map(async (user: any) => {
          const userDetailsResponse = await axios.get(`https://api.github.com/users/${user.login}`);
          return userDetailsResponse.data;
        })
      );

      if (newSearch) {
        setUsers(detailedUsers);
      } else {
        setUsers(prevUsers => [...prevUsers, ...detailedUsers]);
      }
      
      setPage(pageNum + 1);
      setHasMore(userResults.length === 12); // If we got less than requested, there are no more
    } catch (err) {
      console.error('Error fetching GitHub users:', err);
      setError('Failed to fetch developers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchDevelopers(1, true);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      searchDevelopers(page);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Developer Finder</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Find GitHub developers by city or location. Connect with talented developers worldwide.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-lg shadow-md p-6 mb-12"
      >
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter city or location (e.g., San Francisco, London, Tokyo)"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <motion.button
            type="submit"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading && page === 1 ? (
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <Search className="h-5 w-5 mr-2" />
            )}
            Find Developers
          </motion.button>
        </form>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 border-l-4 border-red-500 p-4 mb-8"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {users.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Developers in {location}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user, index) => (
                <motion.div
                  key={user.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <img
                        src={user.avatar_url}
                        alt={`${user.login}'s avatar`}
                        className="h-16 w-16 rounded-full mr-4 border-2 border-indigo-100"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {user.name || user.login}
                        </h3>
                        <div className="flex items-center text-gray-600">
                          <Github className="h-4 w-4 mr-1" />
                          <a
                            href={user.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 hover:underline"
                          >
                            {user.login}
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    {user.bio && (
                      <p className="text-gray-600 mb-4 line-clamp-2">{user.bio}</p>
                    )}
                    
                    <div className="flex justify-between text-sm text-gray-600 mb-4">
                      <div>
                        <span className="font-semibold">{user.public_repos}</span> repos
                      </div>
                      <div>
                        <span className="font-semibold">{user.followers}</span> followers
                      </div>
                      <div>
                        <span className="font-semibold">{user.following}</span> following
                      </div>
                    </div>
                    
                    <a
                      href={user.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
                    >
                      View Profile <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {hasMore && (
              <div className="mt-8 text-center">
                <motion.button
                  onClick={loadMore}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More Developers'
                  )}
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeveloperFinder;
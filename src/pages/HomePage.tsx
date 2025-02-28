import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Code, Users, MapPin, ArrowRight, Activity, Book, FileCode, Briefcase, Lightbulb, GitBranch } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: <Search className="h-8 w-8 text-indigo-600" />,
      title: 'Developer Finder',
      description: 'Find GitHub developers in your city or any location worldwide.',
      available: true,
      link: '/developer-finder'
    },
    {
      icon: <MapPin className="h-8 w-8 text-indigo-600" />,
      title: 'Tech Hubs Map',
      description: 'Discover tech hubs and developer hotspots around the world.',
      available: true,
      link: '/tech-hubs-map'
    },
    {
      icon: <Activity className="h-8 w-8 text-indigo-600" />,
      title: 'Activity Heatmap',
      description: 'Visualize developer activity patterns and contributions.',
      available: true,
      link: '/activity-heatmap'
    },
    {
      icon: <Code className="h-8 w-8 text-indigo-600" />,
      title: 'Repository Analyzer',
      description: 'Analyze repository metrics and code quality.',
      available: true,
      link: '/repository-analyzer'
    },
    {
      icon: <Book className="h-8 w-8 text-indigo-600" />,
      title: 'Resume Generator',
      description: 'Create professional resumes from your GitHub profile.',
      available: true,
      link: '/resume-generator'
    },
    {
      icon: <FileCode className="h-8 w-8 text-indigo-600" />,
      title: 'Portfolio Builder',
      description: 'Build impressive portfolios showcasing your projects.',
      available: true,
      link: '/portfolio-builder'
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-indigo-600" />,
      title: 'Startup Ideas',
      description: 'Generate innovative startup ideas based on trends.',
      available: true,
      link: '/startup-ideas'
    },
    {
      icon: <GitBranch className="h-8 w-8 text-indigo-600" />,
      title: 'Trending Repos',
      description: 'Discover trending repositories and technologies.',
      available: true,
      link: '/trending'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Discover GitHub's Developer Ecosystem
              </h1>
              <p className="text-xl mb-8">
                Explore developer trends, analyze repositories, and connect with the global GitHub community.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/developer-finder"
                    className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg shadow-md hover:bg-gray-100 transition-colors"
                  >
                    Try Developer Finder
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/tech-hubs-map"
                    className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
                  >
                    Explore Tech Hubs
                  </Link>
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden md:block"
            >
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                alt="Developers collaborating"
                className="rounded-lg shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
        
        {/* Wave SVG - Fixed with improved path and z-index */}
        <div className="absolute bottom-0 left-0 right-0 z-10 overflow-hidden">
          
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Explore Our Features
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Comprehensive tools for developers to connect, analyze, and grow
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <Link
                  to={feature.link}
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
                >
                  Try it now <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-12 md:p-12 text-center md:text-left md:flex md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Ready to find developers in your city?</h2>
                <p className="text-indigo-100 md:text-lg">Start using our Developer Finder tool today and connect with local talent.</p>
              </div>
              <div className="mt-8 md:mt-0">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/developer-finder"
                    className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg shadow-md hover:bg-gray-100 transition-colors"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
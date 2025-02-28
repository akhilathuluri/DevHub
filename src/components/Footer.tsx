import React from 'react';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const features = [
    { path: '/developer-finder', label: 'Developer Finder' },
    { path: '/tech-hubs-map', label: 'Tech Hubs Map' },
    { path: '/activity-heatmap', label: 'Activity Heatmap' },
    { path: '/repository-analyzer', label: 'Repository Analyzer' },
    { path: '/resume-generator', label: 'Resume Generator' },
    { path: '/portfolio-builder', label: 'Portfolio Builder' },
    { path: '/startup-ideas', label: 'Startup Ideas' },
    { path: '/trending', label: 'Trending Repositories' }
  ];

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Github className="h-6 w-6 mr-2" />
              DevHub
            </h3>
            <p className="text-gray-300">
              Connecting developers worldwide. Find talented GitHub developers in your city.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <ul className="space-y-2">
              {features.map((feature) => (
                <li key={feature.path}>
                  <a href={feature.path} className="text-gray-300 hover:text-white transition-colors">
                    {feature.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Github className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} DevHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
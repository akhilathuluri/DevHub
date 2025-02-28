import JSZip from 'jszip';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, Github, Code, Star, Globe, ArrowRight, User, Mail, MapPin, Building } from 'lucide-react';
import { generatePortfolioContent, generateSourceCode } from '../services/portfolioBuilderService';

const PortfolioBuilder = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('preview');

  const handleGeneratePortfolio = async () => {
    if (!username) {
      setError('Please enter a GitHub username');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await generatePortfolioContent(username);
      setPortfolioData(data);
    } catch (error: any) {
      setError(error.message || 'Failed to generate portfolio');
    } finally {
      setLoading(false);
    }
  };

  const downloadSourceCode = () => {
    try {
      const files = generateSourceCode(portfolioData);
      
      // Create a zip file
      const zip = new JSZip();
      
      // Add files to the zip
      Object.entries(files).forEach(([filename, content]) => {
        zip.file(filename, content);
      });
      
      // Generate and download the zip file
      zip.generateAsync({ type: "blob" }).then((content) => {
        const url = window.URL.createObjectURL(content);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${username}-portfolio.zip`;
        link.click();
        window.URL.revokeObjectURL(url);
      });
    } catch (error) {
      console.error('Error generating source code:', error);
      setError('Failed to generate source code');
    }
  };

  const PortfolioPreview = () => (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.img
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              src={portfolioData.github.avatarUrl}
              alt={portfolioData.github.username}
              className="w-48 h-48 rounded-full border-4 border-white shadow-lg"
            />
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold mb-4"
              >
                {portfolioData.hero.headline}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-indigo-100"
              >
                {portfolioData.hero.subheadline}
              </motion.p>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex gap-4 mt-6"
              >
                <a
                  href={portfolioData.github.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  <Github className="w-5 h-5 mr-2" />
                  View GitHub Profile
                </a>
                <button className="px-6 py-3 border-2 border-white rounded-lg hover:bg-white hover:text-indigo-600 transition-colors">
                  Contact Me
                </button>
              </motion.div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,160L48,144C96,128,192,96,288,90.7C384,85,480,107,576,128C672,149,768,171,864,165.3C960,160,1056,128,1152,117.3C1248,107,1344,117,1392,122.7L1440,128L1440,200L0,200Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            <div>
              <h2 className="text-3xl font-bold mb-6">About Me</h2>
              <p className="text-gray-600 mb-6">{portfolioData.about.introduction}</p>
              <div className="space-y-4">
                {portfolioData.about.expertise.map((item: string, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-2"
                  >
                    <ArrowRight className="w-5 h-5 text-indigo-600" />
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6">Technical Skills</h3>
              <div className="grid grid-cols-2 gap-4">
                {portfolioData.about.keySkills.map((skill: string, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 p-4 rounded-lg"
                  >
                    <Code className="w-5 h-5 text-indigo-600 mb-2" />
                    <span className="font-medium">{skill}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioData.projects.map((project: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech: string, techIndex: number) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <ul className="space-y-2">
                    {project.highlights.map((highlight: string, highlightIndex: number) => (
                      <li key={highlightIndex} className="flex items-start">
                        <Star className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Let's Connect</h2>
            <p className="text-xl text-gray-600 mb-8">{portfolioData.contact.tagline}</p>
            <p className="text-indigo-600 font-medium mb-8">{portfolioData.contact.availability}</p>
            <div className="flex justify-center gap-4">
              <a
                href={portfolioData.github.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Github className="w-5 h-5 mr-2" />
                GitHub Profile
              </a>
              <button className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
                <Mail className="w-5 h-5 mr-2" />
                Contact Me
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );

  const CodeDownloadSection = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Download Portfolio Code</h3>
        <p className="text-gray-600 mb-4">
          Get the complete source code for your portfolio website, including:
        </p>
        <ul className="list-disc list-inside text-gray-600 mb-6">
          <li>HTML template with your content</li>
          <li>Custom CSS styles</li>
          <li>Setup instructions</li>
          <li>Responsive design included</li>
        </ul>
        <button
          onClick={downloadSourceCode}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center"
        >
          <Download className="h-5 w-5 mr-2" />
          Download Source Code
        </button>
      </div>
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Quick Start Guide</h3>
        <div className="space-y-4 text-gray-600">
          <p>1. Download and extract the zip file</p>
          <p>2. Open index.html in your browser</p>
          <p>3. Customize the content and styles as needed</p>
          <p>4. Deploy to your preferred hosting service</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            GitHub Portfolio Builder
          </h1>
          <p className="text-xl text-gray-600">
            Generate a beautiful portfolio website from your GitHub profile using AI
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <div className="max-w-xl mx-auto">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter GitHub username"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <Github className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <button
                onClick={handleGeneratePortfolio}
                disabled={loading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 flex items-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  <>
                    <Globe className="h-5 w-5" />
                    <span>Generate Portfolio</span>
                  </>
                )}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-red-600 text-sm">{error}</p>
            )}
          </div>
        </motion.div>

        {portfolioData && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === 'preview'
                      ? 'border-b-2 border-indigo-500 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Preview
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === 'code'
                      ? 'border-b-2 border-indigo-500 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Get Code
                </button>
              </nav>
            </div>
            
            <div className="p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'preview' ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <PortfolioPreview />
                  </motion.div>
                ) : (
                  <motion.div
                    key="code"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <CodeDownloadSection />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioBuilder;

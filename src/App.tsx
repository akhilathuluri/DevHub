import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import DeveloperFinder from './pages/DeveloperFinder';
import TechHubsMap from './pages/TechHubsMap';
import DeveloperSkillAnalytics from './pages/DeveloperSkillAnalytics';
import RepositoryAnalyzer from './pages/RepositoryAnalyzer';
import DeveloperActivityHeatmap from './pages/DeveloperActivityHeatmap';
import ErrorBoundary from './components/ErrorBoundary';
import ResumeGenerator from './pages/ResumeGenerator';
import PortfolioBuilder from './pages/PortfolioBuilder';
import StartupIdeaGenerator from './pages/StartupIdeaGenerator';
import SimilarityMatcher from './pages/SimilarityMatcher';
import TrendingRepositories from './pages/TrendingRepositories';

function App() {
  return (
    <Router
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <motion.main 
          className="flex-grow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/developer-finder" element={<DeveloperFinder />} />
              <Route path="/tech-hubs-map" element={<TechHubsMap />} />
              <Route path="/developer-skills" element={<DeveloperSkillAnalytics />} />
              <Route path="/repository-analyzer" element={<RepositoryAnalyzer />} />
              <Route path="/activity-heatmap" element={<DeveloperActivityHeatmap />} />
              <Route path="/resume-generator" element={<ResumeGenerator />} />
              <Route path="/portfolio-builder" element={<PortfolioBuilder />} />
              <Route path="/startup-ideas" element={<StartupIdeaGenerator />} />
              <Route path="/similarity-matcher" element={<SimilarityMatcher />} />
              <Route path="/trending" element={<TrendingRepositories />} />
            </Routes>
          </ErrorBoundary>
        </motion.main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
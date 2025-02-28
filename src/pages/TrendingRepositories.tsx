import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, GitFork, Eye, Clock, 
  TrendingUp, Hash, Globe, Filter,
  Code, BookOpen, Users
} from 'lucide-react';
import { getTrendingRepos, getGithubTopics } from '../services/githubApi';

const TrendingRepositories = () => {
  const [repos, setRepos] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('daily');
  const [language, setLanguage] = useState('');
  const [activeTab, setActiveTab] = useState('repositories');

  useEffect(() => {
    fetchData();
  }, [timeRange, language]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [reposData, topicsData] = await Promise.all([
        getTrendingRepos(timeRange, language),
        getGithubTopics()
      ]);
      setRepos(reposData);
      setTopics(topicsData);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            GitHub Trending
          </h1>
          <p className="text-xl text-gray-600">
            Discover popular repositories and trending topics
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-4 mb-8"
        >
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-400" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Code className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Filter by language..."
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('repositories')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'repositories'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Repositories</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('topics')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'topics'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Hash className="h-5 w-5" />
                  <span>Topics</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center py-12"
                >
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-red-600 py-12"
                >
                  {error}
                </motion.div>
              ) : activeTab === 'repositories' ? (
                <RepositoriesList repos={repos} />
              ) : (
                <TopicsList topics={topics} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const RepositoriesList = ({ repos }: { repos: any[] }) => (
  <motion.div
    key="repos"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="grid gap-6"
  >
    {repos.map((repo, index) => (
      <motion.div
        key={repo.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
      >
        <div className="flex items-start justify-between">
          <div>
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-semibold text-indigo-600 hover:underline"
            >
              {repo.name}
            </a>
            <p className="text-gray-600 mt-2">{repo.description}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>{repo.stars}</span>
            </div>
            <div className="flex items-center space-x-1">
              <GitFork className="h-4 w-4 text-gray-500" />
              <span>{repo.forks}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {repo.languages.map((lang: string) => (
            <span
              key={lang}
              className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
            >
              {lang}
            </span>
          ))}
        </div>
      </motion.div>
    ))}
  </motion.div>
);

const TopicsList = ({ topics }: { topics: any[] }) => (
  <motion.div
    key="topics"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
  >
    {topics.map((topic, index) => (
      <motion.div
        key={topic.name}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          #{topic.name}
        </h3>
        <p className="text-gray-600 mb-4">{topic.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>{topic.repositoryCount} repositories</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>{topic.featuredCount} featured</span>
          </div>
        </div>
      </motion.div>
    ))}
  </motion.div>
);

export default TrendingRepositories;

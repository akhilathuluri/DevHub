import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FolderTree, Code, Star, GitFork, Eye, File, Folder, ChevronRight, ChevronDown, AlertCircle } from 'lucide-react';
import { analyzeRepository } from '../services/githubApi';

interface TreeItemProps {
  item: any;
  level: number;
}

const TreeItem: React.FC<TreeItemProps> = ({ item, level }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const formatSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="select-none">
      <motion.div
        className={`flex items-center py-1 px-2 rounded-lg hover:bg-gray-100 cursor-pointer`}
        style={{ marginLeft: `${level * 20}px` }}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        whileHover={{ x: 4 }}
      >
        <div className="flex items-center text-gray-700">
          {hasChildren ? (
            isOpen ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />
          ) : (
            <div className="w-6" />
          )}
          {item.type === 'dir' ? (
            <Folder className="h-5 w-5 mr-2 text-indigo-500" />
          ) : (
            <File className="h-5 w-5 mr-2 text-gray-500" />
          )}
          <span className="mr-2">{item.name}</span>
          {item.size > 0 && (
            <span className="text-xs text-gray-500">({formatSize(item.size)})</span>
          )}
        </div>
      </motion.div>
      {hasChildren && isOpen && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {item.children.map((child: any, index: number) => (
              <TreeItem key={`${child.path}-${index}`} item={child} level={level + 1} />
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

const RepositoryAnalyzer = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!repoUrl) {
      setError('Please enter a repository URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await analyzeRepository(repoUrl);
      setAnalysis(data);
    } catch (err: any) {
      setError(err.response?.status === 404 
        ? 'Repository not found' 
        : 'Failed to analyze repository'
      );
    } finally {
      setLoading(false);
    }
  };

  const getTotalFiles = (items: any[]): number => {
    let count = 0;
    items.forEach(item => {
      if (item.type === 'blob') count++;
      if (item.children) count += getTotalFiles(item.children);
    });
    return count;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Repository Analyzer</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Analyze GitHub repositories to understand their structure, size, and composition.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-lg shadow-md p-6 mb-8"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="Enter GitHub repository URL (e.g., https://github.com/owner/repo)"
              className="block w-full pl-4 pr-12 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <motion.button
            onClick={handleAnalyze}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="h-5 w-5 mr-2" />
                Analyze Repository
              </>
            )}
          </motion.button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 bg-red-50 border-l-4 border-red-500 p-4"
          >
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {analysis && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <img
                  src={analysis.owner.avatar_url}
                  alt="Repository owner"
                  className="h-12 w-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{analysis.name}</h3>
                  <p className="text-gray-600">by {analysis.owner.login}</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{analysis.description}</p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center">
                  <Star className="h-5 w-5 text-yellow-500 mb-1" />
                  <span className="text-sm font-medium">{analysis.stars}</span>
                  <span className="text-xs text-gray-500">Stars</span>
                </div>
                <div className="flex flex-col items-center">
                  <GitFork className="h-5 w-5 text-blue-500 mb-1" />
                  <span className="text-sm font-medium">{analysis.forks}</span>
                  <span className="text-xs text-gray-500">Forks</span>
                </div>
                <div className="flex flex-col items-center">
                  <Eye className="h-5 w-5 text-green-500 mb-1" />
                  <span className="text-sm font-medium">{analysis.watchers}</span>
                  <span className="text-xs text-gray-500">Watchers</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Languages</h3>
              <div className="space-y-3">
                {Object.entries(analysis.languages).map(([language, bytes]: [string, any]) => {
                  const percentage = (bytes / Object.values(analysis.languages).reduce((a: any, b: any) => a + b, 0) * 100).toFixed(1);
                  return (
                    <div key={language}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{language}</span>
                        <span>{percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 rounded-full h-2"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Repository Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Size:</span>
                  <span className="font-medium">{(analysis.totalSize / 1024).toFixed(2)} MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Files:</span>
                  <span className="font-medium">{getTotalFiles(analysis.structure)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Default Branch:</span>
                  <span className="font-medium">{analysis.defaultBranch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">
                    {new Date(analysis.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
                {analysis.license && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">License:</span>
                    <span className="font-medium">{analysis.license}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FolderTree className="h-5 w-5 mr-2 text-indigo-600" />
                Repository Structure
              </h3>
              <div className="border rounded-lg p-4 max-h-[600px] overflow-y-auto">
                {analysis.structure.map((item: any, index: number) => (
                  <TreeItem key={`${item.path}-${index}`} item={item} level={0} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RepositoryAnalyzer;

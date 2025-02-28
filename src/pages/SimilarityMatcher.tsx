import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Github, Users, Percent, Code, 
  Link2, BookOpen, CloudLightning , ArrowRight 
} from 'lucide-react';
import { findSimilarDevelopers } from '../services/similarityMatcherService';

const SimilarityMatcher = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [matchResults, setMatchResults] = useState<any>(null);

  const handleFindSimilar = async () => {
    if (!username) {
      setError('Please enter a GitHub username');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const results = await findSimilarDevelopers(username);
      setMatchResults(results);
    } catch (error: any) {
      setError(error.message || 'Failed to find similar developers');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            GitHub Profile Similarity Matcher
          </h1>
          <p className="text-xl text-gray-600">
            Find developers who share your coding style, interests, and technical preferences
          </p>
        </motion.div>

        {/* Search Input */}
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
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <Github className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <button
                onClick={handleFindSimilar}
                disabled={loading}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 flex items-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  <>
                    <Users className="h-5 w-5" />
                    <span>Find Similar</span>
                  </>
                )}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-red-600 text-sm">{error}</p>
            )}
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {matchResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Analysis Summary */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h2 className="text-2xl font-bold mb-4">Match Analysis</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <Code className="h-5 w-5 mr-2 text-indigo-600" />
                      Coding Style
                    </h3>
                    <ul className="space-y-2">
                      {matchResults.analysis.codingStyleSimilarities.map((style: string, i: number) => (
                        <li key={i} className="text-gray-600">• {style}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-indigo-600" />
                      Project Interests
                    </h3>
                    <ul className="space-y-2">
                      {matchResults.analysis.projectInterests.map((interest: string, i: number) => (
                        <li key={i} className="text-gray-600">• {interest}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <CloudLightning  className="h-5 w-5 mr-2 text-indigo-600" />
                      Match Criteria
                    </h3>
                    <ul className="space-y-2">
                      {matchResults.analysis.matchCriteria.map((criteria: string, i: number) => (
                        <li key={i} className="text-gray-600">• {criteria}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Similar Profiles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {matchResults.similarProfiles.map((profile: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">
                          {profile.name}
                        </h3>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                          {profile.matchScore}% Match
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{profile.bio}</p>

                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Similar Interests</h4>
                          <div className="flex flex-wrap gap-2">
                            {profile.commonInterests.map((interest: string, i: number) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Shared Technologies</h4>
                          <div className="flex flex-wrap gap-2">
                            {profile.sharedTechnologies.map((tech: string, i: number) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Potential Collaborations</h4>
                          <ul className="space-y-1">
                            {profile.recommendedCollaborations.map((collab: string, i: number) => (
                              <li key={i} className="text-gray-600 text-sm flex items-start">
                                <ArrowRight className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                                {collab}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <a
                          href={`https://github.com/${profile.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
                        >
                          <Github className="h-4 w-4 mr-2" />
                          View Profile
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SimilarityMatcher;

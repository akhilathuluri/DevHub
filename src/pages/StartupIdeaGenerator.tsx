import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Github, Lightbulb, Target, Rocket, 
  TrendingUp, Users, DollarSign, Shield, Brain 
} from 'lucide-react';
import { generateStartupIdeas } from '../services/startupIdeaService';

const StartupIdeaGenerator = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ideas, setIdeas] = useState<any>(null);

  const handleGenerateIdeas = async () => {
    if (!username) {
      setError('Please enter a GitHub username');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await generateStartupIdeas(username);
      setIdeas(data);
    } catch (error: any) {
      setError(error.message || 'Failed to generate ideas');
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
            Startup Idea Generator
          </h1>
          <p className="text-xl text-gray-600">
            Transform your GitHub expertise into innovative business opportunities
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
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <Github className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <button
                onClick={handleGenerateIdeas}
                disabled={loading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 flex items-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  <>
                    <Lightbulb className="h-5 w-5" />
                    <span>Generate Ideas</span>
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
          {ideas && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Startup Ideas */}
              {ideas.ideas.map((idea: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <Rocket className="h-6 w-6 mr-2 text-indigo-600" />
                      {idea.title}
                    </h2>
                    <p className="text-gray-600 mb-6">{idea.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2 flex items-center">
                          <Target className="h-5 w-5 mr-2 text-indigo-600" />
                          Target Market
                        </h3>
                        <p className="text-gray-600">{idea.targetMarket}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2 flex items-center">
                          <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                          Monetization Strategy
                        </h3>
                        <p className="text-gray-600">{idea.monetizationStrategy}</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">Tech Stack</h3>
                      <div className="flex flex-wrap gap-2">
                        {idea.techStack.map((tech: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">Key Features</h3>
                      <ul className="space-y-2">
                        {idea.keyFeatures.map((feature: string, i: number) => (
                          <li key={i} className="flex items-start">
                            <div className="flex-shrink-0 h-5 w-5 text-green-500">•</div>
                            <span className="ml-2 text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Market Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <TrendingUp className="h-6 w-6 mr-2 text-indigo-600" />
                  Market Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Trends</h3>
                    <ul className="space-y-2">
                      {ideas.marketAnalysis.trends.map((trend: string, i: number) => (
                        <li key={i} className="text-gray-600">• {trend}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Opportunities</h3>
                    <ul className="space-y-2">
                      {ideas.marketAnalysis.opportunities.map((opp: string, i: number) => (
                        <li key={i} className="text-gray-600">• {opp}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Risks</h3>
                    <ul className="space-y-2">
                      {ideas.marketAnalysis.risks.map((risk: string, i: number) => (
                        <li key={i} className="text-gray-600">• {risk}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Skills Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Brain className="h-6 w-6 mr-2 text-indigo-600" />
                  Skills Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Existing Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {ideas.skillsMatch.existingSkills.map((skill: string, i: number) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Skills to Acquire</h3>
                    <div className="flex flex-wrap gap-2">
                      {ideas.skillsMatch.skillsToAcquire.map((skill: string, i: number) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Team Roles Needed</h3>
                    <div className="flex flex-wrap gap-2">
                      {ideas.skillsMatch.complementaryRoles.map((role: string, i: number) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StartupIdeaGenerator;

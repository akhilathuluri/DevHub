import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, Activity, AlertCircle, Loader2 } from 'lucide-react';
import { getUserCommitActivity } from '../services/githubApi';

interface HeatmapCellProps {
  date: string;
  count: number;
  maxCount: number;
}

const HeatmapCell: React.FC<HeatmapCellProps> = ({ date, count, maxCount }) => {
  const intensity = count ? Math.min((count / maxCount) * 4, 4) : 0;
  const colorClasses = [
    'bg-gray-100',
    'bg-green-200',
    'bg-green-300',
    'bg-green-400',
    'bg-green-500'
  ];

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="group relative"
    >
      <div
        className={`w-4 h-4 ${colorClasses[Math.floor(intensity)]} rounded-sm cursor-pointer`}
      />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
        <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
          {count} commits on {new Date(date).toLocaleDateString()}
        </div>
      </div>
    </motion.div>
  );
};

const DeveloperActivityHeatmap = () => {
  const [username, setUsername] = useState('');
  const [activityData, setActivityData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ total: 0, average: 0, maxDay: 0 });

  const fetchActivity = async () => {
    if (!username) {
      setError('Please enter a username');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await getUserCommitActivity(username);
      setActivityData(data);

      // Calculate statistics
      const total = data.reduce((sum, day) => sum + day.count, 0);
      const average = total / data.length;
      const maxDay = Math.max(...data.map(day => day.count));

      setStats({ total, average: Math.round(average), maxDay });
    } catch (error: any) {
      setError(error.message || 'Failed to fetch activity data');
    } finally {
      setLoading(false);
    }
  };

  const renderHeatmap = () => {
    if (!activityData.length) return null;

    const weeks: any[][] = [];
    let currentWeek: any[] = [];
    
    activityData.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length) {
      weeks.push(currentWeek);
    }

    return (
      <div className="overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {weeks.map((week, i) => (
            <div key={i} className="flex flex-col gap-1">
              {week.map((day) => (
                <HeatmapCell
                  key={day.date}
                  date={day.date}
                  count={day.count}
                  maxCount={stats.maxDay}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Developer Activity Heatmap
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Visualize GitHub commit patterns and activity levels over time.
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub username"
              className="block w-full pl-4 pr-12 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              onKeyPress={(e) => e.key === 'Enter' && fetchActivity()}
            />
          </div>
          <motion.button
            onClick={fetchActivity}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
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
              <>
                <Activity className="h-5 w-5 mr-2" />
                View Activity
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

      <AnimatePresence>
        {activityData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  Total Commits
                </h3>
                <p className="text-3xl font-bold text-indigo-600">
                  {stats.total.toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  Average Per Day
                </h3>
                <p className="text-3xl font-bold text-indigo-600">
                  {stats.average.toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  Most Active Day
                </h3>
                <p className="text-3xl font-bold text-indigo-600">
                  {stats.maxDay.toLocaleString()}
                </p>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
              Commit Activity Heatmap
            </h3>
            
            {renderHeatmap()}
            
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-gray-600">Less</span>
              <div className="flex gap-1">
                {['bg-gray-100', 'bg-green-200', 'bg-green-300', 'bg-green-400', 'bg-green-500'].map((color, i) => (
                  <div key={i} className={`w-4 h-4 ${color} rounded-sm`} />
                ))}
              </div>
              <span className="text-sm text-gray-600">More</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeveloperActivityHeatmap;

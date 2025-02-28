import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, TextField, Alert, Fade, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend, PolarRadiusAxis } from 'recharts';
import { motion } from 'framer-motion';
import { Search, RefreshCw } from 'lucide-react';
import { getUserLanguages } from '../../services/githubApi';

const SkillDashboard: React.FC = () => {
  const [username, setUsername] = useState('');
  const [skillData, setSkillData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [animate, setAnimate] = useState(false);

  const handleSearch = async () => {
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await getUserLanguages(username);
      if (data.length === 0) {
        setError('No public repositories or language data found for this user');
        setSkillData([]);
      } else {
        setSkillData(data);
        setAnimate(true);
      }
    } catch (error: any) {
      setError(
        error.response?.status === 404 
          ? 'GitHub user not found' 
          : error.response?.status === 403 
            ? 'API rate limit exceeded. Please try again later.'
            : 'Failed to fetch user data. Please check the username and try again.'
      );
      setSkillData([]);
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card elevation={3} sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e' }}>
            Developer Skills Analysis
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              label="GitHub Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              error={!!error}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleSearch} disabled={loading}>
                    <Search />
                  </IconButton>
                ),
              }}
            />
            <Tooltip title="Refresh data">
              <IconButton 
                onClick={handleSearch}
                disabled={loading || !username}
                sx={{ bgcolor: 'primary.light', '&:hover': { bgcolor: 'primary.main' } }}
              >
                <RefreshCw className={loading ? 'animate-spin' : ''} />
              </IconButton>
            </Tooltip>
          </Box>

          {error && (
            <Fade in={true}>
              <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            </Fade>
          )}

          <Box sx={{ 
            width: '100%', 
            height: 500,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {loading ? (
              <CircularProgress />
            ) : skillData.length > 0 ? (
              <motion.div
                initial={animate ? { scale: 0.9, opacity: 0 } : false}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{ width: '100%', height: '100%' }}
              >
                <ResponsiveContainer>
                  <RadarChart data={skillData}>
                    <PolarGrid strokeDasharray="3 3" />
                    <PolarAngleAxis 
                      dataKey="skill"
                      tick={{ fill: '#1a237e', fontSize: 14 }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                    <Radar
                      name="Skill Level"
                      dataKey="value"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                      animationDuration={1000}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </motion.div>
            ) : (
              <Typography color="textSecondary">
                Enter a GitHub username to see their skills analysis
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SkillDashboard;

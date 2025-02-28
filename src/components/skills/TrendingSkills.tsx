import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Chip, CircularProgress, Box, IconButton, Tooltip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { getTrendingLanguages } from '../../services/githubApi';
import { RefreshCw, TrendingUp, Globe } from 'lucide-react';

const TrendingSkills: React.FC = () => {
  const [trendingSkills, setTrendingSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const fetchTrending = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getTrendingLanguages();
      setTrendingSkills(data);
    } catch (error) {
      setError('Failed to fetch trending languages');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTrending();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card elevation={3} sx={{ borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a237e', display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp />
              Trending Languages
            </Typography>
            <Tooltip title="Refresh trends">
              <IconButton onClick={fetchTrending} disabled={loading}>
                <RefreshCw className={loading ? 'animate-spin' : ''} />
              </IconButton>
            </Tooltip>
          </Box>

          {error ? (
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          ) : loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              <AnimatePresence>
                {trendingSkills.map((item: any, index) => (
                  <motion.div
                    key={item.skill}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ListItem
                      divider
                      sx={{
                        borderRadius: 1,
                        mb: 1,
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 0.04)',
                          transform: 'translateX(8px)',
                          transition: 'all 0.3s ease'
                        }
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {item.skill}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Globe size={16} />
                            {item.region}
                          </Box>
                        }
                      />
                      <Chip
                        label={item.trend}
                        color="success"
                        variant="filled"
                        sx={{
                          fontWeight: 'bold',
                          '& .MuiChip-label': { px: 2 }
                        }}
                      />
                    </ListItem>
                  </motion.div>
                ))}
              </AnimatePresence>
            </List>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TrendingSkills;

import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import SkillDashboard from '../components/skills/SkillDashboard';
import TrendingSkills from '../components/skills/TrendingSkills';

const DeveloperSkillAnalytics: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              mb: 4
            }}
          >
            Developer Skill Analytics
          </Typography>
        </motion.div>
        
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <SkillDashboard />
          </Grid>
          <Grid item xs={12} lg={4}>
            <TrendingSkills />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default DeveloperSkillAnalytics;

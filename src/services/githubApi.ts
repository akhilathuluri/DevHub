import axios from 'axios';

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

const githubClient = axios.create({
  baseURL: GITHUB_API_BASE,
  headers: GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}
});

interface Repository {
  name: string;
  description: string;
  stargazers_count: number;
  language: string;
  html_url: string;
}

export const getUserData = async (username: string) => {
  try {
    // Fetch basic user info
    const userResponse = await githubClient.get(`/users/${username}`);
    const user = userResponse.data;

    // Fetch repositories
    const reposResponse = await githubClient.get(`/users/${username}/repos?sort=stars&per_page=10`);
    const repositories = reposResponse.data;

    // Get language statistics
    const languages = new Set<string>();
    repositories.forEach((repo: Repository) => {
      if (repo.language) {
        languages.add(repo.language);
      }
    });

    // Get contribution data (last year's activity)
    const contributionsResponse = await githubClient.get(`/users/${username}/events`);
    const contributions = contributionsResponse.data
      .filter((event: any) => {
        const date = new Date(event.created_at);
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        return date >= oneYearAgo;
      })
      .slice(0, 100);

    return {
      name: user.name || username,
      bio: user.bio,
      repositories: repositories.map((repo: Repository) => ({
        name: repo.name,
        description: repo.description,
        stars: repo.stargazers_count,
        language: repo.language,
        url: repo.html_url
      })),
      languages: Array.from(languages),
      contributions: contributions.length,
      avatarUrl: user.avatar_url,
      location: user.location,
      blog: user.blog,
      company: user.company
    };
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error('GitHub user not found');
    }
    throw new Error('Failed to fetch GitHub data');
  }
};



if (!GITHUB_TOKEN) {
  console.error('GitHub token is not configured! Please set VITE_GITHUB_TOKEN in your .env file');
}

const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `Bearer ${GITHUB_TOKEN}`
  },
});

export const getUserLanguages = async (username: string) => {
  try {
    const repos = await githubApi.get(`/users/${username}/repos?per_page=100`);
    
    if (repos.data.length === 0) {
      return [];
    }

    const languages = repos.data.reduce((acc: { [key: string]: number }, repo: any) => {
      if (repo.language) {
        // Weight by stars and size for better representation
        const weight = repo.stargazers_count + Math.log(repo.size + 1);
        acc[repo.language] = (acc[repo.language] || 0) + weight;
      }
      return acc;
    }, {});

    // Normalize values to a 0-100 scale
    const maxValue = Math.max(...Object.values(languages));
    return Object.entries(languages)
      .map(([name, value]) => ({
        skill: name,
        value: Math.round((value / maxValue) * 100),
      }))
      .sort((a, b) => b.value - a.value);
  } catch (error) {
    console.error('Error fetching user languages:', error);
    throw error;
  }
};

export const getTrendingLanguages = async () => {
  const response = await githubApi.get('/search/repositories', {
    params: {
      q: 'stars:>1000',
      sort: 'stars',
      order: 'desc',
      per_page: 100,
    },
  });
  
  const languages = response.data.items.reduce((acc: { [key: string]: number }, repo: any) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {});

  return Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([language, count]) => ({
      skill: language,
      trend: `${Math.round((count / response.data.items.length) * 100)}%`,
      region: 'Global',
    }));
};

interface RepoContent {
  name: string;
  path: string;
  type: string;
  size: number;
  children?: RepoContent[];
}

interface RepoAnalysis {
  name: string;
  description: string;
  stars: number;
  forks: number;
  watchers: number;
  languages: { [key: string]: number };
  totalSize: number;
  structure: RepoContent[];
  defaultBranch: string;
  lastUpdated: string;
  license?: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export const analyzeRepository = async (repoUrl: string): Promise<RepoAnalysis> => {
  try {
    if (!GITHUB_TOKEN) {
      throw new Error('GitHub token is not configured. Please set VITE_GITHUB_TOKEN in your .env file');
    }

    // Parse repository URL
    let owner, repo;
    try {
      const url = new URL(repoUrl);
      const pathParts = url.pathname.split('/').filter(Boolean);
      if (pathParts.length !== 2) {
        throw new Error('Invalid repository path');
      }
      [owner, repo] = pathParts;
    } catch (e) {
      throw new Error('Invalid GitHub repository URL. Format should be: https://github.com/owner/repo');
    }

    console.log(`Analyzing repository: ${owner}/${repo}`);
    console.log('Using token:', GITHUB_TOKEN ? `${GITHUB_TOKEN.substr(0, 4)}...` : 'No token!');

    // Fetch basic repo information
    const repoResponse = await githubApi.get(`/repos/${owner}/${repo}`);
    const repoData = repoResponse.data;

    // Fetch languages
    const languagesResponse = await githubApi.get(repoData.languages_url);
    
    // Fetch repository contents with error handling
    let treeData = [];
    try {
      const contentsResponse = await githubApi.get(`/repos/${owner}/${repo}/git/trees/${repoData.default_branch}?recursive=1`);
      if (contentsResponse.data.tree) {
        treeData = contentsResponse.data.tree;
      }
    } catch (error: any) {
      console.warn('Error fetching repository structure:', error.message);
      treeData = []; // Proceed with empty structure if tree fetch fails
    }
    
    const processContents = (items: any[]): RepoContent[] => {
      const root: { [key: string]: RepoContent } = {};
      
      items.forEach(item => {
        if (!item.path) return; // Skip invalid items
        
        const paths = item.path.split('/');
        let current = root;
        
        for (let i = 0; i < paths.length; i++) {
          const name = paths[i];
          const isLast = i === paths.length - 1;
          
          if (isLast) {
            if (!current[name]) {
              current[name] = {
                name,
                path: item.path,
                type: item.type,
                size: item.size || 0
              };
            }
          } else {
            if (!current[name]) {
              current[name] = {
                name,
                path: paths.slice(0, i + 1).join('/'),
                type: 'tree',
                size: 0,
                children: {}
              };
            }
            current = (current[name].children || {}) as any;
          }
        }
      });

      const convertToArray = (obj: { [key: string]: RepoContent }): RepoContent[] => {
        return Object.values(obj)
          .map(item => {
            if (item.children) {
              return {
                ...item,
                children: convertToArray(item.children as any)
              };
            }
            return item;
          })
          .sort((a, b) => {
            // Directories first, then files
            if (a.type === 'tree' && b.type !== 'tree') return -1;
            if (a.type !== 'tree' && b.type === 'tree') return 1;
            return a.name.localeCompare(b.name);
          });
      };

      return convertToArray(root);
    };

    return {
      name: repoData.name,
      description: repoData.description || '',
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      watchers: repoData.subscribers_count,
      languages: languagesResponse.data || {},
      totalSize: repoData.size,
      structure: processContents(treeData),
      defaultBranch: repoData.default_branch,
      lastUpdated: repoData.updated_at,
      license: repoData.license?.name,
      owner: {
        login: repoData.owner.login,
        avatar_url: repoData.owner.avatar_url
      }
    };
  } catch (error: any) {
    console.error('Error analyzing repository:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });

    if (error.response?.status === 401) {
      throw new Error('Invalid GitHub token or token has expired. Please check your token configuration.');
    } else if (error.response?.status === 403) {
      throw new Error('API rate limit exceeded or insufficient token permissions. Token needs repo access.');
    } else if (error.response?.status === 404) {
      throw new Error('Repository not found. Please check if the repository exists and is public.');
    }
    throw new Error(error.message || 'An unexpected error occurred while analyzing the repository.');
  }
};

interface CommitActivity {
  date: string;
  count: number;
  hour?: number;
}

export const getUserCommitActivity = async (username: string): Promise<CommitActivity[]> => {
  try {
    // Get user's repos
    const repos = await githubApi.get(`/users/${username}/repos?per_page=100`);
    
    // Get commit activity for each repo
    const commitPromises = repos.data.map(async (repo: any) => {
      try {
        const stats = await githubApi.get(
          `/repos/${repo.owner.login}/${repo.name}/stats/commit_activity`
        );
        return stats.data;
      } catch (error) {
        return [];
      }
    });

    const commitData = await Promise.all(commitPromises);
    
    // Process and aggregate commit data
    const activityMap = new Map<string, { count: number; hourly: number[] }>();
    
    commitData.flat().forEach((weekData: any) => {
      if (!weekData || !weekData.week) return;
      
      const weekTimestamp = weekData.week * 1000; // Convert to milliseconds
      const date = new Date(weekTimestamp);
      
      for (let i = 0; i < 7; i++) {
        const dayDate = new Date(date.getTime());
        dayDate.setDate(date.getDate() + i);
        
        // Ensure the date is valid before converting to ISO string
        if (!isNaN(dayDate.getTime())) {
          const dateStr = dayDate.toISOString().split('T')[0];
          
          if (!activityMap.has(dateStr)) {
            activityMap.set(dateStr, { count: 0, hourly: new Array(24).fill(0) });
          }
          
          const dayData = activityMap.get(dateStr)!;
          dayData.count += weekData.days[i] || 0;
        }
      }
    });

    // Convert map to array and filter out any invalid entries
    return Array.from(activityMap.entries())
      .filter(([date]) => date) // Filter out any undefined dates
      .map(([date, data]) => ({
        date,
        count: data.count
      }))
      .sort((a, b) => a.date.localeCompare(b.date)); // Sort by date
  } catch (error) {
    console.error('Error fetching commit activity:', error);
    throw error;
  }
};

export const getTrendingRepos = async (timeRange: string = 'daily', language?: string) => {
  try {
    let query = 'stars:>100';
    if (language) {
      query += ` language:${language}`;
    }

    const daysAgo = timeRange === 'monthly' ? 30 : timeRange === 'weekly' ? 7 : 1;
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    query += ` created:>${date.toISOString().split('T')[0]}`;

    const response = await githubApi.get('/search/repositories', {
      params: {
        q: query,
        sort: 'stars',
        order: 'desc',
        per_page: 25,
      },
    });

    return response.data.items.map((repo: any) => ({
      id: repo.id,
      name: repo.full_name,
      description: repo.description,
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      languages: [repo.language].filter(Boolean),
      owner: {
        login: repo.owner.login,
        avatar_url: repo.owner.avatar_url,
      },
    }));
  } catch (error) {
    console.error('Error fetching trending repos:', error);
    throw error;
  }
};

export const getGithubTopics = async () => {
  try {
    const response = await githubApi.get('/search/topics', {
      params: {
        q: 'stars:>1000',
        sort: 'stars',
        order: 'desc',
        per_page: 30,
      },
      headers: {
        Accept: 'application/vnd.github.mercy-preview+json',
      },
    });

    return response.data.items.map((topic: any) => ({
      name: topic.name,
      description: topic.description || 'No description available',
      repositoryCount: topic.repository_count || 0,
      featuredCount: topic.featured_count || 0,
      url: `https://github.com/topics/${topic.name}`,
      createdAt: topic.created_at,
    }));
  } catch (error) {
    console.error('Error fetching GitHub topics:', error);
    throw error;
  }
};

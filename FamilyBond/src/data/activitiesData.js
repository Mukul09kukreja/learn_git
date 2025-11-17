export const activitiesData = [
  {
    id: '1',
    title: 'No-Screen Dinner',
    description: 'Enjoy a meal together without any digital devices. Share stories about your day.',
    duration: 30,
    category: 'daily',
    ageGroup: 'all',
    moodBoost: ['stressed', 'overwhelmed', 'disconnected'],
    icon: '🍽️',
  },
  {
    id: '2',
    title: 'Family Talk Time',
    description: 'Sit together for 15 minutes and talk about feelings, dreams, or anything on your mind.',
    duration: 15,
    category: 'daily',
    ageGroup: 'all',
    moodBoost: ['sad', 'anxious', 'lonely'],
    icon: '💬',
  },
  {
    id: '3',
    title: 'Weekly Family Meeting',
    description: 'Discuss the week ahead, share concerns, celebrate wins, and plan together.',
    duration: 45,
    category: 'weekly',
    ageGroup: 'all',
    moodBoost: ['stressed', 'overwhelmed', 'confused'],
    icon: '📋',
  },
  {
    id: '4',
    title: 'Game Night',
    description: 'Play board games, card games, or fun activities that everyone enjoys.',
    duration: 60,
    category: 'weekly',
    ageGroup: 'all',
    moodBoost: ['bored', 'sad', 'disconnected'],
    icon: '🎮',
  },
  {
    id: '5',
    title: 'Outdoor Walk',
    description: 'Take a walk together in nature or around the neighborhood. Fresh air and movement.',
    duration: 30,
    category: 'daily',
    ageGroup: 'all',
    moodBoost: ['stressed', 'anxious', 'tired'],
    icon: '🚶',
  },
  {
    id: '6',
    title: 'Gratitude Session',
    description: 'Each person shares three things they are grateful for today.',
    duration: 10,
    category: 'daily',
    ageGroup: 'all',
    moodBoost: ['sad', 'angry', 'frustrated'],
    icon: '🙏',
  },
  {
    id: '7',
    title: 'Movie Night',
    description: 'Watch a family-friendly movie together with popcorn and cozy blankets.',
    duration: 120,
    category: 'weekly',
    ageGroup: 'all',
    moodBoost: ['bored', 'disconnected', 'tired'],
    icon: '🎬',
  },
  {
    id: '8',
    title: 'Cooking Together',
    description: 'Prepare a meal or bake something together. Great for teamwork and creativity.',
    duration: 45,
    category: 'weekly',
    ageGroup: 'all',
    moodBoost: ['bored', 'stressed', 'disconnected'],
    icon: '👨‍🍳',
  },
  {
    id: '9',
    title: 'Story Time',
    description: 'Read a book together or share personal stories from childhood.',
    duration: 20,
    category: 'daily',
    ageGroup: 'young',
    moodBoost: ['anxious', 'scared', 'sad'],
    icon: '📚',
  },
  {
    id: '10',
    title: 'Arts & Crafts',
    description: 'Create something together - draw, paint, or make DIY projects.',
    duration: 45,
    category: 'weekly',
    ageGroup: 'young',
    moodBoost: ['bored', 'frustrated', 'sad'],
    icon: '🎨',
  },
  {
    id: '11',
    title: 'Music Session',
    description: 'Listen to music together, sing, or play instruments if available.',
    duration: 30,
    category: 'weekly',
    ageGroup: 'all',
    moodBoost: ['sad', 'stressed', 'bored'],
    icon: '🎵',
  },
  {
    id: '12',
    title: 'Exercise Together',
    description: 'Do yoga, stretching, or simple exercises as a family.',
    duration: 20,
    category: 'daily',
    ageGroup: 'all',
    moodBoost: ['stressed', 'tired', 'anxious'],
    icon: '🧘',
  },
  {
    id: '13',
    title: 'Stargazing',
    description: 'Look at the stars together and talk about dreams and the universe.',
    duration: 30,
    category: 'weekly',
    ageGroup: 'all',
    moodBoost: ['anxious', 'overwhelmed', 'curious'],
    icon: '⭐',
  },
  {
    id: '14',
    title: 'Photo Album Review',
    description: 'Look through old photos and share memories together.',
    duration: 30,
    category: 'weekly',
    ageGroup: 'all',
    moodBoost: ['disconnected', 'sad', 'nostalgic'],
    icon: '📸',
  },
  {
    id: '15',
    title: 'Volunteer Together',
    description: 'Do a community service activity as a family.',
    duration: 120,
    category: 'monthly',
    ageGroup: 'all',
    moodBoost: ['disconnected', 'purposeless', 'grateful'],
    icon: '🤝',
  },
];

export const getRecommendedActivities = (moodLogs, familyMembers, completedActivities) => {
  const recentMoods = moodLogs.slice(-7);
  const dominantMoods = {};
  
  recentMoods.forEach(log => {
    dominantMoods[log.mood] = (dominantMoods[log.mood] || 0) + 1;
  });

  const topMoods = Object.keys(dominantMoods)
    .sort((a, b) => dominantMoods[b] - dominantMoods[a])
    .slice(0, 3);

  const recommended = activitiesData.filter(activity => {
    const moodMatch = activity.moodBoost.some(mood => topMoods.includes(mood));
    const notRecentlyCompleted = !completedActivities
      .slice(-5)
      .some(log => log.activityId === activity.id);
    
    return moodMatch && notRecentlyCompleted;
  });

  return recommended.length > 0 ? recommended : activitiesData.slice(0, 5);
};

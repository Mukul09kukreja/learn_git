export const emotions = [
  { id: 'happy', label: 'Happy', emoji: '😊', color: '#4CAF50', score: 5 },
  { id: 'excited', label: 'Excited', emoji: '🤩', color: '#FF9800', score: 5 },
  { id: 'calm', label: 'Calm', emoji: '😌', color: '#2196F3', score: 4 },
  { id: 'grateful', label: 'Grateful', emoji: '🙏', color: '#9C27B0', score: 5 },
  { id: 'content', label: 'Content', emoji: '😊', color: '#4CAF50', score: 4 },
  { id: 'tired', label: 'Tired', emoji: '😴', color: '#607D8B', score: 2 },
  { id: 'bored', label: 'Bored', emoji: '😑', color: '#9E9E9E', score: 2 },
  { id: 'confused', label: 'Confused', emoji: '😕', color: '#795548', score: 2 },
  { id: 'anxious', label: 'Anxious', emoji: '😰', color: '#FF5722', score: 1 },
  { id: 'stressed', label: 'Stressed', emoji: '😫', color: '#F44336', score: 1 },
  { id: 'sad', label: 'Sad', emoji: '😢', color: '#3F51B5', score: 1 },
  { id: 'angry', label: 'Angry', emoji: '😠', color: '#D32F2F', score: 1 },
  { id: 'frustrated', label: 'Frustrated', emoji: '😤', color: '#E91E63', score: 1 },
  { id: 'overwhelmed', label: 'Overwhelmed', emoji: '😵', color: '#9C27B0', score: 1 },
  { id: 'lonely', label: 'Lonely', emoji: '😔', color: '#607D8B', score: 1 },
  { id: 'scared', label: 'Scared', emoji: '😨', color: '#673AB7', score: 1 },
];

export const analyzeText = (text) => {
  const lowerText = text.toLowerCase();
  
  const positiveWords = ['good', 'great', 'happy', 'excited', 'fun', 'love', 'amazing', 'wonderful', 'fantastic', 'joy', 'peaceful', 'calm', 'grateful', 'blessed'];
  const negativeWords = ['bad', 'sad', 'angry', 'upset', 'frustrated', 'stressed', 'worried', 'anxious', 'scared', 'lonely', 'tired', 'overwhelmed', 'difficult', 'hard', 'problem'];
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) positiveCount++;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativeCount++;
  });
  
  if (positiveCount > negativeCount) {
    return { sentiment: 'positive', confidence: 0.7 + (positiveCount * 0.1) };
  } else if (negativeCount > positiveCount) {
    return { sentiment: 'negative', confidence: 0.7 + (negativeCount * 0.1) };
  } else {
    return { sentiment: 'neutral', confidence: 0.5 };
  }
};

export const generateSuggestions = (mood, sentiment) => {
  const suggestions = {
    happy: [
      'Keep up the positive energy! Share your happiness with family.',
      'This is a great time to try new activities together.',
      'Consider journaling about what made you happy today.',
    ],
    excited: [
      'Channel this energy into a fun family activity!',
      'Share your excitement with your family members.',
      'Great mood for starting new projects together.',
    ],
    calm: [
      'Enjoy this peaceful moment. Practice mindfulness together.',
      'Perfect time for deep conversations with family.',
      'Consider a relaxing activity like reading or gentle music.',
    ],
    stressed: [
      'Take deep breaths. Consider a short walk or exercise.',
      'Talk to a family member about what\'s bothering you.',
      'Try breaking down your tasks into smaller, manageable steps.',
      'Remember: it\'s okay to ask for help.',
    ],
    anxious: [
      'Practice grounding techniques: name 5 things you can see, 4 you can touch, 3 you can hear.',
      'Share your worries with someone you trust.',
      'Physical activity can help reduce anxiety.',
      'Consider talking to a counselor if anxiety persists.',
    ],
    sad: [
      'It\'s okay to feel sad. Allow yourself to process these emotions.',
      'Reach out to family or friends for support.',
      'Engage in activities you usually enjoy.',
      'If sadness persists for weeks, consider professional support.',
    ],
    angry: [
      'Take a moment to cool down before reacting.',
      'Express your feelings calmly and clearly.',
      'Physical activity can help release anger safely.',
      'Try to understand what triggered this emotion.',
    ],
    overwhelmed: [
      'Prioritize your tasks. You don\'t have to do everything at once.',
      'Ask family members for help with responsibilities.',
      'Take regular breaks throughout the day.',
      'Focus on one thing at a time.',
    ],
    tired: [
      'Ensure you\'re getting enough sleep (7-9 hours for adults, more for children).',
      'Take short breaks during the day.',
      'Stay hydrated and eat nutritious meals.',
      'Consider if you\'re taking on too much.',
    ],
    lonely: [
      'Reach out to family or friends, even just to chat.',
      'Join family activities or suggest new ones.',
      'Remember: you\'re not alone. Your family cares about you.',
      'Consider joining community groups or activities.',
    ],
  };
  
  return suggestions[mood] || [
    'Take time to understand your feelings.',
    'Share your emotions with family members.',
    'Engage in activities that bring you joy.',
  ];
};

export const detectConcerningPatterns = (moodLogs, userId) => {
  const userLogs = moodLogs.filter(log => log.userId === userId);
  const recentLogs = userLogs.slice(-14);
  
  if (recentLogs.length < 7) return null;
  
  const negativeEmotions = ['sad', 'anxious', 'stressed', 'overwhelmed', 'angry', 'lonely', 'scared'];
  const negativeCount = recentLogs.filter(log => negativeEmotions.includes(log.mood)).length;
  
  const percentage = (negativeCount / recentLogs.length) * 100;
  
  if (percentage >= 70) {
    return {
      level: 'high',
      message: 'We\'ve noticed you\'ve been experiencing difficult emotions frequently. Consider talking to a mental health professional.',
      recommendation: 'professional',
    };
  } else if (percentage >= 50) {
    return {
      level: 'moderate',
      message: 'You\'ve had some challenging days recently. Make sure to practice self-care and talk to family.',
      recommendation: 'support',
    };
  }
  
  return null;
};

export const calculateEmotionalScore = (mood) => {
  const emotion = emotions.find(e => e.id === mood);
  return emotion ? emotion.score : 3;
};

export const getEmotionColor = (mood) => {
  const emotion = emotions.find(e => e.id === mood);
  return emotion ? emotion.color : '#9E9E9E';
};

export const getEmotionEmoji = (mood) => {
  const emotion = emotions.find(e => e.id === mood);
  return emotion ? emotion.emoji : '😐';
};

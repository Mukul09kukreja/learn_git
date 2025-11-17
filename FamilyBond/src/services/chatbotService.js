const responses = {
  greetings: [
    "Hello! I'm here to help your family communicate better. How can I support you today?",
    "Hi there! I'm your family coach. What would you like to talk about?",
    "Welcome! I'm here to help with family communication and emotional support. What's on your mind?",
  ],
  
  parenting: {
    keywords: ['parent', 'parenting', 'child', 'kid', 'discipline', 'behavior'],
    responses: [
      "Parenting is a journey of learning together. Remember that every child is unique and what works for one may not work for another. The key is consistent, loving communication.",
      "Effective parenting involves active listening, setting clear boundaries with love, and being present. Children need to feel heard and understood, not just instructed.",
      "When facing behavioral challenges, try to understand the underlying emotion or need. Often, 'misbehavior' is a child's way of communicating something they can't express in words.",
      "Positive reinforcement works better than punishment. Celebrate small wins and progress. Children thrive when they feel appreciated and valued.",
    ],
  },
  
  communication: {
    keywords: ['talk', 'communicate', 'listen', 'conversation', 'speak', 'express'],
    responses: [
      "Good communication starts with active listening. Put away distractions, make eye contact, and truly hear what the other person is saying without planning your response.",
      "Use 'I' statements instead of 'you' statements. For example, 'I feel worried when...' instead of 'You always...'. This reduces defensiveness and opens dialogue.",
      "Create regular family time for open conversations. Even 15 minutes of undivided attention can strengthen bonds significantly.",
      "Encourage everyone to share their feelings without judgment. Create a safe space where all emotions are valid and respected.",
    ],
  },
  
  emotions: {
    keywords: ['feel', 'emotion', 'sad', 'angry', 'happy', 'stressed', 'anxious', 'mood'],
    responses: [
      "All emotions are valid and serve a purpose. It's important to acknowledge and express feelings in healthy ways rather than suppressing them.",
      "Help children name their emotions. Emotional literacy is a crucial life skill. Use phrases like 'It sounds like you're feeling frustrated because...'",
      "Model healthy emotional expression. Children learn by watching how adults handle their own emotions.",
      "When emotions run high, take a pause. It's okay to say 'I need a moment to calm down before we continue this conversation.'",
    ],
  },
  
  conflict: {
    keywords: ['fight', 'argue', 'conflict', 'disagree', 'problem', 'issue'],
    responses: [
      "Conflicts are normal in families. What matters is how you resolve them. Focus on the issue, not attacking the person.",
      "Try the 'pause and reflect' approach: When tensions rise, take a break, calm down, then return to discuss the issue with a clearer mind.",
      "Teach problem-solving skills: Define the problem together, brainstorm solutions, evaluate options, and agree on a solution to try.",
      "After a conflict, reconnect. A hug, an apology, or simply spending positive time together helps repair and strengthen relationships.",
    ],
  },
  
  bonding: {
    keywords: ['bond', 'connect', 'together', 'activity', 'quality time', 'family time'],
    responses: [
      "Quality matters more than quantity. Even 10 minutes of fully present, engaged time can be more valuable than hours of distracted togetherness.",
      "Find activities everyone enjoys. It doesn't have to be elaborate - simple things like cooking together, walking, or playing games create lasting memories.",
      "Create family rituals and traditions. These provide stability, identity, and something to look forward to.",
      "Regular family meetings can strengthen bonds. Discuss the week, share appreciations, address concerns, and plan together.",
    ],
  },
  
  stress: {
    keywords: ['stress', 'overwhelm', 'pressure', 'busy', 'tired', 'exhausted'],
    responses: [
      "Stress affects the whole family. Make sure everyone, including parents, practices self-care. You can't pour from an empty cup.",
      "Break tasks into smaller steps. Overwhelm often comes from seeing everything at once. Focus on one thing at a time.",
      "It's okay to say no and set boundaries. Overcommitment leads to stress and reduces quality family time.",
      "Physical activity, adequate sleep, and healthy eating significantly impact stress levels. Make these priorities for the whole family.",
    ],
  },
  
  support: {
    keywords: ['help', 'support', 'advice', 'guidance', 'counselor', 'therapist'],
    responses: [
      "Seeking help is a sign of strength, not weakness. If you're struggling, consider talking to a family counselor or therapist.",
      "Professional support can provide tools and strategies tailored to your family's specific needs. Don't hesitate to reach out.",
      "Many families benefit from counseling during transitions or challenging times. It's a proactive step toward healthier relationships.",
      "Remember, you don't have to figure everything out alone. Support is available and can make a real difference.",
    ],
  },
};

export const getChatbotResponse = (userMessage) => {
  const message = userMessage.toLowerCase().trim();
  
  if (message.match(/^(hi|hello|hey|greetings)/)) {
    return responses.greetings[Math.floor(Math.random() * responses.greetings.length)];
  }
  
  for (const [category, data] of Object.entries(responses)) {
    if (category === 'greetings') continue;
    
    const hasKeyword = data.keywords.some(keyword => message.includes(keyword));
    if (hasKeyword) {
      return data.responses[Math.floor(Math.random() * data.responses.length)];
    }
  }
  
  const defaultResponses = [
    "That's an important topic. Could you tell me more about what specific aspect you'd like help with?",
    "I'm here to help. Can you share more details about your situation so I can provide better guidance?",
    "Every family is unique. What specific challenge or question do you have in mind?",
    "I want to make sure I understand correctly. Could you elaborate on what you're experiencing?",
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};

export const getContextualAdvice = (mood, role) => {
  const advice = {
    parent: {
      stressed: "As a parent, your well-being matters too. Take breaks, ask for help, and remember that perfect parenting doesn't exist. You're doing better than you think.",
      sad: "It's okay for children to see that parents have emotions too. Model healthy ways to cope with sadness while ensuring they feel secure.",
      anxious: "Children can sense parental anxiety. Practice self-care and consider talking to someone. Your emotional health impacts the whole family.",
      angry: "Before reacting in anger, take a pause. Children learn emotional regulation by watching you. It's okay to say 'I need a moment.'",
    },
    child: {
      stressed: "School and life can feel overwhelming. Talk to your parents about what's bothering you. They want to help, even if it doesn't always feel that way.",
      sad: "Feeling sad is normal and okay. Don't keep it inside. Your family loves you and wants to support you through difficult times.",
      anxious: "Anxiety can feel scary, but you're not alone. Share your worries with someone you trust. There are ways to feel better.",
      angry: "Anger is a normal emotion. It's okay to feel it, but it's important to express it safely. Try talking about what made you angry instead of acting out.",
    },
  };
  
  return advice[role]?.[mood] || "Remember to communicate openly with your family. Sharing feelings helps everyone understand each other better.";
};

export const getSuggestionForImprovement = (activityLogs, moodLogs) => {
  const recentActivities = activityLogs.slice(-7);
  const recentMoods = moodLogs.slice(-7);
  
  if (recentActivities.length < 3) {
    return "Try to engage in at least one family activity this week. Regular bonding time strengthens relationships.";
  }
  
  const negativeCount = recentMoods.filter(log => 
    ['sad', 'anxious', 'stressed', 'angry', 'overwhelmed'].includes(log.mood)
  ).length;
  
  if (negativeCount > recentMoods.length * 0.6) {
    return "I've noticed some challenging emotions lately. Consider having a family check-in to talk about how everyone is feeling.";
  }
  
  return "You're doing great with family activities! Keep up the consistent bonding time.";
};

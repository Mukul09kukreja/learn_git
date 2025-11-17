import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Title, Paragraph, Button, Avatar, ProgressBar } from 'react-native-paper';
import { useApp } from '../../contexts/AppContext';
import { getRecommendedActivities } from '../../data/activitiesData';
import { detectConcerningPatterns, getEmotionEmoji } from '../../utils/emotionAnalysis';

const HomeScreen = ({ navigation }) => {
  const { user, familyMembers, moodLogs, activityLogs } = useApp();
  const [recommendedActivities, setRecommendedActivities] = useState([]);
  const [todayMood, setTodayMood] = useState(null);
  const [weeklyProgress, setWeeklyProgress] = useState(0);

  useEffect(() => {
    const recommended = getRecommendedActivities(moodLogs, familyMembers, activityLogs);
    setRecommendedActivities(recommended.slice(0, 3));

    const today = new Date().toDateString();
    const todayLog = moodLogs.find(
      (log) => log.userId === user?.id && new Date(log.date).toDateString() === today
    );
    setTodayMood(todayLog);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklyActivities = activityLogs.filter(
      (log) => new Date(log.date) >= weekAgo
    );
    setWeeklyProgress(Math.min(weeklyActivities.length / 7, 1));
  }, [moodLogs, activityLogs, user]);

  const concerningPattern = user ? detectConcerningPatterns(moodLogs, user.id) : null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name}! 👋</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</Text>
        </View>
      </View>

      {!todayMood && (
        <Card style={styles.moodPrompt}>
          <Card.Content>
            <Title>How are you feeling today?</Title>
            <Paragraph>Take a moment to log your mood and reflect on your day.</Paragraph>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Mood')}
              style={styles.promptButton}
            >
              Log My Mood
            </Button>
          </Card.Content>
        </Card>
      )}

      {todayMood && (
        <Card style={styles.moodCard}>
          <Card.Content>
            <View style={styles.moodDisplay}>
              <Text style={styles.moodEmoji}>{getEmotionEmoji(todayMood.mood)}</Text>
              <View style={styles.moodInfo}>
                <Text style={styles.moodLabel}>Today's Mood</Text>
                <Text style={styles.moodText}>{todayMood.mood}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      {concerningPattern && (
        <Card style={[styles.alertCard, { backgroundColor: concerningPattern.level === 'high' ? '#ffebee' : '#fff3e0' }]}>
          <Card.Content>
            <Title style={styles.alertTitle}>💙 We Care About You</Title>
            <Paragraph>{concerningPattern.message}</Paragraph>
            {concerningPattern.level === 'high' && (
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('Reports')}
                style={styles.alertButton}
              >
                View Support Resources
              </Button>
            )}
          </Card.Content>
        </Card>
      )}

      <Card style={styles.progressCard}>
        <Card.Content>
          <Title>Weekly Family Time</Title>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              {activityLogs.filter(log => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(log.date) >= weekAgo;
              }).length} activities this week
            </Text>
          </View>
          <ProgressBar progress={weeklyProgress} color="#6200ee" style={styles.progressBar} />
          <Text style={styles.progressSubtext}>
            {weeklyProgress >= 0.7 ? 'Great job! 🎉' : 'Keep it up! 💪'}
          </Text>
        </Card.Content>
      </Card>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Title>Recommended Activities</Title>
          <TouchableOpacity onPress={() => navigation.navigate('Activities')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {recommendedActivities.map((activity) => (
          <Card key={activity.id} style={styles.activityCard}>
            <Card.Content>
              <View style={styles.activityHeader}>
                <Text style={styles.activityIcon}>{activity.icon}</Text>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDuration}>{activity.duration} min</Text>
                </View>
              </View>
              <Paragraph style={styles.activityDescription}>
                {activity.description}
              </Paragraph>
            </Card.Content>
          </Card>
        ))}
      </View>

      <Card style={styles.coachCard}>
        <Card.Content>
          <View style={styles.coachHeader}>
            <Avatar.Icon size={50} icon="chat" style={styles.coachAvatar} />
            <View style={styles.coachInfo}>
              <Title style={styles.coachTitle}>Family Coach</Title>
              <Paragraph>Get personalized advice and support</Paragraph>
            </View>
          </View>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Coach')}
            style={styles.coachButton}
          >
            Start Conversation
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#6200ee',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: '#e0e0e0',
  },
  moodPrompt: {
    margin: 15,
    elevation: 3,
  },
  promptButton: {
    marginTop: 10,
  },
  moodCard: {
    margin: 15,
    elevation: 3,
  },
  moodDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 50,
    marginRight: 15,
  },
  moodInfo: {
    flex: 1,
  },
  moodLabel: {
    fontSize: 14,
    color: '#666',
  },
  moodText: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  alertCard: {
    margin: 15,
    elevation: 3,
  },
  alertTitle: {
    fontSize: 18,
  },
  alertButton: {
    marginTop: 10,
  },
  progressCard: {
    margin: 15,
    elevation: 3,
  },
  progressInfo: {
    marginVertical: 10,
  },
  progressText: {
    fontSize: 16,
    color: '#333',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  progressSubtext: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  section: {
    padding: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  seeAll: {
    color: '#6200ee',
    fontSize: 14,
    fontWeight: 'bold',
  },
  activityCard: {
    marginBottom: 10,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  activityIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activityDuration: {
    fontSize: 12,
    color: '#666',
  },
  activityDescription: {
    fontSize: 14,
    color: '#555',
  },
  coachCard: {
    margin: 15,
    marginBottom: 30,
    elevation: 3,
  },
  coachHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  coachAvatar: {
    backgroundColor: '#6200ee',
    marginRight: 15,
  },
  coachInfo: {
    flex: 1,
  },
  coachTitle: {
    fontSize: 18,
    marginBottom: 0,
  },
  coachButton: {
    marginTop: 5,
  },
});

export default HomeScreen;

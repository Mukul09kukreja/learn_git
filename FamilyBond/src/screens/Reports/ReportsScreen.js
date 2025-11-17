import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Linking } from 'react-native';
import { Text, Card, Title, Paragraph, Button, SegmentedButtons, Chip } from 'react-native-paper';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useApp } from '../../contexts/AppContext';
import { calculateEmotionalScore, getEmotionColor, detectConcerningPatterns } from '../../utils/emotionAnalysis';

const screenWidth = Dimensions.get('window').width;

const ReportsScreen = () => {
  const { user, familyMembers, moodLogs, activityLogs } = useApp();
  const [timeRange, setTimeRange] = useState('week');
  const [selectedMember, setSelectedMember] = useState(user?.id);
  const [chartData, setChartData] = useState(null);
  const [activityData, setActivityData] = useState(null);
  const [stats, setStats] = useState({});

  useEffect(() => {
    generateReports();
  }, [timeRange, selectedMember, moodLogs, activityLogs]);

  const generateReports = () => {
    const now = new Date();
    let daysBack = 7;
    if (timeRange === 'month') daysBack = 30;
    if (timeRange === 'week') daysBack = 7;

    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - daysBack);

    const memberLogs = moodLogs.filter(
      (log) => log.userId === selectedMember && new Date(log.date) >= startDate
    );

    const labels = [];
    const scores = [];
    const emotionCounts = {};

    for (let i = daysBack - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      labels.push(dateStr);

      const dayLog = memberLogs.find(
        (log) => new Date(log.date).toDateString() === date.toDateString()
      );

      if (dayLog) {
        scores.push(calculateEmotionalScore(dayLog.mood));
        emotionCounts[dayLog.mood] = (emotionCounts[dayLog.mood] || 0) + 1;
      } else {
        scores.push(null);
      }
    }

    setChartData({
      labels: timeRange === 'week' ? labels : labels.filter((_, i) => i % 3 === 0),
      datasets: [
        {
          data: timeRange === 'week' ? scores : scores.filter((_, i) => i % 3 === 0),
          color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    });

    const topEmotions = Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    setActivityData({
      labels: topEmotions.map(([emotion]) => emotion.substring(0, 6)),
      datasets: [
        {
          data: topEmotions.map(([, count]) => count),
        },
      ],
    });

    const avgScore = scores.filter((s) => s !== null).reduce((a, b) => a + b, 0) / scores.filter((s) => s !== null).length || 0;
    const totalActivities = activityLogs.filter((log) => new Date(log.date) >= startDate).length;

    setStats({
      avgScore: avgScore.toFixed(1),
      totalMoodLogs: memberLogs.length,
      totalActivities,
      topEmotion: topEmotions[0]?.[0] || 'N/A',
    });
  };

  const concerningPattern = selectedMember ? detectConcerningPatterns(moodLogs, selectedMember) : null;

  const chartConfig = {
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#6200ee',
    },
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Emotional Insights</Text>
        <Text style={styles.headerSubtitle}>Track your family's well-being</Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Family Member</Title>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.memberSelector}>
            {familyMembers.map((member) => (
              <Chip
                key={member.id}
                selected={selectedMember === member.id}
                onPress={() => setSelectedMember(member.id)}
                style={styles.memberChip}
              >
                {member.name}
              </Chip>
            ))}
          </ScrollView>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <SegmentedButtons
            value={timeRange}
            onValueChange={setTimeRange}
            buttons={[
              { value: 'week', label: 'Week' },
              { value: 'month', label: 'Month' },
            ]}
          />
        </Card.Content>
      </Card>

      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Text style={styles.statValue}>{stats.avgScore}</Text>
            <Text style={styles.statLabel}>Avg Mood Score</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Text style={styles.statValue}>{stats.totalMoodLogs}</Text>
            <Text style={styles.statLabel}>Mood Logs</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Text style={styles.statValue}>{stats.totalActivities}</Text>
            <Text style={styles.statLabel}>Activities</Text>
          </Card.Content>
        </Card>
      </View>

      {chartData && chartData.datasets[0].data.filter((d) => d !== null).length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Emotional Trend</Title>
            <Paragraph style={styles.chartDescription}>
              Track emotional well-being over time (1=Low, 5=High)
            </Paragraph>
            <LineChart
              data={chartData}
              width={screenWidth - 60}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              withInnerLines={false}
              withOuterLines={true}
              withVerticalLabels={true}
              withHorizontalLabels={true}
              fromZero
              segments={4}
            />
          </Card.Content>
        </Card>
      )}

      {activityData && activityData.datasets[0].data.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Most Common Emotions</Title>
            <Paragraph style={styles.chartDescription}>
              Your emotional patterns during this period
            </Paragraph>
            <BarChart
              data={activityData}
              width={screenWidth - 60}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              showValuesOnTopOfBars
              fromZero
            />
          </Card.Content>
        </Card>
      )}

      {concerningPattern && (
        <Card style={[styles.card, styles.alertCard]}>
          <Card.Content>
            <Title style={styles.alertTitle}>💙 Mental Health Support</Title>
            <Paragraph style={styles.alertText}>{concerningPattern.message}</Paragraph>
            {concerningPattern.level === 'high' && (
              <View style={styles.supportSection}>
                <Paragraph style={styles.supportText}>
                  Consider reaching out to a mental health professional. Here are some resources:
                </Paragraph>
                <Button
                  mode="contained"
                  onPress={() => Linking.openURL('tel:988')}
                  style={styles.supportButton}
                >
                  988 - Suicide & Crisis Lifeline
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => Linking.openURL('https://www.psychologytoday.com/us/therapists')}
                  style={styles.supportButton}
                >
                  Find a Therapist
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>
      )}

      <Card style={styles.card}>
        <Card.Content>
          <Title>Professional Support Resources</Title>
          <Paragraph style={styles.resourceText}>
            Seeking help is a sign of strength. These resources are available 24/7:
          </Paragraph>
          <View style={styles.resourceList}>
            <Button
              mode="outlined"
              onPress={() => Linking.openURL('tel:988')}
              style={styles.resourceButton}
              icon="phone"
            >
              988 - Suicide & Crisis Lifeline
            </Button>
            <Button
              mode="outlined"
              onPress={() => Linking.openURL('sms:741741')}
              style={styles.resourceButton}
              icon="message"
            >
              Text HOME to 741741 - Crisis Text Line
            </Button>
            <Button
              mode="outlined"
              onPress={() => Linking.openURL('https://www.betterhelp.com')}
              style={styles.resourceButton}
              icon="web"
            >
              BetterHelp - Online Therapy
            </Button>
            <Button
              mode="outlined"
              onPress={() => Linking.openURL('https://www.talkspace.com')}
              style={styles.resourceButton}
              icon="web"
            >
              Talkspace - Online Counseling
            </Button>
          </View>
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
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e0e0e0',
  },
  card: {
    margin: 15,
    marginTop: 0,
    elevation: 3,
  },
  memberSelector: {
    marginTop: 10,
  },
  memberChip: {
    marginRight: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    elevation: 3,
  },
  statContent: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  chartDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  chart: {
    marginVertical: 10,
    borderRadius: 16,
  },
  alertCard: {
    backgroundColor: '#fff3e0',
  },
  alertTitle: {
    fontSize: 18,
    color: '#e65100',
  },
  alertText: {
    marginTop: 10,
    fontSize: 14,
  },
  supportSection: {
    marginTop: 15,
  },
  supportText: {
    marginBottom: 10,
    fontWeight: '500',
  },
  supportButton: {
    marginTop: 8,
  },
  resourceText: {
    marginTop: 10,
    marginBottom: 15,
  },
  resourceList: {
    marginTop: 10,
  },
  resourceButton: {
    marginBottom: 10,
  },
});

export default ReportsScreen;

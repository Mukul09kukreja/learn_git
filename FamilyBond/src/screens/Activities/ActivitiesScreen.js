import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Title, Paragraph, Button, Chip, Searchbar, FAB } from 'react-native-paper';
import { useApp } from '../../contexts/AppContext';
import { activitiesData, getRecommendedActivities } from '../../data/activitiesData';

const ActivitiesScreen = () => {
  const { moodLogs, familyMembers, activityLogs, addActivityLog } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredActivities, setFilteredActivities] = useState(activitiesData);
  const [recommendedActivities, setRecommendedActivities] = useState([]);

  useEffect(() => {
    const recommended = getRecommendedActivities(moodLogs, familyMembers, activityLogs);
    setRecommendedActivities(recommended);
  }, [moodLogs, activityLogs]);

  useEffect(() => {
    let filtered = activitiesData;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((activity) => activity.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (activity) =>
          activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          activity.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredActivities(filtered);
  }, [selectedCategory, searchQuery]);

  const handleCompleteActivity = async (activity) => {
    const log = {
      activityId: activity.id,
      activityTitle: activity.title,
      date: new Date().toISOString(),
      duration: activity.duration,
      participants: familyMembers.map((m) => m.id),
    };

    await addActivityLog(log);
    alert(`Great! "${activity.title}" has been logged. Keep up the bonding! 🎉`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Family Activities</Text>
        <Text style={styles.headerSubtitle}>Strengthen your bonds together</Text>
      </View>

      <Searchbar
        placeholder="Search activities..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <ScrollView style={styles.content}>
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Chip
              selected={selectedCategory === 'all'}
              onPress={() => setSelectedCategory('all')}
              style={styles.filterChip}
            >
              All
            </Chip>
            <Chip
              selected={selectedCategory === 'daily'}
              onPress={() => setSelectedCategory('daily')}
              style={styles.filterChip}
            >
              Daily
            </Chip>
            <Chip
              selected={selectedCategory === 'weekly'}
              onPress={() => setSelectedCategory('weekly')}
              style={styles.filterChip}
            >
              Weekly
            </Chip>
            <Chip
              selected={selectedCategory === 'monthly'}
              onPress={() => setSelectedCategory('monthly')}
              style={styles.filterChip}
            >
              Monthly
            </Chip>
          </ScrollView>
        </View>

        {recommendedActivities.length > 0 && selectedCategory === 'all' && !searchQuery && (
          <View style={styles.section}>
            <Title style={styles.sectionTitle}>✨ Recommended for You</Title>
            {recommendedActivities.slice(0, 3).map((activity) => (
              <Card key={activity.id} style={styles.activityCard}>
                <Card.Content>
                  <View style={styles.activityHeader}>
                    <Text style={styles.activityIcon}>{activity.icon}</Text>
                    <View style={styles.activityInfo}>
                      <Text style={styles.activityTitle}>{activity.title}</Text>
                      <View style={styles.activityMeta}>
                        <Text style={styles.activityDuration}>⏱️ {activity.duration} min</Text>
                        <Chip style={styles.categoryChip} textStyle={styles.categoryChipText}>
                          {activity.category}
                        </Chip>
                      </View>
                    </View>
                  </View>
                  <Paragraph style={styles.activityDescription}>{activity.description}</Paragraph>
                  <Button
                    mode="contained"
                    onPress={() => handleCompleteActivity(activity)}
                    style={styles.completeButton}
                  >
                    Mark as Done
                  </Button>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Title style={styles.sectionTitle}>
            {selectedCategory === 'all' ? 'All Activities' : `${selectedCategory} Activities`}
          </Title>
          {filteredActivities.map((activity) => (
            <Card key={activity.id} style={styles.activityCard}>
              <Card.Content>
                <View style={styles.activityHeader}>
                  <Text style={styles.activityIcon}>{activity.icon}</Text>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <View style={styles.activityMeta}>
                      <Text style={styles.activityDuration}>⏱️ {activity.duration} min</Text>
                      <Chip style={styles.categoryChip} textStyle={styles.categoryChipText}>
                        {activity.category}
                      </Chip>
                    </View>
                  </View>
                </View>
                <Paragraph style={styles.activityDescription}>{activity.description}</Paragraph>
                <Button
                  mode="outlined"
                  onPress={() => handleCompleteActivity(activity)}
                  style={styles.completeButton}
                >
                  Mark as Done
                </Button>
              </Card.Content>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
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
  searchBar: {
    margin: 15,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  filterContainer: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  filterChip: {
    marginRight: 8,
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  activityCard: {
    marginBottom: 15,
    elevation: 3,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  activityIcon: {
    fontSize: 50,
    marginRight: 15,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  activityDuration: {
    fontSize: 12,
    color: '#666',
    marginRight: 10,
  },
  categoryChip: {
    height: 24,
    backgroundColor: '#e3f2fd',
  },
  categoryChipText: {
    fontSize: 10,
    marginVertical: 0,
  },
  activityDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  completeButton: {
    marginTop: 5,
  },
});

export default ActivitiesScreen;

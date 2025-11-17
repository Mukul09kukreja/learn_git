import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Card, Title, Paragraph, TextInput, Button, Chip } from 'react-native-paper';
import { useApp } from '../../contexts/AppContext';
import { emotions, analyzeText, generateSuggestions } from '../../utils/emotionAnalysis';

const MoodLogScreen = () => {
  const { user, addMoodLog } = useApp();
  const [selectedMood, setSelectedMood] = useState(null);
  const [dayDescription, setDayDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const handleSubmit = async () => {
    if (!selectedMood) return;

    const sentiment = analyzeText(dayDescription);
    const moodSuggestions = generateSuggestions(selectedMood.id, sentiment.sentiment);

    const log = {
      userId: user.id,
      mood: selectedMood.id,
      description: dayDescription,
      sentiment: sentiment,
      date: new Date().toISOString(),
    };

    await addMoodLog(log);
    setSuggestions(moodSuggestions);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSelectedMood(null);
    setDayDescription('');
    setSubmitted(false);
    setSuggestions([]);
  };

  if (submitted) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mood Logged! ✓</Text>
        </View>

        <Card style={styles.resultCard}>
          <Card.Content>
            <View style={styles.moodResult}>
              <Text style={styles.resultEmoji}>{selectedMood.emoji}</Text>
              <Title style={styles.resultTitle}>You're feeling {selectedMood.label}</Title>
            </View>
            <Paragraph style={styles.resultText}>
              Thank you for sharing how you're feeling. Here are some personalized suggestions:
            </Paragraph>
          </Card.Content>
        </Card>

        <View style={styles.suggestionsContainer}>
          <Title style={styles.suggestionsTitle}>💡 Suggestions for You</Title>
          {suggestions.map((suggestion, index) => (
            <Card key={index} style={styles.suggestionCard}>
              <Card.Content>
                <Paragraph>{suggestion}</Paragraph>
              </Card.Content>
            </Card>
          ))}
        </View>

        <Button
          mode="contained"
          onPress={handleReset}
          style={styles.doneButton}
          contentStyle={styles.buttonContent}
        >
          Done
        </Button>
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>How are you feeling?</Text>
          <Text style={styles.headerSubtitle}>Select the emotion that best describes your mood</Text>
        </View>

        <View style={styles.emotionsGrid}>
          {emotions.map((emotion) => (
            <TouchableOpacity
              key={emotion.id}
              style={[
                styles.emotionCard,
                selectedMood?.id === emotion.id && styles.emotionCardSelected,
              ]}
              onPress={() => setSelectedMood(emotion)}
            >
              <Text style={styles.emotionEmoji}>{emotion.emoji}</Text>
              <Text style={styles.emotionLabel}>{emotion.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedMood && (
          <Card style={styles.descriptionCard}>
            <Card.Content>
              <Title>Tell us about your day</Title>
              <Paragraph style={styles.descriptionHint}>
                What happened today? How did it make you feel? (Optional)
              </Paragraph>
              <TextInput
                mode="outlined"
                multiline
                numberOfLines={6}
                value={dayDescription}
                onChangeText={setDayDescription}
                placeholder="I felt this way because..."
                style={styles.textInput}
              />
            </Card.Content>
          </Card>
        )}

        {selectedMood && (
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.submitButton}
            contentStyle={styles.buttonContent}
          >
            Log My Mood
          </Button>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
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
    marginBottom: 20,
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
  emotionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-around',
  },
  emotionCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emotionCardSelected: {
    borderColor: '#6200ee',
    backgroundColor: '#f3e5f5',
    elevation: 4,
  },
  emotionEmoji: {
    fontSize: 40,
    marginBottom: 5,
  },
  emotionLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  descriptionCard: {
    margin: 15,
    elevation: 3,
  },
  descriptionHint: {
    marginTop: 5,
    marginBottom: 10,
    color: '#666',
  },
  textInput: {
    marginTop: 10,
  },
  submitButton: {
    margin: 15,
    marginBottom: 30,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  resultCard: {
    margin: 15,
    elevation: 3,
  },
  moodResult: {
    alignItems: 'center',
    marginBottom: 15,
  },
  resultEmoji: {
    fontSize: 80,
    marginBottom: 10,
  },
  resultTitle: {
    fontSize: 22,
    textAlign: 'center',
  },
  resultText: {
    textAlign: 'center',
    color: '#666',
  },
  suggestionsContainer: {
    padding: 15,
  },
  suggestionsTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  suggestionCard: {
    marginBottom: 10,
    elevation: 2,
    backgroundColor: '#e8f5e9',
  },
  doneButton: {
    margin: 15,
    marginBottom: 30,
  },
});

export default MoodLogScreen;

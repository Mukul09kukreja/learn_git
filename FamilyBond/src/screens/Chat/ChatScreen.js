import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, IconButton, Card, Avatar } from 'react-native-paper';
import { useApp } from '../../contexts/AppContext';
import { getChatbotResponse, getContextualAdvice } from '../../services/chatbotService';

const ChatScreen = () => {
  const { user, moodLogs } = useApp();
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Hello! I'm your Family Coach. I'm here to help with communication, parenting advice, and emotional support. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef();

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const botResponse = getChatbotResponse(inputText);
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);

    setInputText('');
  };

  const handleQuickAction = (action) => {
    let response = '';
    const recentMood = moodLogs.filter((log) => log.userId === user?.id).slice(-1)[0];

    switch (action) {
      case 'tips':
        response = "Here are some communication tips: 1) Practice active listening without interrupting. 2) Use 'I' statements to express feelings. 3) Set aside dedicated family time daily. 4) Create a judgment-free zone for sharing emotions.";
        break;
      case 'mood':
        if (recentMood) {
          response = getContextualAdvice(recentMood.mood, user?.role || 'parent');
        } else {
          response = "I notice you haven't logged your mood yet today. Understanding your emotions is the first step to better communication. Would you like to share how you're feeling?";
        }
        break;
      case 'conflict':
        response = "When conflicts arise: 1) Take a pause to calm down. 2) Focus on the issue, not the person. 3) Listen to understand, not to respond. 4) Find common ground and compromise. 5) Reconnect after resolution with a hug or kind words.";
        break;
      case 'bonding':
        response = "Quality family time doesn't need to be elaborate. Try: 1) Device-free meals together. 2) 15-minute daily check-ins. 3) Weekly game nights. 4) Outdoor walks. 5) Cooking together. The key is being fully present and engaged.";
        break;
      default:
        response = "How can I help you today?";
    }

    const botMessage = {
      id: Date.now().toString(),
      text: response,
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={0}
    >
      <View style={styles.header}>
        <Avatar.Icon size={40} icon="chat" style={styles.avatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Family Coach</Text>
          <Text style={styles.headerSubtitle}>Always here to help</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.length === 1 && (
          <View style={styles.quickActions}>
            <Text style={styles.quickActionsTitle}>Quick Topics:</Text>
            <View style={styles.quickActionsButtons}>
              <Card style={styles.quickActionCard} onPress={() => handleQuickAction('tips')}>
                <Card.Content style={styles.quickActionContent}>
                  <Text style={styles.quickActionIcon}>💬</Text>
                  <Text style={styles.quickActionText}>Communication Tips</Text>
                </Card.Content>
              </Card>
              <Card style={styles.quickActionCard} onPress={() => handleQuickAction('mood')}>
                <Card.Content style={styles.quickActionContent}>
                  <Text style={styles.quickActionIcon}>😊</Text>
                  <Text style={styles.quickActionText}>Mood Support</Text>
                </Card.Content>
              </Card>
              <Card style={styles.quickActionCard} onPress={() => handleQuickAction('conflict')}>
                <Card.Content style={styles.quickActionContent}>
                  <Text style={styles.quickActionIcon}>🤝</Text>
                  <Text style={styles.quickActionText}>Conflict Resolution</Text>
                </Card.Content>
              </Card>
              <Card style={styles.quickActionCard} onPress={() => handleQuickAction('bonding')}>
                <Card.Content style={styles.quickActionContent}>
                  <Text style={styles.quickActionIcon}>❤️</Text>
                  <Text style={styles.quickActionText}>Bonding Ideas</Text>
                </Card.Content>
              </Card>
            </View>
          </View>
        )}

        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageWrapper,
              message.sender === 'user' ? styles.userMessageWrapper : styles.botMessageWrapper,
            ]}
          >
            {message.sender === 'bot' && (
              <Avatar.Icon size={32} icon="robot" style={styles.botAvatar} />
            )}
            <View
              style={[
                styles.messageBubble,
                message.sender === 'user' ? styles.userMessage : styles.botMessage,
              ]}
            >
              <Text style={message.sender === 'user' ? styles.userMessageText : styles.botMessageText}>
                {message.text}
              </Text>
              <Text style={styles.timestamp}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          mode="outlined"
          placeholder="Type your message..."
          value={inputText}
          onChangeText={setInputText}
          style={styles.input}
          multiline
          maxLength={500}
          onSubmitEditing={handleSend}
        />
        <IconButton
          icon="send"
          size={24}
          iconColor="#fff"
          style={styles.sendButton}
          onPress={handleSend}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingTop: 60,
    backgroundColor: '#6200ee',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  avatar: {
    backgroundColor: '#fff',
  },
  headerInfo: {
    marginLeft: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#e0e0e0',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 15,
  },
  quickActions: {
    marginBottom: 20,
  },
  quickActionsTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  quickActionsButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    marginBottom: 10,
    elevation: 2,
  },
  quickActionContent: {
    alignItems: 'center',
    padding: 10,
  },
  quickActionIcon: {
    fontSize: 30,
    marginBottom: 5,
  },
  quickActionText: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-end',
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  botMessageWrapper: {
    justifyContent: 'flex-start',
  },
  botAvatar: {
    backgroundColor: '#6200ee',
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 15,
  },
  userMessage: {
    backgroundColor: '#6200ee',
    borderBottomRightRadius: 5,
  },
  botMessage: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 5,
    elevation: 1,
  },
  userMessageText: {
    color: '#fff',
    fontSize: 15,
  },
  botMessageText: {
    color: '#333',
    fontSize: 15,
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: '#fff',
  },
  sendButton: {
    backgroundColor: '#6200ee',
    marginLeft: 5,
  },
});

export default ChatScreen;

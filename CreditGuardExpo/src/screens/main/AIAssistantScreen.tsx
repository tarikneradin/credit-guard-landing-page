import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {useCreditStore} from '../../stores/creditStore';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  message: string;
  timestamp: Date;
}

export const AIAssistantScreen: React.FC = () => {
  const {theme} = useTheme();
  const {creditScore, reportSummary} = useCreditStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Quick suggestions for users
  const quickSuggestions = [
    'How can I improve my credit score?',
    'What affects my credit utilization?',
    'Should I pay off my debt early?',
    'Explain my credit report',
    "What's a good credit score?",
    'How to dispute credit errors?',
  ];

  useEffect(() => {
    // Initial welcome message
    const welcomeMessage: ChatMessage = {
      id: '1',
      type: 'ai',
      message: `Hello! I'm your AI Credit Assistant. I can help you understand your credit report, improve your score, and answer any credit-related questions. Your current credit score is ${creditScore?.score || 'not available'}. How can I help you today?`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [creditScore]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: message.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Call AI service (currently using mock, but ready for real AI)
      const context = {
        creditScore: creditScore,
        reportSummary: reportSummary,
        conversationHistory: messages,
      };

      const aiResponse = await callRealAI(message, context);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: aiResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      // Handle AI service errors
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message:
          "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({animated: true});
    }, 100);
  };

  const handleClearConversation = () => {
    Alert.alert(
      'Clear Conversation',
      'Are you sure you want to clear this conversation? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            const welcomeMessage: ChatMessage = {
              id: Date.now().toString(),
              type: 'ai',
              message: `Hello! I'm your AI Credit Assistant. I can help you understand your credit report, improve your score, and answer any credit-related questions. Your current credit score is ${creditScore?.score || 'not available'}. How can I help you today?`,
              timestamp: new Date(),
            };
            setMessages([welcomeMessage]);
          },
        },
      ],
    );
  };

  // This function will be replaced with real AI integration
  const callRealAI = async (message: string, context: any) => {
    // TODO: Replace this with actual AI service call
    // For now, return the mock response
    return generateAIResponse(message, creditScore, reportSummary);
  };

  const generateAIResponse = (
    userMessage: string,
    creditScore: any,
    reportSummary: any,
  ): string => {
    const message = userMessage.toLowerCase();

    if (message.includes('improve') && message.includes('score')) {
      const currentScore = creditScore?.score || 0;
      if (currentScore >= 740) {
        return 'Your credit score is excellent! To maintain it: continue making on-time payments, keep credit utilization below 30%, and avoid closing old accounts.';
      } else if (currentScore >= 670) {
        return "Your credit score is good! To improve it further: pay down credit card balances, avoid new credit inquiries, and consider becoming an authorized user on someone's account with good credit.";
      } else {
        return "Here are key ways to improve your credit score: 1) Pay all bills on time 2) Reduce credit card balances 3) Don't close old credit cards 4) Limit new credit applications 5) Monitor your credit report for errors.";
      }
    }

    if (message.includes('utilization')) {
      const utilization = reportSummary?.utilizationRate
        ? Math.round(reportSummary.utilizationRate * 100)
        : 0;
      return `Your current credit utilization is ${utilization}%. Ideally, keep it below 30% (even better below 10%). This means if you have $1,000 in credit limits, use less than $300. Lower utilization can quickly improve your score.`;
    }

    if (message.includes('pay off') || message.includes('debt')) {
      return "Paying off debt is generally good for your credit! Focus on: 1) High-interest debt first 2) Keep accounts open after paying off 3) Consider the 'snowball' or 'avalanche' method 4) Don't close credit cards after paying them off.";
    }

    if (message.includes('explain') || message.includes('report')) {
      return 'Your credit report contains: 1) Personal information 2) Credit accounts and payment history 3) Credit inquiries 4) Public records. The main factors affecting your score are payment history (35%), amounts owed (30%), length of history (15%), new credit (10%), and credit mix (10%).';
    }

    if (message.includes('good score')) {
      return 'Credit score ranges: 300-579 (Poor), 580-669 (Fair), 670-739 (Good), 740-799 (Very Good), 800-850 (Exceptional). Generally, 670+ is considered good and opens up better loan terms and rates.';
    }

    if (message.includes('dispute') || message.includes('error')) {
      return 'To dispute credit report errors: 1) Get free reports from annualcreditreport.com 2) Identify errors 3) File disputes with credit bureaus online or by mail 4) Provide supporting documents 5) Follow up within 30-45 days. Keep records of all communications.';
    }

    // Default response
    return "I'd be happy to help with that! I can provide guidance on credit scores, debt management, credit reports, and financial planning. Could you be more specific about what you'd like to know?";
  };

  const handleSuggestionPress = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const styles = {
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.light,
    },
    headerIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.accent + '15',
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginRight: theme.spacing.md,
    },
    headerText: {
      flex: 1,
    },
    headerTitle: {
      ...theme.textStyles.headline3,
      color: theme.colors.text.primary,
      fontWeight: '700' as const,
    },
    headerSubtitle: {
      ...theme.textStyles.bodyRegular,
      color: theme.colors.text.secondary,
      fontSize: 13,
    },
    onlineIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.success,
      marginLeft: theme.spacing.sm,
    },
    clearButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.surfaceSecondary,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    chatContainer: {
      flex: 1,
    },
    messagesContainer: {
      padding: theme.spacing.lg,
    },
    messageWrapper: {
      marginBottom: theme.spacing.lg,
    },
    userMessageWrapper: {
      alignItems: 'flex-end' as const,
    },
    aiMessageWrapper: {
      alignItems: 'flex-start' as const,
    },
    messageBubble: {
      maxWidth: '80%' as any,
      padding: theme.spacing.md,
      borderRadius: 18,
      marginBottom: theme.spacing.xs,
    },
    userBubble: {
      backgroundColor: theme.colors.accent,
      borderBottomRightRadius: 6,
    },
    aiBubble: {
      backgroundColor: theme.colors.surface,
      borderBottomLeftRadius: 6,
      borderWidth: 1,
      borderColor: theme.colors.border.light,
    },
    messageText: {
      ...theme.textStyles.bodyRegular,
      lineHeight: 20,
    },
    userMessageText: {
      color: theme.colors.surface,
    },
    aiMessageText: {
      color: theme.colors.text.primary,
    },
    timestamp: {
      ...theme.textStyles.caption,
      color: theme.colors.text.tertiary,
      fontSize: 11,
    },
    typingIndicator: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: 18,
      borderBottomLeftRadius: 6,
      maxWidth: '80%' as any,
      marginBottom: theme.spacing.lg,
    },
    typingText: {
      ...theme.textStyles.bodyRegular,
      color: theme.colors.text.secondary,
      marginLeft: theme.spacing.sm,
    },
    suggestionsContainer: {
      padding: theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.light,
    },
    suggestionsTitle: {
      ...theme.textStyles.labelMedium,
      color: theme.colors.text.primary,
      fontWeight: '600' as const,
      marginBottom: theme.spacing.md,
    },
    suggestions: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
    },
    suggestionChip: {
      backgroundColor: theme.colors.surfaceSecondary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border.light,
    },
    suggestionText: {
      ...theme.textStyles.bodyRegular,
      color: theme.colors.text.secondary,
      fontSize: 12,
    },
    inputContainer: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.light,
    },
    textInput: {
      flex: 1,
      ...theme.textStyles.bodyRegular,
      color: theme.colors.text.primary,
      backgroundColor: theme.colors.surfaceSecondary,
      borderRadius: 20,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      marginRight: theme.spacing.md,
      maxHeight: 100,
      minHeight: 44,
      borderWidth: 1,
      borderColor: theme.colors.border.light,
    },
    sendButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.accent,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    sendButtonDisabled: {
      backgroundColor: theme.colors.text.tertiary,
    },
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Animated.View style={{flex: 1, opacity: fadeAnim}}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="chatbubbles" size={20} color={theme.colors.accent} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>AI Credit Assistant</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.headerSubtitle}>Online</Text>
              <View style={styles.onlineIndicator} />
            </View>
          </View>
          <TouchableOpacity style={styles.clearButton} onPress={handleClearConversation}>
            <Ionicons name="trash-outline" size={18} color={theme.colors.text.secondary} />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
          {/* Chat Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.chatContainer}
            contentContainerStyle={styles.messagesContainer}
            showsVerticalScrollIndicator={false}>
            {messages.map(message => (
              <View
                key={message.id}
                style={[
                  styles.messageWrapper,
                  message.type === 'user' ? styles.userMessageWrapper : styles.aiMessageWrapper,
                ]}>
                <View
                  style={[
                    styles.messageBubble,
                    message.type === 'user' ? styles.userBubble : styles.aiBubble,
                  ]}>
                  <Text
                    style={[
                      styles.messageText,
                      message.type === 'user' ? styles.userMessageText : styles.aiMessageText,
                    ]}>
                    {message.message}
                  </Text>
                </View>
                <Text style={styles.timestamp}>{formatTimestamp(message.timestamp)}</Text>
              </View>
            ))}

            {isTyping && (
              <View style={styles.typingIndicator}>
                <ActivityIndicator size="small" color={theme.colors.text.secondary} />
                <Text style={styles.typingText}>AI is thinking...</Text>
              </View>
            )}
          </ScrollView>

          {/* Quick Suggestions */}
          {messages.length === 1 && (
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsTitle}>Quick questions:</Text>
              <View style={styles.suggestions}>
                {quickSuggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionChip}
                    onPress={() => handleSuggestionPress(suggestion)}>
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Input Container */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Ask me about your credit..."
              placeholderTextColor={theme.colors.text.tertiary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              onSubmitEditing={() => handleSendMessage(inputText)}
              returnKeyType="send"
              blurOnSubmit={false}
              autoFocus={false}
              autoCorrect={true}
              autoCapitalize="sentences"
              textAlignVertical="center"
              editable={true}
              selectTextOnFocus={false}
            />
            <TouchableOpacity
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
              onPress={() => handleSendMessage(inputText)}
              disabled={!inputText.trim()}>
              <Ionicons name="send" size={20} color={theme.colors.surface} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </SafeAreaView>
  );
};

import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {BlurView} from 'expo-blur';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIChatModalProps {
  visible: boolean;
  onClose: () => void;
  initialContext?: string;
}

export const AIChatModal: React.FC<AIChatModalProps> = ({visible, onClose, initialContext}) => {
  const {theme} = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const styles = createStyles(theme);

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Add initial greeting
      if (messages.length === 0) {
        const greeting: Message = {
          id: Date.now().toString(),
          text: initialContext
            ? `Hi! I see you're looking at ${initialContext}. How can I help you with this?`
            : "Hi! I'm your AI Credit Assistant. I can help you understand your credit report, suggest improvement strategies, and answer any credit-related questions. How can I help you today?",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages([greeting]);
      }
    }
  }, [visible]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputText),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      scrollViewRef.current?.scrollToEnd({animated: true});
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    // Credit Score related
    if (input.includes('credit score') || input.includes('score')) {
      return "Your current credit score is 742, which is in the 'Very Good' range (740-799). You're just 8 points away from 'Excellent' (800+). To reach it, focus on:\n\n1. Reducing credit utilization to under 10%\n2. Maintaining perfect payment history\n3. Avoiding new hard inquiries\n\nWould you like a detailed breakdown of your score factors?";
    }

    // Improvement strategies
    else if (input.includes('improve') || input.includes('better') || input.includes('boost')) {
      return "Based on your credit report analysis, here's your personalized improvement plan:\n\n**Quick Wins (0-3 months):**\n• Pay down Chase card by $750 → +12 points\n• Request credit limit increase → +8 points\n\n**Medium Term (3-6 months):**\n• Keep utilization under 10% → +15 points\n• Let hard inquiries age → +5 points\n\n**Long Term (6+ months):**\n• Maintain perfect payments → +10 points\n• Build credit mix → +5 points\n\nTotal potential increase: +55 points! Want details on any strategy?";
    }

    // Payment history
    else if (input.includes('payment') || input.includes('late') || input.includes('missed')) {
      return 'Your payment history (35% of score) shows:\n\n✅ **98% on-time payments** - Excellent!\n⚠️ **2 late payments** - From 2021, impact decreasing\n📊 **Recent streak:** 24 months perfect\n\n**Impact of late payments:**\n• 30 days late: -60 to -80 points\n• 60 days late: -80 to -100 points\n• Current impact: ~-15 points (diminishing)\n\nKeep your perfect streak going! Those old late payments will stop affecting your score significantly after 2 years.';
    }

    // Credit utilization
    else if (
      input.includes('utilization') ||
      input.includes('balance') ||
      input.includes('limit')
    ) {
      return "**Credit Utilization Analysis (30% of score):**\n\nCurrent: 35% ($5,250 / $15,000)\nTarget: <30% for 'Good', <10% for 'Excellent'\n\n**By Card:**\n• Chase Freedom: 45% ($1,350/$3,000) ⚠️\n• Capital One: 30% ($1,500/$5,000) ⚡\n• Discover: 32% ($2,400/$7,500) ⚠️\n\n**Action Plan:**\n1. Pay $750 total to reach 30%\n2. Pay $3,750 total to reach 10%\n3. Request limit increases (no hard pull)\n\nWant a payment strategy to optimize your score?";
    }

    // Credit mix
    else if (input.includes('mix') || input.includes('types') || input.includes('accounts')) {
      return "**Credit Mix Analysis (10% of score):**\n\nYour current mix is GOOD:\n✅ Revolving: 3 credit cards\n✅ Installment: 1 auto loan, 1 student loan\n❌ Missing: Mortgage (not required)\n\n**Impact on score:** +8-12 points\n\nYour diverse credit mix shows lenders you can manage different types of credit responsibly. No action needed here unless you're planning a major purchase.\n\nWant to see how each account type affects your score?";
    }

    // Hard inquiries
    else if (
      input.includes('inquir') ||
      input.includes('hard pull') ||
      input.includes('application')
    ) {
      return "**Hard Inquiries (10% of score):**\n\nCurrent: 2 inquiries (last 12 months)\n• Capital One - March 2024 (-5 points)\n• Auto loan - January 2024 (-5 points)\n\n**Timeline:**\n• 0-3 months: Maximum impact (-5-10 points each)\n• 3-12 months: Reduced impact (-2-5 points)\n• After 12 months: No score impact\n• After 24 months: Removed from report\n\n**Tips:**\n• Rate shopping (auto/mortgage): Multiple inquiries in 14-45 days = 1 inquiry\n• Soft pulls don't affect score\n• Space applications 6+ months apart\n\nPlanning any new credit applications?";
    }

    // Account age
    else if (input.includes('age') || input.includes('history') || input.includes('old')) {
      return '**Credit History Length (15% of score):**\n\n• Average age: 6.5 years ✅\n• Oldest account: 12 years (Excellent!)\n• Newest account: 8 months\n\n**Your accounts:**\n• Wells Fargo Card: 12 years (KEEP OPEN!)\n• Student Loan: 8 years\n• Chase Freedom: 5 years\n• Capital One: 3 years\n• Auto Loan: 8 months\n\n**Key insights:**\n• Never close old cards (especially that 12-year account)\n• Even unused cards help your score\n• New accounts temporarily lower average age\n\nYour credit age is strong! Keep those old accounts active.';
    }

    // Disputes and errors
    else if (
      input.includes('dispute') ||
      input.includes('error') ||
      input.includes('mistake') ||
      input.includes('wrong')
    ) {
      return '**How to Dispute Credit Report Errors:**\n\n**Step 1: Identify errors**\n• Wrong personal info\n• Accounts not yours\n• Incorrect payment status\n• Duplicate accounts\n• Outdated negative info (>7 years)\n\n**Step 2: Gather evidence**\n• Bank statements\n• Payment confirmations\n• Account closing letters\n\n**Step 3: File disputes**\n• Online: Fastest (30 days)\n• Mail: Most thorough (30-45 days)\n• Phone: Quick questions only\n\n**Success rate:** 79% of disputes result in changes\n\nWant me to scan your report for potential errors?';
    }

    // Mortgage readiness
    else if (input.includes('mortgage') || input.includes('home') || input.includes('house')) {
      return '**Mortgage Readiness Assessment:**\n\n✅ **Your Score: 742** (Qualifies for good rates)\n\n**Lender Requirements:**\n• FHA: 580+ (3.5% down)\n• Conventional: 620+ (3-5% down)\n• Best rates: 740+ ✅ You qualify!\n• Jumbo loans: 700+\n\n**Your advantages:**\n• Excellent payment history\n• Good credit mix\n• Established credit (12 years)\n\n**To optimize before applying:**\n1. Reduce utilization to <10%\n2. Avoid new credit for 6 months\n3. Save for 20% down (avoid PMI)\n\n**Estimated rate:** 6.8-7.2% (current market)\n\nWant a pre-approval checklist?';
    }

    // Negative marks
    else if (
      input.includes('negative') ||
      input.includes('collection') ||
      input.includes('bankruptcy')
    ) {
      return '**Negative Items Impact & Timeline:**\n\nYour report shows:\n• 2 late payments (2021) - Diminishing impact\n\n**How long items stay:**\n• Late payments: 7 years\n• Collections: 7 years\n• Bankruptcies: 7-10 years\n• Hard inquiries: 2 years\n• Closed accounts: 10 years (if positive)\n\n**Your late payments:**\n• Current impact: -15 points\n• Will be removed: 2028\n• Impact after 2 years: Minimal\n• After 4 years: Almost none\n\nFocus on building positive history to offset these. Want strategies for faster recovery?';
    }

    // Multiple questions or general
    else {
      const responses = [];

      // Check for multiple topics
      if (input.includes('report')) {
        responses.push('I can help you understand every aspect of your credit report.');
      }
      if (input.includes('download') || input.includes('pdf')) {
        responses.push(
          'You can download your full credit report as a PDF from the menu options (three dots) on any screen.',
        );
      }
      if (input.includes('monitor') || input.includes('alert')) {
        responses.push(
          "Credit monitoring is active. You'll receive alerts for score changes, new accounts, and suspicious activity.",
        );
      }

      if (responses.length > 0) {
        return (
          responses.join('\n\n') + '\n\nWhat specific aspect would you like to explore further?'
        );
      }

      return `I understand you're asking about "${userInput}". I can help with:\n\n• Credit score analysis & improvement\n• Payment history & disputes\n• Utilization optimization\n• Account management\n• Mortgage readiness\n• Error identification\n• And much more!\n\nWhat specific information would you like?`;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.aiAvatar}>
              <Ionicons name="sparkles" size={20} color={theme.colors.accent} />
            </View>
            <View>
              <Text style={styles.headerTitle}>AI Credit Assistant</Text>
              <Text style={styles.headerStatus}>Always here to help</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <KeyboardAvoidingView
          style={styles.chatContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({animated: true})}>
            {messages.map(message => (
              <Animated.View
                key={message.id}
                style={[
                  styles.messageBubble,
                  message.isUser ? styles.userMessage : styles.aiMessage,
                  {opacity: fadeAnim},
                ]}>
                {!message.isUser && (
                  <View style={styles.aiIcon}>
                    <Ionicons name="sparkles" size={12} color={theme.colors.accent} />
                  </View>
                )}
                <Text
                  style={[
                    styles.messageText,
                    message.isUser ? styles.userMessageText : styles.aiMessageText,
                  ]}>
                  {message.text}
                </Text>
              </Animated.View>
            ))}

            {isTyping && (
              <View style={[styles.messageBubble, styles.aiMessage]}>
                <View style={styles.typingIndicator}>
                  <ActivityIndicator size="small" color={theme.colors.accent} />
                  <Text style={styles.typingText}>AI is thinking...</Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Quick Actions */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.quickActions}
            contentContainerStyle={styles.quickActionsContent}>
            {[
              'How to improve score?',
              'Payment history',
              'Credit utilization',
              'Check for errors',
              'Account age impact',
              'Mortgage ready?',
            ].map(action => (
              <TouchableOpacity
                key={action}
                style={styles.quickActionChip}
                onPress={() => setInputText(action)}>
                <Text style={styles.quickActionText}>{action}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ask me anything about credit..."
              placeholderTextColor={theme.colors.text.tertiary}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
              onPress={sendMessage}
              disabled={!inputText.trim()}>
              <Ionicons
                name="send"
                size={20}
                color={inputText.trim() ? theme.colors.surface : theme.colors.text.tertiary}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.light,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    aiAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: `${theme.colors.accent}15`,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    headerTitle: {
      ...theme.textStyles.headline3,
      color: theme.colors.text.primary,
      fontWeight: '600',
    },
    headerStatus: {
      ...theme.textStyles.caption,
      color: theme.colors.success,
      marginTop: 2,
    },
    closeButton: {
      padding: theme.spacing.sm,
    },
    chatContainer: {
      flex: 1,
    },
    messagesContainer: {
      flex: 1,
    },
    messagesContent: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.lg,
    },
    messageBubble: {
      marginBottom: theme.spacing.md,
      maxWidth: '80%',
    },
    userMessage: {
      alignSelf: 'flex-end',
      backgroundColor: theme.colors.accent,
      borderRadius: 18,
      borderBottomRightRadius: 4,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    aiMessage: {
      alignSelf: 'flex-start',
      backgroundColor: theme.colors.surfaceSecondary,
      borderRadius: 18,
      borderBottomLeftRadius: 4,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    aiIcon: {
      position: 'absolute',
      top: -8,
      left: -4,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
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
    typingIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    typingText: {
      ...theme.textStyles.caption,
      color: theme.colors.text.secondary,
      marginLeft: theme.spacing.sm,
    },
    quickActions: {
      maxHeight: 50,
      marginBottom: theme.spacing.sm,
    },
    quickActionsContent: {
      paddingHorizontal: theme.spacing.lg,
    },
    quickActionChip: {
      backgroundColor: theme.colors.surfaceSecondary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: 16,
      marginRight: theme.spacing.sm,
    },
    quickActionText: {
      ...theme.textStyles.bodyRegular,
      color: theme.colors.text.primary,
      fontSize: 13,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.light,
    },
    input: {
      flex: 1,
      backgroundColor: theme.colors.surfaceSecondary,
      borderRadius: 20,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      maxHeight: 100,
      marginRight: theme.spacing.sm,
      ...theme.textStyles.bodyRegular,
      color: theme.colors.text.primary,
    },
    sendButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sendButtonDisabled: {
      backgroundColor: theme.colors.surfaceSecondary,
    },
  });

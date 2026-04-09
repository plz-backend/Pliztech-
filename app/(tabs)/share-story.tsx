import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from 'react-native';

import { Text } from '@/components/Text';

import { AppHeaderTitleRow } from '@/components/layout/AppHeaderTitleRow';
import { Screen } from '@/components/Screen';
import { useCurrentUser } from '@/contexts/CurrentUserContext';
import { createStory } from '@/lib/api/stories';
import { updateProfile } from '@/lib/api/profile';
import { formatPlizApiErrorForUser } from '@/lib/api/types';
import { withUnauthorizedRecovery } from '@/lib/auth/session-expired';

const MAX_WORDS = 60;

const STORY_TOPICS = [
  'How Plz helped me',
  'After my withdrawal',
  'Paying it forward',
  'Community support',
  'Family & health',
  'Education & work',
  'Other',
] as const;

function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

export default function ShareStoryScreen() {
  const { topic: topicParam } = useLocalSearchParams<{ topic?: string }>();
  const { user, refreshUser, signOut } = useCurrentUser();
  const [topic, setTopic] = useState<string>(() => {
    const t = typeof topicParam === 'string' ? topicParam : '';
    return STORY_TOPICS.includes(t as (typeof STORY_TOPICS)[number]) ? t : STORY_TOPICS[0];
  });
  const [body, setBody] = useState('');
  const [topicPickerOpen, setTopicPickerOpen] = useState(false);
  const [anonymous, setAnonymous] = useState(user?.profile?.isAnonymous ?? false);
  const [submitting, setSubmitting] = useState(false);

  const composedContent = useMemo(() => {
    const prefix = topic ? `[${topic}] ` : '';
    return `${prefix}${body.trim()}`.trim();
  }, [topic, body]);

  const words = useMemo(() => countWords(composedContent), [composedContent]);
  const overLimit = words > MAX_WORDS;
  const canSubmit =
    words >= 1 && !overLimit && composedContent.trim().length >= 10 && !overLimit;


  const submit = async () => {
    if (!canSubmit || overLimit) return;
    setSubmitting(true);
    try {
      await withUnauthorizedRecovery(signOut, async (token) => {
        if (anonymous !== user?.profile?.isAnonymous) {
          await updateProfile(token, { isAnonymous: anonymous });
          await refreshUser();
        }
        await createStory(token, { content: composedContent });
      });
      Alert.alert(
        'Story submitted',
        'Thank you. Your story will appear in the community after review.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (e) {
      Alert.alert('Could not submit', formatPlizApiErrorForUser(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen backgroundColor="#F9FAFB" scrollable>
      <AppHeaderTitleRow title="Share your story" />

      <Text style={styles.lead}>
        Stories are up to {MAX_WORDS} words. They are reviewed before they appear in the feed.
      </Text>

      <Text style={styles.label}>Topic</Text>
      <Pressable
        style={styles.select}
        onPress={() => setTopicPickerOpen((o) => !o)}
        accessibilityRole="button"
      >
        <Text style={styles.selectText}>{topic}</Text>
        <Ionicons name="chevron-down" size={20} color="#6B7280" />
      </Pressable>
      {topicPickerOpen ? (
        <ScrollView style={styles.topicList} nestedScrollEnabled keyboardShouldPersistTaps="handled">
          {STORY_TOPICS.map((t) => (
            <Pressable
              key={t}
              style={styles.topicRow}
              onPress={() => {
                setTopic(t);
                setTopicPickerOpen(false);
              }}
            >
              <Text style={styles.topicRowText}>{t}</Text>
            </Pressable>
          ))}
        </ScrollView>
      ) : null}

      <Text style={styles.label}>Your story</Text>
      <TextInput
        style={styles.input}
        multiline
        textAlignVertical="top"
        placeholder="What happened? How did support from others make a difference?"
        placeholderTextColor="#9CA3AF"
        value={body}
        onChangeText={setBody}
        maxLength={2800}
      />
      <Text style={[styles.wordCount, overLimit && styles.wordCountError]}>
        {words} / {MAX_WORDS} words
        {composedContent.trim().length > 0 && composedContent.trim().length < 10
          ? ' · At least 10 characters required'
          : ''}
      </Text>

      <View style={styles.anonRow}>
        <View style={styles.anonTextWrap}>
          <Text style={styles.label}>Post anonymously</Text>
          <Text style={styles.anonHint}>
            When on, your story shows as Anonymous (same as your profile privacy setting).
          </Text>
        </View>
        <Switch
          value={anonymous}
          onValueChange={setAnonymous}
          trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
          thumbColor={anonymous ? '#2E8BEA' : '#F3F4F6'}
        />
      </View>

      <Pressable
        style={[styles.submit, (!canSubmit || submitting) && styles.submitDisabled]}
        onPress={() => void submit()}
        disabled={!canSubmit || submitting}
        accessibilityRole="button"
        accessibilityLabel="Submit story"
      >
        {submitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.submitText}>Submit story</Text>
        )}
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  lead: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  selectText: {
    fontSize: 16,
    color: '#1F2937',
  },
  topicList: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  topicRow: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  topicRowText: {
    fontSize: 15,
    color: '#1F2937',
  },
  input: {
    minHeight: 140,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  wordCount: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
  },
  wordCountError: {
    color: '#DC2626',
    fontWeight: '600',
  },
  anonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  anonTextWrap: {
    flex: 1,
  },
  anonHint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    lineHeight: 18,
  },
  submit: {
    backgroundColor: '#2E8BEA',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  submitDisabled: {
    opacity: 0.5,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

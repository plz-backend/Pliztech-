import Ionicons from '@expo/vector-icons/Ionicons';
import { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { Text } from '@/components/Text';

import { StoryCard } from '@/components/activity/StoryCard';
import { MOCK_COMMUNITY_STORIES } from '@/mock/activity';
import type { CommunityStory } from '@/mock/activity';

const SCREEN_PADDING = 48;
const CARD_MARGIN = 12;
const CARD_WIDTH = Dimensions.get('window').width - SCREEN_PADDING - CARD_MARGIN * 4;

export function CommunityStories() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<CommunityStory>>(null);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offset = e.nativeEvent.contentOffset.x;
      const index = Math.round(offset / (CARD_WIDTH + CARD_MARGIN * 2));
      setActiveIndex(Math.min(index, MOCK_COMMUNITY_STORIES.length - 1));
    },
    []
  );

  const goPrev = useCallback(() => {
    if (activeIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: activeIndex - 1,
        animated: true,
      });
    }
  }, [activeIndex]);

  const goNext = useCallback(() => {
    if (activeIndex < MOCK_COMMUNITY_STORIES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: activeIndex + 1,
        animated: true,
      });
    }
  }, [activeIndex]);

  const renderItem = useCallback(
    ({ item }: { item: CommunityStory }) => (
      <View style={styles.cardWrap}>
        <StoryCard story={item} />
      </View>
    ),
    []
  );

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIcon}>
          <Ionicons name="sparkles" size={20} color="#2E8BEA" />
        </View>
        <Text style={styles.sectionTitle}>Community Stories</Text>
      </View>

      <FlatList<CommunityStory>
        ref={flatListRef}
        data={MOCK_COMMUNITY_STORIES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled={false}
        snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
        snapToAlignment="start"
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.carouselContent}
        getItemLayout={(_, index) => ({
          length: CARD_WIDTH + CARD_MARGIN * 2,
          offset: (CARD_WIDTH + CARD_MARGIN * 2) * index,
          index,
        })}
      />

      <View style={styles.controls}>
        <Pressable
          onPress={goPrev}
          style={[styles.arrow, activeIndex === 0 && styles.arrowDisabled]}
          disabled={activeIndex === 0}
          accessibilityLabel="Previous story"
          accessibilityRole="button"
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={activeIndex === 0 ? '#D1D5DB' : '#1F2937'}
          />
        </Pressable>

        <View style={styles.dots}>
          {MOCK_COMMUNITY_STORIES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === activeIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        <Pressable
          onPress={goNext}
          style={[
            styles.arrow,
            activeIndex === MOCK_COMMUNITY_STORIES.length - 1 && styles.arrowDisabled,
          ]}
          disabled={activeIndex === MOCK_COMMUNITY_STORIES.length - 1}
          accessibilityLabel="Next story"
          accessibilityRole="button"
        >
          <Ionicons
            name="chevron-forward"
            size={24}
            color={
              activeIndex === MOCK_COMMUNITY_STORIES.length - 1
                ? '#D1D5DB'
                : '#1F2937'
            }
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  carouselContent: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  cardWrap: {
    width: CARD_WIDTH,
    marginHorizontal: CARD_MARGIN,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  arrow: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  arrowDisabled: {
    opacity: 0.5,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: '#2E8BEA',
  },
  dotInactive: {
    backgroundColor: '#E5E7EB',
  },
});

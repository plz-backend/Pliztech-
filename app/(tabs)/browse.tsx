import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { BrowseRequestCard } from '@/components/browse/BrowseRequestCard';
import { FilterChips, type MainFilter } from '@/components/browse/FilterChips';
import { SearchBar } from '@/components/browse/SearchBar';
import { Screen } from '@/components/Screen';
import { MOCK_BROWSE_REQUESTS } from '@/mock/home';
import type { BrowseRequest } from '@/mock/home';

const LOGO = require('@/assets/images/pliz-logo.png');

export default function BrowseScreen() {
  const [search, setSearch] = useState('');
  const [mainFilter, setMainFilter] = useState<MainFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredRequests = useMemo(() => {
    let list: readonly BrowseRequest[] = MOCK_BROWSE_REQUESTS;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.text.toLowerCase().includes(q) ||
          r.categoryLabel.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== 'all') {
      list = list.filter((r) => r.categoryId === categoryFilter);
    }

    if (mainFilter === 'ending-soon') {
      list = [...list].sort((a, b) => {
        const parseHours = (s: string) => {
          const m = s.match(/(\d+)h/);
          return m ? parseInt(m[1], 10) : 999;
        };
        return parseHours(a.timeLeft) - parseHours(b.timeLeft);
      });
    } else if (mainFilter === 'just-posted') {
      list = [...list].reverse();
    }

    return list;
  }, [search, mainFilter, categoryFilter]);

  const handleRequestPress = useCallback((id: string) => {
    router.push(`/(tabs)/request/${id}` as import('expo-router').Href);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: BrowseRequest }) => (
      <BrowseRequestCard
        request={item}
        onPress={() => handleRequestPress(item.id)}
      />
    ),
    [handleRequestPress]
  );

  const ListHeader = useMemo(
    () => (
      <>
        <SearchBar value={search} onChangeText={setSearch} />
        <FilterChips
          mainFilter={mainFilter}
          onMainFilterChange={setMainFilter}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
        />
      </>
    ),
    [search, mainFilter, categoryFilter]
  );

  return (
    <Screen backgroundColor="#FFFFFF">
      <View style={styles.headerRow}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </Pressable>
        <View style={styles.logoSection}>
          <Image source={LOGO} style={styles.logo} contentFit="contain" />
        </View>
        <View style={styles.backButtonSpacer} />
      </View>

      <FlatList
        data={filteredRequests}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'none',
  },
  logo: {
    width: 40,
    height: 40,
  },
  backButtonSpacer: {
    width: 40,
  },
  listContent: {
    paddingBottom: 24,
  },
});

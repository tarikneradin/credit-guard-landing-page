import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {useOfferStore} from '../../stores/offerStore';
import {OfferCard} from '../../components/offers/OfferCard';
import {OfferDetailModal} from '../../components/offers/OfferDetailModal';
import {FinancialOffer, OfferCategory, SortMethod} from '../../types/offers';
import {HeaderWithOptions, MenuOption} from '../../components/common/HeaderWithOptions';

type FilterCategory = OfferCategory | 'all';

export const OffersScreen: React.FC = () => {
  const {theme} = useTheme();
  const {
    filteredOffers,
    selectedCategory,
    sortMethod,
    searchQuery,
    isLoading,
    fetchOffers,
    filterByCategory,
    sortOffers,
    searchOffers,
    trackOfferView,
  } = useOfferStore();

  const [showDetail, setShowDetail] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<FinancialOffer | null>(null);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOffers();
    setRefreshing(false);
  };

  const handleOfferPress = (offer: FinancialOffer) => {
    trackOfferView(offer.id, 'offers_screen');
    setSelectedOffer(offer);
    setShowDetail(true);
  };

  const handleCategoryPress = (category: FilterCategory) => {
    filterByCategory(category);
  };

  const handleSortPress = (method: SortMethod) => {
    sortOffers(method);
    setShowSortMenu(false);
  };

  const handleSearchChange = (text: string) => {
    searchOffers(text);
  };

  const categories: {id: FilterCategory; label: string; icon: string}[] = [
    {id: 'all', label: 'All', icon: 'apps'},
    {id: 'credit_card', label: 'Credit Cards', icon: 'card'},
    {id: 'personal_loan', label: 'Loans', icon: 'wallet'},
    {id: 'savings_account', label: 'Savings', icon: 'trending-up'},
    {id: 'checking_account', label: 'Checking', icon: 'cash'},
  ];

  const sortOptions: {id: SortMethod; label: string; icon: string}[] = [
    {id: 'relevance', label: 'Best Match', icon: 'star'},
    {id: 'best_apr', label: 'Best APR', icon: 'trending-down'},
    {id: 'highest_rewards', label: 'Highest Rewards', icon: 'gift'},
    {id: 'most_popular', label: 'Most Popular', icon: 'flame'},
  ];

  const getCurrentSortLabel = () => {
    return sortOptions.find((opt) => opt.id === sortMethod)?.label || 'Sort';
  };

  const menuOptions: MenuOption[] = [
    {
      id: 'filter',
      label: getCurrentSortLabel(),
      icon: 'funnel',
      action: () => setShowSortMenu(!showSortMenu),
      color: theme.colors.primary,
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    searchSection: {
      paddingHorizontal: theme.spacing.xl,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
      backgroundColor: theme.colors.background,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      paddingHorizontal: theme.spacing.md + 2,
      borderWidth: 1,
      borderColor: theme.colors.border.light,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.04,
      shadowRadius: 3,
      elevation: 1,
    },
    searchInput: {
      flex: 1,
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.primary,
      paddingVertical: theme.spacing.md,
      marginLeft: theme.spacing.sm,
    },
    filterBar: {
      borderBottomWidth: 0.5,
      borderBottomColor: theme.colors.border.subtle,
      backgroundColor: theme.colors.surface,
    },
    filterScrollContent: {
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.md + 2,
      gap: theme.spacing.sm + 2,
    },
    filterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md + 2,
      paddingVertical: theme.spacing.sm + 2,
      borderRadius: 24,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border.light,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.04,
      shadowRadius: 2,
      elevation: 1,
    },
    filterButtonActive: {
      backgroundColor: theme.colors.primary + '12',
      borderColor: theme.colors.primary,
      shadowColor: theme.colors.primary,
      shadowOpacity: 0.15,
    },
    filterButtonText: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.secondary,
      marginLeft: theme.spacing.xs,
      fontWeight: '600',
      fontSize: 14,
      letterSpacing: 0.2,
    },
    filterButtonTextActive: {
      color: theme.colors.primary,
      fontWeight: '700',
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      padding: theme.spacing.xl,
    },
    resultCount: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.md + 2,
      fontWeight: '500',
      letterSpacing: 0.2,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.xl * 2,
    },
    emptyStateIcon: {
      marginBottom: theme.spacing.lg,
    },
    emptyStateTitle: {
      ...theme.textStyles.headline2,
      color: theme.colors.text.primary,
      fontWeight: '600',
      marginBottom: theme.spacing.sm,
    },
    emptyStateText: {
      ...theme.textStyles.bodyLarge,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      paddingHorizontal: theme.spacing.xl,
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sortMenu: {
      position: 'absolute',
      top: 60,
      right: theme.spacing.xl,
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
      borderWidth: 1,
      borderColor: theme.colors.border.light,
      zIndex: 1000,
      minWidth: 190,
    },
    sortMenuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md + 2,
      borderBottomWidth: 0.5,
      borderBottomColor: theme.colors.border.subtle,
    },
    sortMenuItemActive: {
      backgroundColor: theme.colors.primary + '08',
    },
    sortMenuItemText: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.primary,
      flex: 1,
      marginLeft: theme.spacing.sm,
      fontWeight: '500',
      letterSpacing: 0.2,
    },
    sortMenuItemTextActive: {
      color: theme.colors.primary,
      fontWeight: '700',
    },
    disclosure: {
      backgroundColor: theme.colors.warning + '08',
      paddingHorizontal: theme.spacing.md + 2,
      paddingVertical: theme.spacing.md,
      borderRadius: 14,
      marginBottom: theme.spacing.lg,
      flexDirection: 'row',
      alignItems: 'flex-start',
      borderWidth: 1,
      borderColor: theme.colors.warning + '20',
    },
    disclosureText: {
      ...theme.textStyles.bodySmall,
      color: theme.colors.text.secondary,
      flex: 1,
      marginLeft: theme.spacing.sm,
      lineHeight: 18,
      fontWeight: '500',
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with Options */}
      <HeaderWithOptions
        title="Financial Offers"
        subtitle="Personalized recommendations"
        icon="gift"
        iconColor={theme.colors.tabBar.activeIcon}
        options={menuOptions}
      />

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={theme.colors.text.tertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search offers..."
            placeholderTextColor={theme.colors.text.tertiary}
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearchChange('')}>
              <Ionicons name="close-circle" size={20} color={theme.colors.text.tertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}>
          {categories.map((category) => {
            const isActive = selectedCategory === category.id;
            return (
              <TouchableOpacity
                key={category.id}
                style={[styles.filterButton, isActive && styles.filterButtonActive]}
                onPress={() => handleCategoryPress(category.id)}>
                <Ionicons
                  name={category.icon as any}
                  size={16}
                  color={isActive ? theme.colors.primary : theme.colors.text.secondary}
                />
                <Text style={[styles.filterButtonText, isActive && styles.filterButtonTextActive]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Sort Menu */}
      {showSortMenu && (
        <View style={styles.sortMenu}>
          {sortOptions.map((option, index) => {
            const isActive = sortMethod === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.sortMenuItem,
                  isActive && styles.sortMenuItemActive,
                  index === sortOptions.length - 1 && {borderBottomWidth: 0},
                ]}
                onPress={() => handleSortPress(option.id)}>
                <Ionicons
                  name={option.icon as any}
                  size={18}
                  color={isActive ? theme.colors.primary : theme.colors.text.secondary}
                />
                <Text
                  style={[
                    styles.sortMenuItemText,
                    isActive && styles.sortMenuItemTextActive,
                  ]}>
                  {option.label}
                </Text>
                {isActive && (
                  <Ionicons name="checkmark" size={18} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.emptyStateText, {marginTop: theme.spacing.md}]}>
            Loading offers...
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.primary}
            />
          }>
          {/* Affiliate Disclosure */}
          <View style={styles.disclosure}>
            <Ionicons
              name="information-circle"
              size={18}
              color={theme.colors.text.secondary}
            />
            <Text style={styles.disclosureText}>
              We may earn a commission when you apply for products through our links. All offers
              are from our advertising partners.
            </Text>
          </View>

          {/* Result Count */}
          <Text style={styles.resultCount}>
            {filteredOffers.length} {filteredOffers.length === 1 ? 'offer' : 'offers'} found
          </Text>

          {/* Offers List */}
          {filteredOffers.length > 0 ? (
            filteredOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} onPress={handleOfferPress} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIcon}>
                <Ionicons name="search" size={64} color={theme.colors.text.tertiary} />
              </View>
              <Text style={styles.emptyStateTitle}>No offers found</Text>
              <Text style={styles.emptyStateText}>
                {searchQuery
                  ? `No offers match "${searchQuery}". Try adjusting your search or filters.`
                  : 'Try adjusting your filters or check back later for new offers.'}
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* Detail Modal */}
      <OfferDetailModal
        visible={showDetail}
        offer={selectedOffer}
        onClose={() => setShowDetail(false)}
      />
    </SafeAreaView>
  );
};

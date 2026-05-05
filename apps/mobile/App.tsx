import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import type {
  AuthStrategyDocument,
  Dog,
  EcosystemDirectoryDocument,
  EcosystemListing,
  HealthDocument,
  PartnerDirectoryDocument,
  PartnerDirectoryEntry,
  PublicRegistryDocument,
  PublicRegistryEntry,
  PublicRegistryProfileDocument,
  VerificationDocument,
} from '@cane-corso-platform/contracts';
import { StatusBar } from 'expo-status-bar';
import {
  fetchAuthStrategyDocument,
  fetchCurrentProfileDocument,
  fetchCurrentSessionDocument,
  fetchDogsDocument,
  fetchEcosystemDirectoryDocument,
  fetchHealthDocument,
  fetchOptionalPublicRegistryProfileDocument,
  fetchOptionalVerificationDocument,
  fetchPartnerDirectoryDocument,
  fetchPublicRegistryDocument,
  getApiBaseUrl,
} from './src/api';

interface MobileWorkspaceState {
  health: HealthDocument | null;
  authStrategy: AuthStrategyDocument | null;
  registry: PublicRegistryDocument | null;
  registryProfile: PublicRegistryProfileDocument | null;
  verification: VerificationDocument | null;
  partners: PartnerDirectoryDocument | null;
  ecosystem: EcosystemDirectoryDocument | null;
  sessionLabel: string;
  profileLabel: string;
  dogs: Dog[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  selectedRegistrySlug: string | null;
  selectedVerificationLookup: string;
}

const initialState: MobileWorkspaceState = {
  health: null,
  authStrategy: null,
  registry: null,
  registryProfile: null,
  verification: null,
  partners: null,
  ecosystem: null,
  sessionLabel: 'Loading member session…',
  profileLabel: 'Loading member profile…',
  dogs: [],
  loading: true,
  refreshing: false,
  error: null,
  selectedRegistrySlug: null,
  selectedVerificationLookup: '',
};

export default function App() {
  const [state, setState] = useState<MobileWorkspaceState>(initialState);
  const [verifyInput, setVerifyInput] = useState('');
  const [isResolvingVerify, setIsResolvingVerify] = useState(false);

  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

  const selectedRegistryEntry = useMemo(() => {
    if (!state.registry || !state.selectedRegistrySlug) {
      return null;
    }

    return state.registry.entries.find((entry) => entry.publicSlug === state.selectedRegistrySlug) ?? null;
  }, [state.registry, state.selectedRegistrySlug]);

  const featuredPartner = useMemo(() => selectFeaturedPartner(state.partners), [state.partners]);
  const featuredEcosystemListing = useMemo(() => selectFeaturedEcosystemListing(state.ecosystem), [state.ecosystem]);

  const hydrateRegistryBridge = useCallback(async (entry: PublicRegistryEntry | null) => {
    if (!entry) {
      setState((current) => ({
        ...current,
        registryProfile: null,
        verification: null,
        selectedRegistrySlug: null,
        selectedVerificationLookup: '',
      }));
      setVerifyInput('');
      return;
    }

    const preferredVerificationLookup =
      entry.certificate?.certificateCode ?? entry.certificate?.verificationSlug ?? '';

    const [profileDocument, verificationDocument] = await Promise.all([
      fetchOptionalPublicRegistryProfileDocument(entry.publicSlug),
      preferredVerificationLookup ? fetchOptionalVerificationDocument(preferredVerificationLookup) : Promise.resolve(null),
    ]);

    setState((current) => ({
      ...current,
      selectedRegistrySlug: entry.publicSlug,
      selectedVerificationLookup: preferredVerificationLookup,
      registryProfile: profileDocument,
      verification: verificationDocument,
    }));
    setVerifyInput(preferredVerificationLookup);
  }, []);

  const refreshWorkspace = useCallback(async (mode: 'initial' | 'refresh' = 'initial') => {
    setState((current) => ({
      ...current,
      loading: mode === 'initial',
      refreshing: mode === 'refresh',
      error: null,
    }));

    const [
      healthResult,
      sessionResult,
      profileResult,
      dogsResult,
      authStrategyResult,
      registryResult,
      partnersResult,
      ecosystemResult,
    ] = await Promise.allSettled([
      fetchHealthDocument(),
      fetchCurrentSessionDocument(),
      fetchCurrentProfileDocument(),
      fetchDogsDocument(),
      fetchAuthStrategyDocument(),
      fetchPublicRegistryDocument(),
      fetchPartnerDirectoryDocument(),
      fetchEcosystemDirectoryDocument(),
    ]);

    const registryDocument = registryResult.status === 'fulfilled' ? registryResult.value : null;
    const selectedSlug = state.selectedRegistrySlug;
    const preferredEntry =
      registryDocument?.entries.find((entry) => entry.publicSlug === selectedSlug) ??
      registryDocument?.entries[0] ??
      null;

    const allPublicResultsFailed =
      healthResult.status === 'rejected' &&
      registryResult.status === 'rejected' &&
      partnersResult.status === 'rejected' &&
      ecosystemResult.status === 'rejected';

    setState((current) => ({
      ...current,
      health: healthResult.status === 'fulfilled' ? healthResult.value : null,
      authStrategy: authStrategyResult.status === 'fulfilled' ? authStrategyResult.value : null,
      registry: registryDocument,
      partners: partnersResult.status === 'fulfilled' ? partnersResult.value : null,
      ecosystem: ecosystemResult.status === 'fulfilled' ? ecosystemResult.value : null,
      sessionLabel:
        sessionResult.status === 'fulfilled'
          ? formatSessionLabel(
              sessionResult.value.session.user.displayName,
              sessionResult.value.session.user.email,
              sessionResult.value.bootstrap,
            )
          : 'No member session available yet',
      profileLabel:
        profileResult.status === 'fulfilled'
          ? formatProfileLabel(
              profileResult.value.profile.displayName,
              profileResult.value.profile.city,
              profileResult.value.profile.country,
            )
          : 'Current profile is not available yet',
      dogs: dogsResult.status === 'fulfilled' ? dogsResult.value.dogs : [],
      loading: false,
      refreshing: false,
      error: allPublicResultsFailed
        ? 'The mobile client could not reach the shared Next.js API. Check EXPO_PUBLIC_API_BASE_URL and the local web server.'
        : null,
    }));

    await hydrateRegistryBridge(preferredEntry);
  }, [hydrateRegistryBridge, state.selectedRegistrySlug]);

  useEffect(() => {
    refreshWorkspace('initial').catch((error) => {
      setState((current) => ({
        ...current,
        loading: false,
        refreshing: false,
        error: error instanceof Error ? error.message : 'Unable to load the mobile workspace.',
      }));
    });
  }, [refreshWorkspace]);

  const onRefresh = useCallback(() => {
    refreshWorkspace('refresh').catch((error) => {
      setState((current) => ({
        ...current,
        loading: false,
        refreshing: false,
        error: error instanceof Error ? error.message : 'Unable to refresh the mobile workspace.',
      }));
    });
  }, [refreshWorkspace]);

  const handleSelectRegistryEntry = useCallback(
    (entry: PublicRegistryEntry) => {
      hydrateRegistryBridge(entry).catch((error) => {
        setState((current) => ({
          ...current,
          error: error instanceof Error ? error.message : 'Unable to open the selected registry profile.',
        }));
      });
    },
    [hydrateRegistryBridge],
  );

  const handleVerifyLookup = useCallback(async () => {
    const lookup = verifyInput.trim();

    if (!lookup) {
      setState((current) => ({
        ...current,
        verification: null,
        selectedVerificationLookup: '',
        error: 'Enter a certificate code or verification slug first.',
      }));
      return;
    }

    setIsResolvingVerify(true);

    try {
      const document = await fetchOptionalVerificationDocument(lookup);
      setState((current) => ({
        ...current,
        verification: document,
        selectedVerificationLookup: lookup,
        error: document ? null : `No active certificate matched “${lookup}”.`,
      }));
    } catch (error) {
      setState((current) => ({
        ...current,
        error: error instanceof Error ? error.message : 'Unable to resolve the verification record.',
      }));
    } finally {
      setIsResolvingVerify(false);
    }
  }, [verifyInput]);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={state.refreshing} onRefresh={onRefresh} tintColor="#d4af37" />}
      >
        <View style={styles.heroBlock}>
          <Text style={styles.eyebrow}>UNICO SUO GENERE</Text>
          <Text style={styles.heroTitle}>Mobile QA bridge</Text>
          <Text style={styles.heroCopy}>
            This Expo client checks the shared Next.js API from a mobile surface: health, session, profile, My Cane Corso,
            public registry, verify, partners, and ecosystem directory. Pull to refresh the mobile workspace after every
            publish, certificate, partner, or ecosystem update.
          </Text>
          <Text style={styles.heroMeta}>{apiBaseUrl}</Text>
        </View>

        {state.loading ? (
          <SectionCard
            eyebrow="Loading"
            title="Hydrating shared API contracts"
            description="Reading the same API documents used by the web app before showing mobile QA signals."
          >
            <View style={styles.centerRow}>
              <ActivityIndicator color="#d4af37" />
            </View>
          </SectionCard>
        ) : null}

        {state.error ? (
          <SectionCard eyebrow="Attention" title="Workspace signal" description={state.error} meta={state.selectedVerificationLookup || state.selectedRegistrySlug || '/api/health'} />
        ) : null}

        <View style={styles.metricGrid}>
          <MetricCard label="API" value={state.health?.status ?? 'offline'} />
          <MetricCard label="Registry" value={state.registry?.total ?? 0} />
          <MetricCard label="Partners" value={state.partners?.total ?? 0} />
          <MetricCard label="Ecosystem" value={state.ecosystem?.summary.total ?? 0} />
        </View>

        <SectionCard
          eyebrow="API status"
          title={state.health?.status ?? 'offline'}
          description={state.sessionLabel}
          meta={state.health ? `${state.health.service} • ${state.health.environment} • DB ${state.health.database}` : 'Shared web API unreachable'}
        />

        <SectionCard
          eyebrow="Auth strategy"
          title={state.authStrategy?.provider ?? 'Unavailable'}
          description={
            state.authStrategy
              ? `Web uses ${state.authStrategy.webSessionTransport}; mobile reads public APIs and session-aware APIs through the shared API base URL.`
              : 'The mobile client could not read the current auth/provider contract yet.'
          }
          meta={state.authStrategy ? `${state.authStrategy.provider} • secure cookies ${state.authStrategy.usesSecureCookies ? 'on' : 'off'}` : '/api/auth/provider'}
        />

        <SectionCard
          eyebrow="Current profile"
          title={state.profileLabel}
          description="This confirms the mobile client can read the same member identity document exposed by the web API."
          meta="/api/profile/me"
        />

        <SectionCard
          eyebrow="My Cane Corso"
          title={`${state.dogs.length} profiles in session scope`}
          description={
            state.dogs.length > 0
              ? 'Publication badges and verify identifiers are surfaced inside the mobile workspace too.'
              : 'No Cane Corso profiles are coming through the shared member API yet.'
          }
          meta="/api/dogs"
        >
          {state.dogs.length > 0 ? (
            state.dogs.map((dog) => (
              <View key={dog.id} style={styles.listRow}>
                <View style={styles.listRowHeader}>
                  <Text style={styles.listTitle}>{dog.name}</Text>
                  <Text style={styles.statusPill}>{dog.lifecycleStatus}</Text>
                </View>
                <Text style={styles.listCopy}>
                  {dog.visibility} • {dog.sex} • {dog.registryClass ?? 'owner_declared_cane_corso'}
                </Text>
                {dog.publication ? (
                  <Text style={styles.listMeta}>
                    {dog.publication.publicSlug} • {dog.publication.certificateCode ?? 'certificate not issued'}
                  </Text>
                ) : null}
              </View>
            ))
          ) : (
            <Text style={styles.emptyCopy}>Create and submit a Cane Corso profile in the web app, then publish it from review to see the full bridge here.</Text>
          )}
        </SectionCard>

        <SectionCard
          eyebrow="Public registry"
          title={`${state.registry?.total ?? 0} published profiles`}
          description={
            state.registry?.entries.length
              ? 'Tap a published profile to load the shared registry detail document. Verify becomes available only after an active certificate exists.'
              : 'No published profiles are available yet. Once a review item is published, it will surface here.'
          }
          meta="/api/registry"
        >
          {state.registry?.entries.length ? (
            state.registry.entries.map((entry) => {
              const isSelected = entry.publicSlug === state.selectedRegistrySlug;

              return (
                <Pressable
                  key={entry.entryId}
                  onPress={() => handleSelectRegistryEntry(entry)}
                  style={[styles.selectableRow, isSelected ? styles.selectableRowActive : null]}
                >
                  <View style={styles.listRowHeader}>
                    <Text style={styles.listTitle}>{entry.title}</Text>
                    <Text style={styles.statusPill}>{entry.dog.sex}</Text>
                  </View>
                  <Text style={styles.listCopy}>{entry.owner.displayName}</Text>
                  <Text style={styles.listMeta}>{entry.publicSlug}</Text>
                </Pressable>
              );
            })
          ) : (
            <Text style={styles.emptyCopy}>The public registry is still empty in this environment.</Text>
          )}
        </SectionCard>

        <SectionCard
          eyebrow="Registry detail"
          title={state.registryProfile?.entry.title ?? 'Waiting for a published selection'}
          description={
            state.registryProfile
              ? `${state.registryProfile.entry.owner.displayName} • ${state.registryProfile.entry.publicSlug}`
              : 'Select a published registry card above to load its dedicated detail document.'
          }
          meta={state.registryProfile ? `/api/registry/${state.registryProfile.entry.publicSlug}` : '/api/registry/[slug]'}
        >
          {state.registryProfile ? (
            <View style={styles.listRow}>
              <Text style={styles.listCopy}>{state.registryProfile.entry.summary || 'No registry summary yet.'}</Text>
              <Text style={styles.listMeta}>
                {state.registryProfile.entry.certificate?.certificateCode ?? 'Certificate not issued'}
              </Text>
            </View>
          ) : (
            <Text style={styles.emptyCopy}>The detail bridge will appear here once you select a published profile.</Text>
          )}
        </SectionCard>

        <SectionCard
          eyebrow="Verify bridge"
          title={state.verification?.entry.certificate?.certificateCode ?? 'Resolve certificate or slug'}
          description={
            state.verification
              ? `${state.verification.entry.title} is available through the shared verify contract.`
              : 'Use the active certificate code or verification slug to test the verify endpoint directly from mobile.'
          }
          meta={
            state.verification?.entry.certificate?.verificationSlug
              ? `/api/verify/${state.verification.entry.certificate.verificationSlug}`
              : '/api/verify/[code]'
          }
        >
          <TextInput
            value={verifyInput}
            onChangeText={setVerifyInput}
            placeholder="USG-20260409-RHODOPE or nero-del-rhodope-verify"
            placeholderTextColor="#8f887c"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />
          <Pressable onPress={handleVerifyLookup} style={styles.primaryButton}>
            <Text style={styles.primaryButtonLabel}>{isResolvingVerify ? 'Resolving…' : 'Resolve verify record'}</Text>
          </Pressable>

          {state.verification ? (
            <View style={styles.listRow}>
              <Text style={styles.listTitle}>{state.verification.entry.dog.name}</Text>
              <Text style={styles.listCopy}>{state.verification.entry.owner.displayName}</Text>
              <Text style={styles.listMeta}>{state.verification.entry.certificate?.verificationSlug ?? 'No slug available'}</Text>
            </View>
          ) : (
            <Text style={styles.emptyCopy}>No verification record is loaded yet.</Text>
          )}
        </SectionCard>

        <SectionCard
          eyebrow="Partners bridge"
          title={`${state.partners?.total ?? 0} approved partners`}
          description="The mobile app now reads the same approved partner directory that powers the locked public Partners page."
          meta="/api/partners"
        >
          {featuredPartner ? <PartnerPreview partner={featuredPartner} /> : <Text style={styles.emptyCopy}>No approved partner profile is available yet.</Text>}
        </SectionCard>

        <SectionCard
          eyebrow="Ecosystem bridge"
          title={`${state.ecosystem?.summary.total ?? 0} published ecosystem listings`}
          description="This checks the community/ecosystem public directory from mobile without touching the locked web pages."
          meta="/api/ecosystem"
        >
          {featuredEcosystemListing ? (
            <EcosystemPreview listing={featuredEcosystemListing} />
          ) : (
            <Text style={styles.emptyCopy}>No published ecosystem listing is available yet.</Text>
          )}
        </SectionCard>

        <SectionCard
          eyebrow="Mobile readiness"
          title="Shared API surface is now visible from mobile"
          description="Step 7 keeps the app as a QA bridge, but it now covers the locked registry, verify, partners, and ecosystem public layers."
          meta="Expo • Next.js API • contracts package"
        >
          <View style={styles.checkList}>
            <CheckRow label="Registry and verify bridge" passed={Boolean(state.registry || state.verification)} />
            <CheckRow label="Partners public directory" passed={Boolean(state.partners)} />
            <CheckRow label="Ecosystem public directory" passed={Boolean(state.ecosystem)} />
          </View>
        </SectionCard>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionCard({
  eyebrow,
  title,
  description,
  meta,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  meta?: string;
  children?: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardCopy}>{description}</Text>
      {children ? <View style={styles.cardContent}>{children}</View> : null}
      {meta ? <Text style={styles.cardMeta}>{meta}</Text> : null}
    </View>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

function PartnerPreview({ partner }: { partner: PartnerDirectoryEntry }) {
  const ratingLabel =
    partner.communityRating.totalRatings > 0 && partner.communityRating.averageRating !== null
      ? `Community rating: ${partner.communityRating.averageRating.toFixed(1)} / 5 • ${partner.communityRating.totalRatings} votes`
      : 'Community rating: no votes yet';

  return (
    <View style={styles.previewCard}>
      <View style={styles.listRowHeader}>
        <Text style={styles.listTitle}>{partner.businessName}</Text>
        <Text style={styles.statusPill}>{partner.isFeatured ? 'Featured' : 'Approved'}</Text>
      </View>
      <Text style={styles.listCopy}>{partner.shortDescription ?? 'Approved partner profile.'}</Text>
      <Text style={styles.listMeta}>{formatLocation(partner.city, partner.country) || 'No public location'} • {partner.slug}</Text>
      <Text style={styles.listMeta}>{ratingLabel}</Text>
    </View>
  );
}

function EcosystemPreview({ listing }: { listing: EcosystemListing }) {
  return (
    <View style={styles.previewCard}>
      <View style={styles.listRowHeader}>
        <Text style={styles.listTitle}>{listing.title}</Text>
        <Text style={styles.statusPill}>{formatListingType(listing.listingType)}</Text>
      </View>
      <Text style={styles.listCopy}>{listing.shortDescription ?? 'Published ecosystem listing.'}</Text>
      <Text style={styles.listMeta}>{formatLocation(listing.city, listing.country) || 'No public location'} • {listing.submissionChannel}</Text>
      <Text style={styles.listMeta}>{listing.publishedAt ? `Published ${listing.publishedAt}` : 'Published listing'}</Text>
    </View>
  );
}

function CheckRow({ label, passed }: { label: string; passed: boolean }) {
  return (
    <View style={styles.checkRow}>
      <Text style={styles.checkMark}>{passed ? '✓' : '•'}</Text>
      <Text style={styles.checkLabel}>{label}</Text>
    </View>
  );
}

function selectFeaturedPartner(document: PartnerDirectoryDocument | null) {
  if (!document?.entries.length) {
    return null;
  }

  return document.entries.find((entry) => entry.isFeatured) ?? document.entries[0];
}

function selectFeaturedEcosystemListing(document: EcosystemDirectoryDocument | null) {
  if (!document?.items.length) {
    return null;
  }

  return document.items.find((item) => item.isFeatured) ?? document.items[0];
}

function formatSessionLabel(displayName: string | null, email: string, bootstrap: string) {
  return `${displayName ?? email} • ${bootstrap}`;
}

function formatProfileLabel(displayName: string, city: string | null, country: string | null) {
  const location = formatLocation(city, country);
  return location ? `${displayName} • ${location}` : displayName;
}

function formatLocation(city: string | null, country: string | null) {
  return [city, country].filter(Boolean).join(', ');
}

function formatListingType(type: EcosystemListing['listingType']) {
  const labels: Record<EcosystemListing['listingType'], string> = {
    partner_service: 'Partner',
    transport_relocation: 'Transport',
    hotel_boarding: 'Boarding',
    walk_play_place: 'Places',
    pet_friendly_place: 'Pet-friendly',
    puppy_listing: 'Puppies',
    adoption_new_home: 'New home',
    breeding_match: 'Match',
    event: 'Event',
  };

  return labels[type];
}

const styles = {
  screen: {
    flex: 1,
    backgroundColor: '#0e0e10',
  },
  scrollContent: {
    padding: 24,
    gap: 20,
  },
  heroBlock: {
    gap: 8,
    paddingBottom: 4,
  },
  eyebrow: {
    color: '#d4af37',
    fontSize: 12,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: '#f8f5ef',
    fontSize: 32,
    fontWeight: '700',
  },
  heroCopy: {
    color: '#d0cabf',
    fontSize: 16,
    lineHeight: 24,
  },
  heroMeta: {
    color: '#8f887c',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricCard: {
    flexGrow: 1,
    minWidth: 145,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.18)',
    borderRadius: 20,
    padding: 16,
    backgroundColor: '#15151a',
    gap: 4,
  },
  metricLabel: {
    color: '#8f887c',
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  metricValue: {
    color: '#f8f5ef',
    fontSize: 24,
    fontWeight: '700',
  },
  card: {
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    borderRadius: 24,
    padding: 20,
    backgroundColor: '#17171c',
    gap: 8,
  },
  cardContent: {
    gap: 12,
    marginTop: 4,
  },
  cardTitle: {
    color: '#f8f5ef',
    fontSize: 22,
    fontWeight: '600',
  },
  cardCopy: {
    color: '#d0cabf',
    fontSize: 15,
    lineHeight: 22,
  },
  cardMeta: {
    color: '#8f887c',
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  listRow: {
    gap: 4,
    paddingTop: 2,
  },
  listRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  listTitle: {
    color: '#f8f5ef',
    fontSize: 16,
    fontWeight: '600',
    flexShrink: 1,
  },
  listCopy: {
    color: '#d0cabf',
    fontSize: 14,
    lineHeight: 21,
  },
  listMeta: {
    color: '#8f887c',
    fontSize: 12,
  },
  statusPill: {
    color: '#0e0e10',
    backgroundColor: '#d4af37',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  selectableRow: {
    gap: 4,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.14)',
    backgroundColor: '#111118',
  },
  selectableRowActive: {
    borderColor: '#d4af37',
    backgroundColor: '#1a1711',
  },
  previewCard: {
    gap: 8,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.14)',
    backgroundColor: '#111118',
  },
  checkList: {
    gap: 8,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkMark: {
    color: '#d4af37',
    fontSize: 18,
    fontWeight: '700',
  },
  checkLabel: {
    color: '#d0cabf',
    fontSize: 14,
  },
  emptyCopy: {
    color: '#d0cabf',
    fontSize: 14,
    lineHeight: 22,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.22)',
    backgroundColor: '#111118',
    color: '#f8f5ef',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: '#d4af37',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonLabel: {
    color: '#0e0e10',
    fontSize: 14,
    fontWeight: '700',
  },
  centerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
} as const;

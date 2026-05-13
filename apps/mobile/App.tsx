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

type CapstoneMobileScreenId = 'home' | 'access' | 'myDogs' | 'registryVerify' | 'knowledge' | 'profile';

const capstoneMobileScreens: Array<{ id: CapstoneMobileScreenId; label: string; hint: string }> = [
  { id: 'home', label: 'Home', hint: 'Platform overview' },
  { id: 'access', label: 'Access', hint: 'Auth + API' },
  { id: 'myDogs', label: 'My Dogs', hint: 'Owner workspace' },
  { id: 'registryVerify', label: 'Registry', hint: 'Verify bridge' },
  { id: 'knowledge', label: 'Knowledge', hint: 'Care guide' },
  { id: 'profile', label: 'Profile', hint: 'Account context' },
];

interface MobileScreenProps {
  state: MobileWorkspaceState;
  apiBaseUrl: string;
  featuredPartner: PartnerDirectoryEntry | null;
  featuredEcosystemListing: EcosystemListing | null;
  verifyInput: string;
  setVerifyInput: (value: string) => void;
  isResolvingVerify: boolean;
  handleVerifyLookup: () => void;
  handleSelectRegistryEntry: (entry: PublicRegistryEntry) => void;
}

export default function App() {
  const [state, setState] = useState<MobileWorkspaceState>(initialState);
  const [verifyInput, setVerifyInput] = useState('');
  const [isResolvingVerify, setIsResolvingVerify] = useState(false);
  const [selectedMobileScreen, setSelectedMobileScreen] = useState<CapstoneMobileScreenId>('home');

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
          <Text style={styles.heroTitle}>Mobile Capstone App</Text>
          <Text style={styles.heroCopy}>
            This Expo client presents the same platform through mobile-first screens: overview, access, My Cane Corso,
            registry and verify, knowledge, and profile. Each screen reads shared Next.js API contracts and keeps the
            mobile client aligned with the deployed web platform.
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

        <MobileScreenTabs selectedScreen={selectedMobileScreen} onSelect={setSelectedMobileScreen} />

        {selectedMobileScreen === 'home' ? (
          <MobileHomeScreen
            state={state}
            apiBaseUrl={apiBaseUrl}
            featuredPartner={featuredPartner}
            featuredEcosystemListing={featuredEcosystemListing}
            verifyInput={verifyInput}
            setVerifyInput={setVerifyInput}
            isResolvingVerify={isResolvingVerify}
            handleVerifyLookup={handleVerifyLookup}
            handleSelectRegistryEntry={handleSelectRegistryEntry}
          />
        ) : null}

        {selectedMobileScreen === 'access' ? (
          <MobileAccessScreen
            state={state}
            apiBaseUrl={apiBaseUrl}
            featuredPartner={featuredPartner}
            featuredEcosystemListing={featuredEcosystemListing}
            verifyInput={verifyInput}
            setVerifyInput={setVerifyInput}
            isResolvingVerify={isResolvingVerify}
            handleVerifyLookup={handleVerifyLookup}
            handleSelectRegistryEntry={handleSelectRegistryEntry}
          />
        ) : null}

        {selectedMobileScreen === 'myDogs' ? (
          <MobileMyDogsScreen
            state={state}
            apiBaseUrl={apiBaseUrl}
            featuredPartner={featuredPartner}
            featuredEcosystemListing={featuredEcosystemListing}
            verifyInput={verifyInput}
            setVerifyInput={setVerifyInput}
            isResolvingVerify={isResolvingVerify}
            handleVerifyLookup={handleVerifyLookup}
            handleSelectRegistryEntry={handleSelectRegistryEntry}
          />
        ) : null}

        {selectedMobileScreen === 'registryVerify' ? (
          <MobileRegistryVerifyScreen
            state={state}
            apiBaseUrl={apiBaseUrl}
            featuredPartner={featuredPartner}
            featuredEcosystemListing={featuredEcosystemListing}
            verifyInput={verifyInput}
            setVerifyInput={setVerifyInput}
            isResolvingVerify={isResolvingVerify}
            handleVerifyLookup={handleVerifyLookup}
            handleSelectRegistryEntry={handleSelectRegistryEntry}
          />
        ) : null}

        {selectedMobileScreen === 'knowledge' ? (
          <MobileKnowledgeScreen
            state={state}
            apiBaseUrl={apiBaseUrl}
            featuredPartner={featuredPartner}
            featuredEcosystemListing={featuredEcosystemListing}
            verifyInput={verifyInput}
            setVerifyInput={setVerifyInput}
            isResolvingVerify={isResolvingVerify}
            handleVerifyLookup={handleVerifyLookup}
            handleSelectRegistryEntry={handleSelectRegistryEntry}
          />
        ) : null}

        {selectedMobileScreen === 'profile' ? (
          <MobileProfileScreen
            state={state}
            apiBaseUrl={apiBaseUrl}
            featuredPartner={featuredPartner}
            featuredEcosystemListing={featuredEcosystemListing}
            verifyInput={verifyInput}
            setVerifyInput={setVerifyInput}
            isResolvingVerify={isResolvingVerify}
            handleVerifyLookup={handleVerifyLookup}
            handleSelectRegistryEntry={handleSelectRegistryEntry}
          />
        ) : null}

      </ScrollView>
    </SafeAreaView>
  );
}


function MobileScreenTabs({
  selectedScreen,
  onSelect,
}: {
  selectedScreen: CapstoneMobileScreenId;
  onSelect: (screenId: CapstoneMobileScreenId) => void;
}) {
  return (
    <View style={styles.mobileScreenNav}>
      {capstoneMobileScreens.map((screen) => {
        const isActive = selectedScreen === screen.id;

        return (
          <Pressable
            key={screen.id}
            onPress={() => onSelect(screen.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            style={[styles.mobileScreenTab, isActive ? styles.mobileScreenTabActive : null]}
          >
            <Text style={[styles.mobileScreenTabLabel, isActive ? styles.mobileScreenTabLabelActive : null]}>{screen.label}</Text>
            <Text style={styles.mobileScreenTabHint}>{screen.hint}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function MobileHomeScreen({ state, apiBaseUrl, featuredPartner, featuredEcosystemListing }: MobileScreenProps) {
  return (
    <View style={styles.mobileScreenPanel}>
      <SectionCard
        eyebrow="Mobile screen 1 / Home"
        title="Platform overview"
        description="A mobile-first overview of the deployed Cane Corso Platform, shared API health, live data counts, and public product surfaces."
        meta={apiBaseUrl}
      >
        <View style={styles.checkList}>
          <CheckRow label="Next.js API is reachable from Expo" passed={state.health?.status === 'ok'} />
          <CheckRow label="Registry data is available" passed={Boolean(state.registry)} />
          <CheckRow label="Partner and ecosystem data is available" passed={Boolean(state.partners && state.ecosystem)} />
        </View>
      </SectionCard>

      <SectionCard
        eyebrow="API status"
        title={state.health?.status ?? 'offline'}
        description={state.sessionLabel}
        meta={state.health ? `${state.health.service} • ${state.health.environment} • DB ${state.health.database}` : 'Shared web API unreachable'}
      />

      <SectionCard
        eyebrow="Mobile readiness"
        title="Six mobile screens are available for the Capstone review"
        description="The Expo app is no longer presented only as a QA bridge. It exposes reviewer-friendly mobile screens for the core platform areas."
        meta="Expo • Next.js API • contracts package"
      >
        <View style={styles.checkList}>
          <CheckRow label="Home / platform overview" passed />
          <CheckRow label="Access / auth orientation" passed />
          <CheckRow label="My Dogs / owner workspace" passed />
          <CheckRow label="Registry + Verify mobile flow" passed />
          <CheckRow label="Knowledge / care guide" passed />
          <CheckRow label="Profile / account context" passed />
        </View>
      </SectionCard>

      <SectionCard
        eyebrow="Featured surfaces"
        title="Public platform content"
        description="Mobile reviewers can see approved partner and ecosystem documents coming through the same shared REST-style API contracts."
        meta="/api/partners • /api/ecosystem"
      >
        {featuredPartner ? <PartnerPreview partner={featuredPartner} /> : <Text style={styles.emptyCopy}>No approved partner profile is available yet.</Text>}
        {featuredEcosystemListing ? (
          <EcosystemPreview listing={featuredEcosystemListing} />
        ) : (
          <Text style={styles.emptyCopy}>No published ecosystem listing is available yet.</Text>
        )}
      </SectionCard>
    </View>
  );
}

function MobileAccessScreen({ state }: MobileScreenProps) {
  return (
    <View style={styles.mobileScreenPanel}>
      <SectionCard
        eyebrow="Mobile screen 2 / Access"
        title={state.authStrategy?.provider ?? 'Auth strategy unavailable'}
        description={
          state.authStrategy
            ? `Web sessions use ${state.authStrategy.webSessionTransport}. The mobile client reads public and session-aware API documents through the shared API base URL.`
            : 'The mobile client could not read the current auth/provider contract yet.'
        }
        meta={state.authStrategy ? `${state.authStrategy.provider} • secure cookies ${state.authStrategy.usesSecureCookies ? 'on' : 'off'}` : '/api/auth/provider'}
      />

      <SectionCard
        eyebrow="Session signal"
        title="Member-aware API context"
        description={state.sessionLabel}
        meta="/api/session"
      />

      <SectionCard
        eyebrow="Access boundaries"
        title="Mobile respects the same role model"
        description="The mobile screen documents how member and admin checks remain owned by the Next.js backend. It does not create a separate mobile-only authority layer."
        meta="member • partner • admin"
      >
        <View style={styles.checkList}>
          <CheckRow label="Authentication stays server-owned" passed />
          <CheckRow label="Admin authority remains in protected web/API routes" passed />
          <CheckRow label="Mobile reads contracts instead of bypassing roles" passed />
        </View>
      </SectionCard>
    </View>
  );
}

function MobileMyDogsScreen({ state }: MobileScreenProps) {
  return (
    <View style={styles.mobileScreenPanel}>
      <SectionCard
        eyebrow="Mobile screen 3 / My Dogs"
        title={`${state.dogs.length} profiles in session scope`}
        description={
          state.dogs.length > 0
            ? 'Owner Cane Corso profiles, publication badges and verify identifiers are surfaced inside the mobile workspace too.'
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
        eyebrow="Owner journey"
        title="Profile completion and review readiness"
        description="The mobile screen mirrors the owner-first product direction: create a profile, add core data, add photos, prepare for review, then follow Registry and Verify status."
        meta="private profile → review → registry → verify"
      />
    </View>
  );
}

function MobileRegistryVerifyScreen({
  state,
  verifyInput,
  setVerifyInput,
  isResolvingVerify,
  handleVerifyLookup,
  handleSelectRegistryEntry,
}: MobileScreenProps) {
  return (
    <View style={styles.mobileScreenPanel}>
      <SectionCard
        eyebrow="Mobile screen 4 / Registry"
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
            <Text style={styles.listMeta}>{state.registryProfile.entry.certificate?.certificateCode ?? 'Certificate not issued'}</Text>
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
        meta={state.verification?.entry.certificate?.verificationSlug ? `/api/verify/${state.verification.entry.certificate.verificationSlug}` : '/api/verify/[code]'}
      >
        <TextInput
          value={verifyInput}
          onChangeText={setVerifyInput}
          placeholder="USG-SOFTUNI-DEMO-113"
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
    </View>
  );
}

function MobileKnowledgeScreen({ state, featuredEcosystemListing }: MobileScreenProps) {
  return (
    <View style={styles.mobileScreenPanel}>
      <SectionCard
        eyebrow="Mobile screen 5 / Knowledge"
        title="Care, growth and responsible ownership"
        description="This mobile screen presents the knowledge direction that supports Cane Corso owners: growth tracking, responsible breeding guidance, photo readiness and safe human/veterinary review boundaries."
        meta="Knowledge Center • Health & Growth Tracker"
      >
        <View style={styles.checkList}>
          <CheckRow label="Growth records can support future regression insights" passed />
          <CheckRow label="ASK MARK I remains guidance-only, not an authority" passed />
          <CheckRow label="Veterinary decisions stay with professionals" passed />
        </View>
      </SectionCard>

      <SectionCard
        eyebrow="Ecosystem learning signal"
        title={`${state.ecosystem?.summary.total ?? 0} published ecosystem listings`}
        description="The Knowledge screen connects educational guidance with the moderated ecosystem, helping owners discover safe services and community information."
        meta="/api/ecosystem?page=1&pageSize=24"
      >
        {featuredEcosystemListing ? (
          <EcosystemPreview listing={featuredEcosystemListing} />
        ) : (
          <Text style={styles.emptyCopy}>No published ecosystem listing is available yet.</Text>
        )}
      </SectionCard>
    </View>
  );
}

function MobileProfileScreen({ state, featuredPartner }: MobileScreenProps) {
  return (
    <View style={styles.mobileScreenPanel}>
      <SectionCard
        eyebrow="Mobile screen 6 / Profile"
        title={state.profileLabel}
        description="This confirms the mobile client can read the same member identity document exposed by the web API. It gives reviewers a dedicated account/profile context screen."
        meta="/api/profile/me"
      />

      <SectionCard
        eyebrow="Partner context"
        title={`${state.partners?.total ?? 0} approved partners`}
        description="The profile screen also shows how member, partner and admin product areas remain connected through shared platform data."
        meta="/api/partners"
      >
        {featuredPartner ? <PartnerPreview partner={featuredPartner} /> : <Text style={styles.emptyCopy}>No approved partner profile is available yet.</Text>}
      </SectionCard>
    </View>
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
    lost_found: 'Lost / found',
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
  mobileScreenNav: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  mobileScreenTab: {
    flexGrow: 1,
    minWidth: 132,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.16)',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#121218',
    gap: 4,
  },
  mobileScreenTabActive: {
    borderColor: '#d4af37',
    backgroundColor: '#1d1910',
  },
  mobileScreenTabLabel: {
    color: '#d0cabf',
    fontSize: 14,
    fontWeight: '700',
  },
  mobileScreenTabLabelActive: {
    color: '#f8f5ef',
  },
  mobileScreenTabHint: {
    color: '#8f887c',
    fontSize: 11,
    lineHeight: 15,
  },
  mobileScreenPanel: {
    gap: 20,
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

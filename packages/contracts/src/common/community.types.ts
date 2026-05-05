export type CommunityBadge = 'community_favorite' | 'top_partner';
export type CommunityVoteGate = 'eligible' | 'member_required' | 'own_entry';

export interface CommunityRatingSummary {
  averageRating: number | null;
  totalRatings: number;
  badge: CommunityBadge | null;
}

export interface CommunityVoteState {
  userRating: number | null;
  canRate: boolean;
  gate: CommunityVoteGate;
}

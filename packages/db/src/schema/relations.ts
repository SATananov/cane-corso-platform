import { relations } from 'drizzle-orm';
import { auditLogs } from './audit';
import {
  certificates,
  dogMedia,
  dogs,
  dogSubmissions,
  registryEntries,
  registryEntryRatings,
  submissionReviews,
} from './dogs';
import { articles } from './knowledge';
import { ecosystemListings, ecosystemReviews } from './ecosystem';
import { partnerApplications, partnerRatings, partners } from './partners';
import { profiles, users } from './users';

export const usersRelations = relations(users, ({ one }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
}));

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
  dogs: many(dogs),
  uploadedDogMedia: many(dogMedia),
  dogSubmissions: many(dogSubmissions),
  submissionReviews: many(submissionReviews),
  partners: many(partners),
  partnerApplications: many(partnerApplications),
  registryEntryRatings: many(registryEntryRatings),
  partnerRatings: many(partnerRatings),
  articles: many(articles),
  ecosystemListings: many(ecosystemListings),
  ecosystemReviews: many(ecosystemReviews),
  auditLogs: many(auditLogs),
}));

export const dogsRelations = relations(dogs, ({ one, many }) => ({
  ownerProfile: one(profiles, {
    fields: [dogs.ownerProfileId],
    references: [profiles.id],
  }),
  media: many(dogMedia),
  submissions: many(dogSubmissions),
  registryEntry: one(registryEntries, {
    fields: [dogs.id],
    references: [registryEntries.dogId],
  }),
  certificates: many(certificates),
}));

export const dogMediaRelations = relations(dogMedia, ({ one }) => ({
  dog: one(dogs, {
    fields: [dogMedia.dogId],
    references: [dogs.id],
  }),
  uploadedByProfile: one(profiles, {
    fields: [dogMedia.uploadedByProfileId],
    references: [profiles.id],
  }),
}));

export const dogSubmissionsRelations = relations(dogSubmissions, ({ one, many }) => ({
  dog: one(dogs, {
    fields: [dogSubmissions.dogId],
    references: [dogs.id],
  }),
  submittedByProfile: one(profiles, {
    fields: [dogSubmissions.submittedByProfileId],
    references: [profiles.id],
  }),
  reviews: many(submissionReviews),
}));

export const submissionReviewsRelations = relations(submissionReviews, ({ one }) => ({
  submission: one(dogSubmissions, {
    fields: [submissionReviews.submissionId],
    references: [dogSubmissions.id],
  }),
  reviewerProfile: one(profiles, {
    fields: [submissionReviews.reviewerProfileId],
    references: [profiles.id],
  }),
}));

export const registryEntriesRelations = relations(registryEntries, ({ one, many }) => ({
  dog: one(dogs, {
    fields: [registryEntries.dogId],
    references: [dogs.id],
  }),
  ratings: many(registryEntryRatings),
}));

export const registryEntryRatingsRelations = relations(registryEntryRatings, ({ one }) => ({
  registryEntry: one(registryEntries, {
    fields: [registryEntryRatings.registryEntryId],
    references: [registryEntries.id],
  }),
  voterProfile: one(profiles, {
    fields: [registryEntryRatings.voterProfileId],
    references: [profiles.id],
  }),
}));

export const certificatesRelations = relations(certificates, ({ one }) => ({
  dog: one(dogs, {
    fields: [certificates.dogId],
    references: [dogs.id],
  }),
}));

export const partnersRelations = relations(partners, ({ one, many }) => ({
  ownerProfile: one(profiles, {
    fields: [partners.ownerProfileId],
    references: [profiles.id],
  }),
  ratings: many(partnerRatings),
}));

export const partnerRatingsRelations = relations(partnerRatings, ({ one }) => ({
  partner: one(partners, {
    fields: [partnerRatings.partnerId],
    references: [partners.id],
  }),
  voterProfile: one(profiles, {
    fields: [partnerRatings.voterProfileId],
    references: [profiles.id],
  }),
}));

export const partnerApplicationsRelations = relations(partnerApplications, ({ one }) => ({
  applicantProfile: one(profiles, {
    fields: [partnerApplications.applicantProfileId],
    references: [profiles.id],
  }),
}));

export const articlesRelations = relations(articles, ({ one }) => ({
  authorProfile: one(profiles, {
    fields: [articles.authorProfileId],
    references: [profiles.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  actorProfile: one(profiles, {
    fields: [auditLogs.actorProfileId],
    references: [profiles.id],
  }),
}));


export const ecosystemListingsRelations = relations(ecosystemListings, ({ one, many }) => ({
  ownerProfile: one(profiles, {
    fields: [ecosystemListings.ownerProfileId],
    references: [profiles.id],
  }),
  reviews: many(ecosystemReviews),
}));

export const ecosystemReviewsRelations = relations(ecosystemReviews, ({ one }) => ({
  listing: one(ecosystemListings, {
    fields: [ecosystemReviews.listingId],
    references: [ecosystemListings.id],
  }),
  reviewerProfile: one(profiles, {
    fields: [ecosystemReviews.reviewerProfileId],
    references: [profiles.id],
  }),
}));

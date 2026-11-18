import { z } from 'zod';

export const DataQuality = z.enum(['live', 'operator_reported', 'community_reported', 'demo', 'unavailable']);
export type DataQuality = z.infer<typeof DataQuality>;
export const ShowStatus = z.enum(['scheduled', 'selling', 'fast_filling', 'sold_out', 'cancelled']);
export type ShowStatus = z.infer<typeof ShowStatus>;

export const RegionSchema = z.object({ id: z.string(), state: z.string(), district: z.string(), city: z.string(), slug: z.string(), lat: z.number(), lng: z.number(), isActive: z.boolean() });
export type Region = z.infer<typeof RegionSchema>;
export const MovieSchema = z.object({ id: z.string(), title: z.string(), slug: z.string(), synopsis: z.string(), runtimeMinutes: z.number().int().positive(), certification: z.enum(['U', 'UA', 'A']), languages: z.array(z.string()), genres: z.array(z.string()), posterUrl: z.string().url().optional(), status: z.enum(['now_showing', 'upcoming', 'ended']), dataQuality: DataQuality, source: z.string(), lastUpdatedAt: z.string() });
export type Movie = z.infer<typeof MovieSchema>;
export const ShowSchema = z.object({ id: z.string(), movieId: z.string(), theatreId: z.string(), startsAt: z.string(), format: z.string(), language: z.string(), status: ShowStatus, priceFromPaise: z.number().int().nonnegative(), availableSeats: z.number().int().nonnegative().nullable(), source: z.string(), lastUpdatedAt: z.string(), dataQuality: DataQuality });
export type Show = z.infer<typeof ShowSchema>;
export const TheatreSchema = z.object({ id: z.string(), name: z.string(), slug: z.string(), address: z.string(), regionId: z.string(), lat: z.number(), lng: z.number(), rating: z.number().min(0).max(5), formats: z.array(z.string()), facilities: z.array(z.string()), verified: z.boolean(), dataQuality: DataQuality, source: z.string(), lastUpdatedAt: z.string(), shows: z.array(ShowSchema) });
export type Theatre = z.infer<typeof TheatreSchema>;
export const CompareQuerySchema = z.object({ movie: z.string().default('rekhachithram'), region: z.string().default('kochi'), date: z.string().optional(), sort: z.enum(['best_value', 'lowest_price', 'nearest', 'earliest', 'most_available']).default('best_value'), language: z.string().optional(), format: z.string().optional(), maxPrice: z.coerce.number().optional() });
export type CompareQuery = z.infer<typeof CompareQuerySchema>;

export const OperatorShowInputSchema = z.object({ movieId: z.string(), startsAt: z.string().datetime(), format: z.string().min(1), language: z.string().min(1), priceFromPaise: z.number().int().nonnegative(), availableSeats: z.number().int().nonnegative().nullable().default(null) });
export type OperatorShowInput = z.infer<typeof OperatorShowInputSchema>;
export const OperatorFeedSchema = z.object({ shows: z.array(OperatorShowInputSchema).min(1).max(500) });
export type OperatorFeed = z.infer<typeof OperatorFeedSchema>;
export const CommunityReportSchema = z.object({ theatreId: z.string(), note: z.string().min(10).max(500), observedAt: z.string().datetime() });
export type CommunityReport = z.infer<typeof CommunityReportSchema>;
export const AlertSchema = z.object({ email: z.string().email(), showId: z.string(), kind: z.enum(['price_drop', 'availability', 'reminder']).default('availability') });
export type Alert = z.infer<typeof AlertSchema>;
export const TheatreClaimSchema = z.object({ theatreId: z.string(), operatorName: z.string().min(2).max(120), email: z.string().email() });
export type TheatreClaim = z.infer<typeof TheatreClaimSchema>;
export const OperatorSignupSchema = z.object({ email: z.string().email(), password: z.string().min(8).max(128), theatreId: z.string() });
export const OperatorLoginSchema = z.object({ email: z.string().email(), password: z.string().min(8).max(128) });
export const CsvImportSchema = z.object({ csv: z.string().min(10).max(2_000_000) });

export const API_VERSION = 'v1';
export function rupees(paise: number) { return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(paise / 100); }
export function minutesAgo(iso: string, now = Date.now()) { const minutes = Math.max(0, Math.round((now - new Date(iso).getTime()) / 60000)); return minutes < 1 ? 'just now' : `${minutes} min ago`; }

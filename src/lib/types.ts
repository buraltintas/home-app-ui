export type Locale = 'tr' | 'en' | 'de' | 'ru';
export type SearchSource = 'internal' | 'google' | 'google+platform';
export type Coordinates = { latitude: number; longitude: number };

export type MediaAsset = { id: string; url: string; mime_type: 'image/jpeg' | 'image/png' | 'image/webp'; width: number; height: number };
export type PlatformStats = { average_rating: number; rating_count?: number; review_count: number; favorite_count: number; post_count: number };
export type Post = {
  id: string; user_id: string; store_id: string; text: string; content_language?: Locale; rating: number;
  visit_verified: true; distance_meters: number; store_distance_meters?: number; created_at: string; username: string;
  display_name: string; avatar_url: string; store_name: string; store_city: string; store_district: string;
  media: MediaAsset[]; like_count: number; comment_count: number; viewer_has_liked: boolean;
  viewer_follows_author: boolean; viewer_has_favorited_store: boolean; author_level: number;
};
export type SearchIntent = {
  scope: 'home_living' | 'out_of_scope' | 'unclear'; query_language: Locale; normalized_query: string;
  store_name: string; location_text: string; categories: string[]; product_terms: string[]; style_terms: string[];
  price_intent: '' | 'budget' | 'midrange' | 'premium'; attributes: string[];
  sort_preference: '' | 'relevance' | 'distance' | 'rating' | 'popularity'; semantic_terms: string[];
};
export type GoogleExternal = { provider: 'google'; place_id: string; rating: number; rating_count: number; photo_name?: string; photo_attributions?: string[] };
export type StoredPhoto = { name: string; attributions?: string[] };
export type OwnPhoto = { media_id: string };
export type SearchResult = {
  id: string; search_result_impression_id: string; source: SearchSource; name: string; address: string;
  city?: string; district?: string; latitude: number; longitude: number; distance_meters?: number; categories: string[];
  platform?: PlatformStats & { store_id: string }; google?: GoogleExternal; photo?: StoredPhoto; own_photo?: OwnPhoto; premium?: boolean;
  // The store's public telephone number, when we hold one. Absent for a result we have
  // never had a number for; the card hides the action rather than offering a dead one.
  phone?: string;
};
export type SearchGuidance = { code: 'HOME_LIVING_ONLY'; reason: 'out_of_scope' | 'unclear'; message: string; examples: [string, string] };
export type SearchResponse = { search_id: string; visitor_session_id?: string; intent: SearchIntent; results: SearchResult[]; guidance?: SearchGuidance; fallback_state?: string };
export type LocationResult = { provider: 'google'; place_id: string; name: string; address: string; latitude: number; longitude: number; types: string[]; attributions: string[] };
export type DiscoveryLocation = { source: 'device' | 'manual'; label: string; address: string; place_id?: string; latitude: number; longitude: number; accuracy_meters?: number; updated_at: string };
export type Store = { id:string;name:string;slug:string;is_premium?:boolean;brand_name?:string;address:string;city:string;district:string;phone?:string;latitude:number;longitude:number;distance_meters?:number;categories:string[];category_labels:string[];localized_description?:string;platform:PlatformStats;viewer_has_favorited:boolean;viewer_has_reviewed:boolean;external_sources?:{provider:'google';external_id:string;attribution:Record<string,unknown>;refreshed_at?:string}[] };
export type StoreDetail = { store: Store; recent_posts: Post[] };
export type SearchHistoryResult = { store_id: string; name: string; address: string; city: string; district: string; rank: number; distance_meters?: number; source: SearchSource };
export type SearchHistory = { id: string; raw_query: string; intent: SearchIntent; created_at: string; result_count: number; results: SearchHistoryResult[] };
export type VisitVerification = { id: string; store_id: string; distance_meters: number; verified_at: string; expires_at: string };
export type MediaUpload = { id: string; upload: { storage_key: string; upload_url: string; headers: Record<string, string>; expires_at: string } };
export type TokenPair = { access_token:string;refresh_token:string;token_type:'Bearer';access_expires_at:string;refresh_expires_at:string;user_id:string };
export type Me = { id:string;username:string;display_name:string;avatar_url:string;bio:string;bio_language?:Locale;city:string;follower_count:number;following_count:number;post_count:number;favorite_count:number;level:number;email:string };
export type PublicProfile = { id:string;username:string;display_name:string;avatar_url:string;bio:string;bio_language?:Locale;city:string;follower_count:number;following_count:number;post_count:number;level:number };
// The API names the written text `body` when reading and `text` when writing.
export type Comment = { id:string;user_id:string;body:string;content_language?:Locale;username:string;display_name:string;avatar_url:string;created_at:string };

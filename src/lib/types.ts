export type Locale = 'tr' | 'en' | 'de' | 'ru';
export type SearchSource = 'internal' | 'google' | 'google+platform';
export type Coordinates = { latitude: number; longitude: number };

export type MediaAsset = { id: string; url: string; mime_type: 'image/jpeg' | 'image/png' | 'image/webp'; width: number; height: number };
export type ReviewCriteriaScores = { availability:number;value:number;layout:number;staff_care:number;staff_knowledge:number;checkout:number;returns:number;cleanliness:number };
export type PlatformStats = { average_rating: number; rating_count?: number; review_count: number; favorite_count: number; post_count: number };
export type CriteriaAverages = { review_count:number;availability:number;value:number;layout:number;staff_care:number;staff_knowledge:number;checkout:number;returns:number;cleanliness:number };
export type Post = {
  id: string; user_id: string; store_id: string; text: string; content_language?: Locale; rating: number;
  visit_verified: true; distance_meters: number; store_distance_meters?: number; created_at: string;
  display_name: string; avatar_url: string; store_name: string; store_city: string; store_district: string; store_photo?: StoredPhoto;
  media: MediaAsset[]; like_count: number; comment_count: number; viewer_has_liked: boolean;
  viewer_follows_author: boolean; viewer_has_favorited_store: boolean; author_level: number;
  // Absent on reviews written before the eight criteria existed.
  criteria?: ReviewCriteriaScores;
  // What the visit was for, and why any heading scored one or two. Both optional: a review
  // that answered neither question has neither field.
  purchased?: boolean; purchased_item?: string;
  criterion_notes?: Partial<Record<keyof ReviewCriteriaScores,string>>;
};
export type SearchIntent = {
  scope: 'home_living' | 'out_of_scope' | 'unclear'; query_language: Locale; normalized_query: string;
  store_name: string; location_text: string; categories: string[]; product_terms: string[]; style_terms: string[];
  price_intent: '' | 'budget' | 'midrange' | 'premium'; attributes: string[];
  sort_preference: '' | 'relevance' | 'distance' | 'rating' | 'popularity'; semantic_terms: string[];
};
// Search receives only the Places fields that identify and classify a result. Ratings,
// photos, contact details and hours are loaded once by the store-detail endpoint instead.
export type GoogleExternal = { provider: 'google'; place_id: string; business_status?: string };
export type StoredPhoto = { source: 'admin' | 'brand' | 'google'; media_id?: string; name?: string; brand_slug?: string; attributions?: string[] };
export type SearchResult = {
  id: string; search_result_impression_id: string; source: SearchSource; name: string; address: string;
  city?: string; district?: string; latitude: number; longitude: number; distance_meters?: number; categories: string[];
  // Named by the server, from the same translations the store's own page reads.
  category_labels?: string[];
  platform?: PlatformStats & { store_id: string }; google?: GoogleExternal; premium?: boolean; catalog_store?: boolean;
  // Whether this shop's point was worked out from its address rather than published. A
  // distance to such a point is right to a few hundred metres, not to the doorway, so it
  // cannot support "you are close enough to review this".
  location_approximate?: boolean;
  // The chain this shop belongs to, when it belongs to one. It is what lets a result show
  // the chain's own mark instead of a letter; the API has always sent it.
  brand_slug?: string;
};
export type SearchGuidance = { code: 'HOME_LIVING_ONLY'; reason: 'out_of_scope' | 'unclear'; message: string; examples: [string, string] };
export type SearchResponse = { search_id: string; visitor_session_id?: string; intent: SearchIntent; results: SearchResult[]; guidance?: SearchGuidance; fallback_state?: string };
// reviewer_count is how many different people, which review_count stops being the moment
// somebody visits twice. slug is here so a link goes straight to the store's readable
// address rather than to a uuid that answers with a redirect.
export type StoreHighlight = { id:string;slug?:string;name:string;city:string;district?:string;average_rating:number;review_count:number;recent_review_count:number;reviewer_count?:number;rating_increase?:number;photo?:StoredPhoto };
// recent is not a ranking: it is the shops written about most recently, and it carries no
// threshold because it makes no claim beyond that.
export type MonthlyStoreHighlights = { rating_gainer?:StoreHighlight;most_reviewed?:StoreHighlight;recent?:StoreHighlight[] };
// The picker's places are ours now, read from a Turkish administrative table the API
// ships with rather than bought from a provider. `place_id` carries that table's own id.
export type LocationResult = { provider: 'bosagezme'; place_id: string; name: string; address: string; latitude: number; longitude: number; types: string[]; attributions: string[] };
export type DiscoveryLocation = { source: 'device' | 'manual'; label: string; address: string; place_id?: string; latitude: number; longitude: number; accuracy_meters?: number; updated_at: string };
export type Store = { id:string;name:string;slug:string;is_premium?:boolean;is_catalog_store:boolean;location_approximate?:boolean;brand_name?:string;brand_slug?:string;address:string;city:string;district:string;phone?:string;website?:string;latitude:number;longitude:number;distance_meters?:number;categories:string[];category_labels:string[];localized_description?:string;platform:PlatformStats;criteria_averages?:CriteriaAverages;viewer_has_favorited:boolean;viewer_has_reviewed:boolean;viewer_review_count?:number;photo?:StoredPhoto;external_sources?:{provider:'google'|'osm';external_id:string;attribution:Record<string,unknown>;refreshed_at?:string}[] };
export type StoreDetail = { store: Store; recent_posts: Post[] };
export type SearchHistoryResult = { store_id: string; name: string; address: string; city: string; district: string; rank: number; distance_meters?: number; source: SearchSource };
export type SearchHistory = { id: string; raw_query: string; intent: SearchIntent; created_at: string; result_count: number; results: SearchHistoryResult[] };
export type VisitVerification = { id: string; store_id: string; distance_meters: number; verified_at: string; expires_at: string };
export type MediaUpload = { id: string; upload: { storage_key: string; upload_url: string; headers: Record<string, string>; expires_at: string } };
export type TokenPair = { access_token:string;refresh_token:string;token_type:'Bearer';access_expires_at:string;refresh_expires_at:string;user_id:string };
export type Me = { id:string;display_name:string;avatar_url:string;bio:string;bio_language?:Locale;city:string;follower_count:number;following_count:number;post_count:number;favorite_count:number;level:number;next_level?:number;reviews_to_next_level?:number;email:string;discovery_location?:DiscoveryLocation };
export type FeedbackMessage = { id:string;kind:'suggestion'|'problem'|'praise'|'other';message:string;status:'new'|'read'|'handled';created_at:string;reply?:string;replied_at?:string };
export type PublicProfile = { id:string;display_name:string;avatar_url:string;bio:string;bio_language?:Locale;city:string;follower_count:number;following_count:number;post_count:number;level:number };
// The API names the written text `body` when reading and `text` when writing.
export type Comment = { id:string;user_id:string;body:string;content_language?:Locale;display_name:string;avatar_url:string;created_at:string };

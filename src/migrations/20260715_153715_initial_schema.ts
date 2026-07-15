import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'designer', 'buyer');
  CREATE TYPE "public"."enum_assets_genre" AS ENUM('news', 'sports', 'weather', 'election', 'talk', 'other');
  CREATE TYPE "public"."enum_assets_status" AS ENUM('draft', 'pending', 'published', 'delisted');
  CREATE TYPE "public"."enum_orders_milestones_status" AS ENUM('pending', 'in-progress', 'delivered', 'paid');
  CREATE TYPE "public"."enum_orders_order_type" AS ENUM('standard', 'exclusive', 'custom-project');
  CREATE TYPE "public"."enum_orders_status" AS ENUM('pending', 'paid', 'invoice-requested', 'delivered', 'refunded', 'disputed');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('open', 'awarded', 'in-progress', 'delivered', 'closed');
  CREATE TYPE "public"."enum_bids_status" AS ENUM('submitted', 'accepted', 'declined', 'withdrawn');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_jobs_job_type" AS ENUM('full-time', 'contract', 'freelance', 'remote');
  CREATE TYPE "public"."enum_jobs_status" AS ENUM('live', 'filled', 'expired');
  CREATE TYPE "public"."enum_award_entries_status" AS ENUM('submitted', 'shortlisted', 'winner', 'declined');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'buyer' NOT NULL,
  	"studio_name" varchar,
  	"bio" varchar,
  	"on_air_credits" varchar,
  	"verified_designer" boolean DEFAULT false,
  	"certified_designer" boolean DEFAULT false,
  	"country" varchar,
  	"stripe_account_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar
  );
  
  CREATE TABLE "asset_files" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "assets_genre" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_assets_genre",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "assets_includes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL,
  	"included" boolean DEFAULT true
  );
  
  CREATE TABLE "assets" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"designer_id" integer NOT NULL,
  	"category_id" integer NOT NULL,
  	"engine_id" integer NOT NULL,
  	"engine_version_built" varchar NOT NULL,
  	"engine_version_min" varchar,
  	"description" varchar NOT NULL,
  	"is_free" boolean DEFAULT false,
  	"price" numeric,
  	"exclusive_available" boolean DEFAULT false,
  	"exclusive_price" numeric,
  	"editable_notes" varchar,
  	"requirements" varchar,
  	"tracking_ready" boolean DEFAULT false,
  	"file_size_g_b" numeric,
  	"preview_video_url" varchar,
  	"on_engine_recording_url" varchar,
  	"file_id" integer,
  	"verified" boolean DEFAULT false,
  	"award_winner" boolean DEFAULT false,
  	"status" "enum_assets_status" DEFAULT 'pending' NOT NULL,
  	"featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "assets_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "engines" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"short_label" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "orders_milestones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"amount" numeric,
  	"status" "enum_orders_milestones_status" DEFAULT 'pending'
  );
  
  CREATE TABLE "orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"asset_id" integer NOT NULL,
  	"buyer_id" integer NOT NULL,
  	"order_type" "enum_orders_order_type" DEFAULT 'standard' NOT NULL,
  	"amount" numeric NOT NULL,
  	"currency" varchar DEFAULT 'USD',
  	"commission_pct" numeric DEFAULT 20,
  	"status" "enum_orders_status" DEFAULT 'pending' NOT NULL,
  	"stripe_payment_intent_id" varchar,
  	"download_count" numeric DEFAULT 0,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"posted_by_id" integer NOT NULL,
  	"engine_id" integer,
  	"budget_min" numeric,
  	"budget_max" numeric,
  	"deadline" timestamp(3) with time zone,
  	"status" "enum_projects_status" DEFAULT 'open' NOT NULL,
  	"bid_count" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "bids" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"project_id" integer NOT NULL,
  	"designer_id" integer NOT NULL,
  	"amount" numeric NOT NULL,
  	"timeline_days" numeric,
  	"message" varchar,
  	"status" "enum_bids_status" DEFAULT 'submitted',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"excerpt" varchar,
  	"cover_id" integer,
  	"content" jsonb,
  	"published_at" timestamp(3) with time zone,
  	"status" "enum_posts_status" DEFAULT 'draft',
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"company" varchar NOT NULL,
  	"location" varchar,
  	"job_type" "enum_jobs_job_type",
  	"description" varchar NOT NULL,
  	"apply_url" varchar,
  	"status" "enum_jobs_status" DEFAULT 'live',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "award_entries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"entrant_id" integer NOT NULL,
  	"award_category" varchar NOT NULL,
  	"year" numeric DEFAULT 2026 NOT NULL,
  	"video_url" varchar NOT NULL,
  	"description" varchar,
  	"engine_id" integer,
  	"status" "enum_award_entries_status" DEFAULT 'submitted',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"asset_files_id" integer,
  	"assets_id" integer,
  	"engines_id" integer,
  	"categories_id" integer,
  	"orders_id" integer,
  	"projects_id" integer,
  	"bids_id" integer,
  	"posts_id" integer,
  	"jobs_id" integer,
  	"award_entries_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"sections_marketplace" boolean DEFAULT false,
  	"sections_services" boolean DEFAULT false,
  	"sections_awards" boolean DEFAULT false,
  	"sections_blog" boolean DEFAULT false,
  	"sections_jobs" boolean DEFAULT false,
  	"sections_sell_page" boolean DEFAULT false,
  	"commerce_commission_assets_pct" numeric DEFAULT 20,
  	"commerce_commission_services_pct" numeric DEFAULT 20,
  	"commerce_designer_share_pct" numeric DEFAULT 80,
  	"announcement" varchar,
  	"tagline" varchar DEFAULT 'The home of broadcast design',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "assets_genre" ADD CONSTRAINT "assets_genre_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "assets_includes" ADD CONSTRAINT "assets_includes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "assets" ADD CONSTRAINT "assets_designer_id_users_id_fk" FOREIGN KEY ("designer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "assets" ADD CONSTRAINT "assets_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "assets" ADD CONSTRAINT "assets_engine_id_engines_id_fk" FOREIGN KEY ("engine_id") REFERENCES "public"."engines"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "assets" ADD CONSTRAINT "assets_file_id_asset_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."asset_files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "assets_rels" ADD CONSTRAINT "assets_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "assets_rels" ADD CONSTRAINT "assets_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders_milestones" ADD CONSTRAINT "orders_milestones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_posted_by_id_users_id_fk" FOREIGN KEY ("posted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_engine_id_engines_id_fk" FOREIGN KEY ("engine_id") REFERENCES "public"."engines"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "bids" ADD CONSTRAINT "bids_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "bids" ADD CONSTRAINT "bids_designer_id_users_id_fk" FOREIGN KEY ("designer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "award_entries" ADD CONSTRAINT "award_entries_entrant_id_users_id_fk" FOREIGN KEY ("entrant_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "award_entries" ADD CONSTRAINT "award_entries_engine_id_engines_id_fk" FOREIGN KEY ("engine_id") REFERENCES "public"."engines"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_asset_files_fk" FOREIGN KEY ("asset_files_id") REFERENCES "public"."asset_files"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_assets_fk" FOREIGN KEY ("assets_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_engines_fk" FOREIGN KEY ("engines_id") REFERENCES "public"."engines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_bids_fk" FOREIGN KEY ("bids_id") REFERENCES "public"."bids"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_jobs_fk" FOREIGN KEY ("jobs_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_award_entries_fk" FOREIGN KEY ("award_entries_id") REFERENCES "public"."award_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "asset_files_updated_at_idx" ON "asset_files" USING btree ("updated_at");
  CREATE INDEX "asset_files_created_at_idx" ON "asset_files" USING btree ("created_at");
  CREATE UNIQUE INDEX "asset_files_filename_idx" ON "asset_files" USING btree ("filename");
  CREATE INDEX "assets_genre_order_idx" ON "assets_genre" USING btree ("order");
  CREATE INDEX "assets_genre_parent_idx" ON "assets_genre" USING btree ("parent_id");
  CREATE INDEX "assets_includes_order_idx" ON "assets_includes" USING btree ("_order");
  CREATE INDEX "assets_includes_parent_id_idx" ON "assets_includes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "assets_slug_idx" ON "assets" USING btree ("slug");
  CREATE INDEX "assets_designer_idx" ON "assets" USING btree ("designer_id");
  CREATE INDEX "assets_category_idx" ON "assets" USING btree ("category_id");
  CREATE INDEX "assets_engine_idx" ON "assets" USING btree ("engine_id");
  CREATE INDEX "assets_file_idx" ON "assets" USING btree ("file_id");
  CREATE INDEX "assets_updated_at_idx" ON "assets" USING btree ("updated_at");
  CREATE INDEX "assets_created_at_idx" ON "assets" USING btree ("created_at");
  CREATE INDEX "assets_rels_order_idx" ON "assets_rels" USING btree ("order");
  CREATE INDEX "assets_rels_parent_idx" ON "assets_rels" USING btree ("parent_id");
  CREATE INDEX "assets_rels_path_idx" ON "assets_rels" USING btree ("path");
  CREATE INDEX "assets_rels_media_id_idx" ON "assets_rels" USING btree ("media_id");
  CREATE UNIQUE INDEX "engines_slug_idx" ON "engines" USING btree ("slug");
  CREATE INDEX "engines_updated_at_idx" ON "engines" USING btree ("updated_at");
  CREATE INDEX "engines_created_at_idx" ON "engines" USING btree ("created_at");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "orders_milestones_order_idx" ON "orders_milestones" USING btree ("_order");
  CREATE INDEX "orders_milestones_parent_id_idx" ON "orders_milestones" USING btree ("_parent_id");
  CREATE INDEX "orders_asset_idx" ON "orders" USING btree ("asset_id");
  CREATE INDEX "orders_buyer_idx" ON "orders" USING btree ("buyer_id");
  CREATE INDEX "orders_updated_at_idx" ON "orders" USING btree ("updated_at");
  CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");
  CREATE INDEX "projects_posted_by_idx" ON "projects" USING btree ("posted_by_id");
  CREATE INDEX "projects_engine_idx" ON "projects" USING btree ("engine_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "bids_project_idx" ON "bids" USING btree ("project_id");
  CREATE INDEX "bids_designer_idx" ON "bids" USING btree ("designer_id");
  CREATE INDEX "bids_updated_at_idx" ON "bids" USING btree ("updated_at");
  CREATE INDEX "bids_created_at_idx" ON "bids" USING btree ("created_at");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_cover_idx" ON "posts" USING btree ("cover_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "jobs_updated_at_idx" ON "jobs" USING btree ("updated_at");
  CREATE INDEX "jobs_created_at_idx" ON "jobs" USING btree ("created_at");
  CREATE INDEX "award_entries_entrant_idx" ON "award_entries" USING btree ("entrant_id");
  CREATE INDEX "award_entries_engine_idx" ON "award_entries" USING btree ("engine_id");
  CREATE INDEX "award_entries_updated_at_idx" ON "award_entries" USING btree ("updated_at");
  CREATE INDEX "award_entries_created_at_idx" ON "award_entries" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_asset_files_id_idx" ON "payload_locked_documents_rels" USING btree ("asset_files_id");
  CREATE INDEX "payload_locked_documents_rels_assets_id_idx" ON "payload_locked_documents_rels" USING btree ("assets_id");
  CREATE INDEX "payload_locked_documents_rels_engines_id_idx" ON "payload_locked_documents_rels" USING btree ("engines_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("orders_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_bids_id_idx" ON "payload_locked_documents_rels" USING btree ("bids_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_jobs_id_idx" ON "payload_locked_documents_rels" USING btree ("jobs_id");
  CREATE INDEX "payload_locked_documents_rels_award_entries_id_idx" ON "payload_locked_documents_rels" USING btree ("award_entries_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "asset_files" CASCADE;
  DROP TABLE "assets_genre" CASCADE;
  DROP TABLE "assets_includes" CASCADE;
  DROP TABLE "assets" CASCADE;
  DROP TABLE "assets_rels" CASCADE;
  DROP TABLE "engines" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "orders_milestones" CASCADE;
  DROP TABLE "orders" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "bids" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "jobs" CASCADE;
  DROP TABLE "award_entries" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_assets_genre";
  DROP TYPE "public"."enum_assets_status";
  DROP TYPE "public"."enum_orders_milestones_status";
  DROP TYPE "public"."enum_orders_order_type";
  DROP TYPE "public"."enum_orders_status";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum_bids_status";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum_jobs_job_type";
  DROP TYPE "public"."enum_jobs_status";
  DROP TYPE "public"."enum_award_entries_status";`)
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_job_applications_status" AS ENUM('submitted', 'reviewed', 'shortlisted', 'rejected', 'hired');
  CREATE TYPE "public"."enum_site_settings_section_order" AS ENUM('valueProps', 'featured', 'free', 'stats', 'testimonials');
  ALTER TYPE "public"."enum_jobs_status" ADD VALUE 'pending' BEFORE 'live';
  ALTER TYPE "public"."enum_jobs_status" ADD VALUE 'rejected';
  CREATE TABLE "genres" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"blog_categories_id" integer
  );
  
  CREATE TABLE "blog_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "job_applications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"job_id" integer NOT NULL,
  	"applicant_id" integer NOT NULL,
  	"cover_note" varchar,
  	"resume_url" varchar,
  	"status" "enum_job_applications_status" DEFAULT 'submitted',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_value_props" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_section_order" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_site_settings_section_order",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  ALTER TABLE "assets_genre" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "assets_genre" CASCADE;
  ALTER TABLE "jobs" ALTER COLUMN "status" SET DEFAULT 'pending';
  ALTER TABLE "jobs" ALTER COLUMN "status" SET NOT NULL;
  ALTER TABLE "assets_rels" ADD COLUMN "genres_id" integer;
  ALTER TABLE "jobs" ADD COLUMN "posted_by_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "genres_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "blog_categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "job_applications_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "hero_background_image_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "hero_background_video_url" varchar;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_blog_categories_fk" FOREIGN KEY ("blog_categories_id") REFERENCES "public"."blog_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_applicant_id_users_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_value_props" ADD CONSTRAINT "site_settings_value_props_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_section_order" ADD CONSTRAINT "site_settings_section_order_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "genres_slug_idx" ON "genres" USING btree ("slug");
  CREATE INDEX "genres_updated_at_idx" ON "genres" USING btree ("updated_at");
  CREATE INDEX "genres_created_at_idx" ON "genres" USING btree ("created_at");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_blog_categories_id_idx" ON "posts_rels" USING btree ("blog_categories_id");
  CREATE UNIQUE INDEX "blog_categories_slug_idx" ON "blog_categories" USING btree ("slug");
  CREATE INDEX "blog_categories_updated_at_idx" ON "blog_categories" USING btree ("updated_at");
  CREATE INDEX "blog_categories_created_at_idx" ON "blog_categories" USING btree ("created_at");
  CREATE INDEX "job_applications_job_idx" ON "job_applications" USING btree ("job_id");
  CREATE INDEX "job_applications_applicant_idx" ON "job_applications" USING btree ("applicant_id");
  CREATE INDEX "job_applications_updated_at_idx" ON "job_applications" USING btree ("updated_at");
  CREATE INDEX "job_applications_created_at_idx" ON "job_applications" USING btree ("created_at");
  CREATE INDEX "site_settings_value_props_order_idx" ON "site_settings_value_props" USING btree ("_order");
  CREATE INDEX "site_settings_value_props_parent_id_idx" ON "site_settings_value_props" USING btree ("_parent_id");
  CREATE INDEX "site_settings_section_order_order_idx" ON "site_settings_section_order" USING btree ("order");
  CREATE INDEX "site_settings_section_order_parent_idx" ON "site_settings_section_order" USING btree ("parent_id");
  ALTER TABLE "assets_rels" ADD CONSTRAINT "assets_rels_genres_fk" FOREIGN KEY ("genres_id") REFERENCES "public"."genres"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs" ADD CONSTRAINT "jobs_posted_by_id_users_id_fk" FOREIGN KEY ("posted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_genres_fk" FOREIGN KEY ("genres_id") REFERENCES "public"."genres"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_categories_fk" FOREIGN KEY ("blog_categories_id") REFERENCES "public"."blog_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_job_applications_fk" FOREIGN KEY ("job_applications_id") REFERENCES "public"."job_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_hero_background_image_id_media_id_fk" FOREIGN KEY ("hero_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "assets_rels_genres_id_idx" ON "assets_rels" USING btree ("genres_id");
  CREATE INDEX "jobs_posted_by_idx" ON "jobs" USING btree ("posted_by_id");
  CREATE INDEX "payload_locked_documents_rels_genres_id_idx" ON "payload_locked_documents_rels" USING btree ("genres_id");
  CREATE INDEX "payload_locked_documents_rels_blog_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_categories_id");
  CREATE INDEX "payload_locked_documents_rels_job_applications_id_idx" ON "payload_locked_documents_rels" USING btree ("job_applications_id");
  CREATE INDEX "site_settings_hero_background_image_idx" ON "site_settings" USING btree ("hero_background_image_id");
  DROP TYPE "public"."enum_assets_genre";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_assets_genre" AS ENUM('news', 'sports', 'weather', 'election', 'talk', 'other');
  CREATE TABLE "assets_genre" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_assets_genre",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  ALTER TABLE "genres" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "job_applications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_value_props" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_section_order" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "genres" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "blog_categories" CASCADE;
  DROP TABLE "job_applications" CASCADE;
  DROP TABLE "site_settings_value_props" CASCADE;
  DROP TABLE "site_settings_section_order" CASCADE;
  ALTER TABLE "assets_rels" DROP CONSTRAINT "assets_rels_genres_fk";
  
  ALTER TABLE "jobs" DROP CONSTRAINT "jobs_posted_by_id_users_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_genres_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_blog_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_job_applications_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_hero_background_image_id_media_id_fk";
  
  ALTER TABLE "jobs" ALTER COLUMN "status" SET DATA TYPE text;
  ALTER TABLE "jobs" ALTER COLUMN "status" SET DEFAULT 'live'::text;
  DROP TYPE "public"."enum_jobs_status";
  CREATE TYPE "public"."enum_jobs_status" AS ENUM('live', 'filled', 'expired');
  ALTER TABLE "jobs" ALTER COLUMN "status" SET DEFAULT 'live'::"public"."enum_jobs_status";
  ALTER TABLE "jobs" ALTER COLUMN "status" SET DATA TYPE "public"."enum_jobs_status" USING "status"::"public"."enum_jobs_status";
  DROP INDEX "assets_rels_genres_id_idx";
  DROP INDEX "jobs_posted_by_idx";
  DROP INDEX "payload_locked_documents_rels_genres_id_idx";
  DROP INDEX "payload_locked_documents_rels_blog_categories_id_idx";
  DROP INDEX "payload_locked_documents_rels_job_applications_id_idx";
  DROP INDEX "site_settings_hero_background_image_idx";
  ALTER TABLE "jobs" ALTER COLUMN "status" DROP NOT NULL;
  ALTER TABLE "assets_genre" ADD CONSTRAINT "assets_genre_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "assets_genre_order_idx" ON "assets_genre" USING btree ("order");
  CREATE INDEX "assets_genre_parent_idx" ON "assets_genre" USING btree ("parent_id");
  ALTER TABLE "assets_rels" DROP COLUMN "genres_id";
  ALTER TABLE "jobs" DROP COLUMN "posted_by_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "genres_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "blog_categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "job_applications_id";
  ALTER TABLE "site_settings" DROP COLUMN "hero_background_image_id";
  ALTER TABLE "site_settings" DROP COLUMN "hero_background_video_url";
  DROP TYPE "public"."enum_job_applications_status";
  DROP TYPE "public"."enum_site_settings_section_order";`)
}

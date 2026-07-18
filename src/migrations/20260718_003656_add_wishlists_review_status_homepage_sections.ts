import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_assets_deal_label" AS ENUM('none', 'intro', 'launch', 'featured');
  CREATE TYPE "public"."enum_assets_ribbon" AS ENUM('none', 'editors-choice', 'best-seller', 'best-value', 'new');
  CREATE TYPE "public"."enum_reviews_status" AS ENUM('pending', 'published');
  CREATE TYPE "public"."enum_site_settings_feature_bands_image_side" AS ENUM('right', 'left');
  ALTER TABLE "site_settings_section_order" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum_site_settings_section_order";
  CREATE TYPE "public"."enum_site_settings_section_order" AS ENUM('categoryTiles', 'howItWorks', 'valueProps', 'featured', 'editorsPicks', 'featureBands', 'verifiedExplainer', 'competitionsTeaser', 'stats', 'blogRow', 'testimonials');
  ALTER TABLE "site_settings_section_order" ALTER COLUMN "value" SET DATA TYPE "public"."enum_site_settings_section_order" USING "value"::"public"."enum_site_settings_section_order";
  CREATE TABLE "wishlists" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "wishlists_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"assets_id" integer
  );
  
  CREATE TABLE "site_settings_category_tiles_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"category_id" integer NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "site_settings_feature_bands" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"image_id" integer,
  	"image_side" "enum_site_settings_feature_bands_image_side" DEFAULT 'right'
  );
  
  CREATE TABLE "site_settings_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"assets_id" integer
  );
  
  ALTER TABLE "reviews" ALTER COLUMN "order_id" DROP NOT NULL;
  ALTER TABLE "assets" ADD COLUMN "rating" numeric;
  ALTER TABLE "assets" ADD COLUMN "review_count" numeric;
  ALTER TABLE "assets" ADD COLUMN "original_price" numeric;
  ALTER TABLE "assets" ADD COLUMN "deal_label" "enum_assets_deal_label" DEFAULT 'none';
  ALTER TABLE "assets" ADD COLUMN "ribbon" "enum_assets_ribbon" DEFAULT 'none';
  ALTER TABLE "assets" ADD COLUMN "wishlist_count" numeric DEFAULT 0;
  ALTER TABLE "reviews" ADD COLUMN "title" varchar;
  ALTER TABLE "reviews" ADD COLUMN "verified_purchase" boolean DEFAULT false;
  ALTER TABLE "reviews" ADD COLUMN "status" "enum_reviews_status" DEFAULT 'pending';
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "wishlists_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "category_tiles_heading" varchar DEFAULT 'Explore by category';
  ALTER TABLE "site_settings" ADD COLUMN "category_tiles_subheading" varchar DEFAULT 'Every listing is admin-reviewed before it goes live';
  ALTER TABLE "site_settings" ADD COLUMN "editors_picks_heading" varchar DEFAULT 'Editor''s picks';
  ALTER TABLE "site_settings" ADD COLUMN "editors_picks_subheading" varchar DEFAULT 'Hand-selected for build quality and on-engine accuracy';
  ALTER TABLE "site_settings" ADD COLUMN "blog_row_heading" varchar DEFAULT 'Latest from the blog';
  ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "wishlists_rels" ADD CONSTRAINT "wishlists_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."wishlists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "wishlists_rels" ADD CONSTRAINT "wishlists_rels_assets_fk" FOREIGN KEY ("assets_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_category_tiles_tiles" ADD CONSTRAINT "site_settings_category_tiles_tiles_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_category_tiles_tiles" ADD CONSTRAINT "site_settings_category_tiles_tiles_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_category_tiles_tiles" ADD CONSTRAINT "site_settings_category_tiles_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_feature_bands" ADD CONSTRAINT "site_settings_feature_bands_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_feature_bands" ADD CONSTRAINT "site_settings_feature_bands_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_assets_fk" FOREIGN KEY ("assets_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "wishlists_user_idx" ON "wishlists" USING btree ("user_id");
  CREATE INDEX "wishlists_updated_at_idx" ON "wishlists" USING btree ("updated_at");
  CREATE INDEX "wishlists_created_at_idx" ON "wishlists" USING btree ("created_at");
  CREATE INDEX "wishlists_rels_order_idx" ON "wishlists_rels" USING btree ("order");
  CREATE INDEX "wishlists_rels_parent_idx" ON "wishlists_rels" USING btree ("parent_id");
  CREATE INDEX "wishlists_rels_path_idx" ON "wishlists_rels" USING btree ("path");
  CREATE INDEX "wishlists_rels_assets_id_idx" ON "wishlists_rels" USING btree ("assets_id");
  CREATE INDEX "site_settings_category_tiles_tiles_order_idx" ON "site_settings_category_tiles_tiles" USING btree ("_order");
  CREATE INDEX "site_settings_category_tiles_tiles_parent_id_idx" ON "site_settings_category_tiles_tiles" USING btree ("_parent_id");
  CREATE INDEX "site_settings_category_tiles_tiles_category_idx" ON "site_settings_category_tiles_tiles" USING btree ("category_id");
  CREATE INDEX "site_settings_category_tiles_tiles_image_idx" ON "site_settings_category_tiles_tiles" USING btree ("image_id");
  CREATE INDEX "site_settings_feature_bands_order_idx" ON "site_settings_feature_bands" USING btree ("_order");
  CREATE INDEX "site_settings_feature_bands_parent_id_idx" ON "site_settings_feature_bands" USING btree ("_parent_id");
  CREATE INDEX "site_settings_feature_bands_image_idx" ON "site_settings_feature_bands" USING btree ("image_id");
  CREATE INDEX "site_settings_rels_order_idx" ON "site_settings_rels" USING btree ("order");
  CREATE INDEX "site_settings_rels_parent_idx" ON "site_settings_rels" USING btree ("parent_id");
  CREATE INDEX "site_settings_rels_path_idx" ON "site_settings_rels" USING btree ("path");
  CREATE INDEX "site_settings_rels_assets_id_idx" ON "site_settings_rels" USING btree ("assets_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_wishlists_fk" FOREIGN KEY ("wishlists_id") REFERENCES "public"."wishlists"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_wishlists_id_idx" ON "payload_locked_documents_rels" USING btree ("wishlists_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "wishlists" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "wishlists_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_category_tiles_tiles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_feature_bands" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "wishlists" CASCADE;
  DROP TABLE "wishlists_rels" CASCADE;
  DROP TABLE "site_settings_category_tiles_tiles" CASCADE;
  DROP TABLE "site_settings_feature_bands" CASCADE;
  DROP TABLE "site_settings_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_wishlists_fk";
  
  ALTER TABLE "site_settings_section_order" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum_site_settings_section_order";
  CREATE TYPE "public"."enum_site_settings_section_order" AS ENUM('howItWorks', 'valueProps', 'featured', 'verifiedExplainer', 'competitionsTeaser', 'stats', 'testimonials');
  ALTER TABLE "site_settings_section_order" ALTER COLUMN "value" SET DATA TYPE "public"."enum_site_settings_section_order" USING "value"::"public"."enum_site_settings_section_order";
  DROP INDEX "payload_locked_documents_rels_wishlists_id_idx";
  ALTER TABLE "reviews" ALTER COLUMN "order_id" SET NOT NULL;
  ALTER TABLE "assets" DROP COLUMN "rating";
  ALTER TABLE "assets" DROP COLUMN "review_count";
  ALTER TABLE "assets" DROP COLUMN "original_price";
  ALTER TABLE "assets" DROP COLUMN "deal_label";
  ALTER TABLE "assets" DROP COLUMN "ribbon";
  ALTER TABLE "assets" DROP COLUMN "wishlist_count";
  ALTER TABLE "reviews" DROP COLUMN "title";
  ALTER TABLE "reviews" DROP COLUMN "verified_purchase";
  ALTER TABLE "reviews" DROP COLUMN "status";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "wishlists_id";
  ALTER TABLE "site_settings" DROP COLUMN "category_tiles_heading";
  ALTER TABLE "site_settings" DROP COLUMN "category_tiles_subheading";
  ALTER TABLE "site_settings" DROP COLUMN "editors_picks_heading";
  ALTER TABLE "site_settings" DROP COLUMN "editors_picks_subheading";
  ALTER TABLE "site_settings" DROP COLUMN "blog_row_heading";
  DROP TYPE "public"."enum_assets_deal_label";
  DROP TYPE "public"."enum_assets_ribbon";
  DROP TYPE "public"."enum_reviews_status";
  DROP TYPE "public"."enum_site_settings_feature_bands_image_side";`)
}

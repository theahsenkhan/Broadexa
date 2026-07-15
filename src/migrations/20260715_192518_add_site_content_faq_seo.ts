import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "faq_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar
  );
  
  CREATE TABLE "site_settings_sell_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_extra_nav_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  ALTER TABLE "assets" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "assets" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "projects" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "projects" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "faq_items_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "logo_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "favicon_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "hero_eyebrow" varchar DEFAULT '● REC — Coming soon';
  ALTER TABLE "site_settings" ADD COLUMN "hero_headline" varchar DEFAULT 'The home of broadcast design';
  ALTER TABLE "site_settings" ADD COLUMN "hero_subhead" varchar DEFAULT 'Virtual sets, AR graphics and full show packages — built by real-time designers, verified on the engines you run.';
  ALTER TABLE "site_settings" ADD COLUMN "hero_cta_label" varchar DEFAULT 'Browse the marketplace';
  ALTER TABLE "site_settings" ADD COLUMN "show_free_spotlight" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "sell_headline" varchar DEFAULT 'Sell your scenes. Keep 80%.';
  ALTER TABLE "site_settings" ADD COLUMN "sell_subhead" varchar DEFAULT 'List virtual sets, AR graphics and show packages for Viz Engine, Unreal, Zero Density, Pixotope, Aximmetry, Brainstorm, Chyron, Ross and Reality. You set your own prices. We take 20% — nothing else.';
  ALTER TABLE "site_settings" ADD COLUMN "sell_closing_headline" varchar DEFAULT 'Ready to list your first scene?';
  ALTER TABLE "site_settings" ADD COLUMN "contact_email" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "social_twitter" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "social_instagram" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "social_linkedin" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "social_youtube" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "copyright_text" varchar DEFAULT '© Broadexa. All rights reserved.';
  ALTER TABLE "site_settings" ADD COLUMN "default_seo_title" varchar DEFAULT 'Broadexa — The home of broadcast design';
  ALTER TABLE "site_settings" ADD COLUMN "default_seo_description" varchar DEFAULT 'A global marketplace for broadcast-ready real-time assets. Virtual sets, AR graphics and show packages for Viz Engine, Unreal, Zero Density, Pixotope, Aximmetry and more.';
  ALTER TABLE "site_settings" ADD COLUMN "terms_of_service" jsonb;
  ALTER TABLE "site_settings" ADD COLUMN "privacy_policy" jsonb;
  ALTER TABLE "site_settings" ADD COLUMN "refund_policy" jsonb;
  ALTER TABLE "site_settings_stats" ADD CONSTRAINT "site_settings_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_testimonials" ADD CONSTRAINT "site_settings_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_sell_steps" ADD CONSTRAINT "site_settings_sell_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_extra_nav_links" ADD CONSTRAINT "site_settings_extra_nav_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "faq_items_updated_at_idx" ON "faq_items" USING btree ("updated_at");
  CREATE INDEX "faq_items_created_at_idx" ON "faq_items" USING btree ("created_at");
  CREATE INDEX "site_settings_stats_order_idx" ON "site_settings_stats" USING btree ("_order");
  CREATE INDEX "site_settings_stats_parent_id_idx" ON "site_settings_stats" USING btree ("_parent_id");
  CREATE INDEX "site_settings_testimonials_order_idx" ON "site_settings_testimonials" USING btree ("_order");
  CREATE INDEX "site_settings_testimonials_parent_id_idx" ON "site_settings_testimonials" USING btree ("_parent_id");
  CREATE INDEX "site_settings_sell_steps_order_idx" ON "site_settings_sell_steps" USING btree ("_order");
  CREATE INDEX "site_settings_sell_steps_parent_id_idx" ON "site_settings_sell_steps" USING btree ("_parent_id");
  CREATE INDEX "site_settings_extra_nav_links_order_idx" ON "site_settings_extra_nav_links" USING btree ("_order");
  CREATE INDEX "site_settings_extra_nav_links_parent_id_idx" ON "site_settings_extra_nav_links" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faq_items_fk" FOREIGN KEY ("faq_items_id") REFERENCES "public"."faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_faq_items_id_idx" ON "payload_locked_documents_rels" USING btree ("faq_items_id");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_favicon_idx" ON "site_settings" USING btree ("favicon_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "faq_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_sell_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_extra_nav_links" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "faq_items" CASCADE;
  DROP TABLE "site_settings_stats" CASCADE;
  DROP TABLE "site_settings_testimonials" CASCADE;
  DROP TABLE "site_settings_sell_steps" CASCADE;
  DROP TABLE "site_settings_extra_nav_links" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_faq_items_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_logo_id_media_id_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_favicon_id_media_id_fk";
  
  DROP INDEX "payload_locked_documents_rels_faq_items_id_idx";
  DROP INDEX "site_settings_logo_idx";
  DROP INDEX "site_settings_favicon_idx";
  ALTER TABLE "assets" DROP COLUMN "seo_title";
  ALTER TABLE "assets" DROP COLUMN "seo_description";
  ALTER TABLE "projects" DROP COLUMN "seo_title";
  ALTER TABLE "projects" DROP COLUMN "seo_description";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "faq_items_id";
  ALTER TABLE "site_settings" DROP COLUMN "logo_id";
  ALTER TABLE "site_settings" DROP COLUMN "favicon_id";
  ALTER TABLE "site_settings" DROP COLUMN "hero_eyebrow";
  ALTER TABLE "site_settings" DROP COLUMN "hero_headline";
  ALTER TABLE "site_settings" DROP COLUMN "hero_subhead";
  ALTER TABLE "site_settings" DROP COLUMN "hero_cta_label";
  ALTER TABLE "site_settings" DROP COLUMN "show_free_spotlight";
  ALTER TABLE "site_settings" DROP COLUMN "sell_headline";
  ALTER TABLE "site_settings" DROP COLUMN "sell_subhead";
  ALTER TABLE "site_settings" DROP COLUMN "sell_closing_headline";
  ALTER TABLE "site_settings" DROP COLUMN "contact_email";
  ALTER TABLE "site_settings" DROP COLUMN "social_twitter";
  ALTER TABLE "site_settings" DROP COLUMN "social_instagram";
  ALTER TABLE "site_settings" DROP COLUMN "social_linkedin";
  ALTER TABLE "site_settings" DROP COLUMN "social_youtube";
  ALTER TABLE "site_settings" DROP COLUMN "copyright_text";
  ALTER TABLE "site_settings" DROP COLUMN "default_seo_title";
  ALTER TABLE "site_settings" DROP COLUMN "default_seo_description";
  ALTER TABLE "site_settings" DROP COLUMN "terms_of_service";
  ALTER TABLE "site_settings" DROP COLUMN "privacy_policy";
  ALTER TABLE "site_settings" DROP COLUMN "refund_policy";`)
}

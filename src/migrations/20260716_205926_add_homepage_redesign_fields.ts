import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "site_settings_how_it_works_buyer_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  ALTER TABLE "site_settings_section_order" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum_site_settings_section_order";
  CREATE TYPE "public"."enum_site_settings_section_order" AS ENUM('howItWorks', 'valueProps', 'featured', 'verifiedExplainer', 'competitionsTeaser', 'stats', 'testimonials');
  ALTER TABLE "site_settings_section_order" ALTER COLUMN "value" SET DATA TYPE "public"."enum_site_settings_section_order" USING "value"::"public"."enum_site_settings_section_order";
  ALTER TABLE "site_settings" ADD COLUMN "show_engine_strip" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "verified_heading" varchar DEFAULT 'What "Verified" means';
  ALTER TABLE "site_settings" ADD COLUMN "verified_body" varchar DEFAULT 'A Verified badge means the designer supplied a recording of the asset running live on the engine, and our team checked it matches the listing. It''s not a quality score — it''s confirmation the listing is what it claims to be.';
  ALTER TABLE "site_settings" ADD COLUMN "show_competitions_teaser" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "cta_buy_label" varchar DEFAULT 'Browse the marketplace';
  ALTER TABLE "site_settings" ADD COLUMN "cta_sell_label" varchar DEFAULT 'Start selling';
  ALTER TABLE "site_settings_how_it_works_buyer_steps" ADD CONSTRAINT "site_settings_how_it_works_buyer_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_settings_how_it_works_buyer_steps_order_idx" ON "site_settings_how_it_works_buyer_steps" USING btree ("_order");
  CREATE INDEX "site_settings_how_it_works_buyer_steps_parent_id_idx" ON "site_settings_how_it_works_buyer_steps" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "site_settings_how_it_works_buyer_steps" CASCADE;
  ALTER TABLE "site_settings_section_order" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum_site_settings_section_order";
  CREATE TYPE "public"."enum_site_settings_section_order" AS ENUM('valueProps', 'featured', 'free', 'stats', 'testimonials');
  ALTER TABLE "site_settings_section_order" ALTER COLUMN "value" SET DATA TYPE "public"."enum_site_settings_section_order" USING "value"::"public"."enum_site_settings_section_order";
  ALTER TABLE "site_settings" DROP COLUMN "show_engine_strip";
  ALTER TABLE "site_settings" DROP COLUMN "verified_heading";
  ALTER TABLE "site_settings" DROP COLUMN "verified_body";
  ALTER TABLE "site_settings" DROP COLUMN "show_competitions_teaser";
  ALTER TABLE "site_settings" DROP COLUMN "cta_buy_label";
  ALTER TABLE "site_settings" DROP COLUMN "cta_sell_label";`)
}

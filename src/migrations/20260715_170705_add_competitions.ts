import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_competitions_status" AS ENUM('upcoming', 'open', 'judging', 'closed');
  CREATE TABLE "competitions_prizes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"place" varchar NOT NULL,
  	"prize" varchar NOT NULL
  );
  
  CREATE TABLE "competitions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"theme" varchar NOT NULL,
  	"cover_image_id" integer,
  	"engine_id" integer,
  	"start_date" timestamp(3) with time zone,
  	"deadline" timestamp(3) with time zone,
  	"rules" varchar,
  	"status" "enum_competitions_status" DEFAULT 'upcoming' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "award_entries" ADD COLUMN "competition_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "competitions_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "sections_competitions" boolean DEFAULT false;
  ALTER TABLE "competitions_prizes" ADD CONSTRAINT "competitions_prizes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "competitions" ADD CONSTRAINT "competitions_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "competitions" ADD CONSTRAINT "competitions_engine_id_engines_id_fk" FOREIGN KEY ("engine_id") REFERENCES "public"."engines"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "competitions_prizes_order_idx" ON "competitions_prizes" USING btree ("_order");
  CREATE INDEX "competitions_prizes_parent_id_idx" ON "competitions_prizes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "competitions_slug_idx" ON "competitions" USING btree ("slug");
  CREATE INDEX "competitions_cover_image_idx" ON "competitions" USING btree ("cover_image_id");
  CREATE INDEX "competitions_engine_idx" ON "competitions" USING btree ("engine_id");
  CREATE INDEX "competitions_updated_at_idx" ON "competitions" USING btree ("updated_at");
  CREATE INDEX "competitions_created_at_idx" ON "competitions" USING btree ("created_at");
  ALTER TABLE "award_entries" ADD CONSTRAINT "award_entries_competition_id_competitions_id_fk" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_competitions_fk" FOREIGN KEY ("competitions_id") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "award_entries_competition_idx" ON "award_entries" USING btree ("competition_id");
  CREATE INDEX "payload_locked_documents_rels_competitions_id_idx" ON "payload_locked_documents_rels" USING btree ("competitions_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "competitions_prizes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "competitions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "competitions_prizes" CASCADE;
  DROP TABLE "competitions" CASCADE;
  ALTER TABLE "award_entries" DROP CONSTRAINT "award_entries_competition_id_competitions_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_competitions_fk";
  
  DROP INDEX "award_entries_competition_idx";
  DROP INDEX "payload_locked_documents_rels_competitions_id_idx";
  ALTER TABLE "award_entries" DROP COLUMN "competition_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "competitions_id";
  ALTER TABLE "site_settings" DROP COLUMN "sections_competitions";
  DROP TYPE "public"."enum_competitions_status";`)
}

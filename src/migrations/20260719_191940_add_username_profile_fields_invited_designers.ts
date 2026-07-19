import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_auth_provider" AS ENUM('local', 'google', 'linkedin');
  CREATE TABLE "users_skills" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"skill" varchar
  );
  
  CREATE TABLE "projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  ALTER TABLE "users" ADD COLUMN "username" varchar;
  UPDATE "users" SET "username" = 'user-' || "id" WHERE "username" IS NULL;
  ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL;
  ALTER TABLE "users" ADD COLUMN "avatar_id" integer;
  ALTER TABLE "users" ADD COLUMN "profession" varchar;
  ALTER TABLE "users" ADD COLUMN "years_experience" numeric;
  ALTER TABLE "users" ADD COLUMN "portfolio_url" varchar;
  ALTER TABLE "users" ADD COLUMN "company_name" varchar;
  ALTER TABLE "users" ADD COLUMN "job_title" varchar;
  ALTER TABLE "users" ADD COLUMN "auth_provider" "enum_users_auth_provider" DEFAULT 'local';
  ALTER TABLE "users_skills" ADD CONSTRAINT "users_skills_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_skills_order_idx" ON "users_skills" USING btree ("_order");
  CREATE INDEX "users_skills_parent_id_idx" ON "users_skills" USING btree ("_parent_id");
  CREATE INDEX "projects_rels_order_idx" ON "projects_rels" USING btree ("order");
  CREATE INDEX "projects_rels_parent_idx" ON "projects_rels" USING btree ("parent_id");
  CREATE INDEX "projects_rels_path_idx" ON "projects_rels" USING btree ("path");
  CREATE INDEX "projects_rels_users_id_idx" ON "projects_rels" USING btree ("users_id");
  ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "users_username_idx" ON "users" USING btree ("username");
  CREATE INDEX "users_avatar_idx" ON "users" USING btree ("avatar_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users_skills" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "users_skills" CASCADE;
  DROP TABLE "projects_rels" CASCADE;
  ALTER TABLE "users" DROP CONSTRAINT "users_avatar_id_media_id_fk";
  
  DROP INDEX "users_username_idx";
  DROP INDEX "users_avatar_idx";
  ALTER TABLE "users" DROP COLUMN "username";
  ALTER TABLE "users" DROP COLUMN "avatar_id";
  ALTER TABLE "users" DROP COLUMN "profession";
  ALTER TABLE "users" DROP COLUMN "years_experience";
  ALTER TABLE "users" DROP COLUMN "portfolio_url";
  ALTER TABLE "users" DROP COLUMN "company_name";
  ALTER TABLE "users" DROP COLUMN "job_title";
  ALTER TABLE "users" DROP COLUMN "auth_provider";
  DROP TYPE "public"."enum_users_auth_provider";`)
}

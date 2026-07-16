import * as migration_20260715_153715_initial_schema from './20260715_153715_initial_schema';
import * as migration_20260715_170705_add_competitions from './20260715_170705_add_competitions';
import * as migration_20260715_192518_add_site_content_faq_seo from './20260715_192518_add_site_content_faq_seo';
import * as migration_20260716_145740_add_genres_blog_categories_job_apps from './20260716_145740_add_genres_blog_categories_job_apps';
import * as migration_20260716_205003_add_messaging_reviews_users_updates from './20260716_205003_add_messaging_reviews_users_updates';
import * as migration_20260716_205926_add_homepage_redesign_fields from './20260716_205926_add_homepage_redesign_fields';

export const migrations = [
  {
    up: migration_20260715_153715_initial_schema.up,
    down: migration_20260715_153715_initial_schema.down,
    name: '20260715_153715_initial_schema',
  },
  {
    up: migration_20260715_170705_add_competitions.up,
    down: migration_20260715_170705_add_competitions.down,
    name: '20260715_170705_add_competitions',
  },
  {
    up: migration_20260715_192518_add_site_content_faq_seo.up,
    down: migration_20260715_192518_add_site_content_faq_seo.down,
    name: '20260715_192518_add_site_content_faq_seo',
  },
  {
    up: migration_20260716_145740_add_genres_blog_categories_job_apps.up,
    down: migration_20260716_145740_add_genres_blog_categories_job_apps.down,
    name: '20260716_145740_add_genres_blog_categories_job_apps',
  },
  {
    up: migration_20260716_205003_add_messaging_reviews_users_updates.up,
    down: migration_20260716_205003_add_messaging_reviews_users_updates.down,
    name: '20260716_205003_add_messaging_reviews_users_updates',
  },
  {
    up: migration_20260716_205926_add_homepage_redesign_fields.up,
    down: migration_20260716_205926_add_homepage_redesign_fields.down,
    name: '20260716_205926_add_homepage_redesign_fields'
  },
];

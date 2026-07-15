import * as migration_20260715_153715_initial_schema from './20260715_153715_initial_schema';
import * as migration_20260715_170705_add_competitions from './20260715_170705_add_competitions';
import * as migration_20260715_192518_add_site_content_faq_seo from './20260715_192518_add_site_content_faq_seo';

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
    name: '20260715_192518_add_site_content_faq_seo'
  },
];

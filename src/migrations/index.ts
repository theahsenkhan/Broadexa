import * as migration_20260715_153715_initial_schema from './20260715_153715_initial_schema';
import * as migration_20260715_170705_add_competitions from './20260715_170705_add_competitions';

export const migrations = [
  {
    up: migration_20260715_153715_initial_schema.up,
    down: migration_20260715_153715_initial_schema.down,
    name: '20260715_153715_initial_schema',
  },
  {
    up: migration_20260715_170705_add_competitions.up,
    down: migration_20260715_170705_add_competitions.down,
    name: '20260715_170705_add_competitions'
  },
];

# Database schema baseline

`mysql-schema.sql` is the schema-only baseline generated from the connected
InvestorMart MySQL database on 2 November 2026. It includes legacy tables,
Laravel application tables, and the mobile property-workflow additions. It
contains no property, user, or production data.

For a new developer or deployment environment:

1. Create an empty MySQL database.
2. Set its connection values in `backend/.env`.
3. Run `php artisan migrate`.

Laravel loads this schema snapshot automatically when no migration repository
exists, then runs any migrations created after the snapshot.

Do not run `migrate:fresh` against a database that contains production data.
After an intentional schema change, regenerate the snapshot with
`php artisan schema:dump` and commit the updated SQL file together with its
new migration.

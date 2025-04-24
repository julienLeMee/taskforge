/*
  Warnings:

  - The values [BACKLOG] on the enum `Timeframe` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Timeframe_new" AS ENUM ('TODAY', 'THIS_WEEK', 'UPCOMING');
ALTER TABLE "Task" ALTER COLUMN "timeframe" DROP DEFAULT;
ALTER TABLE "Task" ALTER COLUMN "timeframe" TYPE "Timeframe_new" USING ("timeframe"::text::"Timeframe_new");
ALTER TYPE "Timeframe" RENAME TO "Timeframe_old";
ALTER TYPE "Timeframe_new" RENAME TO "Timeframe";
DROP TYPE "Timeframe_old";
ALTER TABLE "Task" ALTER COLUMN "timeframe" SET DEFAULT 'UPCOMING';
COMMIT;

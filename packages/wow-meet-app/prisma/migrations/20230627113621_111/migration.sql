-- AlterTable
ALTER TABLE "Participants" ALTER COLUMN "voteList" DROP NOT NULL,
ALTER COLUMN "voteList" SET DATA TYPE TEXT;
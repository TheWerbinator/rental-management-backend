/*
  Warnings:

  - You are about to drop the column `rentalId` on the `SavedForLater` table. All the data in the column will be lost.
  - Added the required column `savedId` to the `SavedForLater` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SavedForLater" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userEmail" TEXT NOT NULL,
    "savedId" INTEGER NOT NULL,
    CONSTRAINT "SavedForLater_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "Users" ("email") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SavedForLater_savedId_fkey" FOREIGN KEY ("savedId") REFERENCES "Equipment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SavedForLater" ("id", "userEmail") SELECT "id", "userEmail" FROM "SavedForLater";
DROP TABLE "SavedForLater";
ALTER TABLE "new_SavedForLater" RENAME TO "SavedForLater";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

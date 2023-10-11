/*
  Warnings:

  - You are about to drop the `RentedEquipment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "RentedEquipment";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Equipment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "isRented" BOOLEAN NOT NULL,
    "userEmail" TEXT,
    CONSTRAINT "Equipment_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User" ("email") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ActiveRentals" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userEmail" TEXT NOT NULL,
    "rentalId" INTEGER NOT NULL,
    CONSTRAINT "ActiveRentals_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User" ("email") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ActiveRentals_rentalId_fkey" FOREIGN KEY ("rentalId") REFERENCES "Equipment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ActiveRentals" ("id", "rentalId", "userEmail") SELECT "id", "rentalId", "userEmail" FROM "ActiveRentals";
DROP TABLE "ActiveRentals";
ALTER TABLE "new_ActiveRentals" RENAME TO "ActiveRentals";
CREATE TABLE "new_SavedForLater" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userEmail" TEXT NOT NULL,
    "rentalId" INTEGER NOT NULL,
    CONSTRAINT "SavedForLater_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User" ("email") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SavedForLater_rentalId_fkey" FOREIGN KEY ("rentalId") REFERENCES "Equipment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SavedForLater" ("id", "rentalId", "userEmail") SELECT "id", "rentalId", "userEmail" FROM "SavedForLater";
DROP TABLE "SavedForLater";
ALTER TABLE "new_SavedForLater" RENAME TO "SavedForLater";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

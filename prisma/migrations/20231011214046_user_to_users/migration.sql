/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Users" (
    "email" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SavedForLater" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userEmail" TEXT NOT NULL,
    "rentalId" INTEGER NOT NULL,
    CONSTRAINT "SavedForLater_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "Users" ("email") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SavedForLater_rentalId_fkey" FOREIGN KEY ("rentalId") REFERENCES "Equipment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SavedForLater" ("id", "rentalId", "userEmail") SELECT "id", "rentalId", "userEmail" FROM "SavedForLater";
DROP TABLE "SavedForLater";
ALTER TABLE "new_SavedForLater" RENAME TO "SavedForLater";
CREATE TABLE "new_Equipment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "isRented" BOOLEAN NOT NULL,
    "userEmail" TEXT,
    CONSTRAINT "Equipment_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "Users" ("email") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Equipment" ("description", "id", "image", "isRented", "name", "userEmail") SELECT "description", "id", "image", "isRented", "name", "userEmail" FROM "Equipment";
DROP TABLE "Equipment";
ALTER TABLE "new_Equipment" RENAME TO "Equipment";
CREATE TABLE "new_ActiveRentals" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userEmail" TEXT NOT NULL,
    "rentalId" INTEGER NOT NULL,
    CONSTRAINT "ActiveRentals_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "Users" ("email") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ActiveRentals_rentalId_fkey" FOREIGN KEY ("rentalId") REFERENCES "Equipment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ActiveRentals" ("id", "rentalId", "userEmail") SELECT "id", "rentalId", "userEmail" FROM "ActiveRentals";
DROP TABLE "ActiveRentals";
ALTER TABLE "new_ActiveRentals" RENAME TO "ActiveRentals";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

import { encryptPassword } from "../src/auth-utils";
import { prisma } from "./db.setup";

const clearDb = async () => {
  await prisma.equipment.deleteMany();
  await prisma.users.deleteMany();
};

const seed = async () => {
  console.log("Seeding the database...");
  // await clearDb();

  // Create Jesse
  const Jesse = await prisma.users.create({
    data: {
      email: "bigbucks@hunter.com",
      name: "Jesse",
      passwordHash: await encryptPassword("Savannah"),
    },
  });

  // Create Shawn
  const Shawn = await prisma.users.create({
    data: {
      email: "shawn@shawn.com",
      name: "Shawn",
      passwordHash: await encryptPassword("Sabrina"),
    },
  });

  // Create Test User
  const asdf = await prisma.users.create({
    data: {
      email: "asdf@test.com",
      name: "Asdf",
      passwordHash: await encryptPassword("asdf;klj"),
    },
  });

  // create trailer
  const trailer = await prisma.equipment.create({
    data: {
      id: 1,
      name: "trailer",
      description: "put things on it, pull it with a truck...",
      image: "/src/assets/trailer.png",
      isRented: true,
      userEmail: "shawn@shawn.com",
    },
  });

  // create horse trailer
  const horse_trailer = await prisma.equipment.create({
    data: {
      id: 2,
      name: "horse trailer",
      description: "put horses in it, pull it with a truck...",
      image: "/src/assets/horse_trailer.png",
      isRented: false,
      userEmail: null,
    },
  });

  // create frontloader
  const frontloader = await prisma.equipment.create({
    data: {
      id: 3,
      name: "frontloader",
      description: "moves dirt, has big bucket on the front",
      image: "/src/assets/frontloader.png",
      isRented: false,
      userEmail: null,
    },
  });

  // create enclosed trailer
  const enclosed_trailer = await prisma.equipment.create({
    data: {
      id: 4,
      name: "enclosed trailer",
      description:
        "put things in it (now safe in the rain!) and pull it with a truck...",
      image: "/src/assets/enclosed_trailer.png",
      isRented: false,
      userEmail: null,
    },
  });

  // create existing rental
  const first_rental = await prisma.activeRentals.create({
    data: {
      id: 1,
      userEmail: "shawn@shawn.com",
      rentalId: 1,
    },
  });
};

seed()
  .then(() => {
    console.log("Seeding complete");
  })
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

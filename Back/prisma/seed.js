const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const bcrypt = require("bcrypt");


const prisma = new PrismaClient();

async function main() {
  // The admin user details
  const adminUser = {
    name: "testas",
    email: "testas@testas.com",
    password: "testas",
    role: "ADMIN", // Make sure to set the role to ADMIN
  };

  // Check if the admin user already exists in the database
  const existingAdminUser = await prisma.user.findUnique({
    where: {
      email: adminUser.email,
    },
  });

  // If the admin user doesn't exist, create the admin user
  if (!existingAdminUser) {
    // Hash the password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(adminUser.password, salt);

    // Create the admin user
    await prisma.user.create({
      data: {
        ...adminUser,
        password: hashedPassword,
      },
    });
  }

  const myLakeData = JSON.parse(fs.readFileSync("./prisma/lakes.json", "utf-8"));

  for (const lake of myLakeData) {
    await prisma.lake.create({
      data: {
        x: lake.x,
        y: lake.y,
        isRented: lake.is_rented,
        isPrivate: lake.is_private,
        isLake: lake.lake,
        isRiver: lake.river,
        name: lake.name,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

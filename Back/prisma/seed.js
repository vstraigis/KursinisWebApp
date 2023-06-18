const { PrismaClient } = require("@prisma/client");
const fs = require("fs");

const prisma = new PrismaClient();

async function main() {
  const myLakeData = JSON.parse(
    fs.readFileSync("./lakes.json", "utf-8")
  );

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
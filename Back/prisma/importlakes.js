const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  const lakes = JSON.parse(fs.readFileSync('C:/Users/valst/Desktop/Stud/Kursinis/KursinisWebApp/Front/lakes.json'));

  for (const lake of lakes) {
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

  console.log('Data loaded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
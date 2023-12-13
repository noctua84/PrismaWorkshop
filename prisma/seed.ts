import {Prisma, PrismaClient, User} from "@prisma/client";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'Alice',
    email: 'alice@example.com',
    posts: {
      create: [
        {
          title: 'Join us for Prisma Day 2020',
          content: 'https://www.prisma.io/day/',
          published: true,
          categories: {
            create: [
              {
                name: 'Community',
              },
              {
                name: 'Events',
              },
              {
                name: 'Prisma Day',
              }
            ],
          },
        },
      ],
    },
  },
  {
    name: 'Nilu',
    email: 'nilu@example.com',
    posts: {
      create: [
        {
          title: 'Subscribe to GraphQL Weekly for community news',
          content: 'https://graphqlweekly.com/',
          published: true,
          categories: {
            create: [
              {
                name: 'Community',
              },
              {
                name: 'Events',
              },
              {
                name: 'GraphQL',
              }
            ],
          },
        },
        {
          title: 'Follow Prisma on Twitter',
          content: 'https://twitter.com/prisma',
          published: true,
          categories: {
            create: [
              {
                name: 'Community',
              },
              {
                name: 'Social Media',
              },
              {
                name: 'Twitter',
              }
            ],
          },
        },
      ],
    },
  },
  {
    name: 'John',
    email: 'john.doe@example.com',
    posts: {
      create: [
        {
          title: 'Follow Prisma on Twitter',
          content: 'https://twitter.com/prisma',
          published: true,
          categories: {
            create: [
              {
                name: 'Community',
              },
              {
                name: 'Social Media',
              },
              {
                name: 'Twitter',
              }
            ],
          },
        },
      ],
    },
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const u of userData) {
    const user: User = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
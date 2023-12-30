import {Prisma, PrismaClient, User} from "@prisma/client";

const prisma = new PrismaClient();

// TODO: refactor this.
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
          likes: 15,
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
          likes: 4,
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
        {
          title: 'Follow Nexus on Twitter',
          content: 'https://twitter.com/nexusgql',
          likes: 7,
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
        {
          title: 'Follow Nexus on Instagram',
          content: 'https://instagram.com/nexusgql',
          likes: 3,
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
                name: 'Instagram',
              }
            ],
          },
        },
        {
          title: 'Subscribe to JS Monthly',
          content: 'https://javascriptweekly.com/',
          likes: 9,
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
                name: 'JavaScript',
              }
            ],
          },
        },
        {
          title: 'Subscribe to React Native Weekly',
          content: 'https://reactnativeweekly.com/',
          likes: 1,
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
                name: 'React Native',
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
          title: 'Follow Prisma on Youtube',
          content: 'https://www.youtube.com/prisma',
          likes: 10,
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
        {
          title: 'Follow Prisma on LinkedIn',
          content: 'https://www.linkedin.com/company/prisma',
          likes: 12,
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
                name: 'LinkedIn',
              }
            ],
          },
        },
      ],
    },
  },
  {
    name: 'Bob',
    email: 'bob.smith@example.com',
    posts: {
      create: [
        {
          title: 'Follow Prisma on Twitch',
          content: 'https://twitch.tv/prisma',
          likes: 2,
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
                name: 'Twitch',
              }
            ],
          },
        },
        {
          title: 'Follow Prisma on Instagram',
          content: 'https://instagram.com/prisma',
          likes: 7,
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
                name: 'Instagram',
              }
            ],
          },
        },
        {
          title: 'Follow Prisma on Dev.to',
          content: 'https://dev.to/prisma',
          likes: 23,
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
                name: 'Dev.to',
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
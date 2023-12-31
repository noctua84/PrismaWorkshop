import {Category, Post, Prisma, PrismaClient, User} from "@prisma/client";
import {addCategories} from "../src/controller/posts.service";

const prisma = new PrismaClient();

const categoryData: Prisma.CategoryCreateInput[] = [
  {
    name: 'Community',
  },
  {
    name: 'Events',
  },
  {
    name: 'Prisma Day',
  },
  {
    name: 'GraphQL',
  },
  {
    name: 'Social Media',
  },
  {
    name: 'Twitter',
  },
  {
    name: 'JavaScript',
  },
  {
    name: 'React Native',
  },
  {
    name: 'YouTube',
  },
  {
    name: 'LinkedIn',
  },
  {
    name: 'Twitch',
  },
  {
    name: 'Instagram',
  },
  {
    name: 'Dev.to',
  },
];

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'Alice',
    email: 'alice@example.com',
  },
  {
    name: 'Nilu',
    email: 'nilu@example.com',
  },
  {
    name: 'John',
    email: 'john.doe@example.com',
  },
  {
    name: 'Bob',
    email: 'bob.smith@example.com',
  },
];

const postData: Prisma.PostCreateInput[] = [
  {
    title: 'Join us for Prisma Day 2020',
    content: 'https://www.prisma.io/day/',
    published: true,
    likes: 0,
    author: {
      connectOrCreate: {
        where: {
          email: 'alice@example.com'
        },
        create: {
          name: 'Alice',
          email: 'alice@example.com',
          }
      }
    },
  },
  {
    title: 'Subscribe to GraphQL Weekly for community news',
    content: 'https://graphqlweekly.com/',
    published: true,
    likes: 15,
    author: {
      connectOrCreate: {
        where: {
          email: 'nilu@example.com'
        },
        create: {
          name: 'Nilu',
          email: 'nilu@example.com',
        }
      }
    }
  },
  {
    title: 'Follow Prisma on Twitter',
    content: 'https://twitter.com/prisma',
    published: true,
    likes: 4,
    author: {
      connectOrCreate: {
        where: {
          email: 'nilu@example.com'
        },
        create: {
          name: 'Nilu',
          email: 'nilu@example.com',
        }
      }
    }
  },
  {
    title: 'Follow Nexus on Twitter',
    content: 'https://twitter.com/nexusgql',
    published: true,
    likes: 5,
    author: {
      connectOrCreate: {
        where: {
          email: 'nilu@example.com'
        },
        create: {
          name: 'Nilu',
          email: 'nilu@example.com',
        }
      }
    }
  },
  {
    title: 'Subscribe to JS Monthly',
    content: 'https://javascriptweekly.com/',
    published: true,
    likes: 0,
    author: {
      connectOrCreate: {
        where: {
          email: 'nilu@example.com'
        },
        create: {
          name: 'Nilu',
          email: 'nilu@example.com',
        }
      }
    }
  },
  {
    title: 'Subscribe to React Native Weekly',
    content: 'https://reactnativeweekly.com/',
    published: true,
    likes: 0,
    author: {
      connectOrCreate: {
        where: {
          email: 'nilu@example.com'
        },
        create: {
          name: 'Nilu',
          email: 'nilu@example.com',
        }
      }
    }
  },
  {
    title: 'Follow Prisma on Youtube',
    content: 'https://www.youtube.com/prisma',
    published: true,
    likes: 0,
    author: {
      connectOrCreate: {
        where: {
          email: 'john.doe@example.com'
        },
        create: {
          name: 'John',
          email: 'john.doe@example.com'
        }
      }
    }
  },
  {
    title: 'Follow Prisma on LinkedIn',
    content: 'https://www.linkedin.com/company/prisma',
    published: true,
    likes: 0,
    author: {
      connectOrCreate: {
        where: {
          email: 'john.doe@example.com'
        },
        create: {
          name: 'John',
          email: 'john.doe@example.com'
        }
      }
    }
  },
  {
    title: 'Follow Prisma on Twitch',
    content: 'https://twitch.tv/prisma',
    published: true,
    likes: 0,
    author: {
      connectOrCreate: {
        where: {
          email: 'bob.smith@example.com'
        },
        create: {
          name: 'Bob',
          email: 'bob.smith@example.com',
        }
      }
    }
  },
  {
    title: 'Follow Prisma on Instagram',
    content: 'https://instagram.com/prisma',
    published: true,
    likes: 0,
    author: {
      connectOrCreate: {
        where: {
          email: 'bob.smith@example.com'
        },
        create: {
          name: 'Bob',
          email: 'bob.smith@example.com',
        }
      }
    }
  },
  {
    title: 'Follow Prisma on Dev.to',
    content: 'https://dev.to/prisma',
    published: true,
    likes: 0,
    author: {
      connectOrCreate: {
        where: {
          email: 'bob.smith@example.com'
        },
        create: {
          name: 'Bob',
          email: 'bob.smith@example.com',
        }
      }
    }
  },
  {
    title: 'Follow Nexus on Instagram',
    content: 'https://instagram.com/nexusgql',
    published: true,
    likes: 0,
    author: {
      connectOrCreate: {
        where: {
          email: 'nilu@example.com'
        },
        create: {
          name: 'Nilu',
          email: 'nilu@example.com',
        }
      }
    }
  }
];

const mapCategoriesToPosts = async () => {
  postData[0].categories = await addCategories(prisma, ['Community', 'Events', 'Prisma Day']);
  postData[1].categories = await addCategories(prisma, ['Community', 'Events', 'GraphQL']);
  postData[2].categories = await addCategories(prisma, ['Community', 'Social Media', 'Twitter']);
  postData[3].categories = await addCategories(prisma, ['Community', 'Social Media', 'Twitter']);
  postData[4].categories = await addCategories(prisma, ['Community', 'Events', 'JavaScript']);
  postData[5].categories = await addCategories(prisma, ['Community', 'Events', 'React Native']);
  postData[6].categories = await addCategories(prisma, ['Community', 'Social Media', 'YouTube']);
  postData[7].categories = await addCategories(prisma, ['Community', 'Social Media', 'LinkedIn']);
  postData[8].categories = await addCategories(prisma, ['Community', 'Social Media', 'Twitch']);
  postData[9].categories = await addCategories(prisma, ['Community', 'Social Media', 'Instagram']);
  postData[10].categories = await addCategories(prisma, ['Community', 'Social Media', 'Dev.to']);
  postData[11].categories = await addCategories(prisma, ['Community', 'Social Media', 'Instagram']);
}

async function main() {
  console.log(`Start seeding ...`);
  console.log(`Seeding categories ...`);
  for (const c of categoryData) {
    const category: Category = await prisma.category.create({
      data: c,
    });
    console.log(`Created category with id: ${category.id}`);
  }
  
  console.log(`Seeding users ...`)
  for (const u of userData) {
    const user: User = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }
  
  console.log(`Seeding posts ...`);
  await mapCategoriesToPosts();
  
  for (const p of postData) {
    const post: Post = await prisma.post.create({
      data: p,
    });
    console.log(`Created post with id: ${post.id}`);
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
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const words = [
    "cat", "dog", "house", "tree", "car", "sun", "moon", "star",
    "fish", "bird", "flower", "boat", "plane", "train", "bicycle",
    "apple", "banana", "pizza", "cake", "hat",
    "shoe", "chair", "table", "bed", "clock", "book", "phone",
    "computer", "key", "heart", "cloud", "rain", "snowman",
    "fire", "mountain", "river", "bridge", "castle", "crown",
    "ghost", "robot", "rocket", "ball", "guitar", "camera",
    "map", "flag", "ladder", "umbrella"
  ];

  await prisma.word.createMany({
	data: words.map((text) => ({ text })),
	skipDuplicates: true,
  });
  console.log("Seeded words");
  // Seed dummy users
  const users = [
    { nickname: 'Alice', email: 'alice@example.com', password: 'password1' },
    { nickname: 'Bob', email: 'bob@example.com', password: 'password2' },
    { nickname: 'Charlie', email: 'charlie@example.com', password: 'password3' },
    { nickname: 'test4', email: 'test4@example.com', password: 'password4' },
    { nickname: 'test5', email: 'test5@example.com', password: 'password5' },
  ];

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true, // prevents error if seed is run multiple times
  });

  console.log('Seeded users');

}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
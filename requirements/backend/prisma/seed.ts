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
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
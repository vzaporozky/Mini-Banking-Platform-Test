import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
	const users = [
		{
			username: 'user1',
			email: 'user1@example.com',
			fullname: 'User One',
			password: await bcrypt.hash('password1', 10),
		},
		{
			username: 'user2',
			email: 'user2@example.com',
			fullname: 'User Two',
			password: await bcrypt.hash('password2', 10),
		},
		{
			username: 'user3',
			email: 'user3@example.com',
			fullname: 'User Three',
			password: await bcrypt.hash('password3', 10),
		},
	];

	for (const user of users) {
		const userEntity = await prisma.user.create({
			data: {
				username: user.username,
				email: user.email,
				fullname: user.fullname,
				password: user.password,
				accounts: {
					create: [
						{ currency: 'USD', balance: 1000.0 },
						{ currency: 'EUR', balance: 500.0 },
					],
				},
			},
		});
		console.log(`Created user: ${userEntity.email}`);
	}
}

main()
	.catch(e => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

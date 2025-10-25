import { DataSource } from "typeorm";
import { v4 as uuid } from "uuid";
import * as bcrypt from "bcrypt";

export async function seedUsers(dataSource: DataSource) {
  const userRepo = dataSource.getRepository("User");
  const accountRepo = dataSource.getRepository("Account");

  const users = [
    { username: "user1", password: await bcrypt.hash("password1", 10) },
    { username: "user2", password: await bcrypt.hash("password2", 10) },
    { username: "user3", password: await bcrypt.hash("password3", 10) },
  ];

  for (const user of users) {
    const userEntity = await userRepo.save({
      id: uuid(),
      username: user.username,
      password: user.password,
    });

    await accountRepo.save([
      { id: uuid(), userId: userEntity.id, currency: "USD", balance: 1000.0 },
      { id: uuid(), userId: userEntity.id, currency: "EUR", balance: 500.0 },
    ]);
  }
}

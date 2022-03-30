import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should be able to create user", async () => {
    const user = await createUserUseCase.execute({
      name: "Teste",
      email: "teste@teste.com",
      password: "123456",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create user with same email", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "Teste 1",
        email: "teste@teste.com",
        password: "123456",
      });

      await createUserUseCase.execute({
        name: "Teste 2",
        email: "teste@teste.com",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});

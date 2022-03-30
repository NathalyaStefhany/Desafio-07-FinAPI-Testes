import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let usersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
  });

  //   it("should be able to authenticate user", async () => {
  //     const { email, password } = await usersRepository.create({
  //       name: "Teste",
  //       email: "teste@teste.com",
  //       password: "123456",
  //     });

  //     const token = await authenticateUserUseCase.execute({ email, password });

  //     expect(token).toHaveProperty("token");
  //   });

  it("should not be able to authenticate user with incorrect email", () => {
    expect(async () => {
      await usersRepository.create({
        name: "Teste",
        email: "teste@teste.com",
        password: "123456",
      });

      await authenticateUserUseCase.execute({
        email: "email",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate user with incorrect password", () => {
    expect(async () => {
      await usersRepository.create({
        name: "Teste",
        email: "teste@teste.com",
        password: "123456",
      });

      await authenticateUserUseCase.execute({
        email: "teste@teste.com",
        password: "password",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});

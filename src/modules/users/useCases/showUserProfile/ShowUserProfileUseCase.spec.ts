import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it("should be able to show user profile", async () => {
    const user = await usersRepository.create({
      name: "Teste",
      email: "teste@teste.com",
      password: "123456",
    });

    const profile = await showUserProfileUseCase.execute(user.id as string);

    expect(profile.id).toBe(user.id);
  });

  it("should not be able to show user profile with nonexistent id", () => {
    expect(async () => {
      await showUserProfileUseCase.execute("123456");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});

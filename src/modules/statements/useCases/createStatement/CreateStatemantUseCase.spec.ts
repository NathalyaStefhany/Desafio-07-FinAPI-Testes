import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Create Statemant", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();

    createStatementUseCase = new CreateStatementUseCase(
      usersRepository,
      statementsRepository
    );
  });

  it("should be able to create a statement", async () => {
    const user = await usersRepository.create({
      name: "Teste",
      email: "teste@teste.com",
      password: "123456",
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      description: "Descrição",
      amount: 100,
    });

    expect(statement).toHaveProperty("id");
  });

  it("should not be able to create a statement with a nonexistent user", () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "123456",
        type: OperationType.DEPOSIT,
        description: "Descrição",
        amount: 100,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should be not able to create a statement when is a withdraw and balance < amount ", () => {
    expect(async () => {
      const user = await usersRepository.create({
        name: "Teste",
        email: "teste@teste.com",
        password: "123456",
      });

      await createStatementUseCase.execute({
        user_id: user.id as string,
        type: OperationType.WITHDRAW,
        description: "Descrição",
        amount: 100,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});

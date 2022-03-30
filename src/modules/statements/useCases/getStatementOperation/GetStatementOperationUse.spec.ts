import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Get Statement Operation", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();

    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepository,
      statementsRepository
    );
  });

  it("should be able to get statement operation", async () => {
    const user = await usersRepository.create({
      name: "Teste",
      email: "teste@teste.com",
      password: "123456",
    });

    const statement = await statementsRepository.create({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      description: "Descrição",
      amount: 100,
    });

    const result = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string,
    });

    expect(result.id).toBe(statement.id);
  });

  it("should not be able to get statement operation with a nonexistent user", () => {
    expect(async () => {
      const user = await usersRepository.create({
        name: "Teste",
        email: "teste@teste.com",
        password: "123456",
      });

      const statement = await statementsRepository.create({
        user_id: user.id as string,
        type: OperationType.DEPOSIT,
        description: "Descrição",
        amount: 100,
      });

      await getStatementOperationUseCase.execute({
        user_id: "123",
        statement_id: statement.id as string,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to get statement operation with a nonexistent statement", () => {
    expect(async () => {
      const user = await usersRepository.create({
        name: "Teste",
        email: "teste@teste.com",
        password: "123456",
      });

      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: "123",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});

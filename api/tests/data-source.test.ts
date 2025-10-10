import { DataSource } from "typeorm";
import { AppDataSource } from "../persistence/data-source";
import { Dam } from "../entities/damModel";
import { Level } from "../entities/levelModel";

describe("AppDataSource configuration", () => {
  it("should have correct configuration", () => {
    expect(AppDataSource.options.type).toBe("sqlite");
    expect(AppDataSource.options.database).toBe("db.sqlite");
    expect(AppDataSource.options.entities).toContain(Dam);
    expect(AppDataSource.options.entities).toContain(Level);
  });

  it("should initialize an in-memory database successfully", async () => {
    const testDataSource = new DataSource({
      type: "sqlite",
      database: ":memory:",
      synchronize: true,
      entities: [Dam, Level],
    });

    await testDataSource.initialize();

    const isInitialized = testDataSource.isInitialized;
    expect(isInitialized).toBe(true);

    await testDataSource.destroy();
  });
});

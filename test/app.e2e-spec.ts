import { Test } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as pactum from "pactum";

import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { AuthDto } from "@/auth/dto";

describe("App e2e", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(3000);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl("http://localhost:3000");
  });

  afterAll(() => {
    app.close();
  });

  describe("Auth", () => {
    describe("Signup", () => {
      it("should signup", () => {
        const dto: AuthDto = {
          email: "lucas@email.com",
          password: "123",
        };
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody(dto)
          .expectStatus(201);
      });
    });
    describe("Signin", () => {
      it.todo("should signin");
    });
  });

  describe("User", () => {
    describe("Get me", () => {});
    describe("Edit user", () => {});
  });

  describe("Bookmark", () => {
    describe("Get bookmark", () => {});
    describe("Get by id bookmark", () => {});
    describe("Create bookmark", () => {});
    describe("Edit bookmark", () => {});
    describe("Delete bookmark", () => {});
  });
});

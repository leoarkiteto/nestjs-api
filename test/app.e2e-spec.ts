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
    const dto: AuthDto = {
      email: "lucas@email.com",
      password: "123",
    };

    describe("Signup", () => {
      it("should throw if email empty", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody(dto.password)
          .expectStatus(400);
      });

      it("should throw if password empty", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody(dto.email)
          .expectStatus(400);
      });

      it("should throw if no body provided", () => {
        return pactum.spec().post("/auth/signup").expectStatus(400);
      });

      it("should signup", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe("Signin", () => {
      it("should throw if email empty", () => {
        return pactum
          .spec()
          .post("/auth/signin")
          .withBody(dto.password)
          .expectStatus(400);
      });

      it("should throw if password empty", () => {
        return pactum
          .spec()
          .post("/auth/signin")
          .withBody(dto.email)
          .expectStatus(400);
      });

      it("should throw if no body provided", () => {
        return pactum.spec().post("/auth/signin").expectStatus(400);
      });

      it("should signin", () => {
        return pactum
          .spec()
          .post("/auth/signin")
          .withBody(dto)
          .expectStatus(200)
          .stores("userAt", "access_token");
      });
    });
  });

  describe("User", () => {
    describe("Get me", () => {
      it("should get current user", () => {
        return pactum
          .spec()
          .get("/users/me")
          .withHeaders({ Authorization: "Bearer $S{userAt}" })
          .expectStatus(200);
      });
    });
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

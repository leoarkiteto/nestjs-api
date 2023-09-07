import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { CreateBookmarkDto, EditBookmarkDto } from "@/bookmark/dto";

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  getBookmark(userId: number) {
    return this.prisma.bookmark.findMany({ where: { userId } });
  }

  createBookmark(userId: number, dto: CreateBookmarkDto) {
    return this.prisma.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  getBookmarkById(userId: number, bookmarkId: number) {
    return this.prisma.bookmark.findFirst({
      where: { id: bookmarkId, userId },
    });
  }

  async editBookmarkById(
    userId: number,
    bookmarkId: number,
    dto: EditBookmarkDto
  ) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: { id: bookmarkId },
    });
    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException("Access resources denied!");
    }

    return this.prisma.bookmark.update({
      where: { id: bookmarkId },
      data: { ...dto },
    });
  }

  async deleteBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: { id: bookmarkId },
    });
    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException("Access resource denied!");
    }

    await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}

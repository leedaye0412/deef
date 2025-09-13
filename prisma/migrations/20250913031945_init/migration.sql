/*
  Warnings:

  - You are about to drop the `Images` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Projects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Images" DROP CONSTRAINT "Images_projectId_fkey";

-- DropTable
DROP TABLE "public"."Images";

-- DropTable
DROP TABLE "public"."Projects";

-- CreateTable
CREATE TABLE "public"."projects" (
    "projectId" BIGSERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "category" VARCHAR(100),
    "description" TEXT,
    "area" INTEGER,
    "location" VARCHAR(255),
    "type" VARCHAR(100),
    "photo" VARCHAR(200),
    "year" INTEGER,
    "slug" VARCHAR(200),
    "blogUrl" TEXT,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("projectId")
);

-- CreateTable
CREATE TABLE "public"."images" (
    "imageId" BIGSERIAL NOT NULL,
    "projectId" BIGINT NOT NULL,
    "path" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "no" INTEGER,
    "isLandCover" BOOLEAN NOT NULL DEFAULT false,
    "isPortCover" BOOLEAN NOT NULL DEFAULT false,
    "mime" VARCHAR(50),
    "alt" VARCHAR(255),

    CONSTRAINT "images_pkey" PRIMARY KEY ("imageId")
);

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "public"."projects"("slug");

-- AddForeignKey
ALTER TABLE "public"."images" ADD CONSTRAINT "images_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("projectId") ON DELETE CASCADE ON UPDATE CASCADE;

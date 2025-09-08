-- CreateTable
CREATE TABLE "public"."Project" (
    "projectId" BIGSERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "category" VARCHAR(100),
    "summary" TEXT,
    "area" INTEGER,
    "location" VARCHAR(255),
    "type" VARCHAR(100),
    "photo" VARCHAR(200) NOT NULL,
    "year" INTEGER,
    "slug" VARCHAR(200) NOT NULL,
    "blogUrl" TEXT,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("projectId")
);

-- CreateTable
CREATE TABLE "public"."Image" (
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

    CONSTRAINT "Image_pkey" PRIMARY KEY ("imageId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "public"."Project"("slug");

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("projectId") ON DELETE CASCADE ON UPDATE CASCADE;

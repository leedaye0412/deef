-- CreateTable
CREATE TABLE "public"."Projects" (
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

    CONSTRAINT "Projects_pkey" PRIMARY KEY ("projectId")
);

-- CreateTable
CREATE TABLE "public"."Images" (
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

    CONSTRAINT "Images_pkey" PRIMARY KEY ("imageId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Projects_slug_key" ON "public"."Projects"("slug");

-- AddForeignKey
ALTER TABLE "public"."Images" ADD CONSTRAINT "Images_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Projects"("projectId") ON DELETE CASCADE ON UPDATE CASCADE;

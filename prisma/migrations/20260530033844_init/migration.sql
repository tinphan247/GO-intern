-- CreateTable
CREATE TABLE "Student" (
    "sbd" TEXT NOT NULL PRIMARY KEY,
    "toan" REAL,
    "ngu_van" REAL,
    "ngoai_ngu" REAL,
    "vat_li" REAL,
    "hoa_hoc" REAL,
    "sinh_hoc" REAL,
    "lich_su" REAL,
    "dia_li" REAL,
    "gdcd" REAL,
    "ma_ngoai_ngu" TEXT
);

-- CreateTable
CREATE TABLE "SubjectStats" (
    "subject" TEXT NOT NULL PRIMARY KEY,
    "levelExcellent" INTEGER NOT NULL,
    "levelGood" INTEGER NOT NULL,
    "levelAverage" INTEGER NOT NULL,
    "levelPoor" INTEGER NOT NULL,
    "totalCandidates" INTEGER NOT NULL,
    "averageScore" REAL NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_sbd_key" ON "Student"("sbd");

-- CreateIndex
CREATE INDEX "Student_toan_vat_li_hoa_hoc_idx" ON "Student"("toan", "vat_li", "hoa_hoc");

-- CreateIndex
CREATE UNIQUE INDEX "SubjectStats_subject_key" ON "SubjectStats"("subject");

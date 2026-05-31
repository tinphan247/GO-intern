import { prisma } from '../src/lib/db';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { SubjectRegistry } from '../src/models/subject';

async function main() {
  console.log('Starting high-performance database seed...');
  const startTime = Date.now();

  // Clear existing database tables to ensure clean state
  console.log('Clearing existing data...');
  await prisma.student.deleteMany({});
  await prisma.subjectStats.deleteMany({});

  const csvFilePath = path.join(__dirname, '../dataset/diem_thi_thpt_2024.csv');
  
  if (!fs.existsSync(csvFilePath)) {
    throw new Error(`CSV file not found at path: ${csvFilePath}`);
  }

  const fileStream = fs.createReadStream(csvFilePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let isHeader = true;
  let buffer: any[] = [];
  const BATCH_SIZE = 10000;
  let totalCount = 0;

  // Initialize in-memory statistics tracking
  const statsTracker: Record<string, {
    levelExcellent: number;
    levelGood: number;
    levelAverage: number;
    levelPoor: number;
    totalCandidates: number;
    totalScoreSum: number;
  }> = {};

  const subjects = SubjectRegistry.getAllSubjects();
  for (const sub of subjects) {
    statsTracker[sub.code] = {
      levelExcellent: 0,
      levelGood: 0,
      levelAverage: 0,
      levelPoor: 0,
      totalCandidates: 0,
      totalScoreSum: 0,
    };
  }

  const processedSbds = new Set<string>();

  console.log('Streaming and parsing CSV dataset line-by-line...');

  for await (const line of rl) {
    if (isHeader) {
      isHeader = false;
      continue;
    }

    if (!line.trim()) continue;

    const parts = line.split(',');
    const sbd = parts[0] ? parts[0].trim() : '';
    if (!sbd) continue;

    if (processedSbds.has(sbd)) {
      continue;
    }
    processedSbds.add(sbd);

    const student: any = { sbd };

    // Helper to parse subject float score and track stat
    const parseSubjectScore = (index: number, subjectCode: string) => {
      const valStr = parts[index];
      if (valStr && valStr.trim() !== '') {
        const score = parseFloat(valStr);
        if (!isNaN(score)) {
          student[subjectCode] = score;

          // Track stat using our OOP models
          const subjectObj = SubjectRegistry.getSubject(subjectCode);
          if (subjectObj) {
            const level = subjectObj.classifyLevel(score);
            const tracker = statsTracker[subjectCode];
            tracker.totalCandidates++;
            tracker.totalScoreSum += score;
            
            if (level === 'Excellent') tracker.levelExcellent++;
            else if (level === 'Good') tracker.levelGood++;
            else if (level === 'Average') tracker.levelAverage++;
            else tracker.levelPoor++;
          }
        }
      }
    };

    parseSubjectScore(1, 'toan');
    parseSubjectScore(2, 'ngu_van');
    parseSubjectScore(3, 'ngoai_ngu');
    parseSubjectScore(4, 'vat_li');
    parseSubjectScore(5, 'hoa_hoc');
    parseSubjectScore(6, 'sinh_hoc');
    parseSubjectScore(7, 'lich_su');
    parseSubjectScore(8, 'dia_li');
    parseSubjectScore(9, 'gdcd');

    const ma_ngoai_ngu = parts[10];
    if (ma_ngoai_ngu && ma_ngoai_ngu.trim() !== '') {
      student.ma_ngoai_ngu = ma_ngoai_ngu.trim();
    }

    buffer.push(student);
    totalCount++;

    if (buffer.length >= BATCH_SIZE) {
      await prisma.student.createMany({
        data: buffer,
        skipDuplicates: true,
      } as any);
      buffer = [];
      if (totalCount % 100000 === 0) {
        console.log(`Seeded ${totalCount} records...`);
      }
    }
  }

  // Flush remaining buffer
  if (buffer.length > 0) {
    await prisma.student.createMany({
      data: buffer,
      skipDuplicates: true,
    } as any);
  }

  console.log(`Successfully seeded ${totalCount} student records.`);

  // Write pre-computed statistics
  console.log('Writing pre-computed subject statistics...');
  const statsBuffer = [];
  for (const [subjectCode, tracker] of Object.entries(statsTracker)) {
    const avg = tracker.totalCandidates > 0 ? (tracker.totalScoreSum / tracker.totalCandidates) : 0;
    statsBuffer.push({
      subject: subjectCode,
      levelExcellent: tracker.levelExcellent,
      levelGood: tracker.levelGood,
      levelAverage: tracker.levelAverage,
      levelPoor: tracker.levelPoor,
      totalCandidates: tracker.totalCandidates,
      averageScore: Math.round(avg * 100) / 100, // round to 2 decimals
    });
  }

  await prisma.subjectStats.createMany({
    data: statsBuffer,
  });

  const duration = (Date.now() - startTime) / 1000;
  console.log(`Database seeding completed in ${duration} seconds.`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

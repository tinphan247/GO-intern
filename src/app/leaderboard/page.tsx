import React from 'react';
import { prisma } from '@/lib/db';
import LeaderboardTabs from '@/components/LeaderboardTabs';

export const dynamic = 'force-dynamic';

export default async function LeaderboardPage() {
  // Query 1: Top 10 Group A Students
  const topGroupAStudents = await prisma.$queryRaw<Array<{
    sbd: string;
    toan: number;
    vat_li: number;
    hoa_hoc: number;
    total: number;
  }>>`
    SELECT 
      sbd, 
      toan, 
      vat_li, 
      hoa_hoc, 
      (toan + vat_li + hoa_hoc) AS total
    FROM "Student"
    WHERE toan IS NOT NULL 
      AND vat_li IS NOT NULL 
      AND hoa_hoc IS NOT NULL
    ORDER BY total DESC, sbd ASC
    LIMIT 10
  `;

  const formattedGroupA = topGroupAStudents.map((st) => ({
    sbd: st.sbd,
    math: st.toan,
    physics: st.vat_li,
    chemistry: st.hoa_hoc,
    total: Math.round(st.total * 100) / 100,
  }));

  // Query 2: Top 10 Mathematics Students
  const topMathStudents = await prisma.student.findMany({
    where: { toan: { not: null } },
    select: { sbd: true, toan: true },
    orderBy: [
      { toan: 'desc' },
      { sbd: 'asc' }
    ],
    take: 10
  });

  const formattedMath = topMathStudents.map((st) => ({
    sbd: st.sbd,
    score: st.toan || 0
  }));

  // Query 3: Top 10 Physics Students
  const topPhysicsStudents = await prisma.student.findMany({
    where: { vat_li: { not: null } },
    select: { sbd: true, vat_li: true },
    orderBy: [
      { vat_li: 'desc' },
      { sbd: 'asc' }
    ],
    take: 10
  });

  const formattedPhysics = topPhysicsStudents.map((st) => ({
    sbd: st.sbd,
    score: st.vat_li || 0
  }));

  // Query 4: Top 10 Chemistry Students
  const topChemistryStudents = await prisma.student.findMany({
    where: { hoa_hoc: { not: null } },
    select: { sbd: true, hoa_hoc: true },
    orderBy: [
      { hoa_hoc: 'desc' },
      { sbd: 'asc' }
    ],
    take: 10
  });

  const formattedChemistry = topChemistryStudents.map((st) => ({
    sbd: st.sbd,
    score: st.hoa_hoc || 0
  }));

  return (
    <LeaderboardTabs
      topGroupA={formattedGroupA}
      topMath={formattedMath}
      topPhysics={formattedPhysics}
      topChemistry={formattedChemistry}
    />
  );
}

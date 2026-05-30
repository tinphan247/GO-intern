import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // High-performance raw query with composite index scan
    const topStudents = await prisma.$queryRaw<Array<{
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

    // Map database result for frontend
    const formattedResult = topStudents.map((st) => ({
      sbd: st.sbd,
      math: st.toan,
      physics: st.vat_li,
      chemistry: st.hoa_hoc,
      total: Math.round(st.total * 100) / 100,
    }));

    return NextResponse.json(formattedResult);
  } catch (error: any) {
    console.error('Error fetching Group A leaderboard:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi lấy danh sách thủ khoa khối A.' },
      { status: 500 }
    );
  }
}

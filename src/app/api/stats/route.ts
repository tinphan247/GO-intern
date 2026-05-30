import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const stats = await prisma.subjectStats.findMany({});
    return NextResponse.json(stats);
  } catch (error: any) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi tải dữ liệu thống kê.' },
      { status: 500 }
    );
  }
}

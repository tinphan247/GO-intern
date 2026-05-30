import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { SubjectRegistry } from '@/models/subject';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sbd: string }> | { sbd: string } }
) {
  try {
    const resolvedParams = await params;
    const { sbd } = resolvedParams;

    // Validate registration number (8 digits)
    if (!/^\d{8}$/.test(sbd)) {
      return NextResponse.json(
        { error: 'Số báo danh không hợp lệ. Vui lòng nhập đúng 8 chữ số.' },
        { status: 400 }
      );
    }

    const student = await prisma.student.findUnique({
      where: { sbd },
    });

    if (!student) {
      return NextResponse.json(
        { error: `Không tìm thấy thí sinh với SBD ${sbd}.` },
        { status: 404 }
      );
    }

    // Process scores using OOP Subject model
    const subjects = SubjectRegistry.getAllSubjects();
    const formattedScores: any[] = [];
    let excellentCount = 0;
    let goodCount = 0;
    let averageCount = 0;
    let poorCount = 0;

    for (const sub of subjects) {
      const score = (student as any)[sub.code];
      if (score !== null && score !== undefined) {
        const level = sub.classifyLevel(score);
        formattedScores.push({
          subjectCode: sub.code,
          subjectName: sub.name,
          score,
          level,
        });

        if (level === 'Excellent') excellentCount++;
        else if (level === 'Good') goodCount++;
        else if (level === 'Average') averageCount++;
        else poorCount++;
      }
    }

    // Group A total score (Math, Physics, Chemistry)
    let groupATotal = null;
    if (
      student.toan !== null &&
      student.vat_li !== null &&
      student.hoa_hoc !== null
    ) {
      groupATotal = Math.round((student.toan + student.vat_li + student.hoa_hoc) * 100) / 100;
    }

    return NextResponse.json({
      sbd: student.sbd,
      maNgoaiNgu: student.ma_ngoai_ngu,
      scores: formattedScores,
      summary: {
        totalSubjects: formattedScores.length,
        excellentCount,
        goodCount,
        averageCount,
        poorCount,
        groupATotal,
      },
    });
  } catch (error: any) {
    console.error('Error fetching student details:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi hệ thống.' },
      { status: 500 }
    );
  }
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Award,
  BookOpen,
  TrendingUp,
  ChevronRight,
  Database,
  RefreshCw,
  Zap
} from 'lucide-react';

interface SubjectStat {
  subject: string;
  levelExcellent: number;
  levelGood: number;
  levelAverage: number;
  levelPoor: number;
  totalCandidates: number;
  averageScore: number;
}

interface LeaderboardEntry {
  sbd: string;
  math: number;
  physics: number;
  chemistry: number;
  total: number;
}

const subjectNameMap: Record<string, string> = {
  toan: 'Toán học',
  ngu_van: 'Ngữ văn',
  ngoai_ngu: 'Ngoại ngữ',
  vat_li: 'Vật lý',
  hoa_hoc: 'Hóa học',
  sinh_hoc: 'Sinh học',
  lich_su: 'Lịch sử',
  dia_li: 'Địa lý',
  gdcd: 'GDCD'
};

export default function DashboardPage() {
  const [statsData, setStatsData] = useState<SubjectStat[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [systemKpis, setSystemKpis] = useState({
    totalCandidates: 1061606,
    averageScore: 6.42,
    excellentRate: '15.4%',
    topGroupAScore: 29.6
  });

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const statsRes = await fetch('/api/stats');
        const leaderboardRes = await fetch('/api/group-a');

        let stats: SubjectStat[] = [];
        let lb: LeaderboardEntry[] = [];

        if (statsRes.ok) {
          stats = await statsRes.json();
          setStatsData(stats);
        }

        if (leaderboardRes.ok) {
          lb = await leaderboardRes.json();
          setLeaderboard(lb);
        }

        // Dynamically compute KPIs
        if (stats.length > 0) {
          let totalExcellent = 0;
          let totalPapers = 0;
          let sumScores = 0;
          let candidateCount = 1061606;

          stats.forEach((s) => {
            totalExcellent += s.levelExcellent;
            totalPapers += s.totalCandidates;
            sumScores += s.averageScore;
            if (s.subject === 'toan') {
              candidateCount = s.totalCandidates;
            }
          });

          const avgScore = sumScores / stats.length;
          const exRate = totalPapers > 0 ? ((totalExcellent / totalPapers) * 100).toFixed(1) + '%' : '15.4%';
          const topScore = lb.length > 0 ? lb[0].total : 29.6;

          setSystemKpis({
            totalCandidates: candidateCount,
            averageScore: Math.round(avgScore * 100) / 100,
            excellentRate: exRate,
            topGroupAScore: topScore
          });
        }
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu bảng tổng quan:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  // Aggregate stats levels
  const getAggregateLevels = () => {
    let excellent = 0;
    let good = 0;
    let average = 0;
    let poor = 0;

    statsData.forEach((s) => {
      excellent += s.levelExcellent;
      good += s.levelGood;
      average += s.levelAverage;
      poor += s.levelPoor;
    });

    const total = excellent + good + average + poor;
    if (total === 0) return { excellent: 25, good: 35, average: 30, poor: 10 };

    return {
      excellent: Math.round((excellent / total) * 100),
      good: Math.round((good / total) * 100),
      average: Math.round((average / total) * 100),
      poor: Math.round((poor / total) * 100)
    };
  };

  const levels = getAggregateLevels();

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* KPI Skeleton */}
        <div className="grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="stats-card" style={{ height: '120px', justifyContent: 'center' }}>
              <div style={{ width: '60%', height: '14px', background: 'var(--border-subtle)', borderRadius: '4px', marginBottom: '12px' }}></div>
              <div style={{ width: '40%', height: '28px', background: 'var(--border-subtle)', borderRadius: '4px' }}></div>
            </div>
          ))}
        </div>

        {/* Panels Skeleton */}
        <div className="grid-cols-12">
          <div className="col-span-8 dashboard-panel" style={{ height: '400px' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--border-subtle)', height: '56px' }}></div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} style={{ width: '100%', height: '40px', background: 'var(--bg-primary)', borderRadius: '6px' }}></div>
              ))}
            </div>
          </div>
          <div className="col-span-4 dashboard-panel" style={{ height: '400px' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--border-subtle)', height: '56px' }}></div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ width: '100%', height: '60px', background: 'var(--bg-primary)', borderRadius: '6px' }}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* KPI Cards Grid */}
      <section className="grid-cols-4">
        {/* KPI 1 */}
        <div className="stats-card">
          <span className="stats-label">Tổng số thí sinh</span>
          <div className="stats-value">{systemKpis.totalCandidates.toLocaleString()}</div>
          <div className="stats-sub">
            <Users size={14} />
            <span>Thí sinh đăng ký dự thi</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="stats-card">
          <span className="stats-label">Điểm số trung bình</span>
          <div className="stats-value">{systemKpis.averageScore.toFixed(2)} / 10</div>
          <div className="stats-sub">
            <BookOpen size={14} />
            <span>Điểm trung bình toàn quốc</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="stats-card">
          <span className="stats-label">Tỉ lệ bài thi giỏi</span>
          <div className="stats-value">{systemKpis.excellentRate}</div>
          <div className="stats-sub">
            <TrendingUp size={14} className="text-success" />
            <span>Đạt phân khúc điểm từ 8.0 trở lên</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="stats-card">
          <span className="stats-label">Thủ khoa khối A</span>
          <div className="stats-value">{systemKpis.topGroupAScore.toFixed(2)} / 30</div>
          <div className="stats-sub">
            <Award size={14} />
            <span>Toán + Vật lý + Hóa học cao nhất</span>
          </div>
        </div>
      </section>

      {/* Main Analysis Panels */}
      <div className="grid-cols-12">
        {/* Left Column - Subjects & Distribution */}
        <div className="col-span-8" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Subject Overview Grid */}
          <div className="dashboard-panel">
            <div className="panel-header">
              <h3 className="panel-title">
                <BookOpen size={18} style={{ color: 'var(--primary)' }} />
                Điểm Trung Bình Theo Môn Thi Quốc Gia
              </h3>
              <span className="badge badge-good" style={{ fontSize: '11px' }}>2024</span>
            </div>
            <div className="panel-content">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                {statsData.map((subjectStat) => (
                  <div key={subjectStat.subject} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 500 }}>{subjectNameMap[subjectStat.subject] || subjectStat.subject}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--primary)' }}>
                        {subjectStat.averageScore.toFixed(2)}
                      </span>
                    </div>
                    {/* Visual Progress scale */}
                    <div className="progress-bar-container">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${subjectStat.averageScore * 10}%`,
                          backgroundColor: subjectStat.averageScore >= 6.5 ? 'var(--success)' : 'var(--primary)'
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Academic Level Segment summary */}
          <div className="dashboard-panel">
            <div className="panel-header">
              <h3 className="panel-title">
                <TrendingUp size={18} style={{ color: 'var(--success)' }} />
                Phân Loại Phân Phối Học Lực Toàn Hệ Thống
              </h3>
            </div>
            <div className="panel-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ height: '24px', borderRadius: '8px', overflow: 'hidden', display: 'flex' }}>
                <div style={{ width: `${levels.excellent}%`, backgroundColor: 'var(--success)', height: '100%' }} title={`Giỏi: ${levels.excellent}%`}></div>
                <div style={{ width: `${levels.good}%`, backgroundColor: 'var(--primary)', height: '100%' }} title={`Khá: ${levels.good}%`}></div>
                <div style={{ width: `${levels.average}%`, backgroundColor: 'var(--text-muted)', height: '100%' }} title={`Trung bình: ${levels.average}%`}></div>
                <div style={{ width: `${levels.poor}%`, backgroundColor: 'var(--danger)', height: '100%' }} title={`Yếu: ${levels.poor}%`}></div>
              </div>

              {/* Legends with detail counts */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', textAlign: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--success)', fontWeight: 600 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--success)' }}></span>
                    Giỏi (&gt;=8.0)
                  </span>
                  <span style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{levels.excellent}%</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 600 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--primary)' }}></span>
                    Khá (6.0 - 8.0)
                  </span>
                  <span style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{levels.good}%</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--text-sec)', fontWeight: 600 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--text-muted)' }}></span>
                    Trung bình (4.0 - 6.0)
                  </span>
                  <span style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{levels.average}%</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--danger)', fontWeight: 600 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--danger)' }}></span>
                    Yếu (&lt;4.0)
                  </span>
                  <span style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{levels.poor}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Top Group A Preview & Dataset Info */}
        <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Top 5 Group A Preview */}
          <div className="dashboard-panel">
            <div className="panel-header">
              <h3 className="panel-title">
                <Award size={18} style={{ color: 'var(--warning)' }} />
                Xem Trước Thủ Khoa Khối A
              </h3>
            </div>
            <div style={{ padding: '0 16px' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ padding: '12px 8px', fontSize: '11px' }}>Hạng</th>
                    <th style={{ padding: '12px 8px', fontSize: '11px' }}>Số Báo Danh</th>
                    <th style={{ padding: '12px 8px', fontSize: '11px', textAlign: 'right' }}>Tổng</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.slice(0, 5).map((student, idx) => (
                    <tr key={student.sbd}>
                      <td style={{ padding: '12px 8px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            fontSize: '11px',
                            fontWeight: 700,
                            fontFamily: 'var(--font-mono)',
                            backgroundColor: idx === 0 ? '#FEF3C7' : idx === 1 ? '#E2E8F0' : idx === 2 ? '#FFEDD5' : 'var(--bg-primary)',
                            color: idx === 0 ? '#D97706' : idx === 1 ? '#475569' : idx === 2 ? '#EA580C' : 'var(--text-sec)'
                          }}
                        >
                          {idx + 1}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                        {student.sbd}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                        {student.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: '16px', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <Link href="/leaderboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none' }}>
                Xem toàn bộ bảng xếp hạng
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          {/* Exam Track Distribution widget */}
          <div className="dashboard-panel">
            <div className="panel-header">
              <h3 className="panel-title">
                <BookOpen size={18} style={{ color: 'var(--primary)' }} />
                Phân Hệ Tổ Hợp Đăng Ký
              </h3>
            </div>
            <div className="panel-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-sec)' }}>
                Tỷ lệ thí sinh lựa chọn giữa tổ hợp Khoa học Tự nhiên và Khoa học Xã hội.
              </div>

              {/* Progress scale */}
              {(() => {
                const physicsStat = statsData.find(s => s.subject === 'vat_li');
                const historyStat = statsData.find(s => s.subject === 'lich_su');
                
                const physicsCount = physicsStat ? physicsStat.totalCandidates : 340000;
                const historyCount = historyStat ? historyStat.totalCandidates : 680000;
                const total = physicsCount + historyCount;
                
                const naturalPct = total > 0 ? Math.round((physicsCount / total) * 100) : 33;
                const socialPct = 100 - naturalPct;

                return (
                  <>
                    <div style={{ height: '12px', borderRadius: '6px', overflow: 'hidden', display: 'flex', backgroundColor: 'var(--border-subtle)' }}>
                      <div style={{ width: `${naturalPct}%`, backgroundColor: 'var(--primary)', height: '100%' }} title={`Tự nhiên: ${naturalPct}%`}></div>
                      <div style={{ width: `${socialPct}%`, backgroundColor: 'var(--success)', height: '100%' }} title={`Xã hội: ${socialPct}%`}></div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--primary)' }}></span>
                          KH Tự nhiên (Lý, Hóa, Sinh)
                        </span>
                        <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                          {physicsCount.toLocaleString()} ({naturalPct}%)
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--success)' }}></span>
                          KH Xã hội (Sử, Địa, GDCD)
                        </span>
                        <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                          {historyCount.toLocaleString()} ({socialPct}%)
                        </span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

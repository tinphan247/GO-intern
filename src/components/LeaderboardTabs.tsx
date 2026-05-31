'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Award, Search, Sparkles, ShieldCheck } from 'lucide-react';

interface GroupAStudent {
  sbd: string;
  math: number;
  physics: number;
  chemistry: number;
  total: number;
}

interface SubjectStudent {
  sbd: string;
  score: number;
}

interface LeaderboardTabsProps {
  topGroupA: GroupAStudent[];
  topMath: SubjectStudent[];
  topPhysics: SubjectStudent[];
  topChemistry: SubjectStudent[];
}

export default function LeaderboardTabs({
  topGroupA,
  topMath,
  topPhysics,
  topChemistry
}: LeaderboardTabsProps) {
  const [activeTab, setActiveTab] = useState<'groupA' | 'math' | 'physics' | 'chemistry'>('groupA');
  const router = useRouter();

  const handleSbdClick = (sbd: string) => {
    router.push(`/search?sbd=${sbd}`);
  };

  const getRankBadgeStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return { backgroundColor: '#FEF3C7', color: '#D97706', border: '1px solid #FCD34D' }; // Gold
      case 2:
        return { backgroundColor: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1' }; // Silver
      case 3:
        return { backgroundColor: '#FFEDD5', color: '#EA580C', border: '1px solid #FED7AA' }; // Bronze
      default:
        return { backgroundColor: 'var(--bg-primary)', color: 'var(--text-sec)', border: '1px solid var(--border-subtle)' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Category selector row */}
      <div className="dashboard-panel">
        <div className="panel-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Trophy size={18} style={{ color: 'var(--warning)' }} />
            <span style={{ fontWeight: 600, fontSize: '15px' }}>Lựa chọn bảng xếp hạng:</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('groupA')}
              className={`theme-toggle-btn ${activeTab === 'groupA' ? 'active' : ''}`}
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                backgroundColor: activeTab === 'groupA' ? 'var(--primary-glow)' : 'transparent',
                borderColor: activeTab === 'groupA' ? 'var(--primary)' : 'var(--border-subtle)',
                color: activeTab === 'groupA' ? 'var(--primary)' : 'var(--text-sec)',
                fontWeight: 600
              }}
            >
              Khối A (Toán-Lý-Hóa)
            </button>
            <button
              onClick={() => setActiveTab('math')}
              className={`theme-toggle-btn ${activeTab === 'math' ? 'active' : ''}`}
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                backgroundColor: activeTab === 'math' ? 'var(--primary-glow)' : 'transparent',
                borderColor: activeTab === 'math' ? 'var(--primary)' : 'var(--border-subtle)',
                color: activeTab === 'math' ? 'var(--primary)' : 'var(--text-sec)',
                fontWeight: 600
              }}
            >
              Môn Toán học
            </button>
            <button
              onClick={() => setActiveTab('physics')}
              className={`theme-toggle-btn ${activeTab === 'physics' ? 'active' : ''}`}
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                backgroundColor: activeTab === 'physics' ? 'var(--primary-glow)' : 'transparent',
                borderColor: activeTab === 'physics' ? 'var(--primary)' : 'var(--border-subtle)',
                color: activeTab === 'physics' ? 'var(--primary)' : 'var(--text-sec)',
                fontWeight: 600
              }}
            >
              Môn Vật lý
            </button>
            <button
              onClick={() => setActiveTab('chemistry')}
              className={`theme-toggle-btn ${activeTab === 'chemistry' ? 'active' : ''}`}
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                backgroundColor: activeTab === 'chemistry' ? 'var(--primary-glow)' : 'transparent',
                borderColor: activeTab === 'chemistry' ? 'var(--primary)' : 'var(--border-subtle)',
                color: activeTab === 'chemistry' ? 'var(--primary)' : 'var(--text-sec)',
                fontWeight: 600
              }}
            >
              Môn Hóa học
            </button>
          </div>
        </div>
      </div>

      {/* Main rankings listing panel */}
      <div className="dashboard-panel">
        <div className="panel-header">
          <h3 className="panel-title">
            <Award size={18} style={{ color: 'var(--primary)' }} />
            {activeTab === 'groupA' && 'Thủ Khoa Khối A Toàn Quốc (Toán - Lý - Hóa)'}
            {activeTab === 'math' && 'Top 10 Điểm Số Cao Nhất Môn Toán học'}
            {activeTab === 'physics' && 'Top 10 Điểm Số Cao Nhất Môn Vật lý'}
            {activeTab === 'chemistry' && 'Top 10 Điểm Số Cao Nhất Môn Hóa học'}
          </h3>
          <span style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }} className="badge badge-excellent">
            <ShieldCheck size={12} />
            Dữ liệu xác thực
          </span>
        </div>

        <div className="panel-content" style={{ padding: 0 }}>
          <div className="data-table-wrapper">
            {activeTab === 'groupA' && (
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>Hạng</th>
                    <th>Số Báo Danh</th>
                    <th className="hidden-mobile">Điểm Toán</th>
                    <th className="hidden-mobile">Điểm Lý</th>
                    <th className="hidden-mobile">Điểm Hóa</th>
                    <th style={{ textAlign: 'right' }}>Tổng Khối A</th>
                    <th style={{ width: '120px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {topGroupA.map((student, idx) => (
                    <tr key={student.sbd}>
                      <td>
                        <span
                          className="badge"
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontFamily: 'var(--font-mono)',
                            ...getRankBadgeStyle(idx + 1)
                          }}
                        >
                          {idx + 1}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                        <div>{student.sbd}</div>
                        <div className="visible-mobile" style={{ fontSize: '11px', color: 'var(--text-sec)', fontWeight: 400, marginTop: '4px' }}>
                          T: {student.math.toFixed(1)} | L: {student.physics.toFixed(1)} | H: {student.chemistry.toFixed(1)}
                        </div>
                      </td>
                      <td className="hidden-mobile" style={{ fontFamily: 'var(--font-mono)' }}>{student.math.toFixed(2)}</td>
                      <td className="hidden-mobile" style={{ fontFamily: 'var(--font-mono)' }}>{student.physics.toFixed(2)}</td>
                      <td className="hidden-mobile" style={{ fontFamily: 'var(--font-mono)' }}>{student.chemistry.toFixed(2)}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, fontSize: '15px', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                        {student.total.toFixed(2)}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => handleSbdClick(student.sbd)}
                          className="theme-toggle-btn"
                          style={{ padding: '6px 8px', fontSize: '11px', display: 'inline-flex', gap: '4px' }}
                          title="Xem phân tích chi tiết thí sinh này"
                        >
                          <Search size={12} />
                          <span className="hidden-mobile">Chi tiết</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'math' && (
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>Hạng</th>
                    <th>Số Báo Danh</th>
                    <th style={{ textAlign: 'right' }}>Điểm Môn Toán</th>
                    <th style={{ width: '120px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {topMath.map((student, idx) => (
                    <tr key={student.sbd}>
                      <td>
                        <span
                          className="badge"
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontFamily: 'var(--font-mono)',
                            ...getRankBadgeStyle(idx + 1)
                          }}
                        >
                          {idx + 1}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{student.sbd}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, fontSize: '15px', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                        {student.score.toFixed(2)}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => handleSbdClick(student.sbd)}
                          className="theme-toggle-btn"
                          style={{ padding: '6px 8px', fontSize: '11px', display: 'inline-flex', gap: '4px' }}
                        >
                          <Search size={12} />
                          <span className="hidden-mobile">Chi tiết</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'physics' && (
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>Hạng</th>
                    <th>Số Báo Danh</th>
                    <th style={{ textAlign: 'right' }}>Điểm Môn Vật lý</th>
                    <th style={{ width: '120px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {topPhysics.map((student, idx) => (
                    <tr key={student.sbd}>
                      <td>
                        <span
                          className="badge"
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontFamily: 'var(--font-mono)',
                            ...getRankBadgeStyle(idx + 1)
                          }}
                        >
                          {idx + 1}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{student.sbd}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, fontSize: '15px', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                        {student.score.toFixed(2)}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => handleSbdClick(student.sbd)}
                          className="theme-toggle-btn"
                          style={{ padding: '6px 8px', fontSize: '11px', display: 'inline-flex', gap: '4px' }}
                        >
                          <Search size={12} />
                          <span className="hidden-mobile">Chi tiết</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'chemistry' && (
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>Hạng</th>
                    <th>Số Báo Danh</th>
                    <th style={{ textAlign: 'right' }}>Điểm Môn Hóa học</th>
                    <th style={{ width: '120px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {topChemistry.map((student, idx) => (
                    <tr key={student.sbd}>
                      <td>
                        <span
                          className="badge"
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontFamily: 'var(--font-mono)',
                            ...getRankBadgeStyle(idx + 1)
                          }}
                        >
                          {idx + 1}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{student.sbd}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, fontSize: '15px', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                        {student.score.toFixed(2)}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => handleSbdClick(student.sbd)}
                          className="theme-toggle-btn"
                          style={{ padding: '6px 8px', fontSize: '11px', display: 'inline-flex', gap: '4px' }}
                        >
                          <Search size={12} />
                          <span className="hidden-mobile">Chi tiết</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Loader2, 
  Award, 
  AlertTriangle, 
  TrendingUp, 
  Zap, 
  LayoutGrid, 
  CheckCircle, 
  Activity, 
  Sparkles, 
  X,
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface ScoreDetail {
  subjectCode: string;
  subjectName: string;
  score: number;
  level: 'Excellent' | 'Good' | 'Average' | 'Poor';
}

interface StudentReport {
  sbd: string;
  maNgoaiNgu: string | null;
  scores: ScoreDetail[];
  summary: {
    totalSubjects: number;
    excellentCount: number;
    goodCount: number;
    averageCount: number;
    poorCount: number;
    groupATotal: number | null;
  };
}

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
  toan: 'Toán',
  ngu_van: 'Ngữ văn',
  ngoai_ngu: 'Ngoại ngữ',
  vat_li: 'Vật lí',
  hoa_hoc: 'Hóa học',
  sinh_hoc: 'Sinh học',
  lich_su: 'Lịch sử',
  dia_li: 'Địa lí',
  gdcd: 'GDCD'
};

export default function Dashboard() {
  const [sbdInput, setSbdInput] = useState('');
  const [sbdError, setSbdError] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [studentReport, setStudentReport] = useState<StudentReport | null>(null);
  const [statsData, setStatsData] = useState<SubjectStat[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [systemKpis, setSystemKpis] = useState({
    totalCandidates: 1061606,
    excellentRate: '15.4%',
    topGroupAScore: 29.6
  });

  // Fetch initial dashboard data (stats & leaderboard)
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const statsRes = await fetch('/api/stats');
        if (statsRes.ok) {
          const stats = await statsRes.json();
          setStatsData(stats);

          // Dynamically compute KPIs based on pre-computed stats
          let totalExcellent = 0;
          let totalScores = 0;
          let candidateCount = 1061606;

          stats.forEach((s: SubjectStat) => {
            totalExcellent += s.levelExcellent;
            totalScores += s.totalCandidates;
            if (s.subject === 'toan') {
              candidateCount = s.totalCandidates;
            }
          });

          const rate = totalScores > 0 ? ((totalExcellent / totalScores) * 100).toFixed(1) + '%' : '15.4%';
          setSystemKpis(prev => ({
            ...prev,
            totalCandidates: candidateCount,
            excellentRate: rate
          }));
        }

        const leaderboardRes = await fetch('/api/group-a');
        if (leaderboardRes.ok) {
          const lb = await leaderboardRes.json();
          setLeaderboard(lb);
          if (lb.length > 0) {
            setSystemKpis(prev => ({
              ...prev,
              topGroupAScore: lb[0].total
            }));
          }
        }
      } catch (err) {
        console.error('Error fetching dashboard statistics:', err);
      }
    }

    fetchDashboardData();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSbdError('');
    setStudentReport(null);

    // Validate 8-digit registration number
    if (!/^\d{8}$/.test(sbdInput)) {
      setSbdError('Số báo danh không hợp lệ. Vui lòng nhập đúng 8 chữ số (ví dụ: 01000001).');
      return;
    }

    setSearchLoading(true);
    try {
      const res = await fetch(`/api/students/${sbdInput}`);
      const data = await res.json();

      if (!res.ok) {
        setSbdError(data.error || 'Không thể tìm thấy thông tin thí sinh.');
      } else {
        setStudentReport(data);
      }
    } catch (err) {
      setSbdError('Đã xảy ra lỗi kết nối với máy chủ.');
    } finally {
      setSearchLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Excellent': return 'excellent';
      case 'Good': return 'good';
      case 'Average': return 'average';
      case 'Poor': return 'poor';
      default: return '';
    }
  };

  const getVietnameseLevel = (level: string) => {
    switch (level) {
      case 'Excellent': return 'Giỏi (>=8)';
      case 'Good': return 'Khá (6 - 8)';
      case 'Average': return 'Trung bình (4 - 6)';
      case 'Poor': return 'Yếu (<4)';
      default: return '';
    }
  };

  // Format Recharts data
  const formattedChartData = statsData.map(stat => ({
    name: subjectNameMap[stat.subject] || stat.subject,
    'Giỏi (>=8)': stat.levelExcellent,
    'Khá (6-8)': stat.levelGood,
    'Trung bình (4-6)': stat.levelAverage,
    'Yếu (<4)': stat.levelPoor,
  }));

  return (
    <main>
      {/* Header section with live indicator */}
      <header className="header">
        <div className="logo-container">
          <Zap className="logo-icon" size={24} />
          <h1 className="logo-text">WATT-VISION G-SCORES</h1>
        </div>
        <div className="live-badge">
          <span className="live-dot"></span>
          <span>DỮ LIỆU ĐÃ ĐỒNG BỘ</span>
        </div>
      </header>

      <div className="dashboard-container">
        {/* Top 3 KPI Grid Cards */}
        <section className="kpi-grid">
          <div className="kpi-card cyan">
            <div>
              <div className="kpi-label">Tổng số thí sinh</div>
              <div className="kpi-value">{systemKpis.totalCandidates.toLocaleString()}</div>
            </div>
            <div className="kpi-sub">Tổng số hồ sơ trong hệ thống</div>
          </div>
          
          <div className="kpi-card green">
            <div>
              <div className="kpi-label">{"Tỉ lệ bài thi giỏi (>=8.0)"}</div>
              <div className="kpi-value">{systemKpis.excellentRate}</div>
            </div>
            <div className="kpi-sub">Số điểm đạt phân khúc xuất sắc</div>
          </div>

          <div className="kpi-card cyan">
            <div>
              <div className="kpi-label">Thủ khoa khối A (Toán-Lý-Hóa)</div>
              <div className="kpi-value">{systemKpis.topGroupAScore} Bs / 30</div>
            </div>
            <div className="kpi-sub">Điểm số cao nhất ghi nhận được</div>
          </div>
        </section>

        {/* Dashboard 8 columns main and 4 columns sidebar */}
        <div className="main-grid">
          {/* Main Content Area (8 Columns) */}
          <div className="col-main">
            {/* Search Lookup Module */}
            <section className="card-module fade-in">
              <h2 className="card-title">
                <Search size={20} className="logo-icon" />
                Tra cứu điểm thi cá nhân
              </h2>
              <form onSubmit={handleSearch} className="search-form">
                <div className="input-container">
                  <Search size={20} className="input-icon" />
                  <input
                    type="text"
                    value={sbdInput}
                    onChange={(e) => setSbdInput(e.target.value)}
                    placeholder="Nhập 8 chữ số Số Báo Danh..."
                    className="search-input"
                    maxLength={8}
                  />
                </div>
                <button type="submit" disabled={searchLoading} className="search-btn">
                  {searchLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <span>TRA CỨU VÀ PHÂN TÍCH</span>
                  )}
                </button>
              </form>

              {sbdError && (
                <div className="error-text">
                  <AlertTriangle size={16} />
                  <span>{sbdError}</span>
                </div>
              )}

              {/* Student detailed report */}
              {studentReport && (
                <div className="student-report-card fade-in" style={{ marginTop: '24px' }}>
                  <div className="report-header">
                    <div>
                      <div className="student-sbd">SBD: {studentReport.sbd}</div>
                      {studentReport.maNgoaiNgu && (
                        <div style={{ color: 'var(--text-sec)', fontSize: '12px', marginTop: '4px' }}>
                          Mã ngoại ngữ: {studentReport.maNgoaiNgu}
                        </div>
                      )}
                    </div>
                    {studentReport.summary.groupATotal !== null && (
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-sec)', textTransform: 'uppercase' }}>Điểm Khối A</div>
                        <div className="kpi-value" style={{ fontSize: '26px', color: 'var(--accent-cyan)' }}>
                          {studentReport.summary.groupATotal}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3x3 Grid for Subject Scores */}
                  <div className="score-grid-wrapper">
                    {studentReport.scores.map((scoreObj) => (
                      <div key={scoreObj.subjectCode} className="score-mini-card">
                        <div style={{ color: 'var(--text-sec)', fontSize: '12px', fontWeight: 500 }}>
                          {scoreObj.subjectName}
                        </div>
                        <div className={`score-mini-num ${getLevelColor(scoreObj.level)}`}>
                          {scoreObj.score.toFixed(2)}
                        </div>
                        <span className={`score-level-badge ${getLevelColor(scoreObj.level)}`}>
                          {getVietnameseLevel(scoreObj.level).split(' ')[0]}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Summary Performance Section */}
                  <div style={{ 
                    background: 'rgba(255,255,255,0.02)', 
                    padding: '20px', 
                    borderRadius: '12px', 
                    border: '1px solid var(--border-subtle)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '16px',
                    textAlign: 'center'
                  }}>
                    <div>
                      <div style={{ color: 'var(--accent-green)', fontWeight: 600, fontSize: '18px' }}>
                        {studentReport.summary.excellentCount}
                      </div>
                      <div style={{ color: 'var(--text-sec)', fontSize: '11px' }}>Môn Giỏi</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '18px' }}>
                        {studentReport.summary.goodCount}
                      </div>
                      <div style={{ color: 'var(--text-sec)', fontSize: '11px' }}>Môn Khá</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '18px' }}>
                        {studentReport.summary.averageCount}
                      </div>
                      <div style={{ color: 'var(--text-sec)', fontSize: '11px' }}>Môn TB</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--accent-red)', fontWeight: 600, fontSize: '18px' }}>
                        {studentReport.summary.poorCount}
                      </div>
                      <div style={{ color: 'var(--text-sec)', fontSize: '11px' }}>Điểm Yếu</div>
                    </div>
                  </div>

                  {/* Red Alert card if poor score (<4) detected */}
                  {studentReport.summary.poorCount > 0 && (
                    <div className="alert-box fade-in">
                      <AlertTriangle size={24} style={{ color: 'var(--accent-red)', flexShrink: 0 }} />
                      <div>
                        <h4 className="alert-title">Cảnh báo học tập / Điểm liệt tiềm năng</h4>
                        <p className="alert-desc">
                          Phát hiện thí sinh có {studentReport.summary.poorCount} điểm dưới 4.0 (Đặc biệt lưu ý điểm liệt dưới 1.0 có thể ảnh hưởng xét công nhận tốt nghiệp).
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Statistics Level Chart Section */}
            <section className="card-module fade-in">
              <h2 className="card-title">
                <TrendingUp size={20} className="logo-icon" />
                Phổ điểm phân phối theo 4 cấp độ học lực
              </h2>
              {formattedChartData.length > 0 ? (
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={formattedChartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                      <XAxis dataKey="name" stroke="var(--text-sec)" tick={{ fill: 'var(--text-sec)', fontSize: 12 }} />
                      <YAxis stroke="var(--text-sec)" tick={{ fill: 'var(--text-sec)', fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--bg-card)', 
                          borderColor: 'var(--border-subtle)',
                          borderRadius: '8px',
                          color: '#fff'
                        }} 
                      />
                      <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-main)' }} />
                      <Bar dataKey="Giỏi (>=8)" fill="var(--accent-green)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Khá (6-8)" fill="var(--accent-cyan)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Trung bình (4-6)" fill="rgba(255, 255, 255, 0.4)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Yếu (<4)" fill="var(--accent-red)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-sec)' }}>
                  <Loader2 className="animate-spin" size={24} style={{ marginRight: '8px' }} />
                  Đang phân tích phổ điểm hệ thống...
                </div>
              )}
            </section>
          </div>

          {/* Sidebar Area (4 Columns) */}
          <div className="col-sidebar">
            {/* Top 10 Group A Leaderboard */}
            <section className="card-module fade-in" style={{ height: '100%' }}>
              <h2 className="card-title">
                <Award size={20} className="logo-icon" />
                Thủ khoa Khối A toàn quốc
              </h2>
              {leaderboard.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table className="premium-table">
                    <thead>
                      <tr>
                        <th style={{ width: '50px' }}>Hạng</th>
                        <th>SBD</th>
                        <th style={{ textAlign: 'right' }}>T.Số</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((student, idx) => (
                        <tr key={student.sbd}>
                          <td>
                            <span className={`rank-badge ${idx < 3 ? `rank-${idx + 1}` : 'rank-other'}`}>
                              {idx + 1}
                            </span>
                          </td>
                          <td>
                            <div className="sbd-cell">{student.sbd}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-sec)', marginTop: '2px' }}>
                              T: {student.math.toFixed(1)} | L: {student.physics.toFixed(1)} | H: {student.chemistry.toFixed(1)}
                            </div>
                          </td>
                          <td style={{ textAlign: 'right' }} className="score-cell">
                            {student.total.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-sec)' }}>
                  <Loader2 className="animate-spin" size={24} style={{ margin: '0 auto 12px' }} />
                  Đang tính toán thứ hạng thủ khoa Khối A...
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

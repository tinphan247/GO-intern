'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  BarChart3,
  Loader2,
  TrendingUp,
  Users,
  Filter,
  Activity,
  Layers
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

export default function ReportsPage() {
  const [statsData, setStatsData] = useState<SubjectStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          const stats = await res.json();
          setStatsData(stats);
        }
      } catch (err) {
        console.error('Lỗi tải dữ liệu phổ điểm:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-sec)' }}>
        <Loader2 className="animate-spin" size={24} style={{ marginRight: '8px' }} />
        Đang xây dựng báo cáo phân tích...
      </div>
    );
  }

  // Get selected subject stats or compute aggregates
  const getActiveStats = () => {
    if (selectedSubject === 'all') {
      let excellent = 0;
      let good = 0;
      let average = 0;
      let poor = 0;
      let total = 0;

      statsData.forEach((s) => {
        excellent += s.levelExcellent;
        good += s.levelGood;
        average += s.levelAverage;
        poor += s.levelPoor;
        total += s.totalCandidates;
      });

      return {
        subjectName: 'Tất cả các môn',
        totalCandidates: statsData.length > 0 ? statsData[0].totalCandidates : 1061606, // Toán học candidates represents total students roughly
        averageScore: statsData.length > 0 ? statsData.reduce((acc, curr) => acc + curr.averageScore, 0) / statsData.length : 6.42,
        levelExcellent: excellent,
        levelGood: good,
        levelAverage: average,
        levelPoor: poor
      };
    }

    const found = statsData.find((s) => s.subject === selectedSubject);
    if (!found) return null;

    return {
      subjectName: subjectNameMap[found.subject] || found.subject,
      totalCandidates: found.totalCandidates,
      averageScore: found.averageScore,
      levelExcellent: found.levelExcellent,
      levelGood: found.levelGood,
      levelAverage: found.levelAverage,
      levelPoor: found.levelPoor
    };
  };

  const activeStats = getActiveStats();

  // Pie chart data formatting
  const getPieChartData = () => {
    if (!activeStats) return [];
    return [
      { name: 'Giỏi (>=8.0)', value: activeStats.levelExcellent, color: 'var(--success)' },
      { name: 'Khá (6.0-8.0)', value: activeStats.levelGood, color: 'var(--primary)' },
      { name: 'Trung bình (4.0-6.0)', value: activeStats.levelAverage, color: 'var(--text-muted)' },
      { name: 'Yếu (<4.0)', value: activeStats.levelPoor, color: 'var(--danger)' }
    ];
  };

  const pieData = getPieChartData();

  // Bar chart data formatting for all subjects comparison
  const getSubjectComparisonData = () => {
    return statsData.map((s) => ({
      name: subjectNameMap[s.subject] || s.subject,
      'Điểm trung bình': Math.round(s.averageScore * 100) / 100
    }));
  };

  // Participation stats formatting
  const getParticipationData = () => {
    return statsData.map((s) => ({
      name: subjectNameMap[s.subject] || s.subject,
      'Số thí sinh': s.totalCandidates
    }));
  };

  // Detailed level distribution stacked bar data
  const getStackedBarData = () => {
    return statsData.map((s) => ({
      name: subjectNameMap[s.subject] || s.subject,
      'Giỏi (>=8.0)': s.levelExcellent,
      'Khá (6.0-8.0)': s.levelGood,
      'Trung bình (4.0-6.0)': s.levelAverage,
      'Yếu (<4.0)': s.levelPoor
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Subject Filter Section */}
      <div className="dashboard-panel">
        <div className="panel-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Filter size={18} style={{ color: 'var(--primary)' }} />
            <span style={{ fontWeight: 600, fontSize: '15px' }}>Bộ lọc môn thi phân tích:</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedSubject('all')}
              className={`theme-toggle-btn ${selectedSubject === 'all' ? 'active' : ''}`}
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                backgroundColor: selectedSubject === 'all' ? 'var(--primary-glow)' : 'transparent',
                borderColor: selectedSubject === 'all' ? 'var(--primary)' : 'var(--border-subtle)',
                color: selectedSubject === 'all' ? 'var(--primary)' : 'var(--text-sec)',
                fontWeight: 600
              }}
            >
              Tất cả các môn
            </button>
            {statsData.map((s) => (
              <button
                key={s.subject}
                onClick={() => setSelectedSubject(s.subject)}
                className={`theme-toggle-btn ${selectedSubject === s.subject ? 'active' : ''}`}
                style={{
                  padding: '8px 16px',
                  fontSize: '13px',
                  backgroundColor: selectedSubject === s.subject ? 'var(--primary-glow)' : 'transparent',
                  borderColor: selectedSubject === s.subject ? 'var(--primary)' : 'var(--border-subtle)',
                  color: selectedSubject === s.subject ? 'var(--primary)' : 'var(--text-sec)',
                  fontWeight: 600
                }}
              >
                {subjectNameMap[s.subject] || s.subject}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeStats && (
        <>
          {/* Top Quick Metrics for active view */}
          <section className="grid-cols-4">
            <div className="stats-card">
              <span className="stats-label">Đang xem môn</span>
              <div className="stats-value" style={{ fontSize: '24px' }}>{activeStats.subjectName}</div>
              <div className="stats-sub">
                <Layers size={14} />
                <span>Đối tượng phân tích hiện tại</span>
              </div>
            </div>

            <div className="stats-card">
              <span className="stats-label">Tổng bài thi ghi nhận</span>
              <div className="stats-value">{activeStats.totalCandidates.toLocaleString()}</div>
              <div className="stats-sub">
                <Users size={14} />
                <span>Số bài nộp chính thức</span>
              </div>
            </div>

            <div className="stats-card">
              <span className="stats-label">Điểm số trung bình môn</span>
              <div className="stats-value">{activeStats.averageScore.toFixed(2)}</div>
              <div className="stats-sub">
                <TrendingUp size={14} />
                <span>Thang điểm tối đa 10.0</span>
              </div>
            </div>

            <div className="stats-card">
              <span className="stats-label">Tỷ lệ bài thi Xuất sắc</span>
              <div className="stats-value">
                {activeStats.totalCandidates > 0
                  ? ((activeStats.levelExcellent / (activeStats.levelExcellent + activeStats.levelGood + activeStats.levelAverage + activeStats.levelPoor)) * 100).toFixed(1) + '%'
                  : '0%'
                }
              </div>
              <div className="stats-sub">
                <Activity size={14} />
                <span>Số lượng đạt điểm giỏi</span>
              </div>
            </div>
          </section>

          {/* Active Level Distribution charts (Bar and Pie) */}
          <div className="grid-cols-12">
            <div className="col-span-8 dashboard-panel">
              <div className="panel-header">
                <h3 className="panel-title">
                  <BarChart3 size={18} style={{ color: 'var(--primary)' }} />
                  Phổ Điểm Chi Tiết ({activeStats.subjectName})
                </h3>
              </div>
              <div className="panel-content">
                <div style={{ width: '100%', height: '350px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Giỏi (>=8.0)', 'Số bài thi': activeStats.levelExcellent, fill: 'var(--success)' },
                        { name: 'Khá (6.0-8.0)', 'Số bài thi': activeStats.levelGood, fill: 'var(--primary)' },
                        { name: 'Trung bình (4.0-6.0)', 'Số bài thi': activeStats.levelAverage, fill: 'var(--text-muted)' },
                        { name: 'Yếu (<4.0)', 'Số bài thi': activeStats.levelPoor, fill: 'var(--danger)' }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                      <XAxis dataKey="name" stroke="var(--text-sec)" tick={{ fill: 'var(--text-sec)', fontSize: 12 }} />
                      <YAxis stroke="var(--text-sec)" tick={{ fill: 'var(--text-sec)', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--bg-card)',
                          borderColor: 'var(--border-subtle)',
                          borderRadius: '8px',
                          color: 'var(--text-main)'
                        }}
                      />
                      <Bar dataKey="Số bài thi" radius={[6, 6, 0, 0]}>
                        {[
                          <Cell key="cell-0" fill="var(--success)" />,
                          <Cell key="cell-1" fill="var(--primary)" />,
                          <Cell key="cell-2" fill="var(--text-muted)" />,
                          <Cell key="cell-3" fill="var(--danger)" />
                        ]}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="col-span-4 dashboard-panel">
              <div className="panel-header">
                <h3 className="panel-title">
                  <Activity size={18} style={{ color: 'var(--success)' }} />
                  Tỷ Lệ Phổ Điểm
                </h3>
              </div>
              <div className="panel-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '100%', height: '240px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--bg-card)',
                          borderColor: 'var(--border-subtle)',
                          borderRadius: '8px',
                          color: 'var(--text-main)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Custom Legends list */}
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                  {pieData.map((item, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-sec)' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: item.color }}></span>
                        {item.name}
                      </span>
                      <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                        {item.value.toLocaleString()} ({activeStats.totalCandidates > 0 ? ((item.value / (activeStats.levelExcellent + activeStats.levelGood + activeStats.levelAverage + activeStats.levelPoor)) * 100).toFixed(1) : 0}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* National Comparisons - Average and Participation */}
      <div className="grid-cols-12">
        {/* National Averages comparing horizontal bar */}
        <div className="col-span-6 dashboard-panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <BarChart3 size={18} style={{ color: 'var(--primary)' }} />
              So Sánh Điểm Trung Bình Quốc Gia
            </h3>
          </div>
          <div className="panel-content">
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={getSubjectComparisonData()}
                  margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" horizontal={true} vertical={false} />
                  <XAxis type="number" domain={[0, 10]} stroke="var(--text-sec)" tick={{ fill: 'var(--text-sec)', fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" stroke="var(--text-sec)" tick={{ fill: 'var(--text-sec)', fontSize: 11 }} width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-subtle)',
                      borderRadius: '8px',
                      color: 'var(--text-main)'
                    }}
                  />
                  <Bar dataKey="Điểm trung bình" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* National Subject Registrations Participation comparing vertical bar */}
        <div className="col-span-6 dashboard-panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <Users size={18} style={{ color: 'var(--info)' }} />
              Quy Mô Đăng Ký Dự Thi Các Môn
            </h3>
          </div>
          <div className="panel-content">
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getParticipationData()}
                  margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                  <XAxis dataKey="name" stroke="var(--text-sec)" tick={{ fill: 'var(--text-sec)', fontSize: 11 }} />
                  <YAxis stroke="var(--text-sec)" tick={{ fill: 'var(--text-sec)', fontSize: 11 }} tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-subtle)',
                      borderRadius: '8px',
                      color: 'var(--text-main)'
                    }}
                    formatter={(val) => [Number(val).toLocaleString() + ' thí sinh', 'Đăng ký']}
                  />
                  <Bar dataKey="Số thí sinh" fill="var(--text-muted)" radius={[4, 4, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Stacked level distributions */}
      <div className="dashboard-panel">
        <div className="panel-header">
          <h3 className="panel-title">
            <Layers size={18} style={{ color: 'var(--success)' }} />
            Tỷ Lệ Mức Học Lực Tương Đối Giữa Các Môn
          </h3>
        </div>
        <div className="panel-content">
          <div style={{ width: '100%', height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={getStackedBarData()}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="name" stroke="var(--text-sec)" tick={{ fill: 'var(--text-sec)', fontSize: 12 }} />
                <YAxis stroke="var(--text-sec)" tick={{ fill: 'var(--text-sec)', fontSize: 12 }} tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-subtle)',
                    borderRadius: '8px',
                    color: 'var(--text-main)'
                  }}
                />
                <Legend />
                <Bar dataKey="Giỏi (>=8.0)" fill="var(--success)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Khá (6.0-8.0)" fill="var(--primary)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Trung bình (4.0-6.0)" fill="var(--text-muted)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Yếu (<4.0)" fill="var(--danger)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

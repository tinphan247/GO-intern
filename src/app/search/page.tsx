'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search,
  Loader2,
  AlertTriangle,
  Award,
  Download,
  Printer,
  ChevronRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

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

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sbdInput, setSbdInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [report, setReport] = useState<StudentReport | null>(null);

  // Automatically execute search if "sbd" query param exists
  useEffect(() => {
    const sbd = searchParams.get('sbd');
    if (sbd) {
      setSbdInput(sbd);
      handleSearchExecution(sbd);
    }
  }, [searchParams]);

  const handleSearchExecution = async (sbd: string) => {
    if (!/^\d{8}$/.test(sbd)) {
      setError('Số báo danh không hợp lệ. Vui lòng nhập đúng 8 chữ số (ví dụ: 01000001).');
      setReport(null);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/students/${sbd}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Không tìm thấy thông tin thí sinh.');
        setReport(null);
      } else {
        setReport(data);
      }
    } catch (err) {
      setError('Đã xảy ra lỗi kết nối với máy chủ.');
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update the URL to match the search, which will trigger the useEffect
    router.push(`/search?sbd=${sbdInput}`);
  };

  const getLevelBadgeClass = (level: string) => {
    switch (level) {
      case 'Excellent':
        return 'badge-excellent';
      case 'Good':
        return 'badge-good';
      case 'Average':
        return 'badge-average';
      case 'Poor':
        return 'badge-poor';
      default:
        return '';
    }
  };

  const getVietnameseLevelName = (level: string) => {
    switch (level) {
      case 'Excellent':
        return 'Giỏi (>=8.0)';
      case 'Good':
        return 'Khá (6.0 - 8.0)';
      case 'Average':
        return 'Trung bình (4.0 - 6.0)';
      case 'Poor':
        return 'Yếu (<4.0)';
      default:
        return '';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Excellent':
        return 'var(--success)';
      case 'Good':
        return 'var(--primary)';
      case 'Average':
        return 'var(--text-muted)';
      case 'Poor':
        return 'var(--danger)';
      default:
        return 'var(--border-focus)';
    }
  };

  const hasFailingScore = () => {
    if (!report) return false;
    return report.scores.some((s) => s.score <= 1.0);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    if (!report) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `SBD_${report.sbd}_Scores.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} className="no-print">
      {/* Search Input Box */}
      <div className="dashboard-panel">
        <div className="panel-header">
          <h3 className="panel-title">
            <Search size={18} style={{ color: 'var(--primary)' }} />
            Tra Cứu Điểm Cá Nhân
          </h3>
        </div>
        <div className="panel-content">
          <form onSubmit={handleSearchSubmit} className="search-form-responsive" style={{ display: 'flex', gap: '16px' }}>
            <div className="form-input-wrapper" style={{ flex: 1 }}>
              <Search className="form-icon" size={18} />
              <input
                type="text"
                value={sbdInput}
                onChange={(e) => setSbdInput(e.target.value)}
                placeholder="Nhập đúng 8 chữ số Số Báo Danh (ví dụ: 01000001)..."
                className="form-input"
                maxLength={8}
              />
            </div>
            <button type="submit" disabled={loading} className="form-button">
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <span>Tra Cứu Điểm</span>
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </form>

          {error && (
            <div
              className="badge badge-poor"
              style={{
                marginTop: '16px',
                width: '100%',
                justifyContent: 'flex-start',
                padding: '10px 14px',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '13px',
                gap: '8px'
              }}
            >
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Lookup results */}
      {report && (
        <div className="grid-cols-12 fade-in">
          {/* Left Block - Subject Grid */}
          <div className="col-span-8" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div className="dashboard-panel">
              <div className="panel-header" style={{ justifyContent: 'space-between' }}>
                <h3 className="panel-title" style={{ fontFamily: 'var(--font-mono)' }}>
                  <Sparkles size={18} style={{ color: 'var(--primary)' }} />
                  Số Báo Danh: {report.sbd}
                </h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handlePrint}
                    className="theme-toggle-btn"
                    title="In bảng điểm thí sinh"
                    style={{ padding: '6px 12px', fontSize: '13px', display: 'flex', gap: '6px' }}
                  >
                    <Printer size={15} />
                    <span className="hidden-mobile">In bảng điểm</span>
                  </button>
                  <button
                    onClick={handleExportJson}
                    className="theme-toggle-btn"
                    title="Xuất file JSON kết quả"
                    style={{ padding: '6px 12px', fontSize: '13px', display: 'flex', gap: '6px' }}
                  >
                    <Download size={15} />
                    <span className="hidden-mobile">Xuất tệp tin</span>
                  </button>
                </div>
              </div>
              <div className="panel-content">
                {/* Responsive Grid for Subject Scores */}
                <div className="search-results-grid" style={{ marginBottom: '24px' }}>
                  {report.scores.map((scoreObj) => (
                    <div key={scoreObj.subjectCode} className="subject-score-card">
                      <span style={{ fontSize: '13px', color: 'var(--text-sec)', fontWeight: 500 }}>
                        {scoreObj.subjectName}
                      </span>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span className="subject-score-value" style={{ color: getLevelColor(scoreObj.level) }}>
                          {scoreObj.score.toFixed(2)}
                        </span>
                        <span className={`badge ${getLevelBadgeClass(scoreObj.level)}`} style={{ fontSize: '9px', padding: '2px 6px' }}>
                          {scoreObj.level === 'Excellent' ? 'Giỏi' : scoreObj.level === 'Good' ? 'Khá' : scoreObj.level === 'Average' ? 'Trung bình' : 'Yếu'}
                        </span>
                      </div>
                      <div className="progress-bar-container" style={{ height: '4px', marginTop: '4px' }}>
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${scoreObj.score * 10}%`,
                            backgroundColor: getLevelColor(scoreObj.level)
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Score Danger Indicators */}
                {hasFailingScore() && (
                  <div
                    className="badge badge-poor"
                    style={{
                      width: '100%',
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      textTransform: 'none',
                      alignItems: 'flex-start',
                      fontSize: '13px',
                      fontWeight: 500,
                      gap: '12px'
                    }}
                  >
                    <AlertTriangle size={24} style={{ flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--danger)', fontSize: '14px', marginBottom: '4px' }}>
                        Cảnh Báo: Điểm Liệt Tốt Nghiệp
                      </div>
                      <div style={{ color: '#7F1D1D', lineHeight: 1.4 }}>
                        Thí sinh có môn thi dưới hoặc bằng 1.0 điểm. Theo quy chế của Bộ Giáo dục và Đào tạo, mức điểm này được xếp vào diện điểm liệt, ảnh hưởng trực tiếp đến điều kiện xét công nhận tốt nghiệp THPT Quốc gia.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Block - Analysis summaries */}
          <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* KPI statistics summary */}
            <div className="dashboard-panel">
              <div className="panel-header">
                <h3 className="panel-title">
                  <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />
                  Đánh Giá Học Lực
                </h3>
              </div>
              <div className="panel-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>
                      {report.summary.excellentCount}
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-sec)' }}>Môn Giỏi</span>
                  </div>
                  <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                      {report.summary.goodCount}
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-sec)' }}>Môn Khá</span>
                  </div>
                  <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
                      {report.summary.averageCount}
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-sec)' }}>Môn T.Bình</span>
                  </div>
                  <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--danger)', fontFamily: 'var(--font-mono)' }}>
                      {report.summary.poorCount}
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-sec)' }}>Môn Yếu</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-primary)', borderRadius: '8px', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-sec)' }}>Tổng số môn dự thi:</span>
                  <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{report.summary.totalSubjects} môn</span>
                </div>
              </div>
            </div>

            {/* Group A Calculation Card */}
            <div className="dashboard-panel">
              <div className="panel-header">
                <h3 className="panel-title">
                  <Award size={18} style={{ color: 'var(--warning)' }} />
                  Xét Điểm Tổ Hợp Khối A
                </h3>
              </div>
              <div className="panel-content">
                {report.summary.groupATotal !== null ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-sec)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Điểm tổ hợp Toán - Lý - Hóa
                    </span>
                    <div style={{ fontSize: '42px', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                      {report.summary.groupATotal.toFixed(2)}
                    </div>
                    <span className="badge badge-excellent" style={{ alignSelf: 'center' }}>
                      Trung bình: {(report.summary.groupATotal / 3).toFixed(2)} / môn
                    </span>
                  </div>
                ) : (
                  <div style={{ color: 'var(--text-sec)', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'center' }}>
                    <AlertTriangle size={24} style={{ color: 'var(--warning)', margin: '0 auto 4px' }} />
                    <p>Không thể tính điểm tổ hợp Khối A.</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Thí sinh phải thi đủ 3 môn: Toán học, Vật lý và Hóa học để tham gia xét tuyển tổ hợp này.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-sec)' }}>
        <Loader2 className="animate-spin" size={24} style={{ marginRight: '8px' }} />
        Đang tải cấu hình tìm kiếm...
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Cpu,
  Database,
  Moon,
  Sun,
  Layers,
  Info,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export default function SettingsPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync theme status on load
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const handleThemeChange = (selectedTheme: 'light' | 'dark') => {
    setTheme(selectedTheme);
    document.documentElement.classList.toggle('dark', selectedTheme === 'dark');
    localStorage.setItem('gscores-theme', selectedTheme);

    // Show a micro-success flash message
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* 1. Theme Configuration Panel */}
      <div className="dashboard-panel">
        <div className="panel-header">
          <h3 className="panel-title">
            <Sun size={18} style={{ color: 'var(--primary)' }} />
            Giao Diện & Cá Nhân Hóa
          </h3>
          {savedSuccess && (
            <span className="badge badge-excellent" style={{ fontSize: '11px', textTransform: 'none' }}>
              <CheckCircle size={12} />
              Đã cập nhật
            </span>
          )}
        </div>
        <div className="panel-content">
          <div className="settings-section">
            <div className="settings-row">
              <div className="settings-label-block">
                <span className="settings-title">Lựa chọn chủ đề màu sắc</span>
                <span className="settings-description">Tự động điều chỉnh màu sắc giao diện theo sở thích của bạn (Mặc định: Sáng).</span>
              </div>
              <div className="theme-selector">
                <div
                  className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => handleThemeChange('light')}
                >
                  <Sun size={14} />
                  <span>Sáng</span>
                </div>
                <div
                  className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => handleThemeChange('dark')}
                >
                  <Moon size={14} />
                  <span>Tối</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. System and Technology Information */}
      <div className="grid-cols-12">
        {/* Tech Stack details */}
        <div className="col-span-6 dashboard-panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <Cpu size={18} style={{ color: 'var(--primary)' }} />
              Công Nghệ Phát Triển
            </h3>
          </div>
          <div className="panel-content" style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
              <span style={{ color: 'var(--text-sec)' }}>Kiến trúc nền tảng:</span>
              <span style={{ fontWeight: 600 }}>Next.js 16 (App Router)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
              <span style={{ color: 'var(--text-sec)' }}>Ngôn ngữ:</span>
              <span style={{ fontWeight: 600 }}>TypeScript / TSX</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
              <span style={{ color: 'var(--text-sec)' }}>Bộ phân tích cơ sở dữ liệu:</span>
              <span style={{ fontWeight: 600 }}>Prisma Engine 7.8.0</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
              <span style={{ color: 'var(--text-sec)' }}>Thư viện trực quan hóa:</span>
              <span style={{ fontWeight: 600 }}>Recharts Components</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-sec)' }}>Thiết kế Icons:</span>
              <span style={{ fontWeight: 600 }}>Lucide React Vector Suite</span>
            </div>
          </div>
        </div>

        {/* Database statistics info */}
        <div className="col-span-6 dashboard-panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <Database size={18} style={{ color: 'var(--success)' }} />
              Hệ Thống Cơ Sở Dữ Liệu
            </h3>
          </div>
          <div className="panel-content" style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
              <span style={{ color: 'var(--text-sec)' }}>Hệ quản trị CSDL:</span>
              <span style={{ fontWeight: 600 }}>PostgreSQL</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
              <span style={{ color: 'var(--text-sec)' }}>Dịch vụ lưu trữ đám mây:</span>
              <span style={{ fontWeight: 600 }}>Supabase AWS Cloud Hosting</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
              <span style={{ color: 'var(--text-sec)' }}>Phiên bản Schema:</span>
              <span style={{ fontWeight: 600 }}>Student & SubjectStats Models</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
              <span style={{ color: 'var(--text-sec)' }}>Cơ chế tối ưu tìm kiếm:</span>
              <span style={{ fontWeight: 600, color: 'var(--success)' }}>Composite Index Scan (Khối A)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-sec)' }}>Dữ liệu thi:</span>
              <span style={{ fontWeight: 600 }}>Kỳ thi Tốt nghiệp THPT Quốc gia 2024</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. About Project Panel */}
      <div className="dashboard-panel">
        <div className="panel-header">
          <h3 className="panel-title">
            <Info size={18} style={{ color: 'var(--primary)' }} />
            Giới Thiệu Dự Án G-Scores v2.0
          </h3>
        </div>
        <div className="panel-content" style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-sec)', lineHeight: 1.6 }}>
          <p>
            <strong>G-Scores</strong> là một hệ thống phân tích, tra cứu và hiển thị dữ liệu điểm thi Trung học Phổ thông (THPT) Quốc gia chất lượng cao. Hệ thống được thiết kế nhằm hỗ trợ các nhà quản lý giáo dục, giáo viên, học sinh và phụ huynh có một cái nhìn toàn diện, trực quan và khoa học về kết quả thi cử trên quy mô toàn quốc.
          </p>
          <p>
            Dự án được tái cấu trúc từ nền tảng ứng dụng một trang đơn giản thành một hệ thống SaaS (Software as a Service) chuyên nghiệp với giao diện đa trang tiện dụng, cấu trúc rõ ràng, hỗ trợ tìm kiếm nhanh toàn cục bằng tổ hợp phím <code>Ctrl + K</code>, tích hợp bản in tối ưu và khả năng tương thích cao trên các thiết bị di động, máy tính bảng và màn hình máy tính lớn.
          </p>
        </div>
      </div>
    </div>
  );
}

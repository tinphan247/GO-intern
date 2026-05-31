'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sun, Moon, Search, User } from 'lucide-react';

interface NavbarProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  openSearch: () => void;
}

export default function Navbar({ theme, setTheme, openSearch }: NavbarProps) {
  const pathname = usePathname();

  // Dynamically resolve page titles based on active route
  const getPageTitle = () => {
    switch (pathname) {
      case '/dashboard':
        return 'Phân Tích Tổng Quan';
      case '/search':
        return 'Tra Cứu Học Lực';
      case '/reports':
        return 'Báo Cáo Phổ Điểm';
      case '/leaderboard':
        return 'Bảng Xếp Hạng Kỳ Thi';
      case '/settings':
        return 'Cài Đặt Hệ Thống';
      default:
        return 'G-Scores Analytics';
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

  return (
    <header className="app-navbar">
      {/* Page Title */}
      <div className="navbar-left">
        <h2 className="navbar-title">{getPageTitle()}</h2>
      </div>

      {/* Global Controls */}
      <div className="navbar-right">
        {/* Search Shortcut */}
        <button
          onClick={openSearch}
          className="navbar-search-shortcut"
          title="Mở bảng tìm kiếm nhanh (Ctrl+K)"
        >
          <Search size={16} />
          <span>Tìm nhanh thí sinh...</span>
          <kbd className="search-kbd">Ctrl K</kbd>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          aria-label={theme === 'light' ? 'Chuyển sang chế độ tối' : 'Chuyển sang chế độ sáng'}
          title={theme === 'light' ? 'Chuyển sang chế độ tối' : 'Chuyển sang chế độ sáng'}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Profile */}
        <div className="profile-avatar" title="Thông tin cán bộ quản trị">
          <User size={16} />
        </div>
      </div>
    </header>
  );
}

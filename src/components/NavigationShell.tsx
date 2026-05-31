'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import {
  LayoutDashboard,
  Search,
  BarChart3,
  Award,
  Settings,
  X
} from 'lucide-react';

interface NavigationShellProps {
  children: React.ReactNode;
}

export default function NavigationShell({ children }: NavigationShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickSbd, setQuickSbd] = useState('');
  const [searchError, setSearchError] = useState('');
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Load theme & collapsible settings from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('gscores-theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }

    const savedCollapsed = localStorage.getItem('gscores-sidebar-collapsed');
    if (savedCollapsed) {
      setIsCollapsed(savedCollapsed === 'true');
    }
  }, []);

  // Update theme helper
  const handleSetTheme = (nextTheme: 'light' | 'dark') => {
    setTheme(nextTheme);
    localStorage.setItem('gscores-theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  // Update collapse helper
  const handleSetCollapsed = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    localStorage.setItem('gscores-sidebar-collapsed', String(collapsed));
  };

  // Keyboard shortcut Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Autofocus input when modal opens
  useEffect(() => {
    if (isSearchOpen) {
      setQuickSbd('');
      setSearchError('');
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isSearchOpen]);

  // Handle Quick Search
  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{8}$/.test(quickSbd)) {
      setSearchError('Số báo danh phải có đúng 8 chữ số.');
      return;
    }
    setIsSearchOpen(false);
    router.push(`/search?sbd=${quickSbd}`);
  };

  const mobileMenuItems = [
    { label: 'Tổng quan', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Tra cứu', href: '/search', icon: Search },
    { label: 'Báo cáo', href: '/reports', icon: BarChart3 },
    { label: 'Bảng xếp hạng', href: '/leaderboard', icon: Award },
    { label: 'Cài đặt', href: '/settings', icon: Settings },
  ];

  return (
    <div className="app-shell">
      {/* Sidebar Navigation */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={handleSetCollapsed} />

      {/* Main Content shell */}
      <div className="app-content-wrapper">
        {/* Navbar */}
        <Navbar
          theme={theme}
          setTheme={handleSetTheme}
          openSearch={() => setIsSearchOpen(true)}
        />

        {/* Dynamic Page Content */}
        <main className="main-content">{children}</main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-nav">
        {mobileMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon className="icon" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Ctrl + K Command Search Modal Overlay */}
      {isSearchOpen && (
        <div
          className="search-modal-backdrop"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="search-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleQuickSearchSubmit} className="search-modal-input-wrapper">
              <Search
                className="form-icon"
                size={20}
                style={{ left: '18px' }}
              />
              <input
                ref={searchInputRef}
                type="text"
                value={quickSbd}
                onChange={(e) => {
                  setQuickSbd(e.target.value);
                  setSearchError('');
                }}
                placeholder="Nhập 8 chữ số SBD rồi ấn Enter..."
                className="search-modal-input"
                maxLength={8}
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                style={{
                  position: 'absolute',
                  right: '18px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-sec)',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </form>

            {searchError && (
              <div
                style={{
                  padding: '12px 18px',
                  color: 'var(--danger)',
                  fontSize: '13px',
                  borderBottom: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--danger-bg)'
                }}
              >
                {searchError}
              </div>
            )}

            <div className="search-modal-hint">
              <span>Mẹo: Nhập SBD như 01000001</span>
              <span>Ấn <kbd style={{ background: 'var(--bg-hover)', padding: '2px 4px', borderRadius: '4px' }}>ESC</kbd> để đóng</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

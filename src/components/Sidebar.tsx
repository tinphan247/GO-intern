'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Search,
  BarChart3,
  Award,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { label: 'Tổng quan', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Tra cứu điểm', href: '/search', icon: Search },
    { label: 'Báo cáo chi tiết', href: '/reports', icon: BarChart3 },
    { label: 'Bảng xếp hạng', href: '/leaderboard', icon: Award },
    { label: 'Cấu hình hệ thống', href: '/settings', icon: Settings },
  ];

  return (
    <aside className={`app-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Brand logo */}
      <div className="sidebar-brand">
        <div className="logo-symbol">
          <Sparkles size={16} fill="white" />
        </div>
        <span className="logo-text">G-Scores</span>
      </div>

      {/* Main menu */}
      <ul className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`sidebar-item-link ${isActive ? 'active' : ''}`}
                title={item.label}
              >
                <Icon className="icon" size={20} />
                <span className="sidebar-item-label">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Sidebar Footer collapse trigger */}
      <div className="sidebar-footer">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="sidebar-collapse-btn"
          aria-label={isCollapsed ? 'Mở rộng thanh bên' : 'Thu nhỏ thanh bên'}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}

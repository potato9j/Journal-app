/* 개별 탭 버튼 ─────────────────────────────── */
import React from 'react';
import { Link } from 'react-router-dom';
import styles  from './Tabs.module.css';

export default function TabButton({ label, path, active }) {
  return (
    <Link to={path}
          className={active ? styles.active : styles.inactive}>
      {label}
    </Link>
  );
}

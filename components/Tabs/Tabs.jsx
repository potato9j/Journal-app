/* 상단 네비 + 팝업 트리거 ───────────────────────── */
import React           from 'react';
import { useLocation } from 'react-router-dom';
import TabButton       from './TabButton.jsx';
import styles          from './Tabs.module.css';

/* 탭 정의 (path는 라우터 URL) */
const TABS = [
  { label: '기초 분개',      path: '/basic'     },
  { label: '수정 분개',      path: '/adjust'    },
  { label: '선입선출법',     path: '/fifo'      },
  { label: '후입선출법',     path: '/lifo'      },
  { label: '이동평균법',     path: '/moving'    },
  { label: '총평균법',       path: '/weighted'  },
  { label: '실지재고조사법', path: '/physical'  },
  { label: '재고 감모손실',  path: '/shrinkage' },
  { label: '재고 평가손실',  path: '/valuation' }
];

export default function Tabs({ onPopup }) {
  const { pathname } = useLocation();              // 현재 URL
  return (
    <header className={styles.wrap}>
      <span className={styles.logo}>📒 분개 자동화</span>

      <nav className={styles.nav}>
        {TABS.map(t => (
          <TabButton key={t.path}
                     {...t}
                     active={pathname === t.path}/>
        ))}
      </nav>

      {/* 우측 팝업 트리거 */}
      <div>
        <button className={styles.popupBtn}
                onClick={() => onPopup('about')}>제작</button>
        <button className={styles.popupBtn}
                onClick={() => onPopup('help')}>사용법</button>
        <button className={styles.popupBtn}
                onClick={() => onPopup('support')}>지원</button>
      </div>
    </header>
  );
}

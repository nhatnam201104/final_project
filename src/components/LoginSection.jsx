import { useState, useEffect, useRef } from 'react';
import { initMatrixRain } from '../utils/matrixRain';
import styles from '../styles/LoginSection.module.css';

export default function LoginSection({ onExplode, initAudio }) {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');

  useEffect(() => {
    if (canvasRef.current) {
      return initMatrixRain(canvasRef.current);
    }
  }, []);

  const handleClick = () => {
    initAudio();
    setLoading(true);
    setStatusText('Đang xác thực...');

    const messages = [
      'Đang xác thực...',
      'Kiểm tra thông tin đồ án...',
      'Đang kết nối máy chủ...',
      'Hoàn tất! Đang chuyển trang...',
    ];

    messages.forEach((msg, i) => {
      setTimeout(() => setStatusText(msg), i * 800);
    });

    setTimeout(() => {
      onExplode();
    }, 3200);
  };

  return (
    <div className={styles.loginSection}>
      <canvas ref={canvasRef} className={styles.matrixCanvas} />

      <nav className={styles.navbar}>
        <div className={styles.logo}>🎓</div>
        <span className={styles.systemName}>HỆ THỐNG QUẢN LÝ ĐỒ ÁN — K25</span>
        <div className={styles.navRight}>
          <span className={styles.version}>v3.2.1</span>
        </div>
      </nav>

      <div className={styles.statusBar}>
        <span className={styles.statusDot} />
        <span className={styles.statusText}>Hệ thống hoạt động bình thường</span>
      </div>

      <div className={styles.deadline}>
        ⚠️ Hạn nộp đồ án: <strong>24/04/2025</strong>
      </div>

      <div className={styles.loginCard}>
        <h2 className={styles.title}>Đăng Ký Nộp Đồ Án</h2>
        <p className={styles.subtitle}>Vui lòng đăng nhập để nộp đồ án cuối kỳ</p>

        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <div className={styles.formGroup}>
            <label>Email sinh viên</label>
            <input type="email" placeholder="student@hcmut.edu.vn" autoComplete="off" />
          </div>
          <div className={styles.formGroup}>
            <label>Mật khẩu</label>
            <input type="password" placeholder="••••••••" autoComplete="off" />
          </div>

          {loading ? (
            <div className={styles.loadingArea}>
              <div className={styles.spinner} />
              <p className={styles.loadingText}>{statusText}</p>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} />
              </div>
            </div>
          ) : (
            <button className={styles.submitBtn} type="button" onClick={handleClick}>
              Đăng Ký Nộp Đồ Án
            </button>
          )}
        </form>
      </div>

      <footer className={styles.footer}>
        © 2025 Phòng CNTT — Phiên bản 3.2.1
      </footer>
    </div>
  );
}

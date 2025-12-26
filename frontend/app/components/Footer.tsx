import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-main">
            <p>© 2025 Apex neural. All rights reserved.</p>
          </div>
          <div className="footer-links">
            <Link href="/privacy">Privacy Policy</Link>
            <span className="footer-separator">|</span>
            <Link href="/terms">Terms and Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}


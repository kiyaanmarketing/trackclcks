import Link from 'next/link';

export default function Home() {
  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>TrackClcks Next.js Migration</h1>
        <p style={styles.description}>
          This is the migrated Next.js version of the TrackClcks admin UI and API.
          The original project remains untouched in the parent folder.
        </p>
        <div style={styles.actions}>
          <Link href="/manage-configs" style={styles.button}>
            Manage Site Configs
          </Link>
          <a href="/fast.js" style={styles.link}>
            View Tracking Script
          </a>
        </div>
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(180deg, #eef2ff 0%, #f8fafc 100%)',
    padding: '24px',
  },
  card: {
    maxWidth: '760px',
    width: '100%',
    background: '#ffffff',
    borderRadius: '24px',
    padding: '40px',
    boxShadow: '0 24px 48px rgba(15, 23, 42, 0.12)',
  },
  title: {
    margin: 0,
    fontSize: '2.6rem',
    color: '#111827',
  },
  description: {
    marginTop: '18px',
    lineHeight: 1.75,
    color: '#475569',
  },
  actions: {
    marginTop: '28px',
    display: 'flex',
    gap: '14px',
    flexWrap: 'wrap',
  },
  button: {
    background: '#2563eb',
    color: '#fff',
    padding: '14px 22px',
    borderRadius: '999px',
    textDecoration: 'none',
    fontWeight: 700,
  },
  link: {
    alignSelf: 'center',
    color: '#2563eb',
    textDecoration: 'underline',
    fontWeight: 600,
  },
};

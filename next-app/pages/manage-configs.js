import { useEffect, useMemo, useState } from 'react';

const initialForm = { hostname: '', always: false, cartExtra: false };

export default function ManageConfigs() {
  const [configs, setConfigs] = useState({});
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return Object.entries(configs).filter(([hostname]) => hostname.toLowerCase().includes(query));
  }, [configs, search]);

  useEffect(() => {
    loadConfigs();
  }, []);

  function showToast(message, success = true) {
    setToast({ message, success });
    window.clearTimeout(window.toastTimeout);
    window.toastTimeout = window.setTimeout(() => setToast(null), 2600);
  }

  async function loadConfigs() {
    try {
      const response = await fetch('/api/site-configs');
      const data = await response.json();
      setConfigs(data);
    } catch (error) {
      console.error(error);
      showToast('Unable to load configs', false);
    }
  }

  async function saveConfig(event) {
    event.preventDefault();
    if (!form.hostname.trim()) {
      showToast('Hostname cannot be empty', false);
      return;
    }

    try {
      const response = await fetch('/api/site-configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Save failed');
      showToast(result.message || 'Config saved');
      setForm(initialForm);
      loadConfigs();
    } catch (error) {
      console.error(error);
      showToast(error.message, false);
    }
  }

  async function deleteConfig(hostname) {
    if (!confirm(`Delete config for ${hostname}?`)) return;
    try {
      const response = await fetch(`/api/site-configs/${encodeURIComponent(hostname)}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Delete failed');
      showToast(result.message || 'Config deleted');
      if (form.hostname === hostname) setForm(initialForm);
      loadConfigs();
    } catch (error) {
      console.error(error);
      showToast(error.message, false);
    }
  }

  function editConfig(hostname, config) {
    setForm({ hostname, always: config.always, cartExtra: config.cartExtra });
  }

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Manage Site Configs</h1>
            <p style={styles.subtitle}>Add, update, or delete hostname rules from a modern Next.js admin page.</p>
          </div>
        </div>

        <section style={styles.section}>
          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>Config form</h2>
            <p style={styles.note}>Enter hostname exactly as it appears in the browser URL. Set the tracking behavior for this host.</p>
            <form onSubmit={saveConfig} style={styles.form}>
              <label style={styles.label}>
                Hostname
                <input
                  style={styles.input}
                  value={form.hostname}
                  onChange={(e) => setForm({ ...form, hostname: e.target.value })}
                  placeholder="example.com"
                />
              </label>

              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={form.always}
                    onChange={(e) => setForm({ ...form, always: e.target.checked })}
                  />
                  Always
                </label>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={form.cartExtra}
                    onChange={(e) => setForm({ ...form, cartExtra: e.target.checked })}
                  />
                  Cart Extra
                </label>
              </div>

              <div style={styles.buttonRow}>
                <button type="submit" style={{ ...styles.button, ...styles.primaryButton }}>Save Config</button>
                <button type="button" style={{ ...styles.button, ...styles.secondaryButton }} onClick={() => setForm(initialForm)}>
                  Clear
                </button>
              </div>
            </form>
          </div>

          <div style={styles.panel}>
            <div style={styles.searchBar}>
              <div>
                <h2 style={styles.panelTitle}>Current Configs</h2>
                <p style={styles.note}>Search and edit existing configs instantly.</p>
              </div>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by hostname..."
                style={styles.searchInput}
              />
            </div>
            <div style={styles.list}>
              {filtered.length ? (
                filtered.map(([hostname, config]) => (
                  <article key={hostname} style={styles.configCard}>
                    <div style={styles.configHeader}>
                      <strong>{hostname}</strong>
                      <div style={styles.actionButtons}>
                        <button type="button" style={{ ...styles.button, ...styles.secondaryButton }} onClick={() => editConfig(hostname, config)}>
                          Edit
                        </button>
                        <button type="button" style={{ ...styles.button, ...styles.dangerButton }} onClick={() => deleteConfig(hostname)}>
                          Delete
                        </button>
                      </div>
                    </div>
                    <div style={styles.badges}>
                      <span style={{ ...styles.badge, ...(config.always ? styles.badgeOn : styles.badgeOff) }}>Always: {config.always ? 'On' : 'Off'}</span>
                      <span style={{ ...styles.badge, ...(config.cartExtra ? styles.badgeOn : styles.badgeOff) }}>Cart Extra: {config.cartExtra ? 'On' : 'Off'}</span>
                    </div>
                  </article>
                ))
              ) : (
                <p style={styles.note}>No configs match this search. Add one above.</p>
              )}
            </div>
          </div>
        </section>
      </div>

      {toast ? (
        <div style={{ ...styles.toast, background: toast.success ? '#16a34a' : '#dc2626' }}>{toast.message}</div>
      ) : null}
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    padding: '24px',
    background: 'linear-gradient(180deg, #eef2ff 0%, #f8fafc 100%)',
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: '1160px',
    display: 'grid',
    gap: '24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '24px',
  },
  title: {
    margin: 0,
    fontSize: '2.4rem',
    color: '#0f172a',
  },
  subtitle: {
    marginTop: '12px',
    color: '#64748b',
    lineHeight: 1.8,
  },
  section: {
    display: 'grid',
    gap: '20px',
    gridTemplateColumns: '1.1fr 1.3fr',
  },
  panel: {
    background: '#ffffff',
    borderRadius: '22px',
    padding: '26px',
    boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)',
    border: '1px solid #e2e8f0',
  },
  panelTitle: {
    margin: 0,
    fontSize: '1.1rem',
    color: '#111827',
  },
  note: {
    marginTop: '10px',
    color: '#64748b',
    lineHeight: 1.7,
  },
  form: {
    display: 'grid',
    gap: '18px',
  },
  label: {
    display: 'grid',
    gap: '10px',
    color: '#475569',
    fontWeight: 600,
  },
  input: {
    borderRadius: '14px',
    border: '1px solid #cbd5e1',
    padding: '14px 16px',
    fontSize: '1rem',
    outline: 'none',
  },
  checkboxRow: {
    display: 'flex',
    gap: '18px',
    flexWrap: 'wrap',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontWeight: 700,
    color: '#111827',
  },
  buttonRow: {
    display: 'flex',
    gap: '14px',
    flexWrap: 'wrap',
  },
  button: {
    padding: '12px 20px',
    borderRadius: '999px',
    border: 'none',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  },
  primaryButton: {
    background: '#2563eb',
    color: '#fff',
  },
  secondaryButton: {
    background: '#f8fafc',
    color: '#111827',
  },
  dangerButton: {
    background: '#dc2626',
    color: '#fff',
  },
  searchBar: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  searchInput: {
    minWidth: '220px',
    padding: '12px 16px',
    borderRadius: '14px',
    border: '1px solid #cbd5e1',
  },
  list: {
    display: 'grid',
    gap: '16px',
    marginTop: '18px',
  },
  configCard: {
    borderRadius: '18px',
    border: '1px solid #e2e8f0',
    background: '#ffffff',
    padding: '18px',
    boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)',
  },
  configHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '14px',
    flexWrap: 'wrap',
  },
  actionButtons: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  badges: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  badge: {
    padding: '6px 12px',
    borderRadius: '999px',
    fontWeight: 700,
    fontSize: '0.9rem',
  },
  badgeOn: {
    background: '#d1fae5',
    color: '#166534',
  },
  badgeOff: {
    background: '#fef3c7',
    color: '#78350f',
  },
  toast: {
    position: 'fixed',
    bottom: '22px',
    right: '22px',
    padding: '16px 18px',
    borderRadius: '16px',
    color: '#fff',
    boxShadow: '0 12px 30px rgba(15, 23, 42, 0.18)',
  },
};

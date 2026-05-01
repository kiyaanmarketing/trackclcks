import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '@/styles/manageTrackingUrls.module.css';

export default function ManageTrackingUrls() {
  const [urls, setUrls] = useState([]);
  const [hostname, setHostname] = useState('');
  const [affiliateUrl, setAffiliateUrl] = useState('');
  const [tagUrl, setTagUrl] = useState('');
  const [status, setStatus] = useState('active');
  const [toast, setToast] = useState({ message: '', type: '', visible: false });
  const [editModal, setEditModal] = useState({ visible: false, hostname: '', url: '', tag: '', status: 'active' });

  const apiUrl = '/api/tracking-urls';

  // Toast notification helper
  const showToast = (message, type = 'info', duration = 3000) => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast({ ...toast, visible: false });
    }, duration);
  };

  // Fetch all tracking URLs
  useEffect(() => {
    fetchTrackingUrls();
  }, []);

  const fetchTrackingUrls = async () => {
    try {
      const response = await fetch(`${apiUrl}`);
      if (!response.ok) throw new Error(`Fetch failed with status ${response.status}`);
      const data = await response.json();
      setUrls(data);
    } catch (error) {
      console.error('Fetch Error:', error);
      showToast('Error fetching tracking URLs.', 'error');
    }
  };

  // Add new URL
  const handleAddUrl = async () => {
    if (!hostname || !affiliateUrl) {
      showToast('Please fill all required fields.', 'error');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostname, affiliateUrl, tagUrl, status }),
      });

      const data = await response.json();
      if (response.ok) {
        showToast(data.message, 'success');
        fetchTrackingUrls();
        setHostname('');
        setAffiliateUrl('');
        setTagUrl('');
        setStatus('active');
      } else {
        showToast(data.message, 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Error adding URL.', 'error');
    }
  };

  // Open edit modal
  const openEditModal = (url) => {
    setEditModal({
      visible: true,
      hostname: url.hostname,
      url: url.affiliateUrl,
      tag: url.tagUrl || '',
      status: url.status,
    });
  };

  // Close edit modal
  const closeEditModal = () => {
    setEditModal({ visible: false, hostname: '', url: '', tag: '', status: 'active' });
  };

  // Update URL
  const handleEditSubmit = async () => {
    if (!editModal.url) {
      showToast('Please enter Affiliate URL.', 'error');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hostname: editModal.hostname,
          newUrl: editModal.url,
          newTag: editModal.tag,
          newStatus: editModal.status,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        showToast(data.message, 'success');
        fetchTrackingUrls();
        closeEditModal();
      } else {
        showToast(data.message, 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Error editing URL.', 'error');
    }
  };

  // Delete URL
  const handleDeleteUrl = async (urlHostname) => {
    if (confirm(`Are you sure you want to delete the URL for ${urlHostname}?`)) {
      try {
        const response = await fetch(`${apiUrl}/delete?hostname=${urlHostname}`, {
          method: 'DELETE',
        });

        const data = await response.json();
        if (response.ok) {
          showToast(data.message, 'success');
          fetchTrackingUrls();
        } else {
          showToast(data.message, 'error');
        }
      } catch (error) {
        console.error(error);
        showToast('Error deleting URL.', 'error');
      }
    }
  };

  // Toggle status
  const handleToggleStatus = async (url) => {
    const newStatus = url.status === 'active' ? 'inactive' : 'active';
    try {
      const response = await fetch(`${apiUrl}/toggle-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostname: url.hostname, newStatus }),
      });

      const data = await response.json();
      if (response.ok) {
        showToast(data.message, 'success');
        fetchTrackingUrls();
      } else {
        showToast(data.message, 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Error toggling status.', 'error');
    }
  };

  return (
    <>
      <Head>
        <title>Manage Tracking URLs</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      </Head>

      <div className={styles.pageHeader}>
        <div className={styles.headerContainer}>
          <h1>
            <i className="fas fa-link"></i> Manage Tracking URLs
          </h1>
        </div>
      </div>

      <div className={styles.container}>
        {/* Toast Notification */}
        {toast.visible && (
          <div className={`${styles.toast} ${styles[toast.type]}`}>
            {toast.message}
          </div>
        )}

        {/* Input Section */}
        <div className={styles.inputContainer}>
          <div className={styles.inputWithIcon}>
            <i className="fas fa-globe"></i>
            <input
              type="text"
              className="form-control"
              placeholder="Enter hostname"
              value={hostname}
              onChange={(e) => setHostname(e.target.value)}
            />
          </div>
          <div className={styles.inputWithIcon}>
            <i className="fas fa-link"></i>
            <input
              type="text"
              className="form-control"
              placeholder="Enter URL"
              value={affiliateUrl}
              onChange={(e) => setAffiliateUrl(e.target.value)}
            />
          </div>
          <div className={styles.inputWithIcon}>
            <i className="fas fa-tag"></i>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Tag URL"
              value={tagUrl}
              onChange={(e) => setTagUrl(e.target.value)}
            />
          </div>
          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ flexBasis: '120px', flexGrow: 0 }}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className={styles.submitBtn} onClick={handleAddUrl}>
            <i className="fas fa-plus-circle"></i> Add URL
          </button>
        </div>

        {/* Table Section */}
        <h2 className={styles.sectionTitle}>Tracking URLs</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Hostname</th>
                <th>URL</th>
                <th>Tag URL</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {urls.map((url) => (
                <tr key={url.hostname}>
                  <td>{url.hostname}</td>
                  <td>{url.affiliateUrl}</td>
                  <td>{url.tagUrl || '-'}</td>
                  <td className={styles.actions}>
                    <button
                      className={`${styles.toggle} ${url.status === 'active' ? styles.active : styles.inactive}`}
                      onClick={() => handleToggleStatus(url)}
                    >
                      <i className={`fas ${url.status === 'active' ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                      {url.status.charAt(0).toUpperCase() + url.status.slice(1)}
                    </button>
                    <button className={styles.edit} onClick={() => openEditModal(url)}>
                      <i className="fas fa-edit"></i>Edit
                    </button>
                    <button className={styles.delete} onClick={() => handleDeleteUrl(url.hostname)}>
                      <i className="fas fa-trash"></i>Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editModal.visible && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.close} onClick={closeEditModal}>
              &times;
            </span>
            <h2>Edit Tracking URL</h2>
            <div className={styles.inputWithIcon}>
              <i className="fas fa-globe"></i>
              <input
                type="text"
                className="form-control"
                placeholder="Enter new hostname"
                value={editModal.hostname}
                disabled
                style={{ backgroundColor: '#e9ecef' }}
              />
            </div>
            <div className={styles.inputWithIcon}>
              <i className="fas fa-link"></i>
              <input
                type="text"
                className="form-control"
                placeholder="Enter new URL"
                value={editModal.url}
                onChange={(e) => setEditModal({ ...editModal, url: e.target.value })}
              />
            </div>
            <div className={styles.inputWithIcon}>
              <i className="fas fa-tag"></i>
              <input
                type="text"
                className="form-control"
                placeholder="Enter new Tag URL"
                value={editModal.tag}
                onChange={(e) => setEditModal({ ...editModal, tag: e.target.value })}
              />
            </div>
            <select
              className="form-select"
              value={editModal.status}
              onChange={(e) => setEditModal({ ...editModal, status: e.target.value })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button className={styles.editSubmitBtn} onClick={handleEditSubmit}>
              Submit
            </button>
          </div>
        </div>
      )}
    </>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { FiX, FiCheckCircle, FiUpload } from 'react-icons/fi';
import api from '../../api/axios';
// Global Careers.css imported via page

const ApplyModal = ({ job, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    coverLetter: ''
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Resume must be less than 5MB');
      return;
    }
    if (file && !file.type.includes('pdf') && !file.type.includes('doc')) {
      setError('Please upload PDF or DOC file');
      return;
    }
    setResumeFile(file);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !resumeFile) {
      setError('Please fill all fields and select a resume');
      return;
    }

    setIsSubmitting(true);
    setError('');

    // Create FormData and log to console
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('email', formData.email);
    submitData.append('cover_letter', formData.coverLetter);
    submitData.append('job_id', job.id);
    submitData.append('job_title', job.title);
    submitData.append('resume', resumeFile);

    // Log FormData contents
    console.log('📋 Job Application FormData:');
    for (let [key, value] of submitData.entries()) {
      console.log(`${key}:`, value);
    }
    console.log('🎯 Applying for:', job.title);

    // Mock API for demo (backend endpoint not implemented)
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
    console.log('✅ Mock apply success for:', job.title, formData, resumeFile?.name);

    setIsSubmitting(false);
    setShowSuccess(true);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setFormData({ name: '', email: '', coverLetter: '' });
    setResumeFile(null);
    setError('');
    setShowSuccess(false);
    onClose();
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && !isSubmitting) {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isSubmitting]);

  if (showSuccess) {
    return (
      <div className="apply-backdrop" onClick={handleClose}>
        <div className="apply-modal">
          <div className="modal-success">
            <div className="success-icon">
              <FiCheckCircle size={48} />
            </div>
            <h2>Application Submitted!</h2>
            <p>
              Thank you for applying to <strong>{job.title}</strong>.<br/>
              We'll review your application and contact you soon.
            </p>
            <button className="btn-primary" onClick={handleClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="apply-backdrop" onClick={handleClose}>
      <div className="apply-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Apply for {job.title}</h2>
          <span className="dept-badge" style={{ justifyContent: 'center', marginBottom: '16px' }}>
            {job.department} • {job.type}
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="John Doe"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@example.com"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="coverLetter">Cover Letter (Optional)</label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              rows="4"
              value={formData.coverLetter}
              onChange={handleInputChange}
              placeholder="Tell us why you're perfect for this role..."
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="resume">Resume/CV *</label>
            <input
              id="resume"
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              disabled={isSubmitting}
              style={{ padding: '14px' }}
            />
            {resumeFile && (
              <div style={{ 
                fontSize: '0.9rem', 
                color: 'var(--text-light)', 
                marginTop: '4px' 
              }}>
                ✅ {resumeFile.name}
              </div>
            )}
          </div>

          {error && (
            <div style={{
              padding: '12px 24px',
              background: '#fee',
              color: '#c33',
              borderRadius: '8px',
              margin: '0 24px 20px',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="loading-spinner" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyModal;


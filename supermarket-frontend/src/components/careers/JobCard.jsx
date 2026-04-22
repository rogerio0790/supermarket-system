import React from 'react';
import { FiBriefcase, FiMapPin, FiClock } from 'react-icons/fi';
// Global Careers.css imported via page

const JobCard = ({ job, onApply }) => {
  return (
    <div className="job-card">
      <div className="job-header">
        <div className="dept-badge">
          <FiBriefcase size={16} />
          {job.department}
        </div>
        <h3 className="job-title">{job.title}</h3>
        <div className="job-meta">
          <span>
            <FiClock size={14} />
            {job.type}
          </span>
        </div>
      </div>
      
      <div className="job-body">
        <p className="job-desc">{job.description}</p>
        
        <button 
          className="apply-btn"
          onClick={() => onApply(job)}
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobCard;


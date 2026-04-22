import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import JobCard from '../components/careers/JobCard';
import ApplyModal from '../components/careers/ApplyModal';
import './Careers.css';

const dummyJobs = [
  {
    id: 1,
    title: "Logistics Manager",
    department: "Logistics",
    type: "Full-time",
    description: "Lead our supply chain operations, optimize delivery routes, manage warehouse teams and ensure seamless inventory flow for Rwanda's premium market leader. Experience with cold chain logistics preferred."
  },
  {
    id: 2,
    title: "Warehouse Supervisor",
    department: "Logistics",
    type: "Full-time",
    description: "Oversee daily warehouse activities, manage inventory accuracy, train staff on safety protocols, and coordinate with drivers for timely deliveries. SAP experience a plus."
  },
  {
    id: 3,
    title: "Delivery Driver",
    department: "Logistics",
    type: "Part-time",
    description: "Safely deliver premium groceries across Kigali, maintain vehicle logs, provide excellent customer service, and ensure packages arrive fresh and on time."
  },
  {
    id: 4,
    title: "Retail Operations Manager",
    department: "Retail",
    type: "Full-time",
    description: "Manage daily store operations, optimize product layouts, drive sales through visual merchandising, and lead retail team to deliver exceptional customer experiences."
  },
  {
    id: 5,
    title: "Store Associate",
    department: "Retail",
    type: "Full-time",
    description: "Greet customers, maintain shelves, process transactions accurately, and help create an inviting premium shopping environment. Great for career starters."
  },
  {
    id: 6,
    title: "Visual Merchandiser",
    department: "Retail",
    type: "Full-time",
    description: "Create stunning product displays, plan seasonal layouts, collaborate with buyers on promotions, and enhance the premium shopping experience through visual storytelling."
  },
  {
    id: 7,
    title: "Operations Director",
    department: "Management",
    type: "Full-time",
    description: "Strategic leadership role overseeing all operations, P&L responsibility, team development, and scaling Rukara Premium Market across Rwanda."
  },
  {
    id: 8,
    title: "HR Manager",
    department: "Management",
    type: "Full-time",
    description: "Build high-performing teams, develop talent pipelines, manage employee relations, and create a culture of excellence in our premium retail environment."
  }
];

const Careers = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Real API integration
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get('careers/positions/');
        setJobs(response.data);
        setFilteredJobs(response.data);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
        // Fallback to dummy
        setJobs(dummyJobs);
        setFilteredJobs(dummyJobs);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleFilterChange = (department) => {
    setSelectedDepartment(department);
    if (department === 'All') {
      setFilteredJobs(jobs);
    } else {
      setFilteredJobs(jobs.filter(job => job.department === department));
    }
  };

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  const departments = ['All', ...new Set(dummyJobs.map(job => job.department))];

  if (loading) {
    return (
      <div className="cta-section">
        <div className="section-title animate-on-scroll">Loading careers...</div>
      </div>
    );
  }

  return (
    <>
      <section className="careers-hero animate-on-scroll">
        <div className="careers-hero-content">
          <h1>Join the Premium Market Revolution</h1>
          <p>
            Grow your career with Rukara Premium Market. 
            We're Rwanda's leading premium supermarket seeking passionate talent 
            in logistics, retail, and management.
          </p>
        </div>
      </section>

      <section className="cta-section">
        <h2 className="section-title animate-on-scroll">Open Positions</h2>
        
        <div className="filters animate-on-scroll">
          {departments.map((dept) => (
            <button
              key={dept}
              className={`filter-btn ${selectedDepartment === dept ? 'active' : ''}`}
              onClick={() => handleFilterChange(dept)}
            >
              {dept}
            </button>
          ))}
        </div>

        {filteredJobs.length === 0 ? (
          <div className="no-jobs animate-on-scroll">
            <h3>No positions available</h3>
            <p>Check back soon for new opportunities in {selectedDepartment}</p>
          </div>
        ) : (
          <div className="jobs-grid animate-on-scroll">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApply={() => handleApplyClick(job)}
              />
            ))}
          </div>
        )}
      </section>

      {showApplyModal && selectedJob && (
        <ApplyModal
          job={selectedJob}
          onClose={() => setShowApplyModal(false)}
        />
      )}
    </>
  );
};

export default Careers;


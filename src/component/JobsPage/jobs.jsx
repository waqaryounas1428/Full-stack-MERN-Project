import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import api from "../../services/api";
import toast from 'react-hot-toast';
import "./jobs.css";


export const Jobs = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { socket } = useSocket();

    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [jobTypeFilter, setJobTypeFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [experienceFilter, setExperienceFilter] = useState("");
    const [minSalaryFilter, setMinSalaryFilter] = useState("");
    const [maxSalaryFilter, setMaxSalaryFilter] = useState("");
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [likedJobs, setLikedJobs] = useState(new Set());
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalJobs, setTotalJobs] = useState(0);
    const jobsPerPage = 10;


    

    // Fetch jobs and user's applications on mount or when `user` changes
    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                setLoading(true);
                
                // Determine which API endpoint to use based on filters
                const hasActiveFilters = searchQuery || locationFilter || jobTypeFilter || categoryFilter || experienceFilter || minSalaryFilter || maxSalaryFilter;
                
                let apiUrl = '/jobs';
                let params = new URLSearchParams();
                
                if (hasActiveFilters) {
                    apiUrl = '/jobs/search';
                    // Add all filter parameters
                    if (searchQuery) params.append('query', searchQuery);
                    if (locationFilter) params.append('location', locationFilter);
                    if (jobTypeFilter) params.append('type', jobTypeFilter);
                    if (categoryFilter) params.append('category', categoryFilter);
                    if (experienceFilter) params.append('experience', experienceFilter);
                    if (minSalaryFilter) params.append('minSalary', minSalaryFilter);
                    if (maxSalaryFilter) params.append('maxSalary', maxSalaryFilter);
                }
                
                // Add pagination parameters
                params.append('page', currentPage);
                params.append('limit', jobsPerPage);
                
                const fullUrl = `${apiUrl}?${params.toString()}`;
                console.log(`🔄 Fetching jobs from ${apiUrl}... (Page ${currentPage})`);
                console.log('🔍 Search params:', params.toString());

                // API call
                const response = await api.get(fullUrl);

                if (!mounted) return;

                console.log('✅ Full API Response:', response);
                console.log('✅ Response Data:', response.data);

                let fetchedJobs = [];
                
                // Handle different response formats
                if (response.data && Array.isArray(response.data.jobs)) {
                    fetchedJobs = response.data.jobs;
                    
                    // Extract pagination info
                    if (response.data.pagination) {
                        setTotalPages(response.data.pagination.totalPages);
                        setTotalJobs(response.data.pagination.totalJobs);
                        setCurrentPage(response.data.pagination.currentPage);
                    }
                } else if (response.data && Array.isArray(response.data)) {
                    fetchedJobs = response.data;
                } else if (Array.isArray(response)) {
                    fetchedJobs = response;
                } else {
                    console.warn('⚠️ Unexpected response format:', response);
                    fetchedJobs = [];
                }

                console.log(`📊 Total jobs fetched: ${fetchedJobs.length}`);
                console.log(`📄 Page ${currentPage} of ${totalPages}`);
                console.log('📋 Jobs array:', fetchedJobs);

                if (fetchedJobs.length === 0) {
                    console.warn('⚠️ No jobs found! Try adjusting your search filters.');
                }

                setJobs(fetchedJobs);
                // Auto-select first job
                if (fetchedJobs.length > 0) {
                    setSelectedJob(fetchedJobs[0]);
                }
                setLoading(false);
                setError(null);
            } catch (error) {
                if (!mounted) return;
                console.error('❌ Error fetching jobs:', error);
                console.error('❌ Error response:', error.response?.data);
                console.error('❌ Error status:', error.response?.status);
                console.error('❌ Error message:', error.message);
                
                // Show more helpful error message
                const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch jobs';
                setError(errorMsg);
                setLoading(false);
                setJobs([]);
                
                toast.error(`Failed to load jobs: ${errorMsg}`, {
                    duration: 5000,
                });
            }

            if (user && user.token) {
                try {
                    const resp = await api.get('/applications/my');
                    if (!mounted) return;
                    setApplications(resp.data.applications || []);
                } catch (err) {
                    if (!mounted) return;
                    console.error('Error fetching applications:', err);
                }
            }
        };

        load();

        return () => { mounted = false; };
    }, [user, currentPage, searchQuery, locationFilter, jobTypeFilter, categoryFilter, experienceFilter, minSalaryFilter, maxSalaryFilter]); // Added all filter dependencies

    // Real-time Socket.io listeners
    useEffect(() => {
        if (!socket) return;

        // Listen for new jobs
        socket.on('new_job', (newJob) => {
            console.log('🎉 Real-time: New job added:', newJob.title);
            setJobs(prev => [newJob, ...prev]);
            toast.success(`✨ New job posted: ${newJob.title}`);
        });

        // Listen for deleted jobs
        socket.on('job_removed', (jobId) => {
            console.log('🗑️ Real-time: Job removed:', jobId);
            setJobs(prev => prev.filter(j => j._id !== jobId));
            if (selectedJob?._id === jobId) {
                setSelectedJob(null);
            }
            toast.success('Job has been removed');
        });

        // Listen for updated jobs
        socket.on('job_changed', (updatedJob) => {
            console.log('✏️ Real-time: Job updated:', updatedJob.title);
            setJobs(prev => prev.map(j => j._id === updatedJob._id ? updatedJob : j));
            if (selectedJob?._id === updatedJob._id) {
                setSelectedJob(updatedJob);
            }
            toast.success(`Job updated: ${updatedJob.title}`);
        });

        // Listen for new applications
        socket.on('new_application', (data) => {
            console.log('📝 Real-time: New application:', data);
            if (user?.role === 'admin') {
                toast.success(`📝 New application for ${data.company}`);
            }
        });

        return () => {
            socket.off('new_job');
            socket.off('job_removed');
            socket.off('job_changed');
            socket.off('new_application');
        };
    }, [socket, selectedJob, user]);


    
    // Get filtered jobs (for initial display before backend search)
    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.description?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesLocation = locationFilter === "" ||
            job.location?.toLowerCase().includes(locationFilter.toLowerCase());

        return matchesSearch && matchesLocation;
    });

    // Get already applied job IDs for this user
    const appliedJobIds = applications.map((a) => a.jobId);

    const handleApply = (job) => {
        if (!user) {
            toast.error('⚠️ Please login to apply for jobs', {
                duration: 4000,
            });
            navigate("/login");
            return;
        }

        const jobId = job._id;
        if (appliedJobIds.includes(jobId)) {
            toast.success('✅ You have already applied for this job', {
                duration: 3000,
            });
            return;
        }

        toast.success('🎉 Redirecting to application form...', {
            duration: 2000,
        });
        navigate("/apply", { state: { job } });
    };

    const handleJobClick = (job) => {
        setSelectedJob(job);
    };

    // Toggle like/unlike functionality
    const handleToggleLike = (jobId, e) => {
        e.stopPropagation(); // Prevent job selection when clicking like button
        
        if (!user) {
            toast.error('⚠️ Please login to like jobs', {
                duration: 3000,
            });
            return;
        }

        const newLikedJobs = new Set(likedJobs);
        if (newLikedJobs.has(jobId)) {
            newLikedJobs.delete(jobId);
            toast.success('💔 Removed from favorites', {
                duration: 2000,
            });
        } else {
            newLikedJobs.add(jobId);
            toast.success('❤️ Added to favorites', {
                duration: 2000,
            });
        }
        setLikedJobs(newLikedJobs);
    };

    if (loading) {
        return (
            <div className="jobs-section">
                <div style={{
                    background: 'white',
                    padding: '10px',
                    borderRadius: '12px',
                    marginBottom: '25px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
                        <div className="skeleton" style={{ width: '150px', height: '40px', borderRadius: '12px' }}></div>
                        <div style={{ display: 'flex', gap: '12px', flex: 1, maxWidth: '700px' }}>
                            <div className="skeleton" style={{ flex: 1, height: '42px', borderRadius: '8px' }}></div>
                            <div className="skeleton" style={{ width: '180px', height: '42px', borderRadius: '8px' }}></div>
                        </div>
                    </div>
                </div>

                <div className="jobs-container">
                    {/* LEFT PANEL SKELETON */}
                    <div className="jobs-list">
                        <div className="skeleton" style={{ width: '60%', height: '30px', marginBottom: '20px', borderRadius: '8px' }}></div>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} style={{
                                background: '#ffffff',
                                padding: '16px',
                                borderRadius: '12px',
                                border: '2px solid #e5e7eb',
                                marginBottom: '12px'
                            }}>
                                <div className="skeleton" style={{ width: '70%', height: '20px', marginBottom: '10px', borderRadius: '6px' }}></div>
                                <div className="skeleton" style={{ width: '50%', height: '16px', borderRadius: '6px' }}></div>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT PANEL SKELETON */}
                    <div className="job-details">
                        <div className="skeleton" style={{ width: '60%', height: '32px', marginBottom: '12px', borderRadius: '8px' }}></div>
                        <div className="skeleton" style={{ width: '40%', height: '20px', marginBottom: '24px', borderRadius: '6px' }}></div>
                        
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} style={{ marginBottom: '16px' }}>
                                <div className="skeleton" style={{ width: '100%', height: '16px', marginBottom: '8px', borderRadius: '6px' }}></div>
                            </div>
                        ))}
                        
                        <div className="skeleton" style={{ width: '100%', height: '50px', marginTop: '24px', borderRadius: '10px' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="jobs-section">
                <div className="no-jobs">
                    <p>❌ Error loading jobs</p>
                    <p className="no-jobs-sub">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '20px',
                            padding: '10px 20px',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        🔄 Retry
                    </button>
                </div>
            </div>
        );
    }

    console.log('🎨 Rendering jobs page');
    console.log('🎨 Jobs state:', jobs);
    console.log('🎨 Jobs length:', jobs.length);
    console.log('🎨 Jobs is array?', Array.isArray(jobs));

    const alreadyApplied = selectedJob && appliedJobIds.includes(selectedJob._id);

    return (
        <div className="jobs-section">
            {/* Enhanced Search Section */}
            <div style={{
                background: 'white',
                padding: '16px',
                borderRadius: '12px',
                marginBottom: '25px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* MAIN SEARCH ROW */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                        {/* SEARCH BAR */}
                        <div style={{
                            display: 'flex',
                            gap: '12px',
                            flex: 1,
                            minWidth: '300px',
                            flexWrap: 'nowrap',
                            alignItems: 'center'
                        }}>
                            <input
                                type="text"
                                placeholder="🔍 Search job title, company, or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    flex: 1,
                                    minWidth: '200px',
                                    padding: '12px 16px',
                                    fontSize: '14px',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '8px',
                                    outline: 'none'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                            />

                            <select
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                                style={{
                                    width: '180px',
                                    padding: '12px 16px',
                                    fontSize: '14px',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '8px',
                                    background: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="">📍 All Locations</option>
                                <option value="Lahore">Lahore</option>
                                <option value="Karachi">Karachi</option>
                                <option value="Islamabad">Islamabad</option>
                                <option value="Remote">Remote</option>
                            </select>

                            <button
                                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                style={{
                                    padding: '12px 20px',
                                    fontSize: '14px',
                                    border: 'none',
                                    borderRadius: '8px',
                                    background: '#3b82f6',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseOver={(e) => e.target.style.background = '#2563eb'}
                                onMouseOut={(e) => e.target.style.background = '#3b82f6'}
                            >
                                {showAdvancedFilters ? '▲ Advanced' : '▼ Advanced'}
                            </button>

                            {(searchQuery || locationFilter || jobTypeFilter || categoryFilter || experienceFilter || minSalaryFilter || maxSalaryFilter) && (
                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setLocationFilter("");
                                        setJobTypeFilter("");
                                        setCategoryFilter("");
                                        setExperienceFilter("");
                                        setMinSalaryFilter("");
                                        setMaxSalaryFilter("");
                                    }}
                                    style={{
                                        padding: '12px 20px',
                                        fontSize: '14px',
                                        border: 'none',
                                        borderRadius: '8px',
                                        background: '#ef4444',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseOver={(e) => e.target.style.background = '#dc2626'}
                                    onMouseOut={(e) => e.target.style.background = '#ef4444'}
                                >
                                    ✕ Clear All
                                </button>
                            )}
                        </div>

                        {/* ADMIN BUTTON */}
                        {user?.role === "admin" && (
                            <button 
                                className="add-job-btn" 
                                onClick={() => navigate("/admin")}
                                style={{
                                    padding: '12px 24px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    background: 'linear-gradient(135deg, #1dbf73, #16a34a)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    whiteSpace: 'nowrap'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 8px 16px rgba(29, 191, 115, 0.3)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            >
                                ➕ Go to Admin Dashboard
                            </button>
                        )}
                    </div>

                    {/* ADVANCED FILTERS (Collapsible) */}
                    {showAdvancedFilters && (
                        <div style={{
                            padding: '20px',
                            background: '#f9fafb',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                            animation: 'fadeIn 0.3s ease'
                        }}>
                            <h4 style={{ marginBottom: '16px', color: '#374151', fontSize: '16px', fontWeight: '600' }}>
                                🔍 Advanced Filters
                            </h4>
                            
                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                {/* Job Type Filter */}
                                <div style={{ flex: '1', minWidth: '180px' }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#6b7280' }}>
                                        💼 Job Type
                                    </label>
                                    <select
                                        value={jobTypeFilter}
                                        onChange={(e) => setJobTypeFilter(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            fontSize: '14px',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            background: 'white',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value="">All Types</option>
                                        <option value="full-time">Full-time</option>
                                        <option value="part-time">Part-time</option>
                                        <option value="contract">Contract</option>
                                        <option value="internship">Internship</option>
                                        <option value="freelance">Freelance</option>
                                    </select>
                                </div>

                                {/* Category Filter */}
                                <div style={{ flex: '1', minWidth: '180px' }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#6b7280' }}>
                                        🏷️ Category
                                    </label>
                                    <select
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            fontSize: '14px',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            background: 'white',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value="">All Categories</option>
                                        <option value="IT">IT & Software</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Healthcare">Healthcare</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="Education">Education</option>
                                        <option value="Engineering">Engineering</option>
                                        <option value="Sales">Sales</option>
                                        <option value="Design">Design</option>
                                    </select>
                                </div>

                                {/* Experience Filter */}
                                <div style={{ flex: '1', minWidth: '180px' }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#6b7280' }}>
                                        📚 Experience
                                    </label>
                                    <select
                                        value={experienceFilter}
                                        onChange={(e) => setExperienceFilter(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            fontSize: '14px',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            background: 'white',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value="">Any Experience</option>
                                        <option value="0-1">0-1 Years</option>
                                        <option value="1-2">1-2 Years</option>
                                        <option value="2-3">2-3 Years</option>
                                        <option value="3-4">3-4 Years</option>
                                        <option value="4-5">4-5 Years</option>
                                        <option value="5+">5+ Years</option>
                                    </select>
                                </div>

                                {/* Salary Range Filters */}
                                <div style={{ flex: '1', minWidth: '180px' }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#6b7280' }}>
                                        💰 Min Salary (PKR)
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={minSalaryFilter}
                                        onChange={(e) => setMinSalaryFilter(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            fontSize: '14px',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '8px'
                                        }}
                                    />
                                </div>

                                <div style={{ flex: '1', minWidth: '180px' }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#6b7280' }}>
                                        💰 Max Salary (PKR)
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={maxSalaryFilter}
                                        onChange={(e) => setMaxSalaryFilter(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            fontSize: '14px',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '8px'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Active Filters Display */}
                            <div style={{ marginTop: '16px', padding: '12px', background: '#f0f9ff', borderRadius: '6px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '13px', color: '#0c4a6e', fontWeight: '500' }}>📊 Active Filters:</span>
                                    {locationFilter && (
                                        <span style={{ 
                                            background: '#dbeafe', 
                                            padding: '4px 12px', 
                                            borderRadius: '16px', 
                                            fontSize: '13px', 
                                            color: '#1e40af'
                                        }}>
                                            📍 {locationFilter}
                                        </span>
                                    )}
                                    {jobTypeFilter && (
                                        <span style={{ 
                                            background: '#f0f9ff', 
                                            padding: '4px 12px', 
                                            borderRadius: '16px', 
                                            fontSize: '13px', 
                                            color: '#0c4a6e'
                                        }}>
                                            💼 {jobTypeFilter}
                                        </span>
                                    )}
                                    {categoryFilter && (
                                        <span style={{ 
                                            background: '#ecfdf5', 
                                            padding: '4px 12px', 
                                            borderRadius: '16px', 
                                            fontSize: '13px', 
                                            color: '#065f46'
                                        }}>
                                            🏷️ {categoryFilter}
                                        </span>
                                    )}
                                    {experienceFilter && (
                                        <span style={{ 
                                            background: '#fef3c7', 
                                            padding: '4px 12px', 
                                            borderRadius: '16px', 
                                            fontSize: '13px', 
                                            color: '#92400e'
                                        }}>
                                            📚 {experienceFilter} years
                                        </span>
                                    )}
                                    {(minSalaryFilter || maxSalaryFilter) && (
                                        <span style={{ 
                                            background: '#fef2f2', 
                                            padding: '4px 12px', 
                                            borderRadius: '16px', 
                                            fontSize: '13px', 
                                            color: '#991b1b'
                                        }}>
                                            💰 {minSalaryFilter || '0'} - {maxSalaryFilter || '∞'} PKR
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Search Results Info */}
            <div className="search-results-info">
                <span>🔍 Found <strong>{totalJobs}</strong> jobs</span>
                {totalPages > 1 && (
                    <span style={{ marginLeft: 'auto' }}>
                        📄 Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                    </span>
                )}
            </div>

            {filteredJobs.length === 0 ? (
                <div className="no-jobs">
                    <p>📭 No jobs found matching your search.</p>
                    <p className="no-jobs-sub">Try adjusting your filters!</p>
                </div>
            ) : (
                <>
                    <div className="jobs-container">
                        {/* LEFT PANEL - JOB CARDS LIST */}
                        <div className="jobs-list">
                            <h3 style={{
                                fontSize: '20px',
                                fontWeight: '700',
                                color: '#1f2937',
                                marginBottom: '20px',
                                paddingBottom: '15px',
                                borderBottom: '2px solid #e5e7eb'
                            }}>
                                💼 Jobs For You ({filteredJobs.length})
                            </h3>
                            {filteredJobs.map((job) => (
                                <div
                                    className={`job-card-mini ${selectedJob?._id === job._id ? 'active' : ''}`}
                                    key={job._id}
                                    onClick={() => handleJobClick(job)}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ flex: 1 }}>
                                            <h3>{job.title || 'No Title'}</h3>
                                            <p className="company">🏢 {job.company || 'No Company'} • 📍 {job.location || 'N/A'}</p>
                                        </div>
                                        <button
                                            className="like-btn"
                                            onClick={(e) => handleToggleLike(job._id, e)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                fontSize: '20px',
                                                cursor: 'pointer',
                                                padding: '5px',
                                                borderRadius: '50%',
                                                transition: 'all 0.3s ease',
                                                marginLeft: '10px'
                                            }}
                                            onMouseOver={(e) => e.target.style.transform = 'scale(1.2)'}
                                            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                        >
                                            {likedJobs.has(job._id) ? '❤️' : '🤍'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* RIGHT PANEL - JOB DETAILS */}
                        {selectedJob && (
                            <div className="job-details">
                                <div className="job-details-header">
                                    <h2>{selectedJob.title}</h2>
                                    <p className="company">{selectedJob.company}</p>
                                </div>

                                <div className="job-details-body">
                                    <div className="detail-row">
                                        <span className="label">📍 Location:</span>
                                        <span className="value">{selectedJob.location}</span>
                                    </div>

                                    {selectedJob.salary && (
                                        <div className="detail-row">
                                            <span className="label">💰 Salary:</span>
                                            <span className="value">{selectedJob.salary}</span>
                                        </div>
                                    )}

                                    {selectedJob.experience && (
                                        <div className="detail-row">
                                            <span className="label">📚 Experience:</span>
                                            <span className="value">{selectedJob.experience} years</span>
                                        </div>
                                    )}

                                    {selectedJob.type && (
                                        <div className="detail-row">
                                            <span className="label">💼 Job Type:</span>
                                            <span className="value">{selectedJob.type}</span>
                                        </div>
                                    )}

                                    {selectedJob.category && (
                                        <div className="detail-row">
                                            <span className="label">🏷️ Category:</span>
                                            <span className="value">{selectedJob.category}</span>
                                        </div>
                                    )}

                                    {selectedJob.skills && selectedJob.skills.length > 0 && (
                                        <div className="detail-row">
                                            <span className="label">🛠️ Skills:</span>
                                            <span className="value">{Array.isArray(selectedJob.skills) ? selectedJob.skills.join(', ') : selectedJob.skills}</span>
                                        </div>
                                    )}

                                    {selectedJob.deadline && (
                                        <div className="detail-row">
                                            <span className="label">⏰ Deadline:</span>
                                            <span className="value">{new Date(selectedJob.deadline).toLocaleDateString()}</span>
                                        </div>
                                    )}

                                    <div className="detail-section">
                                        <h3>📋 Job Description</h3>
                                        <div
                                            className="description"
                                            dangerouslySetInnerHTML={{
                                                __html: (selectedJob.description || 'No description')
                                                    .replace(/\n\n/g, '</p><p>')
                                                    .replace(/\n/g, '<br/>')
                                                    .replace(/🚀 Key Responsibilities/g, '<h4>🚀 Key Responsibilities</h4>')
                                                    .replace(/🎯 Requirements/g, '<h4>🎯 Requirements</h4>')
                                                    .replace(/⭐ What We Offer/g, '<h4>⭐ What We Offer</h4>')
                                                    .replace(/Key Responsibilities/g, '<h4>Key Responsibilities</h4>')
                                                    .replace(/Requirements/g, '<h4>Requirements</h4>')
                                                    .replace(/What We Offer/g, '<h4>What We Offer</h4>')
                                            }}
                                        />
                                    </div>

                                    {selectedJob.requirements && (
                                        <div className="detail-section">
                                            <h3>🎯 Additional Requirements</h3>
                                            <p className="requirements-text">{selectedJob.requirements}</p>
                                        </div>
                                    )}

                                    {selectedJob.benefits && (
                                        <div className="detail-section">
                                            <h3>⭐ Benefits</h3>
                                            <p className="benefits-text">{selectedJob.benefits}</p>
                                        </div>
                                    )}

                                    {/* ADMIN CRUD BUTTONS */}
                                    {user?.role === "admin" ? (
                                        <div className="admin-job-actions">
                                            <button className="edit-btn" onClick={() => navigate("/admin")}>
                                                ✏️ Edit Job
                                            </button>
                                            <button className="delete-btn" onClick={() => navigate("/admin")}>
                                                🗑️ Delete Job
                                            </button>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                            <button
                                                className="like-btn-large"
                                                onClick={(e) => handleToggleLike(selectedJob._id, e)}
                                                style={{
                                                    background: likedJobs.has(selectedJob._id) ? '#fef2f2' : '#f9fafb',
                                                    border: likedJobs.has(selectedJob._id) ? '2px solid #ef4444' : '2px solid #e5e7eb',
                                                    borderRadius: '12px',
                                                    padding: '12px 20px',
                                                    fontSize: '24px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    fontWeight: '600'
                                                }}
                                                onMouseOver={(e) => {
                                                    e.target.style.transform = 'scale(1.05)';
                                                    e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.2)';
                                                }}
                                                onMouseOut={(e) => {
                                                    e.target.style.transform = 'scale(1)';
                                                    e.target.style.boxShadow = 'none';
                                                }}
                                            >
                                                {likedJobs.has(selectedJob._id) ? '❤️' : '🤍'}
                                            </button>
                                            {alreadyApplied ? (
                                                <button className="applied-btn" disabled style={{ flex: 1 }}>✅ Already Applied</button>
                                            ) : (
                                                <button className="apply-btn" onClick={() => handleApply(selectedJob)} style={{ flex: 1 }}>
                                                    Apply Now
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* PAGINATION CONTROLS */}
                    {totalPages > 1 && (
                        <div className="pagination-container">
                            <button
                                className="pagination-btn"
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                            >
                                ← Previous
                            </button>

                            <div className="pagination-info">
                                <span className="page-numbers">
                                    Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                                </span>
                                <span className="total-jobs">
                                    ({totalJobs} total jobs)
                                </span>
                            </div>

                            <button
                                className="pagination-btn"
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
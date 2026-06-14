import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./jobs.css";

export const JobsSimple = () => {
    const navigate = useNavigate();
    
    const [jobs, setJobs] = useState([
        {
            _id: "1",
            title: "Data Scientist",
            company: "DataCorp",
            location: "Remote",
            salary: "80,000 - 120,000",
            experience: "4-5",
            type: "full-time",
            category: "Data Science",
            skills: ["Python", "SQL", "Machine Learning", "Data Visualization", "Power BI", "Tableau"],
            description: "We are looking for a highly skilled Data Scientist to join our team. The ideal candidate will analyze complex datasets, build predictive models, and transform data into actionable business insights."
        },
        {
            _id: "2",
            title: "Backend Developer",
            company: "CodeBase",
            location: "Karachi",
            salary: "60,000 - 90,000",
            experience: "3-4",
            type: "full-time",
            category: "IT",
            skills: ["Node.js", "Express", "MongoDB"],
            description: "Develop secure and scalable backend services using Node.js, Express, and databases while creating RESTful APIs and handling server-side logic."
        },
        {
            _id: "3",
            title: "Full Stack Developer",
            company: "DevHub",
            location: "Islamabad",
            salary: "70,000 - 100,000",
            experience: "4-5",
            type: "full-time",
            category: "IT",
            skills: ["React", "Node.js", "MongoDB", "Express"],
            description: "Work on both frontend and backend systems, building complete web applications using modern technologies and ensuring smooth integration between client and server."
        },
        {
            _id: "4",
            title: "MERN Stack Developer",
            company: "StackTech",
            location: "Remote",
            salary: "65,000 - 95,000",
            experience: "2-3",
            type: "full-time",
            category: "IT",
            skills: ["MongoDB", "Express", "React", "Node.js"],
            description: "Develop full-stack applications using MongoDB, Express, React, and Node.js with a focus on performance, scalability, and clean code practices."
        },
        {
            _id: "5",
            title: "Web Developer",
            company: "WebWorks",
            location: "Lahore",
            salary: "40,000 - 70,000",
            experience: "1-2",
            type: "full-time",
            category: "IT",
            skills: ["HTML", "CSS", "JavaScript", "WordPress"],
            description: "Create responsive and visually appealing websites using modern web technologies while ensuring usability and performance optimization."
        },
        {
            _id: "6",
            title: "Software Engineer",
            company: "SoftSolutions",
            location: "Karachi",
            salary: "75,000 - 110,000",
            experience: "5+",
            type: "full-time",
            category: "IT",
            skills: ["Java", "Python", "System Design", "Algorithms"],
            description: "Design and develop scalable software systems, implement efficient algorithms, and ensure high-quality code and performance optimization."
        },
        {
            _id: "7",
            title: "Software Developer",
            company: "InnovateX",
            location: "Islamabad",
            salary: "55,000 - 85,000",
            experience: "3-4",
            type: "full-time",
            category: "IT",
            skills: ["C++", "Python", "Git", "APIs"],
            description: "Write clean, maintainable, and efficient code for various applications while collaborating with teams to deliver high-quality software solutions."
        },
        {
            _id: "8",
            title: "Application Developer",
            company: "Appify",
            location: "Remote",
            salary: "50,000 - 80,000",
            experience: "2-3",
            type: "full-time",
            category: "IT",
            skills: ["React Native", "Flutter", "Mobile Development"],
            description: "Develop mobile and web applications with modern frameworks, focusing on performance, usability, and scalability."
        },
        {
            _id: "9",
            title: "AI Engineer",
            company: "AI Labs",
            location: "Lahore",
            salary: "80,000 - 120,000",
            experience: "4-5",
            type: "full-time",
            category: "AI/ML",
            skills: ["Python", "TensorFlow", "Machine Learning", "Deep Learning"],
            description: "Build and deploy AI models, work on automation systems, and implement intelligent solutions for real-world problems."
        },
        {
            _id: "10",
            title: "Machine Learning Engineer",
            company: "ML Tech",
            location: "Karachi",
            salary: "75,000 - 110,000",
            experience: "3-4",
            type: "full-time",
            category: "AI/ML",
            skills: ["Python", "scikit-learn", "PyTorch", "Data Science"],
            description: "Develop and train machine learning models, optimize algorithms, and deploy predictive systems for business solutions."
        },
        {
            _id: "11",
            title: "Data Analyst",
            company: "InsightX",
            location: "Remote",
            salary: "50,000 - 80,000",
            experience: "1-2",
            type: "full-time",
            category: "Data Science",
            skills: ["Excel", "SQL", "Tableau", "Power BI"],
            description: "Interpret data, generate reports, and provide actionable insights using tools like Excel, SQL, and visualization platforms."
        },
        {
            _id: "12",
            title: "NLP Engineer",
            company: "LangTech",
            location: "Lahore",
            salary: "75,000 - 110,000",
            experience: "4-5",
            type: "full-time",
            category: "AI/ML",
            skills: ["Python", "NLP", "spaCy", "NLTK"],
            description: "Develop natural language processing systems for chatbots, text analysis, and language-based AI applications."
        },
        {
            _id: "13",
            title: "DevOps Engineer",
            company: "CloudOps",
            location: "Karachi",
            salary: "70,000 - 100,000",
            experience: "3-4",
            type: "full-time",
            category: "DevOps",
            skills: ["Docker", "Kubernetes", "CI/CD", "AWS"],
            description: "Manage CI/CD pipelines, automate deployments, and ensure system reliability using DevOps tools and cloud platforms."
        },
        {
            _id: "14",
            title: "Cloud Engineer",
            company: "SkyNet",
            location: "Remote",
            salary: "65,000 - 95,000",
            experience: "2-3",
            type: "full-time",
            category: "Cloud",
            skills: ["AWS", "Azure", "Google Cloud", "Terraform"],
            description: "Design and manage cloud infrastructure using AWS, Azure, or Google Cloud while ensuring scalability and security."
        },
        {
            _id: "15",
            title: "Site Reliability Engineer",
            company: "RelianceTech",
            location: "Islamabad",
            salary: "75,000 - 110,000",
            experience: "5+",
            type: "full-time",
            category: "DevOps",
            skills: ["Linux", "Monitoring", "Automation", "Kubernetes"],
            description: "Ensure system reliability, monitor performance, and implement solutions to maintain uptime and scalability."
        },
        {
            _id: "16",
            title: "Cyber Security Analyst",
            company: "SecureNet",
            location: "Lahore",
            salary: "70,000 - 100,000",
            experience: "3-4",
            type: "full-time",
            category: "Security",
            skills: ["Network Security", "Penetration Testing", "SIEM"],
            description: "Monitor security systems, identify vulnerabilities, and protect networks and data from cyber threats."
        },
        {
            _id: "17",
            title: "Ethical Hacker",
            company: "HackProof",
            location: "Remote",
            salary: "80,000 - 120,000",
            experience: "4-5",
            type: "full-time",
            category: "Security",
            skills: ["Penetration Testing", "Kali Linux", "Security Audits"],
            description: "Perform penetration testing, identify system vulnerabilities, and help organizations strengthen their security systems."
        },
        {
            _id: "18",
            title: "UI/UX Designer",
            company: "DesignPro",
            location: "Karachi",
            salary: "50,000 - 80,000",
            experience: "2-3",
            type: "full-time",
            category: "Design",
            skills: ["Figma", "Adobe XD", "User Research", "Prototyping"],
            description: "Design intuitive and user-friendly interfaces with a focus on user experience, usability, and modern design trends."
        },
        {
            _id: "19",
            title: "Product Manager",
            company: "ProdX",
            location: "Islamabad",
            salary: "80,000 - 120,000",
            experience: "5+",
            type: "full-time",
            category: "Management",
            skills: ["Product Strategy", "Agile", "Roadmap Planning"],
            description: "Manage product lifecycle, coordinate with teams, and ensure successful delivery of products aligned with business goals."
        },
        {
            _id: "20",
            title: "QA/Test Engineer",
            company: "TestLab",
            location: "Remote",
            salary: "50,000 - 80,000",
            experience: "1-2",
            type: "full-time",
            category: "QA",
            skills: ["Manual Testing", "Automation", "Selenium", "JIRA"],
            description: "Test software applications, identify bugs, and ensure product quality through manual and automated testing techniques."
        },
        {
            _id: "21",
            title: "Frontend Developer",
            company: "TechSoft",
            location: "Lahore",
            salary: "50,000 - 80,000",
            experience: "2-3",
            type: "full-time",
            category: "IT",
            skills: ["React", "JavaScript", "HTML", "CSS"],
            description: "Build modern, responsive, and interactive user interfaces using React, HTML, CSS, and JavaScript while ensuring cross-browser compatibility and optimized performance."
        }
    ]);

    const [searchQuery, setSearchQuery] = useState("");
    const [locationFilter, setLocationFilter] = useState("");

    // Filter jobs based on search
    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesLocation = locationFilter === "" || 
                               job.location.toLowerCase().includes(locationFilter.toLowerCase());
        
        return matchesSearch && matchesLocation;
    });

    // Edit Job Function
    const handleEdit = (jobId) => {
        const job = jobs.find(j => j._id === jobId);
        if (!job) return;

        // Prompt for new values
        const newTitle = prompt("Enter new title:", job.title);
        if (newTitle === null) return; // User cancelled

        const newCompany = prompt("Enter new company:", job.company);
        if (newCompany === null) return;

        const newLocation = prompt("Enter new location:", job.location);
        if (newLocation === null) return;

        const newSalary = prompt("Enter new salary:", job.salary);
        if (newSalary === null) return;

        const newDescription = prompt("Enter new description:", job.description);
        if (newDescription === null) return;

        // Update job
        const updatedJobs = jobs.map(j => 
            j._id === jobId 
                ? { 
                    ...j, 
                    title: newTitle || j.title,
                    company: newCompany || j.company,
                    location: newLocation || j.location,
                    salary: newSalary || j.salary,
                    description: newDescription || j.description
                }
                : j
        );

        setJobs(updatedJobs);
        alert("✅ Job updated successfully!");
    };

    // Delete Job Function
    const handleDelete = (jobId) => {
        const job = jobs.find(j => j._id === jobId);
        if (!job) return;

        const confirmDelete = window.confirm(
            `Are you sure you want to delete this job?\n\n${job.title} at ${job.company}`
        );

        if (confirmDelete) {
            const updatedJobs = jobs.filter(j => j._id !== jobId);
            setJobs(updatedJobs);
            alert("✅ Job deleted successfully!");
        }
    };

    return (
        <div className="jobs-section">
            <button className="back-home-btn" onClick={() => navigate("/")}>
                ← Back to Home
            </button>
            
            <h2>🎯 All Jobs ({filteredJobs.length} total)</h2>

            {/* Search Bar */}
            <div style={{ 
                display: 'flex', 
                gap: '15px', 
                marginBottom: '30px', 
                maxWidth: '800px',
                flexWrap: 'wrap'
            }}>
                <input
                    type="text"
                    placeholder="🔍 Search jobs, company, or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        flex: 1,
                        minWidth: '250px',
                        padding: '12px 20px',
                        fontSize: '15px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '10px',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
                
                <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    style={{
                        flex: 0.6,
                        minWidth: '180px',
                        padding: '12px 20px',
                        fontSize: '15px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '10px',
                        outline: 'none',
                        cursor: 'pointer',
                        background: 'white'
                    }}
                >
                    <option value="">📍 All Locations</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Remote">Remote</option>
                </select>

                {(searchQuery || locationFilter) && (
                    <button
                        onClick={() => {
                            setSearchQuery("");
                            setLocationFilter("");
                        }}
                        style={{
                            padding: '12px 24px',
                            fontSize: '15px',
                            border: 'none',
                            borderRadius: '10px',
                            background: '#ef4444',
                            color: 'white',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        ✕ Clear
                    </button>
                )}
            </div>

            <div className="job-cards">
                {filteredJobs.map((job) => (
                    <div className="job-card" key={job._id}>
                        <h3>{job.title}</h3>
                        <p className="company">🏢 {job.company} • 📍 {job.location}</p>
                        <p className="salary">� {job.salary}</p>
                        <p className="experience">📚 {job.experience} years</p>
                        <p className="job-type">💼 {job.type}</p>
                        <p className="category">🏷️ {job.category}</p>
                        <div className="skills">
                            <strong>🛠️ Skills:</strong> {job.skills.join(', ')}
                        </div>
                        <p className="desc">{job.description}</p>
                        
                        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                            <button className="apply-btn" style={{ flex: 1 }}>
                                Apply Now
                            </button>
                            <button 
                                className="edit-btn" 
                                onClick={() => handleEdit(job._id)}
                                style={{ 
                                    flex: 1, 
                                    background: '#f59e0b',
                                    border: 'none',
                                    padding: '10px 18px',
                                    color: 'white',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '13px'
                                }}
                            >
                                ✏️ Edit
                            </button>
                            <button 
                                className="delete-btn" 
                                onClick={() => handleDelete(job._id)}
                                style={{ 
                                    flex: 1, 
                                    background: '#ef4444',
                                    border: 'none',
                                    padding: '10px 18px',
                                    color: 'white',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '13px'
                                }}
                            >
                                🗑️ Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

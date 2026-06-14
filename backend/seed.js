require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');
const Job = require('./models/job');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        // Create Admin User with simple credentials
        let admin = await User.findOne({ email: 'admin' });
        if (!admin) {
            admin = new User({
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin',
                password: 'admin',
                role: 'admin'
            });
            await admin.save();
            console.log('✅ Admin user created (email: admin, password: admin)');
        } else {
            console.log('ℹ️  Admin user already exists');
        }

        // Create Jobs (21 default jobs)
        const jobsCount = await Job.countDocuments();
        if (jobsCount === 0) {
            const jobs = [
                {
                    title: "Frontend Developer",
                    company: "TechSoft",
                    location: "Lahore",
                    salary: "50,000 - 80,000",
                    experience: "2-3",
                    description: "Build modern, responsive, and interactive user interfaces using React, HTML, CSS, and JavaScript while ensuring cross-browser compatibility and optimized performance.",
                    postedBy: admin._id
                },
                {
                    title: "Backend Developer",
                    company: "CodeBase",
                    location: "Karachi",
                    salary: "60,000 - 90,000",
                    experience: "3-4",
                    description: "Develop secure and scalable backend services using Node.js, Express, and databases while creating RESTful APIs and handling server-side logic.",
                    postedBy: admin._id
                },
                {
                    title: "Full Stack Developer",
                    company: "DevHub",
                    location: "Islamabad",
                    salary: "70,000 - 100,000",
                    experience: "4-5",
                    description: "Work on both frontend and backend systems, building complete web applications using modern technologies and ensuring smooth integration between client and server.",
                    postedBy: admin._id
                },
                {
                    title: "MERN Stack Developer",
                    company: "StackTech",
                    location: "Remote",
                    salary: "65,000 - 95,000",
                    experience: "2-3",
                    description: "Develop full-stack applications using MongoDB, Express, React, and Node.js with a focus on performance, scalability, and clean code practices.",
                    postedBy: admin._id
                },
                {
                    title: "Web Developer",
                    company: "WebWorks",
                    location: "Lahore",
                    salary: "40,000 - 70,000",
                    experience: "1-2",
                    description: "Create responsive and visually appealing websites using modern web technologies while ensuring usability and performance optimization.",
                    postedBy: admin._id
                },
                {
                    title: "Software Engineer",
                    company: "SoftSolutions",
                    location: "Karachi",
                    salary: "75,000 - 110,000",
                    experience: "5+",
                    description: "Design and develop scalable software systems, implement efficient algorithms, and ensure high-quality code and performance optimization.",
                    postedBy: admin._id
                },
                {
                    title: "Software Developer",
                    company: "InnovateX",
                    location: "Islamabad",
                    salary: "55,000 - 85,000",
                    experience: "3-4",
                    description: "Write clean, maintainable, and efficient code for various applications while collaborating with teams to deliver high-quality software solutions.",
                    postedBy: admin._id
                },
                {
                    title: "Application Developer",
                    company: "Appify",
                    location: "Remote",
                    salary: "50,000 - 80,000",
                    experience: "2-3",
                    description: "Develop mobile and web applications with modern frameworks, focusing on performance, usability, and scalability.",
                    postedBy: admin._id
                },
                {
                    title: "AI Engineer",
                    company: "AI Labs",
                    location: "Lahore",
                    salary: "80,000 - 120,000",
                    experience: "4-5",
                    description: "Build and deploy AI models, work on automation systems, and implement intelligent solutions for real-world problems.",
                    postedBy: admin._id
                },
                {
                    title: "Machine Learning Engineer",
                    company: "ML Tech",
                    location: "Karachi",
                    salary: "75,000 - 110,000",
                    experience: "3-4",
                    description: "Develop and train machine learning models, optimize algorithms, and deploy predictive systems for business solutions.",
                    postedBy: admin._id
                },
                {
                    title: "Data Scientist",
                    company: "DataCorp",
                    location: "Islamabad",
                    salary: "80,000 - 120,000",
                    experience: "4-5",
                    description: "Analyze large datasets, build predictive models, and extract meaningful insights to support business decision-making.",
                    postedBy: admin._id
                },
                {
                    title: "Data Analyst",
                    company: "InsightX",
                    location: "Remote",
                    salary: "50,000 - 80,000",
                    experience: "1-2",
                    description: "Interpret data, generate reports, and provide actionable insights using tools like Excel, SQL, and visualization platforms.",
                    postedBy: admin._id
                },
                {
                    title: "NLP Engineer",
                    company: "LangTech",
                    location: "Lahore",
                    salary: "75,000 - 110,000",
                    experience: "4-5",
                    description: "Develop natural language processing systems for chatbots, text analysis, and language-based AI applications.",
                    postedBy: admin._id
                },
                {
                    title: "DevOps Engineer",
                    company: "CloudOps",
                    location: "Karachi",
                    salary: "70,000 - 100,000",
                    experience: "3-4",
                    description: "Manage CI/CD pipelines, automate deployments, and ensure system reliability using DevOps tools and cloud platforms.",
                    postedBy: admin._id
                },
                {
                    title: "Cloud Engineer",
                    company: "SkyNet",
                    location: "Remote",
                    salary: "65,000 - 95,000",
                    experience: "2-3",
                    description: "Design and manage cloud infrastructure using AWS, Azure, or Google Cloud while ensuring scalability and security.",
                    postedBy: admin._id
                },
                {
                    title: "Site Reliability Engineer",
                    company: "RelianceTech",
                    location: "Islamabad",
                    salary: "75,000 - 110,000",
                    experience: "5+",
                    description: "Ensure system reliability, monitor performance, and implement solutions to maintain uptime and scalability.",
                    postedBy: admin._id
                },
                {
                    title: "Cyber Security Analyst",
                    company: "SecureNet",
                    location: "Lahore",
                    salary: "70,000 - 100,000",
                    experience: "3-4",
                    description: "Monitor security systems, identify vulnerabilities, and protect networks and data from cyber threats.",
                    postedBy: admin._id
                },
                {
                    title: "Ethical Hacker",
                    company: "HackProof",
                    location: "Remote",
                    salary: "80,000 - 120,000",
                    experience: "4-5",
                    description: "Perform penetration testing, identify system vulnerabilities, and help organizations strengthen their security systems.",
                    postedBy: admin._id
                },
                {
                    title: "UI/UX Designer",
                    company: "DesignPro",
                    location: "Karachi",
                    salary: "50,000 - 80,000",
                    experience: "2-3",
                    description: "Design intuitive and user-friendly interfaces with a focus on user experience, usability, and modern design trends.",
                    postedBy: admin._id
                },
                {
                    title: "Product Manager",
                    company: "ProdX",
                    location: "Islamabad",
                    salary: "80,000 - 120,000",
                    experience: "5+",
                    description: "Manage product lifecycle, coordinate with teams, and ensure successful delivery of products aligned with business goals.",
                    postedBy: admin._id
                },
                {
                    title: "QA/Test Engineer",
                    company: "TestLab",
                    location: "Remote",
                    salary: "50,000 - 80,000",
                    experience: "1-2",
                    description: "Test software applications, identify bugs, and ensure product quality through manual and automated testing techniques.",
                    postedBy: admin._id
                }
            ];

            await Job.insertMany(jobs);
            console.log(`✅ ${jobs.length} jobs created successfully!`);
        } else {
            console.log(`ℹ️  ${jobsCount} jobs already exist in database`);
        }

        console.log('✅ Seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error.message);
        process.exit(1);
    }
};

connectDB().then(seedData);

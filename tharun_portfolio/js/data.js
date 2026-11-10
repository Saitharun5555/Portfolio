/**
 * Default portfolio data for Sai Tarun Cherukuri
 * Pre-populated with real resume details and projects including FaceID, JyothiMart, and AI systems.
 */
const DEFAULT_PORTFOLIO_DATA = {
  profile: {
    name: "Sai Tarun Cherukuri",
    title: "Full-Stack Web Developer & AI / Machine Learning Engineer",
    tagline: "Building responsive, modern web platforms & deep learning biometric AI solutions.",
    bio: "Computer Science undergraduate at SRM University AP with hands-on experience in full-stack web development (Next.js, React) and deep learning systems (OpenCV YuNet + SFace biometric FaceID, Explainable AI). Proven track record delivering production web apps and enterprise solutions during internships at APCOB and EDUNET.",
    avatarUrl: "assets/avatar.svg",
    email: "saitarunkodad@gmail.com",
    phone: "+91 7569358645",
    location: "Andhra Pradesh, India",
    github: "https://github.com/Saitharun5555",
    linkedin: "https://linkedin.com/in/saitarun5555",
    statusBadge: "Available for Opportunities",
    adminPin: "1234" // Default secret PIN for Sai Tarun's edit mode
  },
  resume: {
    filename: "Sai_Tarun_Cherukuri_Resume.pdf",
    summary: "Dedicated software engineer skilled in full-stack web development (React, Next.js, modern JavaScript) and Machine Learning / Computer Vision (Python, OpenCV YuNet & SFace, Scikit-learn, Explainable AI). Strong analytical mindset with proven industry internship experience and live cloud deployments.",
    education: [
      {
        institution: "SRM University AP",
        degree: "Bachelor's Degree in Computer Science & Engineering",
        period: "2022 - Present",
        description: "Focus on Data Structures, Operating Systems, Software Engineering, Artificial Intelligence, and Full-Stack Web Development."
      }
    ],
    experience: [
      {
        id: "exp-1",
        role: "Web Development Intern",
        company: "APCOB (Andhra Pradesh State Co-operative Bank)",
        period: "March 2024 - May 2024",
        highlights: [
          "Contributed to the design and implementation of a Complaint Management System using modern web development technologies to streamline customer complaint processing.",
          "Collaborated closely with engineering team to enhance customer service efficiency and significantly improve client satisfaction.",
          "Improved operational efficiency by reducing manual complaint handling and enabling faster turnaround responses."
        ]
      },
      {
        id: "exp-2",
        role: "Machine Learning Intern",
        company: "EDUNET",
        period: "June 2024 - August 2024",
        highlights: [
          "Developed a machine learning model using Linear Regression to predict employee burnout risk.",
          "Managed end-to-end data collection, preprocessing, and exploratory data analysis (EDA) to prepare datasets for modeling.",
          "Presented analytical findings through rich visualizations and metric reports to support data-driven decision-making.",
          "Strengthened skills in data analysis, machine learning algorithms, and applying AI to real-world HR challenges."
        ]
      }
    ],
    skills: {
      languages: ["Python", "C++", "MySQL", "HTML5", "CSS3", "JavaScript (ES6+)", "React.js"],
      concepts: ["Artificial Intelligence", "Machine Learning", "Computer Vision (OpenCV)", "Operating Systems", "Software Engineering", "Web Development", "Next.js", "Explainable AI (SHAP & LIME)", "Role-Based Access Control (RBAC)"]
    }
  },
  projects: [
    {
      id: "proj-faceid",
      title: "FaceID Biometric Recognition & RBAC System",
      category: "ml",
      categoryLabel: "AI & Computer Vision",
      featured: true,
      description: "Real-time deep learning facial biometric authentication system powered by OpenCV YuNet and SFace (128-D vector embeddings). Features strict Role-Based Access Control (RBAC), ultra-low False Acceptance Rate (FAR < 0.01%) via Cosine Similarity, registered accuracy gauge (98.4%), and forensic audit logging.",
      tags: ["OpenCV (YuNet + SFace)", "Python", "Deep Learning", "Biometrics", "Cosine Similarity", "RBAC", "SQLite"],
      liveType: "interactive",
      liveAction: "openFaceIdDemo",
      liveButtonLabel: "⚡ Try Biometric Live Demo",
      githubUrl: "https://github.com/Saitharun5555/FACEID-2",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
      accent: "teal"
    },
    {
      id: "proj-jyothimart",
      title: "JyothiMart E-Commerce Platform",
      category: "web",
      categoryLabel: "Web Development",
      featured: true,
      description: "Full-featured, responsive retail e-commerce platform built with Next.js, HTML5, and CSS3. Features dynamic product catalogs, shopping cart, customer authentication, SSR performance optimization, and live deployment on Google Cloud with custom domain.",
      tags: ["Next.js", "React", "HTML5", "CSS3", "Google Cloud", "SSR"],
      liveType: "external",
      liveAction: "https://jyothimart.in",
      liveButtonLabel: "🌐 Visit Live Site (jyothimart.in)",
      githubUrl: "https://github.com/Saitharun5555",
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80",
      accent: "teal"
    },
    {
      id: "proj-threat-detection",
      title: "Explainable AI Cybersecurity Threat Detection",
      category: "ml",
      categoryLabel: "Machine Learning / AI",
      featured: true,
      description: "Explainable AI (XAI) intrusion detection system evaluating malicious network activities on TON_IoT and UNSW-NB15 datasets. Implemented Random Forest, SVM, and Logistic Regression with SHAP & LIME for transparent, interpretable threat prediction and feature attribution.",
      tags: ["Python", "Scikit-learn", "SHAP", "LIME", "Random Forest", "Pandas", "NumPy"],
      liveType: "interactive",
      liveAction: "openThreatDemo",
      liveButtonLabel: "🔍 Test XAI Packet Inspector",
      githubUrl: "https://github.com/Saitharun5555",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
      accent: "indigo"
    },
    {
      id: "proj-burnout",
      title: "Employee Burnout Predictor (EDUNET)",
      category: "ml",
      categoryLabel: "Machine Learning / AI",
      featured: false,
      description: "Predictive modeling and exploratory data analysis built during internship at EDUNET using Linear Regression to evaluate workplace stress factors, overtime loads, and forecast burnout risk for data-driven HR support.",
      tags: ["Python", "Linear Regression", "EDA", "Data Visualization", "Pandas"],
      liveType: "interactive",
      liveAction: "openBurnoutDemo",
      liveButtonLabel: "📊 Test Burnout Calculator",
      githubUrl: "https://github.com/Saitharun5555",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
      accent: "indigo"
    },
    {
      id: "proj-complaint-system",
      title: "Complaint Management System (APCOB)",
      category: "web",
      categoryLabel: "Web Development",
      featured: false,
      description: "Enterprise web application built during APCOB internship to register, manage, and resolve customer banking grievances with status tracking, faster turnaround times, and reduced manual workload.",
      tags: ["React", "JavaScript", "HTML5", "CSS3", "REST APIs", "APCOB"],
      liveType: "interactive",
      liveAction: "openComplaintDemo",
      liveButtonLabel: "📋 View Ticket Workflow",
      githubUrl: "https://github.com/Saitharun5555",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      accent: "teal"
    }
  ]
};

const STORAGE_KEY = "sai_tarun_portfolio_data_v2";

/**
 * Loads current portfolio data from localStorage or falls back to defaults.
 */
function loadPortfolioData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        profile: { ...DEFAULT_PORTFOLIO_DATA.profile, ...(parsed.profile || {}) },
        resume: { ...DEFAULT_PORTFOLIO_DATA.resume, ...(parsed.resume || {}) },
        projects: parsed.projects && parsed.projects.length ? parsed.projects : DEFAULT_PORTFOLIO_DATA.projects
      };
    }
  } catch (err) {
    console.error("Failed to parse stored portfolio data:", err);
  }
  return JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA));
}

/**
 * Saves current portfolio data into localStorage.
 */
function savePortfolioData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (err) {
    console.error("Failed to save portfolio data:", err);
    return false;
  }
}

/**
 * Resets portfolio data to initial state.
 */
function resetPortfolioData() {
  localStorage.removeItem(STORAGE_KEY);
  return JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA));
}

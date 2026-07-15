import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import api from '../utils/api';
import { 
  User, 
  Gamepad, 
  Briefcase, 
  Code, 
  Award, 
  CheckSquare, 
  Mail, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  Loader2, 
  Link as LinkIcon, 
  FileText 
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [admin, setAdmin] = useState(null);
  
  // Data States
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [messages, setMessages] = useState([]);

  // Uploader indicators
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingProjImage, setUploadingProjImage] = useState(false);
  const [projImageUrl, setProjImageUrl] = useState('');

  // Editing structures
  const [editSkillId, setEditSkillId] = useState(null);
  const [editExpId, setEditExpId] = useState(null);
  const [editProjId, setEditProjId] = useState(null);
  const [editAchId, setEditAchId] = useState(null);
  const [editCertId, setEditCertId] = useState(null);

  // Forms
  const { register: profileReg, handleSubmit: profileSub, setValue: setProfileVal } = useForm();
  
  // Authenticate Admin
  useEffect(() => {
    const authenticate = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.warning("Auth session expired. Please log in.");
        navigate('/login');
        return;
      }
      try {
        const res = await api.get('/admin/check-auth');
        if (res.data.success) {
          setAdmin(res.data.admin);
        } else {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } catch (err) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    };
    authenticate();
  }, [navigate]);

  // Fetch Panel Data
  const fetchData = async () => {
    try {
      const prof = await api.get('/admin/profile');
      if (prof.data.success) {
        const adminData = prof.data.admin;
        setProfileVal('name', adminData.name);
        setProfileVal('title', adminData.title);
        setProfileVal('tagline', adminData.tagline);
        setProfileVal('aboutMe', adminData.aboutMe);
        setProfileVal('currentFocus', adminData.currentFocus.join(', '));
        setProfileVal('gitHubUrl', adminData.gitHubUrl);
        setProfileVal('linkedInUrl', adminData.linkedInUrl);
        setProfileVal('leetCodeUrl', adminData.leetCodeUrl);
        setProfileVal('email', adminData.email);
        setProfileVal('phone', adminData.phone);
        setProfileVal('resumeUrl', adminData.resumeUrl);
      }

      const skillRes = await api.get('/skills');
      if (skillRes.data.success) setSkills(skillRes.data.skills);

      const expRes = await api.get('/experiences');
      if (expRes.data.success) setExperiences(expRes.data.experiences);

      const projRes = await api.get('/projects');
      if (projRes.data.success) setProjects(projRes.data.projects);

      const achRes = await api.get('/achievements');
      if (achRes.data.success) setAchievements(achRes.data.achievements);

      const certRes = await api.get('/certifications');
      if (certRes.data.success) setCertifications(certRes.data.certifications);

      const msgRes = await api.get('/contact');
      if (msgRes.data.success) setMessages(msgRes.data.messages);
    } catch (err) {
      console.error('Error fetching dashboard records', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // WebSockets Real-time Recruiter Alerts connection
  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_SOCKET_URL || 'http://localhost:5000');
    
    socket.emit('join_admin_dashboard');

    socket.on('new_contact_message', (newMessage) => {
      toast.info(`🔔 New Contact inquiry from: ${newMessage.name}!`, {
        position: "top-right",
        autoClose: false
      });
      // Prepend message
      setMessages(prev => [newMessage, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/admin/logout');
      localStorage.removeItem('token');
      toast.success("Successfully logged out.");
      navigate('/');
    } catch (error) {
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  // Resume PDF uploading
  const uploadResumeFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setUploadingResume(true);

    try {
      const res = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setProfileVal('resumeUrl', res.data.fileUrl);
        toast.success("Resume asset saved successfully!");
      }
    } catch (error) {
      toast.error("Failed uploading PDF.");
    } finally {
      setUploadingResume(false);
    }
  };

  // Project photos uploading
  const uploadProjectImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setUploadingProjImage(true);

    try {
      const res = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setProjImageUrl(res.data.fileUrl);
        toast.success("Project screenshot saved!");
      }
    } catch (error) {
      toast.error("Failed upload image.");
    } finally {
      setUploadingProjImage(false);
    }
  };

  // Profile save
  const handleProfileSave = async (data) => {
    try {
      const payload = {
        ...data,
        currentFocus: data.currentFocus.split(',').map(s => s.trim()).filter(Boolean)
      };
      const res = await api.put('/admin/profile', payload);
      if (res.data.success) {
        toast.success("Personal profile information updated!");
      }
    } catch (error) {
      toast.error("Fail update profile.");
    }
  };

  // --- Skill operations ---
  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: e.target.name.value,
      category: e.target.category.value,
      level: parseInt(e.target.level.value),
      icon: e.target.icon.value
    };

    try {
      if (editSkillId) {
        const res = await api.put(`/skills/${editSkillId}`, data);
        if (res.data.success) {
          toast.success("Skill updated!");
          setEditSkillId(null);
        }
      } else {
        const res = await api.post('/skills', data);
        if (res.data.success) toast.success("Skill added!");
      }
      e.target.reset();
      fetchData();
    } catch (error) {
      toast.error("Process failed.");
    }
  };

  const deleteSkill = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await api.delete(`/skills/${id}`);
      if (res.data.success) {
        toast.success("Skill deleted.");
        fetchData();
      }
    } catch (error) {
      toast.error("Deletion failed.");
    }
  };

  // --- Experience operations ---
  const handleExperienceSubmit = async (e) => {
    e.preventDefault();
    const data = {
      company: e.target.company.value,
      title: e.target.title.value,
      duration: e.target.duration.value,
      responsibilities: e.target.responsibilities.value.split('\n').filter(Boolean),
      techStack: e.target.techStack.value.split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      if (editExpId) {
        const res = await api.put(`/experiences/${editExpId}`, data);
        if (res.data.success) {
          toast.success("Experience updated!");
          setEditExpId(null);
        }
      } else {
        const res = await api.post('/experiences', data);
        if (res.data.success) toast.success("Experience added!");
      }
      e.target.reset();
      fetchData();
    } catch (error) {
      toast.error("Save failed.");
    }
  };

  const deleteExperience = async (id) => {
    if (!window.confirm("Delete experience?")) return;
    try {
      const res = await api.delete(`/experiences/${id}`);
      if (res.data.success) {
        toast.success("Deleted successfully.");
        fetchData();
      }
    } catch (err) {
      toast.error("Failed deletion.");
    }
  };

  // --- Project Operations ---
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const data = {
      title: e.target.title.value,
      description: e.target.description.value,
      features: e.target.features.value.split('\n').filter(Boolean),
      techStack: e.target.techStack.value.split(',').map(s => s.trim()).filter(Boolean),
      github: e.target.github.value,
      liveDemo: e.target.liveDemo.value,
      metrics: e.target.metrics.value,
      image: projImageUrl || e.target.image_link.value
    };

    try {
      if (editProjId) {
        const res = await api.put(`/projects/${editProjId}`, data);
        if (res.data.success) {
          toast.success("Project updated!");
          setEditProjId(null);
          setProjImageUrl('');
        }
      } else {
        const res = await api.post('/projects', data);
        if (res.data.success) {
          toast.success("Project added!");
          setProjImageUrl('');
        }
      }
      e.target.reset();
      fetchData();
    } catch (error) {
      toast.error("Operation failed.");
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Delete project?")) return;
    try {
      const res = await api.delete(`/projects/${id}`);
      if (res.data.success) {
        toast.success("Project deleted.");
        fetchData();
      }
    } catch (error) {
      toast.error("Failed.");
    }
  };

  // --- Achievements Operations ---
  const handleAchSubmit = async (e) => {
    e.preventDefault();
    const data = {
      title: e.target.title.value,
      rating: e.target.rating.value ? parseInt(e.target.rating.value) : undefined,
      solvedCount: e.target.solvedCount.value ? parseInt(e.target.solvedCount.value) : undefined,
      description: e.target.description.value,
      details: e.target.details.value
    };

    try {
      if (editAchId) {
        const res = await api.put(`/achievements/${editAchId}`, data);
        if (res.data.success) {
          toast.success("Achievement updated!");
          setEditAchId(null);
        }
      } else {
        const res = await api.post('/achievements', data);
        if (res.data.success) toast.success("Achievement added!");
      }
      e.target.reset();
      fetchData();
    } catch (error) {
      toast.error("Operation failed.");
    }
  };

  const deleteAchievement = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await api.delete(`/achievements/${id}`);
      if (res.data.success) {
        toast.success("Deleted.");
        fetchData();
      }
    } catch (error) {
      toast.error("Failed deletion.");
    }
  };

  // --- Certifications Operations ---
  const handleCertSubmit = async (e) => {
    e.preventDefault();
    const data = {
      title: e.target.title.value,
      provider: e.target.provider.value,
      link: e.target.link.value
    };

    try {
      if (editCertId) {
        const res = await api.put(`/certifications/${editCertId}`, data);
        if (res.data.success) {
          toast.success("Certification updated!");
          setEditCertId(null);
        }
      } else {
        const res = await api.post('/certifications', data);
        if (res.data.success) toast.success("Certification added!");
      }
      e.target.reset();
      fetchData();
    } catch (error) {
      toast.error("Failed operation.");
    }
  };

  const deleteCert = async (id) => {
    if (!window.confirm("Remove certification?")) return;
    try {
      const res = await api.delete(`/certifications/${id}`);
      if (res.data.success) {
        toast.success("Removed certification.");
        fetchData();
      }
    } catch (error) {
      toast.error("Failed Deletion.");
    }
  };

  // --- Messages Deletion ---
  const deleteMessage = async (id) => {
    if (!window.confirm("Remove query log?")) return;
    try {
      const res = await api.delete(`/contact/${id}`);
      if (res.data.success) {
        toast.success("Query removed.");
        fetchData();
      }
    } catch (error) {
      toast.error("Failed Deletion.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-display font-bold text-lg tracking-wide text-blue-600">
            DASHBOARD PANEL
          </span>
          <span className="font-mono text-xs bg-blue-50 text-blue-600 border border-blue-200/50 px-2.5 py-0.5 rounded">ADMIN MODULE</span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')} 
            className="text-xs font-mono text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            PREVIEW SITE
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl text-xs font-mono text-red-650 cursor-pointer transition-colors"
          >
            <LogOut size={12} />
            LOGOUT
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer text-left ${activeTab === 'profile' ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <User size={16} /> Bio Metadata
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer text-left ${activeTab === 'skills' ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'text-slate-600 hover:bg-slate-55/50 hover:text-slate-900'}`}
          >
            <Gamepad size={16} /> Skills Toolkit
          </button>
          <button
            onClick={() => setActiveTab('experiences')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer text-left ${activeTab === 'experiences' ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'text-slate-600 hover:bg-slate-55/50 hover:text-slate-900'}`}
          >
            <Briefcase size={16} /> Work Timeline
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer text-left ${activeTab === 'projects' ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'text-slate-600 hover:bg-slate-55/50 hover:text-slate-900'}`}
          >
            <Code size={16} /> Project Portfolio
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer text-left ${activeTab === 'achievements' ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'text-slate-600 hover:bg-slate-55/50 hover:text-slate-900'}`}
          >
            <Award size={16} /> Achievements
          </button>
          <button
            onClick={() => setActiveTab('certifications')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer text-left ${activeTab === 'certifications' ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'text-slate-600 hover:bg-slate-55/50 hover:text-slate-900'}`}
          >
            <CheckSquare size={16} /> Certifications
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer text-left ${activeTab === 'messages' ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'text-slate-600 hover:bg-slate-55/50 hover:text-slate-900'}`}
          >
            <span className="flex items-center gap-3">
              <Mail size={16} /> Recruiter Mail
            </span>
            {messages.length > 0 && (
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full shrink-0 font-semibold ${activeTab === 'messages' ? 'bg-blue-800 text-white' : 'bg-blue-50 text-blue-600'}`}>
                {messages.length}
              </span>
            )}
          </button>
        </aside>

        {/* Content body panels */}
        <main className="flex-1 p-6 md:p-10 max-w-5xl overflow-y-auto">
          
          {/* Tab 1: Profile & Bio Data */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-xl font-display font-bold text-slate-800">Update Bio Metadata</h2>
              <form onSubmit={profileSub(handleProfileSave)} className="glass-panel p-6 rounded-2xl space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-1">NAME</label>
                    <input type="text" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm text-slate-800" {...profileReg('name')} />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-1">TITLE</label>
                    <input type="text" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm text-slate-800" {...profileReg('title')} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 mb-1">TAGLINE</label>
                  <textarea rows={2} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm text-slate-800" {...profileReg('tagline')} />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 mb-1">ABOUT BIOGRAPHY</label>
                  <textarea rows={4} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm text-slate-800" {...profileReg('aboutMe')} />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 mb-1">FOCUS KEYWORDS (comma separated)</label>
                  <input type="text" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm text-slate-800" {...profileReg('currentFocus')} />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-1">EMAIL</label>
                    <input type="email" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm text-slate-800" {...profileReg('email')} />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-1">PHONE</label>
                    <input type="text" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm text-slate-800" {...profileReg('phone')} />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-1">RESUME DOCKER PATH / URL</label>
                    <input type="text" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm font-mono text-xs text-slate-800" {...profileReg('resumeUrl')} />
                  </div>
                </div>

                {/* File uploads */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-500 uppercase">Upload Resume PDF:</span>
                    <label className="px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-mono text-blue-600 flex items-center gap-1.5 cursor-pointer transition-colors">
                      {uploadingResume ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                      SELECT PDF
                      <input type="file" accept="application/pdf" className="hidden" onChange={uploadResumeFile} />
                    </label>
                  </div>

                  <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-500 transition-colors shadow-sm cursor-pointer">
                    SAVE METADATA
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tab 2: Skills Toolkit */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <h2 className="text-xl font-display font-bold text-slate-800">Skills Toolkit Editor</h2>
              
              <form onSubmit={handleSkillSubmit} className="glass-panel p-5 rounded-xl grid md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-xs font-mono text-slate-500 mb-1">SKILL NAME</label>
                  <input name="name" type="text" required className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm text-slate-800" placeholder="e.g. React" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-500 mb-1">CATEGORY</label>
                  <select name="category" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm text-slate-800">
                    <option value="Programming Languages">Programming Languages</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
                    <option value="Authentication">Authentication</option>
                    <option value="Cloud">Cloud</option>
                    <option value="Real Time">Real Time</option>
                    <option value="Tools">Tools</option>
                    <option value="Core Concepts">Core Concepts</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-1">LEVEL (0-100)</label>
                    <input name="level" type="number" defaultValue={80} className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm text-slate-800" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-1">LUCIDE ICON</label>
                    <input name="icon" type="text" defaultValue="Code" className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-xs font-mono text-slate-800" />
                  </div>
                </div>
                <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-sm flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-sm">
                  <Plus size={16} /> ADD SKILL
                </button>
              </form>

              {/* Skills list table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full border-collapse text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase font-mono">
                    <tr>
                      <th className="p-3">Skill</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Level</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {skills.map((skill) => (
                      <tr key={skill._id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-3 font-semibold text-slate-800">{skill.name}</td>
                        <td className="p-3 text-xs font-mono text-blue-600">{skill.category}</td>
                        <td className="p-3 font-mono">{skill.level}%</td>
                        <td className="p-3 text-right flex items-center justify-end gap-2.5">
                          <button onClick={() => deleteSkill(skill._id)} className="text-red-600 hover:text-red-800 cursor-pointer p-1">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Experiences CRUD */}
          {activeTab === 'experiences' && (
            <div className="space-y-6">
              <h2 className="text-xl font-display font-bold text-slate-800">Work Timeline Editor</h2>
              
              <form onSubmit={handleExperienceSubmit} className="glass-panel p-5 rounded-xl space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-1">COMPANY WORKPLACE</label>
                    <input name="company" type="text" required className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm text-slate-800" placeholder="e.g. Better Tomorrow" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-1">ROLE / TITLE</label>
                    <input name="title" type="text" required className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm text-slate-800" placeholder="e.g. Full Stack Intern" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-1">DURATION PERIOD</label>
                    <input name="duration" type="text" required className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm text-slate-800" placeholder="e.g. 2025" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 mb-1">RESPONSIBILITIES (one sentence per line)</label>
                  <textarea name="responsibilities" rows={3} required className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm text-slate-800" placeholder="e.g. Built Express REST API microservices..." />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 mb-1">TECH STACK BADGES (comma separated)</label>
                  <input name="techStack" type="text" className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm text-slate-800" placeholder="React, Express.js..." />
                </div>

                <div className="flex justify-end">
                  <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-sm flex items-center gap-1 cursor-pointer transition-colors shadow-sm">
                    <Plus size={16} /> SAVE WORK HISTORY
                  </button>
                </div>
              </form>

              {/* Work list */}
              <div className="space-y-3">
                {experiences.map((exp) => (
                  <div key={exp._id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-800 text-sm">{exp.title} at <span className="text-blue-600 font-display font-medium">{exp.company}</span></h3>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{exp.duration}</p>
                    </div>
                    <button onClick={() => deleteExperience(exp._id)} className="text-red-650 hover:text-red-850 p-2 cursor-pointer bg-red-50 rounded-lg border border-red-10 border-red-200">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Projects CRUD */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <h2 className="text-xl font-display font-bold text-slate-800">Project Portfolio Editor</h2>
              
              <form onSubmit={handleProjectSubmit} className="glass-panel p-5 rounded-2xl space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-1">PROJECT TITLE</label>
                    <input name="title" type="text" required className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm text-slate-800" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-1">METRIC TAGLINE</label>
                    <input name="metrics" type="text" className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm text-slate-800" placeholder="e.g. 120ms latency" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 mb-1">SUMMARY / DESCRIPTION</label>
                  <textarea name="description" rows={2} required className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm text-slate-800" />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 mb-1">KEY FEATURES (one per line)</label>
                  <textarea name="features" rows={2} required className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm text-slate-800" placeholder="JWT Authentication&#10;Google Maps routing..." />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-1">GITHUB PATH</label>
                    <input name="github" type="text" className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm text-slate-800" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-1">LIVE DEMO URL</label>
                    <input name="liveDemo" type="text" className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm text-slate-800" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-1">TECH STACK (comma separated)</label>
                    <input name="techStack" type="text" required className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm text-slate-800" placeholder="React, Node.js" />
                  </div>
                </div>

                {/* Upload project photos & covers */}
                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 items-center">
                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-1">COVER PHOTO LINK (fallback)</label>
                    <input name="image_link" type="text" className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-xs font-mono text-slate-805" placeholder="http://url" />
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-505 uppercase">Upload Media:</span>
                    <label className="px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-mono text-blue-600 flex items-center gap-1.5 cursor-pointer transition-colors">
                      {uploadingProjImage ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                      SELECT IMAGE
                      <input type="file" accept="image/*" className="hidden" onChange={uploadProjectImage} />
                    </label>
                    {projImageUrl && <span className="text-[10px] text-emerald-600 font-mono truncate max-w-[120px]">Image Loaded</span>}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-sm flex items-center gap-1 cursor-pointer transition-colors shadow-sm">
                    <Plus size={16} /> SAVE PROJECT
                  </button>
                </div>
              </form>

              {/* Projects List */}
              <div className="grid md:grid-cols-2 gap-4">
                {projects.map((proj) => (
                  <div key={proj._id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-semibold text-slate-800 text-sm">{proj.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{proj.description}</p>
                    </div>
                    <button onClick={() => deleteProject(proj._id)} className="text-red-650 hover:text-red-850 p-2 cursor-pointer bg-red-50 rounded-lg border border-red-200 shrink-0">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Tab 5: Achievements CRUD */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <h2 className="text-xl font-display font-bold text-slate-800">Achievements Metrics Editor</h2>
              
              <form onSubmit={handleAchSubmit} className="glass-panel p-5 rounded-xl space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-1">TITLE</label>
                    <input name="title" type="text" required className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm text-slate-800" placeholder="e.g. Leetcode rating" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-1">RATING COUNTER (Numeric)</label>
                    <input name="rating" type="number" className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm text-slate-800" placeholder="e.g. 1554" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-1">PROBLEMS COUNT (Numeric)</label>
                    <input name="solvedCount" type="number" className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm text-slate-800" placeholder="e.g. 567" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-1">DESCRIPTION</label>
                    <textarea name="description" rows={2} required className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm text-slate-800" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-1">SUB DETAILS / PROVIDERS</label>
                    <textarea name="details" rows={2} className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm text-slate-800" placeholder="conducted by Sri Eshwar..." />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-sm flex items-center gap-1 cursor-pointer transition-colors shadow-sm">
                    <Plus size={16} /> SAVE ACHIEVEMENT
                  </button>
                </div>
              </form>

              {/* Achievements List */}
              <div className="space-y-3">
                {achievements.map((ach) => (
                  <div key={ach._id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">{ach.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{ach.description}</p>
                    </div>
                    <button onClick={() => deleteAchievement(ach._id)} className="text-red-650 hover:text-red-850 p-2 cursor-pointer bg-red-50 rounded-lg border border-red-200">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 6: Certifications CRUD */}
          {activeTab === 'certifications' && (
            <div className="space-y-6">
              <h2 className="text-xl font-display font-bold text-slate-800">Certifications Editor</h2>
              
              <form onSubmit={handleCertSubmit} className="glass-panel p-5 rounded-xl grid md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-xs font-mono text-slate-505 mb-1">CERTIFICATE COURSE TITLE</label>
                  <input name="title" type="text" required className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm text-slate-800" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-505 mb-1">PROVIDER</label>
                  <input name="provider" type="text" required className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm text-slate-800" placeholder="Udemy" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-505 mb-1">VALIDATION LINK / URL</label>
                  <input name="link" type="text" className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-xs font-mono text-slate-800" placeholder="http://proof" />
                </div>
                <button type="submit" className="py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-sm flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-sm">
                  <Plus size={16} /> SAVE CERTIFICATION
                </button>
              </form>

              {/* Certifications List */}
              <div className="space-y-3">
                {certifications.map((cert) => (
                  <div key={cert._id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">{cert.title}</h4>
                      <p className="text-xs text-blue-600 font-mono mt-0.5">{cert.provider}</p>
                    </div>
                    <button onClick={() => deleteCert(cert._id)} className="text-red-655 hover:text-red-850 p-2 cursor-pointer bg-red-50 rounded-lg border border-red-200">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 7: Recruiter Messages Logs */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <h2 className="text-xl font-display font-bold text-slate-800">Incoming Recruiter Contacts</h2>
              {messages.length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-mono text-sm border border-slate-200 rounded-xl bg-white shadow-sm">
                  NO RECRUITER CONTACTS RECORDED YET.
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg._id} className="glass-panel p-6 rounded-2xl space-y-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none"></div>
                      
                      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-3">
                        <div className="space-y-1">
                          <h3 className="font-bold text-slate-850 text-base">{msg.name}</h3>
                          <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-500">
                            <span className="flex items-center gap-1"><Mail size={12} /> {msg.email}</span>
                            {msg.phone && <span className="flex items-center gap-1"><FileText size={12} /> +91 {msg.phone}</span>}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-mono text-slate-400">{new Date(msg.createdAt).toLocaleString()}</span>
                          <button onClick={() => deleteMessage(msg._id)} className="text-red-655 hover:text-red-900 p-2 cursor-pointer bg-red-50 rounded-lg border border-red-200 shrink-0 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <p className="text-slate-650 text-sm whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

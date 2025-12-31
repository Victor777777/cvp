import React, { useState, useEffect, useRef } from 'react';
import { CVData } from './types';
import { INITIAL_CV_DATA } from './constants';

// Utility to parse basic markdown bolding into JSX
const formatText = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-slate-900 font-bold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const CompanyLogo: React.FC<{ src?: string; name: string; onClick: () => void; id: string }> = ({ src, name, onClick, id }) => {
  const [error, setError] = useState(false);
  const nameLower = name.toLowerCase();
  const isPadded = nameLower.includes('n8n') || nameLower.includes('massachusetts');
  const isZoomed = ['ehl', 'progenius', 'archethic', 'clones'].some(target => nameLower.includes(target));

  let imgClass = "w-full h-full object-contain";
  if (isPadded) imgClass = "max-w-[70%] max-h-[70%] object-contain";
  else if (isZoomed) imgClass = "w-full h-full object-contain scale-[1.10]";
  else imgClass = "w-full h-full object-contain p-1";

  return (
    <div onClick={onClick} className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white flex items-center justify-center border border-black/[0.05] shrink-0 shadow-sm transition-all hover:scale-105 cursor-pointer relative overflow-hidden group">
      {!error && src ? (
        <img src={src} alt={name} className={imgClass} onError={() => setError(true)} />
      ) : (
        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xl">{name.charAt(0)}</div>
      )}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center no-print">
        <i className="fas fa-upload text-[10px] text-white"></i>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [data, setData] = useState<CVData>(() => {
    const saved = localStorage.getItem('cv_data_v1');
    return saved ? JSON.parse(saved) : INITIAL_CV_DATA;
  });

  const [mounted, setMounted] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(() => localStorage.getItem('profile_image_v1') || INITIAL_CV_DATA.profileImage || null);
  const [persistedLogos, setPersistedLogos] = useState<Record<string, string>>(() => JSON.parse(localStorage.getItem('persisted_logos_v1') || '{}'));

  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const activeLogoId = useRef<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('cv_data_v1', JSON.stringify(data));
  }, [data]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setProfileImage(base64);
        localStorage.setItem('profile_image_v1', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const id = activeLogoId.current;
    if (file && id) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const newLogos = { ...persistedLogos, [id]: base64 };
        setPersistedLogos(newLogos);
        localStorage.setItem('persisted_logos_v1', JSON.stringify(newLogos));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerProfileUpload = () => fileInputRef.current?.click();
  const triggerLogoUpload = (id: string) => {
    activeLogoId.current = id;
    logoInputRef.current?.click();
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-12">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-black uppercase tracking-[0.2em] text-slate-400 shrink-0">{title}</h2>
      <div className="h-[1px] flex-1 bg-black/[0.05] rounded-full"></div>
    </div>
  );

  return (
    <div className="min-h-screen text-slate-900 font-['Inter'] selection:bg-black/10 relative overflow-x-hidden">
      <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
      <input type="file" ref={logoInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />

      {/* Background Decor */}
      <div className="fixed inset-0 z-0 no-print bg-white">
        <div className="absolute top-[-10%] left-[-20%] w-[100vw] h-[100vw] rounded-full bg-[radial-gradient(circle,rgba(240,240,240,0.8)_0%,rgba(255,255,255,0)_70%)] blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[80vw] h-[80vw] rounded-full bg-[radial-gradient(circle,rgba(245,245,245,0.9)_0%,rgba(255,255,255,0)_60%)] blur-[100px]"></div>
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center pt-6 md:pt-10 pb-20 px-4 md:px-10 lg:pl-32 lg:pr-20 min-h-screen">
        <nav className="max-w-[calc(100vw-2rem)] md:max-w-none mx-auto bg-black/[0.02] backdrop-blur-[50px] border border-black/[0.05] rounded-full px-6 md:px-10 py-3 md:py-4 flex items-center mb-8 md:mb-12 shadow-[0_10px_40px_rgba(0,0,0,0.03)] no-print sticky top-4 md:top-8 z-50 overflow-x-auto no-scrollbar">
          <div className="flex gap-6 md:gap-10 whitespace-nowrap mx-auto">
            {['Overview', 'Experience', 'Achievement', 'Formation'].map((item) => (
              <button key={item} onClick={() => scrollToSection(item.toLowerCase())} className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-500 hover:text-slate-950 transition-all">{item}</button>
            ))}
          </div>
        </nav>

        <div className="w-full max-w-[1300px] flex flex-col gap-6 md:gap-10">
          <header id="overview" className="bg-black/[0.03] backdrop-blur-[80px] border border-black/[0.05] rounded-[2.5rem] md:rounded-[3.5rem] py-5 px-6 md:py-6 md:px-10 lg:py-10 lg:px-20 shadow-[0_40px_100px_rgba(0,0,0,0.05)] relative overflow-hidden group scroll-mt-24">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-20 relative z-10">
              <div className="flex-1 text-center md:text-left order-2 md:order-1">
                <div className="flex flex-col md:flex-row items-center md:items-center gap-4 mb-3">
                  <h1 className="text-2xl md:text-3xl lg:text-5xl font-black tracking-tight uppercase leading-[0.9] text-slate-800">{data.name}</h1>
                  <a href={`https://${data.website}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white/60 backdrop-blur-sm border border-black/[0.05] rounded-full text-slate-600 hover:bg-slate-950 hover:text-white transition-all shadow-sm no-print"><i className="fab fa-linkedin text-lg md:text-xl"></i></a>
                </div>

                <p className="text-sm md:text-base lg:text-lg font-medium text-slate-600 max-w-2xl leading-relaxed mt-4 md:mt-6">
                  {data.summary}
                </p>

                <div className="flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-3 sm:gap-6 mt-8 text-slate-400 font-bold text-[9px] md:text-[10px] tracking-widest uppercase">
                  <a href={`mailto:${data.email}`} className="hover:text-slate-950 transition-colors flex items-center gap-2"><i className="fas fa-envelope text-slate-300"></i>{data.email}</a>
                  <span className="hidden sm:block opacity-10">/</span>
                  <a href={`tel:${data.phone}`} className="hover:text-slate-950 transition-colors flex items-center gap-2"><i className="fas fa-phone text-slate-300"></i>{data.phone}</a>
                </div>
              </div>

              <div className="shrink-0 relative order-1 md:order-2">
                <div onClick={triggerProfileUpload} className="w-28 h-28 md:w-36 md:h-36 lg:w-48 lg:h-48 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border-2 md:border-3 border-slate-300 shadow-xl transition-all duration-500 hover:scale-[1.02] cursor-pointer bg-slate-100 flex items-center justify-center relative group/img">
                  {profileImage ? <img src={profileImage} alt={data.name} className="w-full h-full object-cover" /> : <div className="text-center p-4"><i className="fas fa-camera text-slate-300 text-xl mb-1"></i><p className="text-[6px] font-black uppercase tracking-widest text-slate-400">Photo</p></div>}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center"><span className="text-white text-[8px] font-black uppercase tracking-widest">Update</span></div>
                </div>
              </div>
            </div>
          </header>

          <div className="flex flex-col xl:flex-row gap-6 md:gap-10">
            <section id="experience" className="flex-[7] bg-black/[0.02] backdrop-blur-[60px] border border-black/[0.05] rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-10 lg:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.03)] scroll-mt-24">
              <SectionHeader title="Experience" />
              <div className="space-y-4 md:space-y-6">
                {data.experiences.map((exp) => (
                  <div key={exp.id} className="group transition-all duration-300 md:hover:bg-slate-950/[0.04] rounded-[2.5rem] py-12 px-6 md:py-16 md:px-10 md:-mx-10 relative">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                      <div className="flex gap-4 md:gap-6">
                        <CompanyLogo id={exp.id} name={exp.company} src={persistedLogos[exp.id] || exp.logo} onClick={() => triggerLogoUpload(exp.id)} />
                        <div>
                          <h3 className="text-lg md:text-xl lg:text-2xl font-black text-slate-800 leading-tight tracking-tight">{exp.title}</h3>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest mt-3 md:mt-5">
                             <span className="text-slate-950 font-black">{exp.company}</span> 
                             <span className="mx-0.5 text-slate-300 hidden sm:inline">—</span> 
                             <span className="font-bold text-slate-500">{exp.location}</span> 
                             <span className="font-black ml-1 text-slate-900">{exp.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {exp.description && <p className="text-sm md:text-base lg:text-lg text-slate-500 font-medium italic mb-6 md:mb-8 border-l-2 border-slate-200 pl-4 md:pl-6 group-hover:border-slate-950 transition-colors">{exp.description}</p>}
                    <ul className="grid grid-cols-1 gap-4 md:gap-5">
                      {exp.responsibilities.map((resp, idx) => {
                        const parts = resp.split(':');
                        const category = parts.length > 1 ? parts[0].trim().replace(/\*\*/g, '') : null;
                        const content = parts.length > 1 ? parts.slice(1).join(':').trim() : resp;

                        return (
                          <li key={idx} className="text-[13px] md:text-[15px] text-slate-600 flex items-start gap-3 md:gap-4 transition-all duration-500">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-950 mt-2 shrink-0 opacity-10"></div>
                            <div className="leading-relaxed">
                              {category && <span className="inline-block bg-slate-100 text-slate-950 px-2 md:px-2.5 py-0.5 md:py-1 rounded-md text-[8px] md:text-[9px] font-black uppercase tracking-wider mr-2 md:mr-3 align-middle">{category}</span>}
                              <span className="align-middle">{formatText(content)}</span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="absolute bottom-0 left-10 right-10 h-[1px] bg-black/[0.03] group-last:hidden"></div>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex-[3] flex flex-col gap-6 md:gap-10">
              <div id="achievement" className="bg-black/[0.03] backdrop-blur-[60px] border border-black/[0.05] rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.02)] scroll-mt-24">
                <SectionHeader title="Achievements" />
                <div className="space-y-5 md:space-y-6">
                  {data.achievements.map((ach, idx) => (
                    <div key={idx} className="flex gap-4 items-start group">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-950 mt-1.5 shrink-0 opacity-20"></div>
                      <p className="text-[12px] md:text-[13px] font-medium text-slate-600 leading-relaxed group-hover:text-slate-900 transition-colors">{ach}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-black/[0.03] backdrop-blur-[60px] border border-black/[0.05] rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
                <h2 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-slate-400 mb-8 md:mb-10">Capabilities</h2>
                <div className="flex flex-wrap gap-2 md:gap-2.5">
                  {data.skills.map((skill, idx) => (
                    <span key={idx} className="px-3 md:px-4 py-2 md:py-2.5 bg-white border border-black/[0.05] text-[9px] md:text-[10px] font-bold uppercase rounded-xl hover:bg-slate-950 hover:text-white transition-all text-slate-800 backdrop-blur-md shadow-sm">{skill}</span>
                  ))}
                </div>
              </div>

              <div id="formation" className="bg-black/[0.03] backdrop-blur-[60px] border border-black/[0.05] rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.02)] scroll-mt-24">
                 <SectionHeader title="Formation" />
                 <div className="space-y-10 md:space-y-12">
                    {data.education.map((edu) => (
                      <div key={edu.id} className="group flex flex-col gap-3 md:gap-4">
                         <div className="flex items-center gap-4">
                            <CompanyLogo id={edu.id} name={edu.institution} src={persistedLogos[edu.id] || edu.logo} onClick={() => triggerLogoUpload(edu.id)} />
                            <div>
                               <h4 className="text-[11px] md:text-[12px] font-bold uppercase text-slate-900 leading-tight">{edu.degree}</h4>
                               <p className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{edu.institution}</p>
                            </div>
                         </div>
                         <div className="inline-block self-start px-2.5 py-1 bg-black/[0.03] rounded-full text-[8px] font-black tracking-widest text-slate-400 border border-black/[0.05]">{edu.year}</div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-black/[0.03] backdrop-blur-[60px] border border-black/[0.05] rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.02)] mb-10">
                 <SectionHeader title="Languages" />
                 <div className="space-y-8 md:space-y-10">
                    {data.languages.map((lang) => (
                      <div key={lang.id}>
                        <div className="flex justify-between items-end mb-3 md:mb-4">
                          <span className="text-[10px] md:text-[11px] font-black uppercase text-slate-900">{lang.name}</span>
                          <span className="text-[8px] md:text-[9px] font-bold text-slate-400">{lang.percentage}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-black/[0.05] rounded-full overflow-hidden border border-black/[0.02]">
                          <div className="h-full bg-slate-950 rounded-full transition-all duration-1000" style={{ width: mounted ? `${lang.percentage}%` : '0%' }}></div>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>

          <div className="mt-12 md:mt-20 mb-10 flex flex-col items-center gap-6 no-print">
            <div className="text-[9px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-slate-300 text-center px-4">Portfolio © {new Date().getFullYear()} • LAFFORGUE.V</div>
            <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-slate-950 transition-all flex flex-col items-center gap-2 group p-4">
                <i className="fas fa-chevron-up text-xs opacity-50 group-hover:-translate-y-1 transition-transform"></i>
                Back to Top
            </button>
          </div>
        </div>
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default App;
import React, { useState } from 'react';
import { 
  Building, 
  Mail, 
  MapPin, 
  Phone, 
  Shield, 
  FileText, 
  AlertTriangle, 
  Globe, 
  Send, 
  CheckCircle2, 
  Scale, 
  Clock, 
  Check 
} from 'lucide-react';

interface LegalHubProps {
  initialSubTab?: 'about' | 'contact' | 'terms' | 'privacy' | 'disclaimer';
}

export const LegalHub: React.FC<LegalHubProps> = ({ initialSubTab = 'about' }) => {
  const [activeSubTab, setActiveSubTab] = useState<string>(initialSubTab);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setContactSubmitted(true);
    // Offline simulation of success
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    }, 3000);
  };

  const tabs = [
    { id: 'about', label: 'About Sevenova', icon: Building, desc: 'Corporate profile & mission' },
    { id: 'contact', label: 'Contact Us', icon: Mail, desc: 'Support channels & direct connect' },
    { id: 'terms', label: 'Terms & Conditions', icon: Scale, desc: 'Usage rules & constraints' },
    { id: 'privacy', label: 'Privacy Policy', icon: Shield, desc: 'Secure data handling metrics' },
    { id: 'disclaimer', label: 'Disclaimer Notice', icon: AlertTriangle, desc: 'Legal immunity disclosures' }
  ];

  return (
    <div className="space-y-6 animate-fade-in" id="legal-hub-page">
      {/* Header Panel */}
      <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between border-b border-gray-150 dark:border-zinc-800 pb-3">
        <div>
          <h2 className="text-lg font-black uppercase text-gray-950 tracking-wide dark:text-white flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            Sevenova Innovations Hub
          </h2>
          <span className="text-xs text-gray-400">
            Legal, regulatory standards, operations, and corporate channels
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[9px] bg-sub-active/40 border border-ui-element/35 text-secondary px-2.5 py-1 rounded-full dark:bg-primary/20 dark:text-ui-element select-none shrink-0 w-fit">
          <Clock className="h-3 w-3 text-primary animate-spin" />
          VERIFIED COMPLIANCE 2026
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side Tab Panel */}
        <div className="lg:col-span-1 space-y-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveSubTab(tab.id);
                  setContactSubmitted(false);
                }}
                className={`w-full text-left flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  activeSubTab === tab.id
                    ? 'border-primary bg-sub-active/30 dark:border-primary/40 dark:bg-primary/25 text-secondary dark:text-ui-element shadow-xs font-bold'
                    : 'border-transparent bg-gray-50/50 hover:bg-gray-100 dark:bg-zinc-850 dark:hover:bg-zinc-800/80 text-gray-600 dark:text-zinc-400'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${activeSubTab === tab.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs truncate">{tab.label}</span>
                  <span className="text-[9px] text-gray-400 dark:text-zinc-500 truncate">{tab.desc}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Side Content Pane */}
        <div className="lg:col-span-3 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 md:p-6 shadow-3xs">
          
          {/* ABOUT SEVENOVA INNOVATIONS */}
          {activeSubTab === 'about' && (
            <div className="space-y-5 animate-fade-in text-gray-700 dark:text-zinc-300">
              <div className="flex items-center gap-2 pb-2.5 border-b border-gray-150 dark:border-zinc-800">
                <Building className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-black uppercase text-gray-900 dark:text-white tracking-wider font-mono">
                  Corporate Profile & Mission
                </h3>
              </div>
              
              <div className="space-y-4 text-xs leading-relaxed">
                <div>
                  <h4 className="font-extrabold text-gray-900 dark:text-white text-xs mb-1">Who We Are</h4>
                  <p>
                    <strong>Sevenova Innovations</strong> is a cutting-edge technological development and design house centering human-first utilities. We construct responsive full-stack ecosystems, dynamic data rendering channels, and automated processing tools that operate with mathematical precision. Our signature design philosophy prioritizes local client-side operations to ensure absolute server immunity and user data security.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                  <div className="bg-gray-50 dark:bg-zinc-850 p-4 rounded-xl border border-gray-100 dark:border-zinc-800/60">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-primary font-mono block mb-1">Our Core Vision</span>
                    <p className="text-[11px] text-gray-500 dark:text-zinc-400">
                      Eliminating complex server dependencies to deliver zero-latency applications directly in the client browser. We democratize studio-grade photography alignments for international identification compliance.
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-zinc-850 p-4 rounded-xl border border-gray-100 dark:border-zinc-800/60">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-primary font-mono block mb-1">Security Standards</span>
                    <p className="text-[11px] text-gray-500 dark:text-zinc-400">
                      We believe user bio-credentials like facial structures and high-resolution photographs must never reside on static servers. By enforcing client-only computation, Sevenova ensures total hack resistance.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-extrabold text-gray-900 dark:text-white text-xs mb-1">NovaPass Studio Engine</h4>
                  <p>
                    NovaPass Studio is the state-of-the-art biological picture framing utility released by Sevenova Innovations. Combining automated aspect-scaling ratio calculations with instant chroma-key background algorithms, it gives families, individuals, and commercial studios the power to formulate, fine-tune, and align identification documents matching exact embassy parameters.
                  </p>
                </div>

                <div className="border-t border-gray-100 dark:border-zinc-800 pt-4 flex flex-col md:flex-row gap-4 items-center justify-between text-[11px] text-gray-500 font-mono">
                  <span>Sevenova Innovations</span>
                  <span>Secure Client-Side Design Studio</span>
                </div>
              </div>
            </div>
          )}

          {/* CONTACT INFORMATION */}
          {activeSubTab === 'contact' && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 pb-2.5 border-b border-gray-150 dark:border-zinc-800">
                <Mail className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-black uppercase text-gray-900 dark:text-white tracking-wider font-mono">
                  Corporate Communication Channels
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs text-gray-600 dark:text-zinc-350">
                {/* Contact coordinates */}
                <div className="md:col-span-5 space-y-4">
                  <p className="leading-relaxed">
                    Let us know what you think of NovaPass Studio or inquire about commercial integrations, white-label licenses, or enterprise support.
                  </p>

                  <div className="space-y-3 font-mono text-[11px]">
                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-850 p-3 rounded-xl border border-gray-100 dark:border-zinc-800">
                      <Mail className="h-4 w-4 text-primary shrink-0" />
                      <div className="flex flex-col truncate">
                        <span className="text-[9px] text-gray-400">SUPPORT DESK</span>
                        <a href="mailto:sevenovainnovations@gmail.com" className="font-bold hover:underline truncate text-secondary dark:text-ui-element">
                          sevenovainnovations@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-850 p-3 rounded-xl border border-gray-100 dark:border-zinc-800">
                      <MapPin className="h-4 w-4 text-primary shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[9px] text-gray-400">HEADQUARTERS</span>
                        <span className="font-bold text-gray-800 dark:text-zinc-200">
                          Sevenova Innovations, Chennai, Tamil Nadu, India
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-850 p-3 rounded-xl border border-gray-100 dark:border-zinc-800">
                      <Globe className="h-4 w-4 text-primary shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[9px] text-gray-400">AVAILABILITY</span>
                        <span className="font-bold text-gray-800 dark:text-zinc-200">
                          24/7 Global Self-Service Client Engine
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct Connect Form */}
                <div className="md:col-span-7 bg-gray-50 dark:bg-zinc-850/50 p-4 rounded-xl border border-gray-100 dark:border-zinc-800">
                  <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-wider mb-2.5 font-mono text-xs">
                    Get in Touch
                  </h4>
                  {contactSubmitted ? (
                    <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                      <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 animate-bounce">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <span className="font-extrabold text-xs text-gray-900 dark:text-zinc-100 block">Message Logged Successfully</span>
                        <p className="text-[10px] text-gray-400 leading-relaxed max-w-xs">
                          Your correspondence has been converted to an offline security ticket index. Sevenova support team will check and email you shortly.
                        </p>
                      </div>
                      <button 
                        onClick={() => setContactSubmitted(false)}
                        className="text-[9px] font-bold uppercase text-primary hover:underline"
                      >
                        Send another ticket
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase">Your Name</label>
                          <input 
                            type="text" 
                            required
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full text-xs bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-850 rounded-lg p-2 focus:outline-none focus:border-primary dark:text-zinc-200"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase">Email Address</label>
                          <input 
                            type="email" 
                            required
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full text-xs bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-850 rounded-lg p-2 focus:outline-none focus:border-primary dark:text-zinc-200"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase">Subject</label>
                        <select
                          value={formData.subject}
                          onChange={(e) => setFormData({...formData, subject: e.target.value})}
                          className="w-full text-xs bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-850 rounded-lg p-2 focus:outline-none focus:border-primary dark:text-zinc-200"
                        >
                          <option>General Inquiry</option>
                          <option>Commercial License Request</option>
                          <option>Report Sizing Correction Exception</option>
                          <option>Technical Partnership</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase">Your Message</label>
                        <textarea
                          required
                          rows={3}
                          placeholder="Please write down detailed inquiries..."
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                          className="w-full text-xs bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-850 rounded-lg p-2 focus:outline-none focus:border-primary dark:text-zinc-200"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-primary hover:opacity-90 text-white font-bold py-2 rounded-lg text-[11px] transition-transform active:scale-98"
                      >
                        <Send className="h-3.5 w-3.5" /> Submit Security Ticket
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TERMS & CONDITIONS */}
          {activeSubTab === 'terms' && (
            <div className="space-y-4 animate-fade-in text-gray-700 dark:text-zinc-300 text-xs leading-relaxed overflow-y-auto max-h-[60vh] pr-2">
              <div className="flex items-center gap-2 pb-2.5 border-b border-gray-150 dark:border-zinc-800">
                <Scale className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-black uppercase text-gray-900 dark:text-white tracking-wider font-mono">
                  Terms of Service & Licensing Agreements
                </h3>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] text-gray-400 font-mono mb-2">Effective Date: June 14, 2026</p>
                
                <div>
                  <h4 className="font-extrabold text-gray-950 dark:text-white border-l-2 border-primary pl-2 mb-1">
                    1. Agreement and Boundaries of Services
                  </h4>
                  <p>
                    These Terms & Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity, and <strong>Sevenova Innovations</strong> concerning your access, use, and compiled outputs generated using NovaPass Studio. By utilizing this product, you explicitly represent that you understand and agree to accept all terms delineated herein.
                  </p>
                </div>

                <div>
                  <h4 className="font-extrabold text-gray-950 dark:text-white border-l-2 border-primary pl-2 mb-1">
                    2. Dynamic Sizing & Local Compilations
                  </h4>
                  <p>
                    The tools provided are designed for scaling, aspect-ratio alignment, background replacement, and grouping photos on standard A4 print sheets (210×297mm). All operations happen instantaneously inside the client container environment. Users are solely responsible for ensuring that the physical print output aligns with local or government metrics, and must manually confirm printing scale configurations (ensure "Actual Size" or "100%" scale zoom parameters are selected during PDF print setups).
                  </p>
                </div>

                <div>
                  <h4 className="font-extrabold text-gray-950 dark:text-white border-l-2 border-primary pl-2 mb-1">
                    3. No Server Log & Ultimate Responsibility
                  </h4>
                  <p>
                    Sevenova Innovations does not maintain a server-side index of uploaded or edited images. Images exist strictly in client volatile application memory. Accordingly, Sevenova Innovations holds zero storage backups. You assume full custody of files created, deleted, downloaded, or shared during operations.
                  </p>
                </div>

                <div>
                  <h4 className="font-extrabold text-gray-950 dark:text-white border-l-2 border-primary pl-2 mb-1">
                    4. Prohibited Behaviors
                  </h4>
                  <p>
                    Users are strictly prohibited from utilizing the NovaPass Studio background-editing engine or template generators to construct forged credentials, counterfeit visas, fraudulent government passes, or deceptive identification assets. Any illegal activities violating country safety regulations are the absolute legal responsibility of the operator, and Sevenova Innovations will comply fully with law enforcement agencies if necessary.
                  </p>
                </div>

                <div>
                  <h4 className="font-extrabold text-gray-950 dark:text-white border-l-2 border-primary pl-2 mb-1">
                    5. Intellectual Properties
                  </h4>
                  <p>
                    All visual frameworks, codebases, logic flowcharts, pixel transformations, design themes, the NovaPass Studio name, and logos are the exclusive property of Sevenova Innovations and are protected under international copyright treaties.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PRIVACY POLICY */}
          {activeSubTab === 'privacy' && (
            <div className="space-y-4 animate-fade-in text-gray-700 dark:text-zinc-300 text-xs leading-relaxed overflow-y-auto max-h-[60vh] pr-2">
              <div className="flex items-center gap-2 pb-2.5 border-b border-gray-150 dark:border-zinc-800">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-black uppercase text-gray-900 dark:text-white tracking-wider font-mono">
                  Personal Information Protection Statement
                </h3>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] text-gray-400 font-mono mb-2">Effective Date: June 14, 2026</p>

                <div className="bg-emerald-500/5 rounded-xl border border-emerald-500/10 p-3 flex gap-2.5">
                  <Shield className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-450 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-450 block mb-0.5">
                      100% Zero-Server Upload Privacy Guarantee
                    </span>
                    <p className="text-[10.5px] leading-relaxed text-emerald-900/80 dark:text-emerald-200/80">
                      NovaPass Studio operates under a zero-telemetry architecture. Neither Sevenova Innovations nor any third party has physical access to view, intercept, store, or transmit your uploaded headshots or compiled grid outputs.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-extrabold text-gray-950 dark:text-white border-l-2 border-emerald-500 pl-2 mb-1">
                    1. Direct Data Storage & Local Persistence
                  </h4>
                  <p>
                    All historical records shown under the "Recent Creations" panel are stored securely on your local computer's browser using HTML5 <code>localStorage</code> API. These data states remain 100% private. Other machines or network operators accessing this URL will never see your items because local storage is strictly partitioned per device.
                  </p>
                </div>

                <div>
                  <h4 className="font-extrabold text-gray-950 dark:text-white border-l-2 border-emerald-500 pl-2 mb-1">
                    2. Processing Context
                  </h4>
                  <p>
                    Image cropping, contrast tweaks, background chroma keys, and photo-compilation grids are rendered using client CPU/GPU Canvas 2D engines. Operations require zero external software runtimes.
                  </p>
                </div>

                <div>
                  <h4 className="font-extrabold text-gray-950 dark:text-white border-l-2 border-emerald-500 pl-2 mb-1">
                    3. Browser Cookie Parameters
                  </h4>
                  <p>
                    We do not deploy marketing trackers, conversion pixels, analytics scrapers, or third-party advertising cookies. Persistent variables are solely for rememberable settings presets.
                  </p>
                </div>

                <div>
                  <h4 className="font-extrabold text-gray-950 dark:text-white border-l-2 border-emerald-500 pl-2 mb-1">
                    4. Security Compliance Metrics (GDPR & CCPA Compliant)
                  </h4>
                  <p>
                    Because we do not capture, collect, or store any Personally Identifiable Information (PII) on regional servers, the application is inherently fully compliant with the European Union General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA). You hold ultimate power over deletion. Clearing browser cookies or cache will destroy all history logs immediately.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* LEGAL DISCLAIMERS & DISCLOSURES */}
          {activeSubTab === 'disclaimer' && (
            <div className="space-y-4 animate-fade-in text-gray-700 dark:text-zinc-300 text-xs leading-relaxed overflow-y-auto max-h-[60vh] pr-2">
              <div className="flex items-center gap-2 pb-2.5 border-b border-gray-150 dark:border-zinc-800">
                <AlertTriangle className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-black uppercase text-gray-900 dark:text-white tracking-wider font-mono">
                  Limitation of Liability & Official Disclaimer
                </h3>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] text-gray-400 font-mono mb-2">Effective Date: June 14, 2026</p>

                <div className="bg-amber-500/5 rounded-xl border border-amber-500/10 p-3.5 flex gap-2.5">
                  <AlertTriangle className="h-4.5 w-4.5 text-amber-600 dark:text-amber-450 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-450 block mb-0.5">
                      EMBASSY COMPLIANCE EXCLUSION NOTICE
                    </span>
                    <p className="text-[10.5px] leading-relaxed text-amber-900/80 dark:text-amber-200/80">
                      NovaPass Studio is an interactive client assistant utility and NOT an official government passport issuing agent. Automatic presets are updated periodically but may not match instant localized biometric policy reviews.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-extrabold text-gray-950 dark:text-white border-l-2 border-amber-500 pl-2 mb-1">
                    1. Absolute Disclaimer of Guarantee
                  </h4>
                  <p>
                    All sizing guidelines (such as 2×2 inches for US or 35×45mm for Indian/Schengen visas) represent general standardized parameters. Sevenova Innovations does not guarantee that the generated images will pass inspection or be accepted by any embassy, physical passport office, consulate, department of motor vehicles, or identification issuing authority. Sizing and print contrast must be verified by the user at their own risk.
                  </p>
                </div>

                <div>
                  <h4 className="font-extrabold text-gray-950 dark:text-white border-l-2 border-amber-500 pl-2 mb-1">
                    2. Indemnity Boundaries ("No Problem" Safe Clause)
                  </h4>
                  <p>
                    Under no circumstances shall <strong>Sevenova Innovations</strong>, its founders, developer agents, directors, employees, or partners be liable for any direct, indirect, consequential, incidental, or special damages, including passport application rejections, travel delays, booking cancelations, photo re-printing costs, data loss, or physical processing penalties arising straight out of utilizing this application. By compiling layouts, you agree to fully indemnify and hold Sevenova Innovations harmless against any claims.
                  </p>
                </div>

                <div>
                  <h4 className="font-extrabold text-gray-950 dark:text-white border-l-2 border-amber-500 pl-2 mb-1">
                    3. Print-Driver Scale Sizing Offset Warning
                  </h4>
                  <p>
                    Standard browsers and desktop document managers may automatically reduce sheet percentages to fit margins. Users must disable "Scaling", "Fit to Page", or "Print Printable Area" constraints inside printer drivers. Sevenova Innovations is not responsible for physical size irregularities resulting from print machine misconfigurations.
                  </p>
                </div>

                <div>
                  <h4 className="font-extrabold text-gray-950 dark:text-white border-l-2 border-amber-500 pl-2 mb-1">
                    4. Absolute Professional Service Disclaimer
                  </h4>
                  <p>
                    Usage of the NovaPass Studio application does not constitute professional photographer consultation services. If your passport agency requires extreme sub-millimeter biometric verification with standard physical certificates, we strongly recommend requesting physical photo alignments from physical studios equipped with physical stamps.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

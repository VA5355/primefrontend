import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Columns, Layout, Grid, Square, Type, 
  Image as ImageIcon, Menu, ChevronLeft, ChevronRight, 
  Play, Code, Save, Trash2, Layers, Move, ArrowUp, ArrowDown,
  Sparkles, Globe, CheckCircle2, Download, Flame, Palette
} from 'lucide-react';

// TOOLBOX ITEMS: Expanded with Hero Theme Templates
const TOOLBOX_ITEMS = [
  { id: 'hero-dark', name: 'Hero: Dark Tech (Orange)', icon: Layout, type: 'section' },
  { id: 'hero-blue', name: 'Hero: Glassmorphic (Blue)', icon: Layout, type: 'section' },
  { id: 'grid', name: 'Features Grid', icon: Grid, type: 'grid' },
  { id: 'text', name: 'Text Block', icon: Type, type: 'element' },
  { id: 'image', name: 'Media Holder', icon: ImageIcon, type: 'element' },
  { id: 'columns', name: '2 Column Split', icon: Columns, type: 'section' },
];

/* =========================================================
   1. HERO TEMPLATES (Matching Client Screen Specifications)
   ========================================================= */

// Hero Design 1: Dark Tech (Orange / Prime Computer Design 1)
const HeroDarkTech = ({ data }) => (
  <section className="w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 text-white font-sans relative">
    <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-black/40">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-orange-600/20 border border-orange-500/40 flex items-center justify-center font-bold text-orange-500 text-xl tracking-tighter">
          {data?.logoInitial || 'P'}
        </div>
        <div>
          <div className="font-extrabold tracking-wider text-sm text-white uppercase leading-none">{data?.brandName || 'PRIME COMPUTER'}</div>
          <div className="text-[9px] tracking-widest text-orange-500 uppercase font-semibold">{data?.subBrand || 'IT SOLUTIONS'}</div>
        </div>
      </div>
      <nav className="hidden md:flex items-center gap-6 text-xs text-slate-300 font-medium">
        <span className="text-orange-400 font-semibold cursor-pointer">Home</span>
        <span className="hover:text-white cursor-pointer transition-colors">Services</span>
        <span className="hover:text-white cursor-pointer transition-colors">Products</span>
        <span className="hover:text-white cursor-pointer transition-colors">About Us</span>
        <span className="hover:text-white cursor-pointer transition-colors">Contact</span>
      </nav>
    </header>

    <div className="relative grid grid-cols-1 md:grid-cols-2 items-center min-h-[360px] p-8 md:p-12 overflow-hidden">
      <div className="space-y-5 z-10">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight text-white uppercase">
          {data?.title || 'EMPOWERING YOUR'} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-200 to-white">
            {data?.highlightTitle || 'DIGITAL WORLD'}
          </span>
        </h1>
        <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-lg shadow-lg shadow-orange-950/40 text-xs tracking-wide transition-all">
          {data?.ctaText || 'Contact Sales'}
        </button>
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-full md:w-3/5 opacity-40 md:opacity-100 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent z-10"></div>
        <img 
          src={data?.imgUrl || "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1000&q=80"} 
          alt="IT Solutions" 
          className="w-full h-full object-cover object-center"
        />
      </div>
    </div>
  </section>
);

// Hero Design 2: Glassmorphic Blue (Prime Computer Design 2)
const HeroGlassBlue = ({ data }) => (
  <section className="w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 text-white font-sans relative">
    <div className="flex items-center justify-between px-8 py-5 bg-slate-950/90 border-b border-slate-800">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-blue-600/20 border border-blue-400/40 flex items-center justify-center font-black text-blue-400 text-2xl">
          {data?.logoInitial || 'P'}
        </div>
        <div>
          <div className="font-black text-lg tracking-wider text-white uppercase leading-none">{data?.brandName || 'PRIME COMPUTER'}</div>
          <div className="text-[10px] tracking-widest text-blue-400 uppercase font-semibold">{data?.subBrand || 'TECHNOLOGY SOLUTIONS'}</div>
        </div>
      </div>
    </div>

    <nav className="flex items-center justify-between px-8 py-3 bg-gradient-to-r from-slate-950 via-blue-950/40 to-slate-950 border-b border-blue-900/30 text-xs font-medium">
      <div className="flex items-center gap-6 text-slate-300">
        <span className="text-white font-semibold cursor-pointer">Home</span>
        <span className="hover:text-white cursor-pointer transition-colors">Services</span>
        <span className="hover:text-white cursor-pointer transition-colors">Products</span>
        <span className="hover:text-white cursor-pointer transition-colors">Support</span>
        <span className="hover:text-white cursor-pointer transition-colors">About Us</span>
      </div>
      <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-md shadow-md transition-colors">
        {data?.ctaText || 'Contact Sales'}
      </button>
    </nav>

    <div className="relative grid grid-cols-1 md:grid-cols-2 items-center min-h-[360px] p-8 md:p-12">
      <div className="space-y-4 z-10">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
          {data?.title || 'Empowering Your'} <br />
          <span className="text-blue-400">{data?.highlightTitle || 'Digital World'}</span>
        </h1>
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-full md:w-3/5 opacity-30 md:opacity-100 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent z-10"></div>
        <img 
          src={data?.imgUrl || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1000&q=80"} 
          alt="Technology Solutions" 
          className="w-full h-full object-cover object-left"
        />
      </div>
    </div>
  </section>
);

/* =========================================================
   2. MAIN COMPONENT BUILDER & DESIGNER INTERFACE
   ========================================================= */

export default function LayoutDesigner() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Initial canvas preset with the requested Dark Tech Hero section loaded
  const [canvasLayout, setCanvasLayout] = useState([
    { 
      id: 'hero-dark', 
      name: 'Hero: Dark Tech (Orange)', 
      icon: Layout, 
      type: 'section', 
      canvasId: 'hero-dark-initial', 
      size: 'w-full',
      customData: {
        brandName: 'PRIME COMPUTER',
        subBrand: 'IT SOLUTIONS',
        title: 'EMPOWERING YOUR',
        highlightTitle: 'DIGITAL WORLD',
        ctaText: 'Contact Sales',
        logoInitial: 'P'
      }
    },
    { id: 'grid', name: 'Features Grid', icon: Grid, type: 'grid', canvasId: 'grid-default-2', size: 'w-full' }
  ]);
  
  const [activeTab, setActiveTab] = useState('builder'); // builder | preview | code
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [isPublishedModalOpen, setIsPublishedModalOpen] = useState(false);

  // Layout Management Actions
  const addElementToCanvas = (item) => {
    const newElement = {
      ...item,
      canvasId: `${item.id}-${Date.now()}`,
      size: 'w-full'
    };
    setCanvasLayout(prev => [...prev, newElement]);
  };

  const removeElement = (canvasId) => {
    setCanvasLayout(prev => prev.filter(el => el.canvasId !== canvasId));
  };

  const moveElement = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= canvasLayout.length) return;
    const updated = [...canvasLayout];
    const [movedItem] = updated.splice(index, 1);
    updated.splice(newIndex, 0, movedItem);
    setCanvasLayout(updated);
  };

  // Drag and Drop reordering handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;
    const updated = [...canvasLayout];
    const [draggedItem] = updated.splice(draggedIndex, 1);
    updated.splice(dropIndex, 0, draggedItem);
    setCanvasLayout(updated);
    setDraggedIndex(null);
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      
      {/* SIDEBAR: Toolbox & Components */}
      <motion.div 
        animate={{ width: sidebarOpen ? 280 : 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="relative bg-slate-900 border-r border-slate-800 flex flex-col z-20 shrink-0"
      >
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col h-full w-[280px]"
            >
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="text-purple-400 h-5 w-5" />
                  <span className="font-semibold text-sm tracking-wide uppercase">Layout Designer</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">v2.0</span>
              </div>

              {/* Toolbox Sections */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Hero Layout Presets</h3>
                  <div className="space-y-2">
                    {TOOLBOX_ITEMS.filter(i => i.id.startsWith('hero')).map((item) => {
                      const Icon = item.icon;
                      return (
                        <motion.button
                          key={item.id}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => addElementToCanvas(item)}
                          className="w-full flex items-center gap-3 p-3 bg-slate-800/60 hover:bg-purple-950/40 border border-slate-700/60 hover:border-purple-500/50 rounded-lg text-left text-sm transition-colors text-slate-200 group"
                        >
                          <Icon className="h-4 w-4 text-orange-400 group-hover:text-purple-300 transition-colors" />
                          <span className="font-medium text-xs">{item.name}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Standard UI Elements</h3>
                  <div className="space-y-2">
                    {TOOLBOX_ITEMS.filter(i => !i.id.startsWith('hero')).map((item) => {
                      const Icon = item.icon;
                      return (
                        <motion.button
                          key={item.id}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => addElementToCanvas(item)}
                          className="w-full flex items-center gap-3 p-3 bg-slate-800/40 hover:bg-slate-800 border border-slate-700/60 rounded-lg text-left text-sm transition-colors text-slate-300 group"
                        >
                          <Icon className="h-4 w-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
                          <span className="font-medium text-xs">{item.name}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 space-y-1">
                  <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Palette size={13} className="text-amber-400" /> Payment & Client Note
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Toggle preview models using the upper bar to demonstrate live responsive variations to the client.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 bg-slate-800 border border-slate-700 p-1 rounded-full text-slate-400 hover:text-white shadow-lg transition-colors z-30"
        >
          {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </motion.div>

      {/* MAIN WORKSPACE AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* NAVBAR */}
        <header className="h-14 border-b border-slate-800 bg-slate-900/50 backdrop-blur flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="p-1.5 hover:bg-slate-800 rounded text-slate-400">
                <Menu size={18} />
              </button>
            )}
            <h1 className="text-md font-medium text-slate-200 flex items-center gap-2">
              GitHub Workspace <span className="text-slate-600">/</span> <span className="text-purple-400 font-mono">Prime_Computer_Home</span>
            </h1>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1">
            <button 
              onClick={() => setActiveTab('builder')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTab === 'builder' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Layout size={14} /> Builder
            </button>
            <button 
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTab === 'preview' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Play size={14} /> Live View
            </button>
            <button 
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTab === 'code' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Code size={14} /> Code
            </button>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCanvasLayout([])} 
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-900 hover:bg-red-950/40 text-slate-400 hover:text-red-400 font-medium rounded-md border border-slate-800 transition-colors"
            >
              <Trash2 size={13} /> Clear
            </button>
            <button 
              onClick={() => setIsPublishedModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-md shadow-md transition-all"
            >
              <Globe size={13} /> Publish Layout
            </button>
          </div>
        </header>

        {/* INTERACTIVE WORKSPACE SCREEN */}
        <main className="flex-1 overflow-y-auto p-8 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]">
          
          {/* TAB 1: Builder Canvas View */}
          {activeTab === 'builder' && (
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="text-center py-2 text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg bg-slate-950/40">
                Click components in sidebar or drag cards to assemble layout sequence dynamically.
              </div>

              <div className="space-y-4 min-h-[400px]">
                <AnimatePresence mode="popLayout">
                  {canvasLayout.map((element, index) => (
                    <motion.div
                      key={element.canvasId}
                      layout
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={(e) => handleDrop(e, index)}
                      initial={{ opacity: 0, y: 20, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                      className="group relative bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 rounded-xl p-5 shadow-xl transition-all cursor-grab active:cursor-grabbing"
                    >
                      {/* Controls overlay */}
                      <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/80 p-1 rounded-lg border border-slate-800 z-20">
                        <button 
                          onClick={() => moveElement(index, -1)}
                          disabled={index === 0}
                          className="p-1 hover:bg-slate-800 text-slate-400 disabled:opacity-30 hover:text-slate-200 rounded"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button 
                          onClick={() => moveElement(index, 1)}
                          disabled={index === canvasLayout.length - 1}
                          className="p-1 hover:bg-slate-800 text-slate-400 disabled:opacity-30 hover:text-slate-200 rounded"
                        >
                          <ArrowDown size={13} />
                        </button>
                        <button 
                          onClick={() => removeElement(element.canvasId)}
                          className="p-1 hover:bg-red-950 text-slate-400 hover:text-red-400 rounded"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div className="text-xs text-slate-500 mb-2 font-mono flex items-center gap-2">
                        <Move size={12} className="text-slate-600 group-hover:text-purple-400 transition-colors" />
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                        <span>Index #{index + 1} // {element.name}</span>
                      </div>

                      {/* Render Specific Blocks */}
                      {element.id === 'hero-dark' && <HeroDarkTech data={element.customData} />}
                      {element.id === 'hero-blue' && <HeroGlassBlue data={element.customData} />}

                      {element.id === 'grid' && (
                        <div className="grid grid-cols-3 gap-3 py-2">
                          <div className="h-20 bg-slate-800/40 rounded-lg p-2 border border-slate-800 flex items-center justify-center text-xs text-slate-600 font-mono">Service Card #1</div>
                          <div className="h-20 bg-slate-800/40 rounded-lg p-2 border border-slate-800 flex items-center justify-center text-xs text-slate-600 font-mono">Service Card #2</div>
                          <div className="h-20 bg-slate-800/40 rounded-lg p-2 border border-slate-800 flex items-center justify-center text-xs text-slate-600 font-mono">Service Card #3</div>
                        </div>
                      )}

                      {element.id === 'text' && (
                        <div className="space-y-2 py-2 bg-slate-950/30 rounded p-3 border border-slate-800/40">
                          <div className="h-3 bg-slate-800 rounded w-full"></div>
                          <div className="h-3 bg-slate-800 rounded w-5/6"></div>
                        </div>
                      )}

                      {element.id === 'image' && (
                        <div className="h-32 bg-slate-950/50 border border-dashed border-slate-800 rounded-lg flex flex-col items-center justify-center text-slate-500 gap-2">
                          <ImageIcon size={24} className="text-slate-600" />
                          <span className="text-xs font-mono">Asset Media Holder</span>
                        </div>
                      )}

                      {element.id === 'columns' && (
                        <div className="grid grid-cols-2 gap-4 py-2">
                          <div className="h-20 bg-slate-800/30 rounded-lg border border-slate-800 p-3"></div>
                          <div className="h-20 bg-slate-800/30 rounded-lg border border-slate-800 p-3"></div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {canvasLayout.length === 0 && (
                  <div className="py-16 text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
                    <Square size={32} className="mx-auto text-slate-600 mb-3" />
                    <p className="text-sm text-slate-400 font-medium">Your canvas layout is empty.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Clean Render Preview */}
          {activeTab === 'preview' && (
            <div className="max-w-4xl mx-auto space-y-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl min-h-[500px]">
              {canvasLayout.map((element) => (
                <div key={element.canvasId} className="w-full">
                  {element.id === 'hero-dark' && <HeroDarkTech data={element.customData} />}
                  {element.id === 'hero-blue' && <HeroGlassBlue data={element.customData} />}
                  
                  {element.id === 'grid' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="p-5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                          <div className="w-8 h-8 rounded-lg bg-orange-950/40 border border-orange-800/60 flex items-center justify-center text-orange-400 text-xs font-mono font-bold">
                            0{i}
                          </div>
                          <h4 className="text-sm font-semibold text-slate-200">IT Solutions Package</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">Enterprise server deployment, network infrastructure, and maintenance.</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {element.id === 'text' && (
                    <div className="py-4 text-slate-300 text-sm leading-relaxed bg-slate-950/40 p-5 rounded-xl border border-slate-800/60">
                      Prime Computer provides top-tier technology components and managed IT infrastructure services.
                    </div>
                  )}

                  {element.id === 'image' && (
                    <div className="py-4">
                      <div className="w-full h-48 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                        <ImageIcon size={32} className="text-orange-500" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Code Export Output */}
          {activeTab === 'code' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl font-mono text-xs">
                <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-slate-400">
                  <span>PrimeComputerHome.jsx</span>
                  <span className="text-[11px] text-emerald-400">Production Code Ready</span>
                </div>
                <pre className="p-6 text-slate-300 overflow-x-auto leading-relaxed">
{`import React from 'react';

export default function PrimeComputerHome() {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 p-4">
${canvasLayout.map(el => {
  if (el.id === 'hero-dark') {
    return `      {/* Dark Tech Hero Section */}
      <section className="w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 text-white">
        {/* Navigation & Hero Code Included */}
      </section>`;
  }
  if (el.id === 'hero-blue') {
    return `      {/* Glass Blue Hero Section */}
      <section className="w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 text-white">
        {/* Blue Navigation & Hero Code Included */}
      </section>`;
  }
  return `      {/* Component: ${el.name} */}
      <div className="w-full py-4" />;`;
}).join('\n\n')}
    </div>
  );
}`}
                </pre>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* PUBLISH CONFIRMATION MODAL */}
      {isPublishedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-emerald-400">
              <CheckCircle2 size={24} />
              <h3 className="text-lg font-bold text-white">Layout Published to Production</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              The layout configuration has been compiled. You can send this link directly to your client to confirm design sign-off.
            </p>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-400 truncate">
              https://primecomputer.com/itsolutions?mode=published
            </div>
            <div className="flex gap-2 pt-2">
              <button 
                onClick={() => setIsPublishedModalOpen(false)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-lg transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
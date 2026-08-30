import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Columns, Layout, Grid, Square, Type, 
  Image as ImageIcon, Menu, ChevronLeft, ChevronRight, 
  Play, Code, Save, Trash2, Layers, Move, ArrowUp, ArrowDown,
  Sparkles
} from 'lucide-react';

// Mock UI elements available to drag/click into the designer
const TOOLBOX_ITEMS = [
  { id: 'hero', name: 'Hero Section', icon: Layout, type: 'section' },
  { id: 'grid', name: 'Features Grid', icon: Grid, type: 'grid' },
  { id: 'text', name: 'Text Block', icon: Type, type: 'element' },
  { id: 'image', name: 'Media Holder', icon: ImageIcon, type: 'element' },
  { id: 'columns', name: '2 Column Split', icon: Columns, type: 'section' },
];

export default function LayoutDesigner() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [canvasLayout, setCanvasLayout] = useState([
    { id: 'hero', name: 'Hero Section', icon: Layout, type: 'section', canvasId: 'hero-default-1', size: 'w-full' },
    { id: 'grid', name: 'Features Grid', icon: Grid, type: 'grid', canvasId: 'grid-default-2', size: 'w-full' }
  ]);
  const [activeTab, setActiveTab] = useState('builder'); // builder | preview | code
  const [draggedIndex, setDraggedIndex] = useState(null);

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
              {/* Sidebar Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="text-purple-400 h-5 w-5" />
                  <span className="font-semibold text-sm tracking-wide uppercase">Layout Canvas</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">v1.0</span>
              </div>

              {/* Toolbox Sections */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Components</h3>
                  <div className="space-y-2">
                    {TOOLBOX_ITEMS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <motion.button
                          key={item.id}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => addElementToCanvas(item)}
                          className="w-full flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 rounded-lg text-left text-sm transition-colors text-slate-300 group"
                        >
                          <Icon className="h-4 w-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
                          <span className="font-medium">{item.name}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3 bg-purple-950/30 border border-purple-800/40 rounded-xl text-xs text-purple-300/80 space-y-1">
                  <div className="font-semibold text-purple-200 flex items-center gap-1.5">
                    <Sparkles size={13} /> Canvas Tip
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Click elements above to append them directly. Grab cards on the main workspace canvas to reorder layout sequences dynamically.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapse Button Indicator */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 bg-slate-800 border border-slate-700 p-1 rounded-full text-slate-400 hover:text-white shadow-lg transition-colors z-30"
        >
          {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </motion.div>

      {/* MAIN CONTAINER */}
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
              GitHub Workspace <span className="text-slate-600">/</span> <span className="text-purple-400 font-mono">Layout_Design_Beta</span>
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
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-md transition-colors shadow-sm">
              <Save size={13} /> Save Draft
            </button>
          </div>
        </header>

        {/* INTERACTIVE WORKSPACE SCREEN */}
        <main className="flex-1 overflow-y-auto p-8 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]">
          
          {/* TAB 1: Builder Canvas View */}
          {activeTab === 'builder' && (
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="text-center py-2 text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg bg-slate-950/40">
                Click components in sidebar or drag cards to assemble layout. Real-time DOM sequence sync.
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
                      {/* Interactive Drag & Delete Controls */}
                      <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/80 p-1 rounded-lg border border-slate-800">
                        <button 
                          onClick={() => moveElement(index, -1)}
                          disabled={index === 0}
                          className="p-1 hover:bg-slate-800 text-slate-400 disabled:opacity-30 hover:text-slate-200 rounded"
                          title="Move Up"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button 
                          onClick={() => moveElement(index, 1)}
                          disabled={index === canvasLayout.length - 1}
                          className="p-1 hover:bg-slate-800 text-slate-400 disabled:opacity-30 hover:text-slate-200 rounded"
                          title="Move Down"
                        >
                          <ArrowDown size={13} />
                        </button>
                        <button 
                          onClick={() => removeElement(element.canvasId)}
                          className="p-1 hover:bg-red-950 text-slate-400 hover:text-red-400 rounded"
                          title="Delete Item"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      {/* Block Type Indicators */}
                      <div className="text-xs text-slate-500 mb-2 font-mono flex items-center gap-2">
                        <Move size={12} className="text-slate-600 group-hover:text-purple-400 transition-colors" />
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                        <span>Index #{index + 1} // {element.name}</span>
                      </div>

                      {/* Simulated Block Layout Renderings */}
                      {element.id === 'hero' && (
                        <div className="py-6 text-center space-y-3 bg-slate-950/40 rounded-lg border border-slate-800/50 p-4">
                          <div className="h-6 w-3/4 bg-slate-800 rounded mx-auto"></div>
                          <div className="h-4 w-1/2 bg-slate-800/60 rounded mx-auto"></div>
                          <div className="h-8 w-28 bg-purple-600/30 border border-purple-500/30 rounded mx-auto mt-4"></div>
                        </div>
                      )}

                      {element.id === 'grid' && (
                        <div className="grid grid-cols-3 gap-3 py-2">
                          <div className="h-20 bg-slate-800/40 rounded-lg p-2 border border-slate-800 flex items-center justify-center text-xs text-slate-600 font-mono">Card item #1</div>
                          <div className="h-20 bg-slate-800/40 rounded-lg p-2 border border-slate-800 flex items-center justify-center text-xs text-slate-600 font-mono">Card item #2</div>
                          <div className="h-20 bg-slate-800/40 rounded-lg p-2 border border-slate-800 flex items-center justify-center text-xs text-slate-600 font-mono">Card item #3</div>
                        </div>
                      )}

                      {element.id === 'text' && (
                        <div className="space-y-2 py-2 bg-slate-950/30 rounded p-3 border border-slate-800/40">
                          <div className="h-3 bg-slate-800 rounded w-full"></div>
                          <div className="h-3 bg-slate-800 rounded w-5/6"></div>
                          <div className="h-3 bg-slate-800/60 rounded w-2/3"></div>
                        </div>
                      )}

                      {element.id === 'image' && (
                        <div className="h-36 bg-slate-950/50 border border-dashed border-slate-800 rounded-lg flex flex-col items-center justify-center text-slate-500 gap-2">
                          <ImageIcon size={24} className="text-slate-600" />
                          <span className="text-xs font-mono">Asset Storage Slot</span>
                        </div>
                      )}

                      {element.id === 'columns' && (
                        <div className="grid grid-cols-2 gap-4 py-2">
                          <div className="h-24 bg-slate-800/30 rounded-lg border border-slate-800 p-3 space-y-2">
                            <div className="h-3 bg-slate-700/50 rounded w-1/2"></div>
                            <div className="h-3 bg-slate-800/50 rounded w-5/6"></div>
                          </div>
                          <div className="h-24 bg-slate-800/30 rounded-lg border border-slate-800 p-3 space-y-2">
                            <div className="h-3 bg-slate-700/50 rounded w-1/2"></div>
                            <div className="h-3 bg-slate-800/50 rounded w-5/6"></div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {canvasLayout.length === 0 && (
                  <div className="py-16 text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
                    <Square size={32} className="mx-auto text-slate-600 mb-3" />
                    <p className="text-sm text-slate-400 font-medium">Your workspace layout canvas is completely empty.</p>
                    <p className="text-xs text-slate-600 mt-1">Select elements from the sidebar to assemble your design.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Clean Render Preview */}
          {activeTab === 'preview' && (
            <div className="max-w-4xl mx-auto space-y-8 bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl min-h-[500px]">
              {canvasLayout.map((element) => (
                <div key={element.canvasId} className="w-full">
                  {element.id === 'hero' && (
                    <section className="text-center py-12 px-4 space-y-4">
                      <h1 className="text-4xl font-extrabold text-white tracking-tight">Engineering Next-Gen Interfaces</h1>
                      <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
                        A GitHub-esque design layout framework powered by React, Motion & modern structural mechanics.
                      </p>
                      <button className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium text-xs transition-colors shadow-lg shadow-purple-900/20">
                        Explore Platform
                      </button>
                    </section>
                  )}

                  {element.id === 'grid' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="p-5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                          <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400 text-xs font-mono font-bold">
                            0{i}
                          </div>
                          <h4 className="text-sm font-semibold text-slate-200">Feature Container</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">High performance composable layout modules for React state managers.</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {element.id === 'text' && (
                    <div className="py-4 text-slate-300 text-sm leading-relaxed bg-slate-950/40 p-5 rounded-xl border border-slate-800/60">
                      This is a dynamic text module component. It can be easily structured inside your layout grids to outline documentation metadata, system configuration notes, or quick developer insights.
                    </div>
                  )}

                  {element.id === 'image' && (
                    <div className="py-4">
                      <div className="w-full h-48 bg-slate-950 border border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-400 space-y-2">
                        <ImageIcon size={32} className="text-purple-400" />
                        <span className="text-xs font-mono text-slate-500">Media Showcase Frame Container</span>
                      </div>
                    </div>
                  )}

                  {element.id === 'columns' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                      <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-purple-400">Section Alpha</h5>
                        <p className="text-xs text-slate-400 leading-relaxed">Dual column responsive flex framework providing automatic layout breaks.</p>
                      </div>
                      <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-purple-400">Section Beta</h5>
                        <p className="text-xs text-slate-400 leading-relaxed">Integrated seamless UI preview modules rendered directly into your tree visualizer.</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {canvasLayout.length === 0 && (
                <div className="text-center py-20 text-slate-500 font-mono text-xs">
                  // No layout modules added to display view.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Compiled Code Output */}
          {activeTab === 'code' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl font-mono text-xs">
                <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-slate-400">
                  <span>GeneratedLayout.jsx</span>
                  <span className="text-[11px] text-purple-400">React + Tailwind Components</span>
                </div>
                <pre className="p-6 text-slate-300 overflow-x-auto leading-relaxed">
{`import React from 'react';

export default function RenderedLayout() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-6">
${canvasLayout.map(el => {
  if (el.id === 'hero') {
    return `      {/* Hero Section */}
      <section className="text-center py-12 max-w-xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold text-white">Engineering Next-Gen Interfaces</h1>
        <p className="text-slate-400 text-sm">A GitHub-esque design layout framework powered by React.</p>
        <button className="px-5 py-2.5 bg-purple-600 text-white rounded-lg text-xs">Explore Platform</button>
      </section>`;
  }
  if (el.id === 'grid') {
    return `      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">Feature Module 1</div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">Feature Module 2</div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">Feature Module 3</div>
      </div>`;
  }
  if (el.id === 'text') {
    return `      {/* Text Block */}
      <p className="text-slate-300 text-sm leading-relaxed">
        This is a dynamic text module component structured inside your grid.
      </p>`;
  }
  if (el.id === 'image') {
    return `      {/* Media Holder */}
      <div className="w-full h-48 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center">
        <span className="text-xs text-slate-500">Media Showcase Frame Container</span>
      </div>`;
  }
  if (el.id === 'columns') {
    return `      {/* 2 Column Split */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">Column 1</div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">Column 2</div>
      </div>`;
  }
  return `      {/* Custom Component: ${el.name} */}
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
    </div>
  );
}
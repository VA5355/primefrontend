import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Type,
  Square,
  Image as ImageIcon,
  Layers,
  Trash2,
  Layout,
  Monitor,
  Smartphone,
  Tablet,
  Undo2,
  Redo2,
  Download,
  Plus,
  Move,
  Settings,
} from "lucide-react";

const ELEMENT_TYPES = [
  {
    type: "heading",
    label: "Heading",
    icon: Type,
    defaultContent: "New Heading",
    defaultStyles: "text-3xl font-extrabold text-slate-900",
  },
  {
    type: "paragraph",
    label: "Paragraph",
    icon: Type,
    defaultContent: "Click to edit this description text.",
    defaultStyles: "text-base text-slate-600",
  },
  {
    type: "button",
    label: "Button",
    icon: Square,
    defaultContent: "Click Me",
    defaultStyles:
      "px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg shadow-md",
  },
  {
    type: "image",
    label: "Image",
    icon: ImageIcon,
    defaultContent: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
    defaultStyles: "w-64 h-40 object-cover rounded-xl shadow-sm",
  },
  {
    type: "box",
    label: "Container Box",
    icon: Layout,
    defaultContent: "",
    defaultStyles:
      "w-full h-32 bg-slate-100 border border-dashed border-slate-300 rounded-xl",
  },
];

const VIEWPORTS = {
  desktop: {
    label: "Desktop",
    className: "w-full max-w-5xl",
  },
  tablet: {
    label: "Tablet",
    className: "w-[768px] max-w-[calc(100vw-4rem)]",
  },
  mobile: {
    label: "Mobile",
    className: "w-[390px] max-w-[calc(100vw-4rem)]",
  },
};

export default function StudioDesigner() {
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [viewportMode, setViewportMode] = useState("desktop");
  const [history, setHistory] = useState([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const canvasRef = useRef(null);

  const commit = (nextElements) => {
    const truncated = history.slice(0, historyIndex + 1);
    const nextHistory = [...truncated, nextElements];
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
    setElements(nextElements);
  };

  const undo = () => {
    if (historyIndex <= 0) return;
    const nextIndex = historyIndex - 1;
    setHistoryIndex(nextIndex);
    setElements(history[nextIndex]);
    setSelectedId(null);
  };

  const redo = () => {
    if (historyIndex >= history.length - 1) return;
    const nextIndex = historyIndex + 1;
    setHistoryIndex(nextIndex);
    setElements(history[nextIndex]);
    setSelectedId(null);
  };

  const addElement = (elementType) => {
    const template = ELEMENT_TYPES.find((item) => item.type === elementType);
    if (!template) return;

    const offset = elements.length * 18;
    const newElement = {
      id: `el-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: template.type,
      content: template.defaultContent,
      styles: template.defaultStyles,
      x: 48 + offset,
      y: 56 + offset,
    };

    const updated = [...elements, newElement];
    commit(updated);
    setSelectedId(newElement.id);
  };

  const updateSelectedElement = (key, value) => {
    if (!selectedId) return;

    const updated = elements.map((element) =>
      element.id === selectedId
        ? { ...element, [key]: value }
        : element,
    );

    commit(updated);
  };

  const deleteElement = (id) => {
    const updated = elements.filter((element) => element.id !== id);
    commit(updated);
    if (selectedId === id) setSelectedId(null);
  };

  const updateElementPosition = (id, info) => {
    const updated = elements.map((element) => {
      if (element.id !== id) return element;
      return {
        ...element,
        x: element.x + info.offset.x,
        y: element.y + info.offset.y,
      };
    });

    commit(updated);
  };

  const exportSchema = () => {
    const payload = {
      version: 1,
      viewportMode,
      elements,
      exportedAt: new Date().toISOString(),
    };

    const dataStr =
      "data:application/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(payload, null, 2));

    const anchor = document.createElement("a");
    anchor.href = dataStr;
    anchor.download = "studio-layout.json";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  const selectedElement = elements.find((element) => element.id === selectedId);

  const renderElement = (element) => {
    const commonClass = `group relative cursor-grab active:cursor-grabbing rounded-md ${
      element.styles || ""
    } ${
      selectedId === element.id
        ? "ring-2 ring-indigo-500 ring-offset-2"
        : "hover:ring-1 hover:ring-slate-300"
    }`;

    switch (element.type) {
      case "heading":
        return <h2 className={commonClass}>{element.content}</h2>;
      case "paragraph":
        return <p className={commonClass}>{element.content}</p>;
      case "button":
        return <button className={commonClass}>{element.content}</button>;
      case "image":
        return (
          <img
            src={element.content}
            alt="Designer element"
            className={commonClass}
            draggable={false}
          />
        );
      case "box":
        return <div className={commonClass} aria-label="Container box" />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-200">
      <header className="flex h-14 items-center justify-between border-b border-slate-800 bg-slate-900/70 px-4 backdrop-blur md:px-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-indigo-600 p-1.5">
            <Layout className="h-5 w-5 text-white" />
          </div>
          <span className="hidden bg-gradient-to-r from-white to-slate-400 bg-clip-text text-sm font-semibold tracking-wide text-transparent sm:block">
            STUDIO // ENGINE
          </span>
        </div>

        <div className="flex rounded-xl border border-slate-700 bg-slate-800 p-1">
          {[
            ["desktop", Monitor, "Desktop"],
            ["tablet", Tablet, "Tablet"],
            ["mobile", Smartphone, "Mobile"],
          ].map(([mode, Icon, label]) => (
            <button
              key={mode}
              type="button"
              title={label}
              onClick={() => setViewportMode(mode)}
              className={`rounded-lg p-2 transition-all ${
                viewportMode === mode
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
              }`}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            disabled={historyIndex <= 0}
            onClick={undo}
            title="Undo"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={historyIndex >= history.length - 1}
            onClick={redo}
            title="Redo"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Redo2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={exportSchema}
            className="ml-1 flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-lg transition hover:bg-emerald-500"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-3.5rem)] min-h-0">
        <aside className="hidden w-64 shrink-0 border-r border-slate-800 bg-slate-900/40 md:flex md:flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Add Elements
            </span>
            <Layers className="h-4 w-4 text-slate-500" />
          </div>

          <div className="grid gap-2 overflow-y-auto p-4">
            {ELEMENT_TYPES.map((item) => {
              const IconComp = item.icon;
              return (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => addElement(item.type)}
                  className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-left transition-all hover:border-slate-700 hover:bg-slate-800/60"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-slate-800 p-2 text-slate-400 transition-colors group-hover:text-indigo-400">
                      <IconComp className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-medium text-slate-300">
                      {item.label}
                    </span>
                  </div>
                  <Plus className="h-3.5 w-3.5 text-slate-600 group-hover:text-slate-400" />
                </button>
              );
            })}
          </div>
        </aside>

        <main className="relative min-w-0 flex-1 overflow-auto bg-slate-950 p-4 md:p-8">
          <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] [background-size:24px_24px]" />

          <div className="relative flex min-h-full justify-center">
            <motion.div
              layout
              ref={canvasRef}
              onClick={() => setSelectedId(null)}
              className={`relative min-h-[680px] shrink-0 overflow-hidden rounded-2xl border border-slate-200/20 bg-white text-slate-900 shadow-2xl transition-all duration-300 ${VIEWPORTS[viewportMode].className}`}
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-5 justify-between border-b border-dashed border-slate-100 px-2 text-[9px] text-slate-300">
                <span>0px</span>
                <span className="truncate px-2">Section Workspace Canvas</span>
                <span>{VIEWPORTS[viewportMode].label}</span>
              </div>

              <AnimatePresence>
                {elements.map((element) => (
                  <motion.div
                    key={element.id}
                    drag
                    dragMomentum={false}
                    dragElastic={0}
                    dragConstraints={canvasRef}
                    onDragEnd={(_, info) => updateElementPosition(element.id, info)}
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedId(element.id);
                    }}
                    style={{
                      position: "absolute",
                      top: element.y,
                      left: element.x,
                    }}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                  >
                    {selectedId === element.id && (
                      <div className="pointer-events-none absolute -top-6 left-0 flex items-center gap-1 rounded bg-indigo-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                        <Move className="h-2.5 w-2.5" />
                        {element.type.toUpperCase()}
                      </div>
                    )}
                    {renderElement(element)}
                  </motion.div>
                ))}
              </AnimatePresence>

              {elements.length === 0 && (
                <div className="pointer-events-none flex min-h-[680px] items-center justify-center p-8 text-center text-slate-300">
                  <div>
                    <Layout className="mx-auto mb-3 h-10 w-10 text-slate-200" />
                    <p className="text-sm font-semibold">Start designing</p>
                    <p className="mt-1 text-xs">
                      Add an element from the left panel.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </main>

        <aside className="hidden w-72 shrink-0 border-l border-slate-800 bg-slate-900/40 lg:flex lg:flex-col">
          <div className="flex items-center gap-2 border-b border-slate-800 p-4">
            <Settings className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Inspector
            </span>
          </div>

          {selectedElement ? (
            <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Object
                </p>
                <p className="mt-1 break-all text-xs text-slate-300">
                  {selectedElement.id}
                </p>
              </div>

              {selectedElement.type !== "box" && (
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-400">
                    Content
                  </span>
                  {selectedElement.type === "image" ? (
                    <input
                      type="text"
                      value={selectedElement.content}
                      onChange={(event) =>
                        updateSelectedElement("content", event.target.value)
                      }
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-200 outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  ) : (
                    <textarea
                      rows={3}
                      value={selectedElement.content}
                      onChange={(event) =>
                        updateSelectedElement("content", event.target.value)
                      }
                      className="w-full resize-none rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-200 outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  )}
                </label>
              )}

              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-slate-400">
                  Tailwind Classes
                </span>
                <textarea
                  rows={5}
                  value={selectedElement.styles}
                  onChange={(event) =>
                    updateSelectedElement("styles", event.target.value)
                  }
                  className="w-full resize-none rounded-lg border border-slate-800 bg-slate-950 p-2.5 font-mono text-xs text-slate-200 outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </label>

              <p className="text-[10px] leading-5 text-slate-500">
                Change utility classes such as bg-red-500, text-center,
                rounded-full, shadow-xl or px-8 to alter the selected element.
              </p>

              <button
                type="button"
                onClick={() => deleteElement(selectedElement.id)}
                className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl border border-rose-900/60 bg-rose-950/40 py-2.5 text-xs font-semibold tracking-wide text-rose-400 transition-colors hover:bg-rose-900/40"
              >
                <Trash2 className="h-4 w-4" />
                Delete Layer
              </button>
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center p-6 text-center">
              <div>
                <Layers className="mx-auto mb-3 h-8 w-8 text-slate-700" />
                <p className="text-xs font-semibold text-slate-500">
                  No active element
                </p>
                <p className="mt-1 text-[10px] leading-5 text-slate-600">
                  Select an element on the canvas to edit its content and
                  styles.
                </p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

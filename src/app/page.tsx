"use client";

import { useState, useEffect } from "react";
import { Sun, Moon, Plus, Trash2, Copy, Check, Wand2, XCircle } from "lucide-react";

interface InputItem {
  id: number;
  value: string;
}

interface OutputItem {
  id: number;
  original: string;
  slug: string;
  copied: boolean;
}

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [inputs, setInputs] = useState<InputItem[]>([{ id: 1, value: "" }]);
  const [outputs, setOutputs] = useState<OutputItem[]>([]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleGenerate = () => {
    const newOutputs: OutputItem[] = inputs
      .filter((input) => input.value.trim() !== "")
      .map((input) => ({
        id: Date.now() + input.id,
        original: input.value,
        slug: generateSlug(input.value),
        copied: false,
      }));
    setOutputs(newOutputs);
  };

  const handleClearAll = () => {
    setInputs([{ id: 1, value: "" }]);
    setOutputs([]);
  };

  const handleAddInput = () => {
    setInputs([...inputs, { id: Date.now(), value: "" }]);
  };

  const handleRemoveInput = (id: number) => {
    if (inputs.length > 1) {
      setInputs(inputs.filter((input) => input.id !== id));
    }
  };

  const handleInputChange = (id: number, value: string) => {
    setInputs(inputs.map((input) => (input.id === id ? { ...input, value } : input)));
  };

  const handleCopy = async (id: number) => {
    const output = outputs.find((o) => o.id === id);
    if (output?.slug) {
      await navigator.clipboard.writeText(output.slug);
      setOutputs(outputs.map((o) => (o.id === id ? { ...o, copied: true } : o)));
      setTimeout(() => {
        setOutputs(outputs.map((o) => (o.id === id ? { ...o, copied: false } : o)));
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300 relative overflow-x-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 -left-20 sm:left-0 w-[300px] sm:w-[400px] lg:w-[500px] h-full min-h-[600px] sm:min-h-[800px] bg-gradient-to-br from-cyan-100/60 to-teal-100/60 dark:from-cyan-950/40 dark:to-teal-950/40 rounded-full blur-2xl sm:blur-3xl" />
        <div className="absolute top-0 -right-20 sm:right-0 w-[300px] sm:w-[400px] lg:w-[500px] h-full min-h-[600px] sm:min-h-[800px] bg-gradient-to-tl from-blue-100/60 to-cyan-100/60 dark:from-blue-950/40 dark:to-cyan-950/40 rounded-full blur-2xl sm:blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <header className="flex items-center justify-between mb-6 sm:mb-8 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-[0_8px_30px_rgba(6,182,212,0.3)] flex-shrink-0">
              <span className="text-lg sm:text-xl font-bold text-white">S</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate hidden min-[360px]:block">
              Transform text into URL-friendly slugs
            </p>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_28px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_6px_28px_rgba(0,0,0,0.5)] transition-all duration-300 flex items-center justify-center flex-shrink-0"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>
        </header>

        <main className="space-y-6 sm:space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-[0_8px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.3)] overflow-hidden">
            <div className="sticky top-0 z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-200">
                Input Text
              </h2>
              <button
                onClick={handleAddInput}
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg sm:rounded-xl font-medium text-sm shadow-[0_4px_16px_rgba(6,182,212,0.3)] hover:shadow-[0_6px_24px_rgba(6,182,212,0.4)] transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add More</span>
              </button>
            </div>

            <div className="p-4 sm:p-6 lg:p-8 space-y-3 sm:space-y-4 max-h-[60vh] sm:max-h-[50vh] overflow-y-auto">
              {inputs.map((input) => (
                <div key={input.id} className="relative group">
                  <textarea
                    value={input.value}
                    onChange={(e) => handleInputChange(input.id, e.target.value)}
                    placeholder="Enter your text here..."
                    className="w-full h-20 sm:h-[100px] px-4 sm:px-5 py-3 sm:py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl resize-none text-sm sm:text-base text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/15 transition-all duration-300"
                  />
                  {inputs.length > 1 && (
                    <button
                      onClick={() => handleRemoveInput(input.id)}
                      className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-red-100 dark:bg-red-900/30 text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-200 dark:hover:bg-red-900/50"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="sticky bottom-0 z-10 flex flex-col sm:flex-row gap-3 sm:gap-4 px-4 sm:px-6 lg:py-4 py-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={handleGenerate}
                className="flex-1 flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-lg shadow-[0_8px_32px_rgba(6,182,212,0.35)] hover:shadow-[0_12px_40px_rgba(6,182,212,0.45)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Wand2 className="w-4 sm:w-5 h-4 sm:h-5" />
                Generate
              </button>
              <button
                onClick={handleClearAll}
                className="flex-1 flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-lg border-2 border-slate-200 dark:border-slate-700 shadow-[0_4px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:border-red-300 dark:hover:border-red-700 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-300"
              >
                <XCircle className="w-4 sm:w-5 h-4 sm:h-5" />
                Clear All
              </button>
            </div>
          </div>

          {outputs.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-[0_8px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.3)] p-4 sm:p-6 lg:p-8">
              <h2 className="text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4 sm:mb-6">
                Generated Slugs
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {outputs.map((output) => (
                  <div
                    key={output.id}
                    onClick={() => handleCopy(output.id)}
                    className="relative group cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative p-4 sm:p-5 bg-slate-100 dark:bg-slate-800 rounded-xl sm:rounded-2xl border-2 border-slate-200 dark:border-slate-700 group-hover:border-transparent transition-all duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                            Original
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-300 truncate">
                            {output.original}
                          </p>
                        </div>
                        <div className="hidden sm:block w-px h-10 bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                            Slug
                          </p>
                          <p className="text-sm font-mono text-cyan-600 dark:text-cyan-400 truncate">
                            {output.slug}
                          </p>
                        </div>
                        <div className="sm:ml-2">
                          {output.copied ? (
                            <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-emerald-500 text-white rounded-lg sm:rounded-xl shadow-[0_4px_12px_rgba(16,185,129,0.3)]">
                              <Check className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                              <span className="text-xs sm:text-sm font-medium">Copied!</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg sm:rounded-xl opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm shadow-[0_4px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                              <Copy className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                              <span className="text-xs sm:text-sm font-medium whitespace-nowrap">Copy</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

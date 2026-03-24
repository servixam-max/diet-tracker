"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Copy, Check, X, Calendar, Clock, ChefHat, FileText } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface PlanTemplate {
  id: string;
  name: string;
  planData: any[];
  targetCalories: number;
  userId?: string;
  createdAt: string;
}

interface PlanTemplateProps {
  userId: string;
  currentPlan?: any[];
  currentTargetCalories?: number;
  onSaveTemplate?: (template: PlanTemplate) => void;
  onLoadTemplate?: (template: PlanTemplate) => void;
  onCopyPreviousWeek?: () => void;
}

export function PlanTemplate({ 
  userId, 
  currentPlan, 
  currentTargetCalories,
  onSaveTemplate,
  onLoadTemplate,
  onCopyPreviousWeek 
}: PlanTemplateProps) {
  const [showModal, setShowModal] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [savedTemplates, setSavedTemplates] = useState<PlanTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const { light, success } = useHaptic();

  async function saveCurrentPlanAsTemplate() {
    if (!currentPlan || !templateName.trim()) return;
    
    light();
    setLoading(true);
    
    try {
      const newTemplate: PlanTemplate = {
        id: crypto.randomUUID(),
        userId,
        name: templateName.trim(),
        planData: currentPlan,
        targetCalories: currentTargetCalories || 2000,
        createdAt: new Date().toISOString(),
      };
      
      // Save to localStorage (can be upgraded to Supabase later)
      const existing = JSON.parse(localStorage.getItem(`plan_templates_${userId}`) || "[]");
      const updated = [...existing, newTemplate];
      localStorage.setItem(`plan_templates_${userId}`, JSON.stringify(updated));
      
      setSavedTemplates(updated);
      
      if (onSaveTemplate) {
        onSaveTemplate(newTemplate);
      }
      
      success();
      setTemplateName("");
      setShowModal(false);
    } catch (error) {
      console.error("Error saving template:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadTemplate(template: PlanTemplate) {
    light();
    
    if (onLoadTemplate) {
      onLoadTemplate(template);
    }
    
    success();
    setShowModal(false);
  }

  async function copyPreviousWeek() {
    if (!onCopyPreviousWeek) return;
    
    light();
    await onCopyPreviousWeek();
    success();
    setShowModal(false);
  }

  async function deleteTemplate(templateId: string) {
    light();
    
    const updated = savedTemplates.filter(t => t.id !== templateId);
    setSavedTemplates(updated);
    localStorage.setItem(`plan_templates_${userId}`, JSON.stringify(updated));
  }

  return (
    <div className="space-y-3">
      {/* Template actions button */}
      <button
        onClick={() => { light(); setShowModal(true); }}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 font-medium flex items-center justify-center gap-2 hover:bg-purple-500/30 transition-colors"
      >
        <Calendar size={18} />
        Gestionar plantillas
      </button>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            
            <motion.div
              className="relative w-full max-w-lg bg-[#121218] rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
            >
              <div className="w-12 h-1 bg-zinc-700 rounded-full mx-auto mb-4" />
              
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Plantillas de plan</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-lg hover:bg-white/10"
                >
                  <X size={20} className="text-zinc-400" />
                </button>
              </div>

              {/* Save current plan */}
              {currentPlan && (
                <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Save size={18} className="text-purple-400" />
                    Guardar plan actual
                  </h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nombre de la plantilla..."
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/10 outline-none focus:border-purple-500/50 text-sm"
                      onKeyDown={(e) => e.key === "Enter" && saveCurrentPlanAsTemplate()}
                    />
                    <button
                      onClick={saveCurrentPlanAsTemplate}
                      disabled={!templateName.trim() || loading}
                      className="px-4 py-2 rounded-lg bg-purple-500 text-white text-sm font-medium disabled:opacity-50"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              )}

              {/* Copy previous week */}
              <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Copy size={18} className="text-cyan-400" />
                  Copiar de semana anterior
                </h4>
                <button
                  onClick={copyPreviousWeek}
                  className="w-full py-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-sm font-medium hover:bg-cyan-500/30 transition-colors"
                >
                  Copiar semana anterior
                </button>
              </div>

              {/* Saved templates */}
              {savedTemplates.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <FileText size={18} className="text-green-400" />
                    Plantillas guardadas
                  </h4>
                  <div className="space-y-2">
                    {savedTemplates.map((template) => (
                      <div
                        key={template.id}
                        className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{template.name}</p>
                          <div className="flex items-center gap-3 text-xs text-zinc-500">
                            <span className="flex items-center gap-1">
                              <Flame size={12} className="text-orange-400" />
                              {template.targetCalories} kcal
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              {new Date(template.createdAt).toLocaleDateString("es-ES")}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => loadTemplate(template)}
                            className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => deleteTemplate(template.id)}
                            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {savedTemplates.length === 0 && (
                <div className="text-center py-8 text-zinc-500">
                  <Calendar size={48} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No hay plantillas guardadas</p>
                  <p className="text-xs mt-1">Guarda tu plan actual como plantilla para reutilizarlo</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Flame icon for inline use
function Flame({ size, className }: { size: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 2 3.5 2 5.5a7 7 0 1 1-14 0c0-1.1.2-2.2.5-3.3.3.9.5 1.8.5 2.8z"/>
    </svg>
  );
}

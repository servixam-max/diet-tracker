"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckSquare, Plus, Check, Trash2, Sparkles } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
}

interface TodoListProps {
  userId: string;
}

export function TodoList({ userId }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>([
    { id: "1", text: "Registrar desayuno", completed: false, priority: "high" },
    { id: "2", text: "Beber 8 vasos de agua", completed: true, priority: "medium" },
    { id: "3", text: "30 min de ejercicio", completed: false, priority: "high" },
    { id: "4", text: "Preparar comida para mañana", completed: false, priority: "low" },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const [newPriority, setNewPriority] = useState<"high" | "medium" | "low">("medium");
  const { light, success } = useHaptic();

  function toggleTodo(id: string) {
    light();
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }

  function addTodo() {
    if (!newTodo.trim()) return;
    
    light();
    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false,
      priority: newPriority,
    };
    setTodos([...todos, todo]);
    setNewTodo("");
    setShowAdd(false);
    success();
  }

  function removeTodo(id: string) {
    light();
    setTodos(todos.filter(todo => todo.id !== id));
  }

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;

  function getPriorityColor(priority: Todo["priority"]) {
    switch (priority) {
      case "high": return "border-red-500/40 bg-red-500/10";
      case "medium": return "border-yellow-500/40 bg-yellow-500/10";
      case "low": return "border-green-500/40 bg-green-500/10";
    }
  }

  function getPriorityDot(priority: Todo["priority"]) {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckSquare size={18} className="text-teal-400" />
          <h3 className="font-semibold">Tareas del día</h3>
        </div>
        <span className="text-sm text-zinc-500">{completedCount}/{totalCount}</span>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500"
          initial={{ width: 0 }}
          animate={{ width: `${(completedCount / totalCount) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Todo list */}
      <div className="space-y-2">
        <AnimatePresence>
          {todos.map((todo, index) => (
            <motion.div
              key={todo.id}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                todo.completed
                  ? "bg-teal-500/5 border-teal-500/20"
                  : getPriorityColor(todo.priority)
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  todo.completed
                    ? "bg-teal-500 border-teal-500"
                    : "border-zinc-600 hover:border-teal-500"
                }`}
              >
                {todo.completed && <Check size={14} className="text-white" />}
              </button>

              <div className="flex-1 min-w-0">
                <p className={`font-medium ${todo.completed ? "line-through text-zinc-500" : ""}`}>
                  {todo.text}
                </p>
                {!todo.completed && (
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className={`w-2 h-2 rounded-full ${getPriorityDot(todo.priority)}`} />
                    <span className="text-xs text-zinc-500">
                      {todo.priority === "high" ? "Alta" : todo.priority === "medium" ? "Media" : "Baja"}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => removeTodo(todo.id)}
                className="p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add new todo */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <input
              type="text"
              placeholder="Nueva tarea..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-teal-500/50"
              autoFocus
            />
            <div className="flex gap-2">
              {(["high", "medium", "low"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setNewPriority(p)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                    newPriority === p
                      ? p === "high"
                        ? "bg-red-500/20 text-red-400 border border-red-500/40"
                        : p === "medium"
                        ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40"
                        : "bg-green-500/20 text-green-400 border border-green-500/40"
                      : "bg-white/5 text-zinc-400"
                  }`}
                >
                  {p === "high" ? "Alta" : p === "medium" ? "Media" : "Baja"}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <motion.button
                onClick={() => { light(); setShowAdd(false); }}
                className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400"
                whileTap={{ scale: 0.98 }}
              >
                Cancelar
              </motion.button>
              <motion.button
                onClick={addTodo}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-medium"
                whileTap={{ scale: 0.98 }}
              >
                Añadir
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showAdd && (
        <motion.button
          onClick={() => { light(); setShowAdd(true); }}
          className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-400 font-medium flex items-center justify-center gap-2"
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={18} />
          Añadir tarea
        </motion.button>
      )}

      {/* AI suggestions */}
      {completedCount === totalCount && totalCount > 0 && (
        <motion.div
          className="p-3 rounded-xl bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-teal-400" />
            <span className="text-sm text-teal-300">¡Todas las tareas completadas! 🎉</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

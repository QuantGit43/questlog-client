"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import debounce from "lodash/debounce";
import { taskService } from "@/services/taskService";
import { CreateTaskRequest, TaskCategory, TaskComplexityResponse, Task } from "@/types/tasks";

interface CreateModalProps {
  onClose: () => void;
  onCreated: (task: Task) => void;
}

export const CreateModal = ({ onClose, onCreated }: CreateModalProps) => {
  const [aiLoading, setAiLoading] = useState(false);
  const [preview, setPreview] = useState<TaskComplexityResponse | null>(null);
  
  const [formData, setFormData] = useState<CreateTaskRequest>({
    title: "",
    description: "",
    type: "Daily",
    category: TaskCategory.Career,
    dueDate: "",
  });

const fetchAiComplexity = useCallback(
    debounce(async (title: string, desc?: string) => {
        if (!title || title.length < 3) {
            setPreview(null);
            return;
        }

        setAiLoading(true);

        try {
            const result = await taskService.analyzeComplexity(title, desc ?? "");
            
            setPreview(result);

            setFormData(prev => {
                const newData = { ...prev };
                if (result.category && Object.keys(TaskCategory).includes(result.category)) {
                    newData.category = result.category as unknown as TaskCategory;
                }


                return newData;
            });

        } catch (error) {
            console.error("AI analysis failed:", error);
            setPreview(null);
        } finally {
            setAiLoading(false);
        }
    }, 1000), 
    []
);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "title" || name === "description") {
        fetchAiComplexity(
          name === "title" ? value : updated.title,
          name === "description" ? value : updated.description
        );
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const payload: CreateTaskRequest = {
            ...formData,
            dueDate: formData.dueDate === "" ? undefined : formData.dueDate,
            xpReward: preview?.xpReward,
            goldReward: preview?.goldReward,
            difficulty: preview?.difficulty
        };

        const newTask = await taskService.create(payload);

        onCreated(newTask);
    } catch (error) {
        console.error(" Error creating task:", error);
        console.groupEnd();
    }
};

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4 backdrop-blur-sm animate-fade-in">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-[500px] h-[550px] bg-no-repeat bg-contain bg-center flex flex-col items-center px-12 py-10 text-[#3e2723] font-pixel"
        style={{ backgroundImage: "url('/images/dashboard/Frame.png')" }} 
      >
        <button 
            onClick={onClose} 
            className="absolute top-18 right-9 text-[#5d4037] hover:text-red-700 font-bold text-2xl transition-colors"
        >
            ×
        </button>

        <h2 className="text-3xl mb-6 mt-8 font-bold uppercase tracking-widest text-[#3e2723] drop-shadow-sm">
            New Quest
        </h2>
        
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            
            <div className="relative group">
                <input 
                    name="title" 
                    placeholder="Quest Title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    required 
                    autoFocus
                    className="w-full bg-[#C38759] text-[#fdf5e6] placeholder-[#fdf5e6]/60 rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#5d4037] shadow-inner font-bold text-lg transition-all"
                />
                {aiLoading && (
                   <div className="absolute right-3 top-3 animate-spin h-5 w-5 border-2 border-[#fdf5e6] border-t-transparent rounded-full" />
                )}
            </div>

            <textarea 
                name="description" 
                placeholder="Description (optional)" 
                value={formData.description} 
                onChange={handleChange}
                className="w-full bg-[#C38759] text-[#fdf5e6] placeholder-[#fdf5e6]/60 rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#5d4037] shadow-inner text-sm resize-none h-24 font-medium custom-scrollbar"
            />
            <div className="flex items-center justify-between mt-2 gap-2">
                <div className="relative w-1/2">
                    <select 
                        name="category" 
                        value={formData.category} 
                        onChange={handleChange} 
                        className="w-full bg-[#c29b6d] text-[#3e2723] rounded-lg px-3 py-2 outline-none border-2 border-[#8d6e63] font-bold text-sm cursor-pointer shadow-sm hover:brightness-110"
                    >
                        {Object.keys(TaskCategory).filter((key) => isNaN(Number(key))).map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-[#5d4037]">
                    <div className="flex items-center gap-1">
                        <span>XP:</span>
                        <div className="bg-[#c29b6d] border-2 border-[#8d6e63] rounded w-12 h-8 flex items-center justify-center shadow-inner text-[#fdf5e6]">
                           {preview ? (
                               <motion.span initial={{ scale: 0.5 }} animate={{ scale: 1 }}>{preview.xpReward}</motion.span>
                           ) : (
                               <span className="opacity-50 text-xs">-</span>
                           )}
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <span>Gold:</span>
                        <div className="bg-[#c29b6d] border-2 border-[#8d6e63] rounded w-12 h-8 flex items-center justify-center shadow-inner text-yellow-200">
                           {preview ? (
                               <motion.span initial={{ scale: 0.5 }} animate={{ scale: 1 }}>{preview.goldReward}</motion.span>
                           ) : (
                               <span className="opacity-50 text-xs">-</span>
                           )}
                        </div>
                    </div>

                </div>
            </div>
            {preview && (
                <div className="text-center text-[14px] font-bold uppercase tracking-widest text-[#5d4037]/70 -mt-1">
                    Difficulty: <span className="text-[#3e2723]">{preview.difficulty}</span>
                </div>
            )}
            <div className="flex justify-center mt-4">
                <button 
                    type="submit" 
                    disabled={aiLoading}
                    className="w-40 h-12 bg-contain bg-center bg-no-repeat text-[#fdf5e6] font-bold text-lg uppercase tracking-wide pt-1 hover:brightness-110 active:scale-95 transition-all disabled:grayscale shadow-lg drop-shadow-md"
                    style={{ backgroundImage: "url('/images/dashboard/button.png')" }}
                >
                </button>
            </div>

        </form>
      </motion.div>
    </div>
  );
};
"use client";
import React from "react";
import Modal from "./Modal";
import { AlertTriangle, Trash2, LogOut } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  type?: "danger" | "warning" | "info"; 
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  type = "warning",
}: ConfirmModalProps) {
  
  const styles = {
    danger: {
      icon: <Trash2 size={24} className="text-red-400" />,
      iconBg: "bg-red-400/10 border-red-400/20",
      btnClass: "bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]",
    },
    warning: {
      icon: <AlertTriangle size={24} className="text-yellow-400" />,
      iconBg: "bg-yellow-400/10 border-yellow-400/20",
      btnClass: "bg-yellow-500 hover:bg-yellow-600 text-black font-bold shadow-[0_0_15px_rgba(234,179,8,0.3)]",
    },
    info: {
      icon: <LogOut size={24} className="text-primary" />,
      iconBg: "bg-primary/10 border-primary/20",
      btnClass: "bg-primary hover:bg-primary-fixed text-[#23005c] font-bold shadow-[0_0_15px_rgba(208,188,255,0.3)]",
    },
  };

  const currentStyle = styles[type];

  return (
    <Modal isOpen={isOpen} onClose={!isLoading ? onClose : () => {}} maxWidth="sm">
      <div className="flex flex-col items-center text-center">
        
        {/* Animated Icon Ring */}
        <div className={`w-16 h-16 rounded-full border flex items-center justify-center mb-4 ${currentStyle.iconBg}`}>
          {currentStyle.icon}
        </div>

        {/* Content */}
        <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
        <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 w-full">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 px-4 rounded-lg font-medium text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${currentStyle.btnClass}`}
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
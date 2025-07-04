"use client"

import { useState, useCallback } from "react"
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

export type ToastType = "success" | "error" | "warning" | "info"

export interface Toast {
    id: string
    message: string
    type: ToastType
    duration?: number
}

let toastCount = 0

export function useToast() {
    const [toasts, setToasts] = useState<Toast[]>([])

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, [])

    const addToast = useCallback((message: string, type: ToastType, duration = 5000) => {
        const id = `toast-${++toastCount}`
        const newToast: Toast = { id, message, type, duration }

        setToasts((prev) => [...prev, newToast])

        // Auto remove after duration
        setTimeout(() => {
            removeToast(id)
        }, duration)

        return id
    }, [removeToast])

    const success = useCallback((message: string) => addToast(message, "success"), [addToast])
    const error = useCallback((message: string) => addToast(message, "error"), [addToast])
    const warning = useCallback((message: string) => addToast(message, "warning"), [addToast])
    const info = useCallback((message: string) => addToast(message, "info"), [addToast])

    // Toast component
    const ToastContainer = useCallback(() => {
        if (toasts.length === 0) return null

        const getIcon = (type: ToastType) => {
            switch (type) {
                case "success": return <CheckCircle className="h-5 w-5 text-green-500" />
                case "error": return <XCircle className="h-5 w-5 text-red-500" />
                case "warning": return <AlertTriangle className="h-5 w-5 text-yellow-500" />
                case "info": return <Info className="h-5 w-5 text-blue-500" />
            }
        }

        const getStyles = (type: ToastType) => {
            switch (type) {
                case "success": return "bg-green-50 border-green-200 text-green-800"
                case "error": return "bg-red-50 border-red-200 text-red-800"
                case "warning": return "bg-yellow-50 border-yellow-200 text-yellow-800"
                case "info": return "bg-blue-50 border-blue-200 text-blue-800"
            }
        }

        return (
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg transition-all duration-300 ease-in-out animate-in slide-in-from-right-full ${getStyles(toast.type)}`}
                    >
                        <div className="flex-shrink-0">{getIcon(toast.type)}</div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{toast.message}</p>
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="flex-shrink-0 p-1 rounded-md hover:bg-black/10 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        )
    }, [toasts, removeToast])

    return {
        success,
        error,
        warning,
        info,
        ToastContainer,
    }
}

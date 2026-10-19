import type React from "react";

export default function ReusableModal(
    { isOpen, onClose, children }
    :{ isOpen: boolean, onClose: () => void, children?: React.ReactNode }
) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 min-h-full bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white min-h-50 p-6 rounded-lg shadow-lg max-w-md w-full relative">
                <div className="inline-flex self-end">
                    <button
                        onClick={onClose}
                        className="absolute text-3xl top-2 right-2 text-gray-500 hover:text-gray-700 hover:cursor-pointer">
                        &times;
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
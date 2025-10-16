"use client";

import { createContext, useState } from "react";

interface IFormStatus {
    isValid: boolean
    isSubmitting: boolean
    dirty: boolean
    status: any
    values: any
    setSubmitting: (isSubmitting: boolean) => void
    validateForm: (values?: any) => void
}

interface FormStatusContextType {
    formStatus: IFormStatus | undefined
    updateFromStatus: (formStatus: IFormStatus) => void

}
export const FormStatusContext = createContext<FormStatusContextType | undefined>(undefined);
export const FormStatusProvider = ({ children }: { children: React.ReactNode }) => {
    const [formStatus, updateFromStatus] = useState<IFormStatus>()

    return (
        <FormStatusContext.Provider value={{ formStatus, updateFromStatus }}>
            {children}
        </FormStatusContext.Provider>
    );
};


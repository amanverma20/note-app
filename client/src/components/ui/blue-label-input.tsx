import type { InputHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface BlueLabelInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    registration?: UseFormRegisterReturn;
    error?: string;
}

export const BlueLabelInput = ({
    label,
    registration,
    error,
    ...props
}: BlueLabelInputProps) => {
    return (
        <div className="w-full">
            <Label className="text-blue-600 mb-1 block">{label}</Label>
            <Input
                {...props}
                {...registration}
                className="border border-blue-500 focus:border-blue-600 focus:ring-0 rounded-lg"
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
    );
};

import { useEffect, useState, type InputHTMLAttributes} from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import clsx from "clsx";

interface FloatingLabelInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    registration?: UseFormRegisterReturn;
    error?: string;
    value?: string;
}

export const FloatingLabelInput = ({
    label,
    registration,
    error,
    value,
    ...props
}: FloatingLabelInputProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(Boolean(value));

    useEffect(() => {
        setHasValue(Boolean(value));
    }, [value]);

    return (
        <div className="relative w-full">
            <input
                {...props}
                {...registration}
                onFocus={() => setIsFocused(true)}
                onBlur={(e) => {
                    setIsFocused(false);
                    setHasValue(!!e.target.value);
                }}
                className={clsx(
                    "peer w-full border border-blue-500 rounded-md px-3 pt-5 pb-2 text-sm text-black outline-none",
                    error ? "border-red-500" : "border-blue-500"
                )}
                placeholder=" "
            />
            <label
                className={clsx(
                    "absolute left-3 transition-all bg-white px-1 text-blue-600",
                    {
                        "text-xs -top-2": isFocused || hasValue,
                        "top-3 text-sm": !isFocused && !hasValue,
                    }
                )}
            >
                {label}
            </label>
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
    );
};

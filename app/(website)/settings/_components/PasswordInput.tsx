"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type PasswordInputProps = {
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

export function PasswordInput({ label, value, onChange, placeholder }: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[16px] text-[#2C2C2C] dark:text-[#FFFFFF]">{label}</label>
      <div className="flex items-center border border-[#D7D7D7] rounded-[4px] px-3.5 h-[50px] gap-2">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-0 outline-none text-[color:var(--text-primary)] text-sm tracking-widest"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="text-[color:var(--text-muted)] flex items-center bg-transparent border-0 cursor-pointer p-0"
        >
          {show ? (
            <EyeOff size={20} className="!text-[#7D7D7D] dark:!text-white" />
          ) : (
            <Eye size={20} className="!text-[#7D7D7D] dark:!text-white" />
          )}
        </button>
      </div>
    </div>
  );
}

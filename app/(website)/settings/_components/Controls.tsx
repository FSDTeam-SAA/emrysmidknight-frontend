"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/* ─── Toggle ─────────────────────────────────────────────── */
type ToggleProps = {
  checked: boolean;
  onChange: () => void;
};

export function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      className={`relative w-11 h-6 rounded-full border-0 cursor-pointer transition-colors duration-200 shrink-0 ${
        checked ? "bg-[color:var(--accent)]" : "bg-[color:var(--border)]"
      }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${
          checked ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

/* ─── Password Input ──────────────────────────────────────── */
type PasswordInputProps = {
  label: string;
  defaultValue?: string;
};

export function PasswordInput({ label, defaultValue = "password123" }: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] text-[color:var(--text-secondary)]">{label}</label>
      <div className="flex items-center bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-lg px-3.5 py-2.5 gap-2">
        <input
          type={show ? "text" : "password"}
          defaultValue={defaultValue}
          className="flex-1 bg-transparent border-0 outline-none text-[color:var(--text-primary)] text-sm tracking-widest"
        />
        <button
          onClick={() => setShow(!show)}
          className="text-[color:var(--text-muted)] flex items-center bg-transparent border-0 cursor-pointer p-0"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

/* ─── Radio Option ────────────────────────────────────────── */
type RadioOptionProps = {
  label: string;
  value: string;
  selected: string;
  onChange: (value: string) => void;
};

export function RadioOption({ label, value, selected, onChange }: RadioOptionProps) {
  const isSelected = selected === value;

  return (
    <label onClick={() => onChange(value)} className="flex items-center gap-2.5 cursor-pointer">
      <span
        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
          isSelected ? "border-[color:var(--accent)]" : "border-[color:var(--border)]"
        }`}
      >
        {isSelected && <span className="w-2 h-2 rounded-full bg-[color:var(--accent)] block" />}
      </span>
      <span className="text-sm text-[color:var(--text-primary)]">{label}</span>
    </label>
  );
}

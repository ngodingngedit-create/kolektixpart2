import React from "react";
import { Select, SelectItem } from "@nextui-org/react";

interface OptionProps {
  label: string;
  key: string;
}

interface InputSelectProps {
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  size?: "sm" | "lg";
  options: OptionProps[];
  onChange?: (e: any) => void;
  multiple?: boolean;
}

export default function InputSelect({
  label,
  required,
  options,
  onChange,
  placeholder,
  multiple = false, // Default value is false
}: InputSelectProps) {
  return (
    <div className="flex flex-col gap-1.5 mb-1">
      {label && (
        <label className="text-sm font-semibold text-[#64748b] px-0.5">
          {label}
          {required && <span className="text-danger"> *</span>}
        </label>
      )}

      <Select
        size="sm"
        onChange={onChange}
        selectionMode={multiple ? "multiple" : "single"}
        defaultSelectedKeys={options[0].key}
        placeholder={placeholder}
        variant="bordered"
        radius="lg"
        classNames={{
          trigger: "bg-white border-[#e4e4e7] hover:border-primary-base focus:ring-2 focus:ring-primary-100 transition-all h-[42px] rounded-xl shadow-smooth-low",
          value: "text-sm text-[#0f172a] font-medium",
          popoverContent: "rounded-xl border-[#e4e4e7] shadow-xl",
        }}
      >
        {options.map((item) => (
          <SelectItem className="text-[#0f172a] font-medium" key={item.key}>
            {item.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}

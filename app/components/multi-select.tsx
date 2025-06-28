"use client";
import { useState, useEffect } from "react";
import { Controller } from "react-hook-form";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  name: string;
  control: any;
  options: Option[];
  label: string;
  placeholder?: string;
  onChange: (selected: Option[]) => void;
}

export default function MultiSelect({
  name,
  control,
  options,
  label,
  placeholder,
  onChange,
}: MultiSelectProps) {
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);

  // Update filtered options when options prop changes
  useEffect(() => {
    setFilteredOptions(
      options.filter((opt) =>
        opt.label.toLowerCase().includes(inputValue.toLowerCase())
      )
    );
  }, [options, inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setFilteredOptions(
      options.filter((opt) =>
        opt.label.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  return (
    <div className="text-rose-900 col-span-2 relative">
      {/* <label className="block text-sm font-medium mb-1">{label}</label> */}
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selectedValues: Option[] = Array.isArray(field.value)
            ? field.value
            : [];

          return (
            <div className="relative">
              {/* Input Field for Searching */}
              <input
                type="text"
                className="block appearance-none text-black placeholder-gray-500 w-full text-sm font-light p-2 border border-rose-900  rounded-md bg-white"
                placeholder={placeholder || "Rechercher..."}
                value={inputValue}
                onChange={handleInputChange}
              />

              {/* Dropdown Suggestions */}
              {inputValue && filteredOptions.length > 0 && (
                <ul className="left-0 right-0 bg-bred-100 rounded-md border border-rose-900 text-sm font-light mt-1 z-10 max-h-40 overflow-y-auto">
                  {filteredOptions.map((option) => (
                    <li
                      key={option.value}
                      className="px-4 py-2 cursor-pointer hover:text-white hover:bg-rose-950"
                      onClick={() => {
                        const alreadySelected = selectedValues.some(
                          (item) => item.value === option.value
                        );
                        if (!alreadySelected) {
                          const newSelection = [...selectedValues, option];
                          field.onChange(newSelection);
                          onChange(newSelection);
                        }
                        setInputValue("");
                      }}
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              )}

              {/* Selected Items */}
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedValues.map((option) => (
                  <span
                    key={option.value}
                    className="inline-flex items-center bg-rose-50 border border-rose-900  text-rose-900 text-sm  font-light px-2 py-1 rounded"
                  >
                    {option.label}
                    <button
                      type="button"
                      className="ml-2 font-light text-rose-900 hover:text-rose-500"
                      onClick={() => {
                        const newSelection = selectedValues.filter(
                          (item) => item.value !== option.value
                        );
                        field.onChange(newSelection);
                        onChange(newSelection);
                      }}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}

import * as React from "react";
import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { DOCUMENT_TEMPLATES } from "@/lib/documentador/constants";

export default function TemplateSelect({ value, onChange, disabled }: {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}) {
  const selected =
    DOCUMENT_TEMPLATES.find((template) => template.code === value) || null;
  return (
  <Listbox value={selected as any} onChange={(template: { code: string; label: string }) => onChange(template?.code)} disabled={disabled}>
      <div className="relative mt-2">
        <Listbox.Button className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:text-base bg-white text-[#061224] focus:outline-none focus:ring-2 focus:ring-[#061224] ${disabled ? 'opacity-50' : ''}`}> 
          <span className={`block truncate ${!selected ? 'text-gray-400' : ''}`}>{selected ? selected.label : 'Seleccione una plantilla'}</span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronUpDownIcon className="h-5 w-5 text-[#061224]" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Listbox.Options className="absolute z-10 mt-1 w-full rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden">
          {DOCUMENT_TEMPLATES.map((template) => (
            <Listbox.Option
              key={template.code}
              value={template}
              className={({ active, selected }: { active: boolean; selected: boolean }) =>
                `cursor-pointer select-none relative py-2 pl-10 pr-4 transition-colors ${
                  active ? 'bg-[#061224] text-white' : 'text-[#061224]'
                } ${selected && !active ? 'font-semibold' : 'font-normal'}`
              }
            >
              {({ selected, active }: { selected: boolean; active: boolean }) => (
                <>
                  <span className={`block truncate`}>{template.label}</span>
                  {selected ? (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <CheckIcon className={`h-5 w-5 ${active ? 'text-white' : 'text-[#061224]'}`} aria-hidden="true" />
                    </span>
                  ) : null}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}

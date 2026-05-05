'use client';

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';

export interface LuxurySelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface LuxurySelectProps {
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options: LuxurySelectOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  className?: string;
}

export function LuxurySelect({
  id,
  name,
  value,
  defaultValue,
  onValueChange,
  options,
  placeholder,
  disabled = false,
  required = false,
  invalid = false,
  className = '',
}: LuxurySelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const listboxId = `${selectId}-listbox`;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? options[0]?.value ?? '');
  const [isOpen, setIsOpen] = useState(false);
  const currentValue = isControlled ? value ?? '' : internalValue;

  const selectedOption = useMemo(
    () => options.find((option) => option.value === currentValue) ?? null,
    [currentValue, options],
  );

  const triggerLabel = selectedOption?.label ?? placeholder ?? options[0]?.label ?? '';
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === currentValue));

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const commitValue = (nextValue: string) => {
    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
    setIsOpen(false);
  };

  const handleTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (disabled) {
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsOpen(true);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      const previous = options[Math.max(0, selectedIndex - 1)];
      if (previous && !previous.disabled) {
        commitValue(previous.value);
      }
    }
  };

  const handleOptionKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, optionIndex: number) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = Math.min(options.length - 1, optionIndex + 1);
      const next = options[nextIndex];
      if (next && !next.disabled) {
        commitValue(next.value);
      }
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      const previousIndex = Math.max(0, optionIndex - 1);
      const previous = options[previousIndex];
      if (previous && !previous.disabled) {
        commitValue(previous.value);
      }
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const option = options[optionIndex];
      if (option && !option.disabled) {
        commitValue(option.value);
      }
    }
  };

  return (
    <div ref={containerRef} className={`luxury-select ${className}`.trim()}>
      {name ? <input type="hidden" name={name} value={currentValue} required={required} /> : null}
      <button
        id={selectId}
        type="button"
        className={`luxury-select__trigger${invalid ? ' is-invalid' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        disabled={disabled}
        onClick={() => setIsOpen((current) => !current)}
        onKeyDown={handleTriggerKeyDown}
      >
        <span className={`luxury-select__value${!selectedOption && placeholder ? ' is-placeholder' : ''}`}>{triggerLabel}</span>
        <span className={`luxury-select__chevron${isOpen ? ' is-open' : ''}`} aria-hidden="true">
          <svg viewBox="0 0 20 20" focusable="false">
            <path d="M5 7.5 10 12.5 15 7.5" />
          </svg>
        </span>
      </button>

      {isOpen ? (
        <div className="luxury-select__menu" role="listbox" id={listboxId} aria-labelledby={selectId}>
          {options.map((option, optionIndex) => {
            const isSelected = option.value === currentValue;

            return (
              <button
                key={`${option.value}-${optionIndex}`}
                type="button"
                role="option"
                className={`luxury-select__option${isSelected ? ' is-selected' : ''}`}
                aria-selected={isSelected}
                disabled={option.disabled}
                onClick={() => commitValue(option.value)}
                onKeyDown={(event) => handleOptionKeyDown(event, optionIndex)}
              >
                <span>{option.label}</span>
                {isSelected ? <span className="luxury-select__option-mark">•</span> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

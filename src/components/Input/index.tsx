import React from 'react';
import { DateInput, TimeInput, DatePicker } from '@nextui-org/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faClock } from '@fortawesome/free-regular-svg-icons';
import { parseDate, parseTime, getLocalTimeZone, today, maxDate } from '@internationalized/date';
interface InputProps {
  onChange?: (e: any) => void;
  placeholder?: string;
  type: string;
  fullWidth?: boolean;
  label?: string;
  required?: boolean;
  value?: any;
  disabled?: boolean;
  size?: 'sm' | 'lg';
  maxDateVal?: string;
  minDateVal?: string;
  inputProps?: any;
  error?: boolean;
  className?: string;
  autofocus?: boolean;
}

const InputField = ({
  onChange,
  maxDateVal,
  minDateVal,
  placeholder,
  type,
  fullWidth,
  label,
  required,
  value,
  disabled,
  size,
  error,
  className,
  autofocus,
}: InputProps) => {
  const handleKeyPress = (event: any) => {
    const key = event.key;
    if (
      !/[0-9]/.test(key) &&
      key !== 'Backspace' &&
      key !== 'ArrowLeft' &&
      key !== 'ArrowRight' &&
      key !== 'Delete' &&
      key !== 'Tab'
    ) {
      event.preventDefault();
    }
  };
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className='text-sm font-semibold text-[#64748b] px-0.5'>
          {label}
          {required && <span className='text-danger'> *</span>}
        </label>
      )}
      {type === 'number' && (
        <input
          autoFocus={autofocus}
          type='text'
          className={`${error ? 'border-red-400' : 'border-[#e4e4e7]'} ${
            size === 'lg' ? 'py-3 px-4' : 'px-4 py-2.5 text-sm'
          } shadow-smooth-low border focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-base rounded-xl transition-all ${
            fullWidth ? 'w-full' : 'w-80'
          }`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyPress}
          maxLength={16}
        />
      )}
      {type === 'num' && (
        <input
          autoFocus={autofocus}
          type='number'
          className={`${error ? 'border-red-400' : 'border-[#e4e4e7]'} ${
            size === 'lg' ? 'py-3 px-4' : 'px-4 py-2.5 text-sm'
          } shadow-smooth-low border focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-base rounded-xl transition-all ${
            fullWidth ? 'w-full' : 'w-80'
          }`}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={onChange}
        />
      )}
      {type === 'text' && (
        <input
          autoFocus={autofocus}
          type='text'
          className={`${error ? 'border-red-400' : 'border-[#e4e4e7]'} ${
            size === 'lg' ? 'py-3 px-4' : 'px-4 py-2.5 text-sm'
          } shadow-smooth-low border focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-base rounded-xl transition-all disabled:bg-gray-50 ${
            fullWidth ? 'w-full' : 'w-80'
          }`}
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      )}
      {type === 'date' && (
        <DatePicker
          autoFocus={autofocus}
          className='w-full'
          aria-label='date'
          value={value && parseDate(value)}
          minValue={minDateVal ? parseDate(minDateVal) : today(getLocalTimeZone())}
          maxValue={maxDateVal ? parseDate(maxDateVal) : parseDate('9999-12-31')}
          variant='bordered'
          radius='lg'
          fullWidth={fullWidth}
          classNames={{
            inputWrapper: `h-auto py-2.5 px-4 border ${error ? 'border-red-400' : 'border-[#e4e4e7]'} hover:border-primary-base focus-within:ring-2 focus-within:ring-primary-100 focus-within:border-primary-base transition-all rounded-xl shadow-smooth-low`,
          }}
          onChange={onChange}
        />
      )}
      {type === 'textarea' && (
        <textarea
          autoFocus={autofocus}
          className={`${error ? 'border-red-400' : 'border-[#e4e4e7]'} px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-base rounded-xl transition-all ${
            fullWidth ? 'w-full' : 'w-80'
          }`}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
        />
      )}
      {type === 'time' && (
        <TimeInput
          autoFocus={autofocus}
          startContent={<FontAwesomeIcon icon={faClock} className='text-dark' />}
          classNames={{
            inputWrapper: `h-auto py-2.5 border shadow-smooth-low ${error ? 'border-red-400' : 'border-[#e4e4e7]'} bg-white rounded-xl focus-within:ring-2 focus-within:ring-primary-100 focus-within:border-primary-base transition-all`,
          }}
          aria-label='time'
          fullWidth={fullWidth}
          defaultValue={value && parseTime(value)}
          hourCycle={24}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default InputField;

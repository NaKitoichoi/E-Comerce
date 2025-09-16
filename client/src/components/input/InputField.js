import React, { memo } from 'react'
import { clsx } from 'clsx'

const InputField = ({ value, setValue, nameKey, type, invalidFields, setInvalidFields, placeholder, style, fullWidth, isHideLabel }) => {
  return (
    <div className={clsx('relative flex flex-col mb-2', fullWidth && 'w-full')}>
      {!isHideLabel && value?.trim() !== '' && <label
        htmlFor={nameKey}
        className='text-[10px] animate-slide-top-sm absolute top-0 left-[12px] block bg-white px-1'>
        {nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}
      </label>}
      <input
        type={type || "text"}
        className={clsx('px-4 py-2 rounded-sm border w-full my-2 placeholder:text-sm placeholder:italic outline-none', style)}
        placeholder={placeholder || nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}
        value={value}
        onChange={e => setValue(prev => ({ ...prev, [nameKey]: e.target.value }))}
        onFocus={() => setInvalidFields && setInvalidFields([])}
      />
      {invalidFields?.some(el => el.name === nameKey) &&
        <small
          className='text-main italic'>
          {invalidFields.find(el => el.name === nameKey)?.mes}
        </small>}
    </div>
  )
}

export default memo(InputField)

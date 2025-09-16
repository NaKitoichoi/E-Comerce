import React, {memo} from 'react'

const InputSelect = ({value, changeValue, options}) => {
  return (
    <select className='form-select text-sm' value={value} onChange={e => changeValue(e.target.value)}>
        {options?.map(el => (
            <option value={el.value} key={el.id}>{el.text}</option>
        ))}
    </select>
  )
}

export default memo(InputSelect)

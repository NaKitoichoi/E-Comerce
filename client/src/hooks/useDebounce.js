import React, {useEffect, useState} from 'react'

const useDebounce = (value, ms) => {
    const [decounceValue, setDecounceValue] = useState('');
    useEffect(() => {
      const setTimeoutID = setTimeout(() => {
        setDecounceValue(value)
      },ms)
      return () => {
        clearTimeout(setTimeoutID)
      }     
    },[value, ms])
  return decounceValue
}

export default useDebounce

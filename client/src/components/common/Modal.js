import React, { memo, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { showModal } from 'store/app/appSlice'

const Modal = ({ children }) => {
  const dispatch = useDispatch()
   useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])
  return (
    <div
      onClick={() => dispatch(showModal({ isShowModal: false, modalChildren: null }))}
      className='fixed overflow-auto  inset-0 z-[100] bg-overlay flex items-center justify-center'
    >
      {children}
    </div>
  )
}

export default memo(Modal)

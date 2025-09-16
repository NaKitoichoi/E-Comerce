import React, { useEffect, memo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import path from 'ultils/path'
import { getCurrent } from 'store/user/asyncActions'
import { useDispatch, useSelector } from 'react-redux'
import icons from 'ultils/icons'
import { logout } from 'store/user/userSlice'
import Swal from 'sweetalert2'

const { MdLogout } = icons

const TopHeader = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoggedIn, current, mes } = useSelector(state => state.user)
  useEffect(() => {
    const setTimeOurID = setTimeout(() => {
      if (isLoggedIn) dispatch(getCurrent())
    }, 300)
    return () => {
      clearTimeout(setTimeOurID)
    }
  }, [dispatch, isLoggedIn])

  useEffect(() => {
    if(mes) Swal.fire('Oops!', mes, 'info').then(() => {
      navigate(`/${path.LOGIN}`)
    })
  },[mes])

  return (
    <div className='h-[40px] w-full bg-main flex items-center justify-center'>
      <div className='w-main flex items-center justify-between text-xs text-white'>
        <span>ORDER ONLINE OR CALL US (+1800) 000 8808</span>
        {isLoggedIn
          ? <div className='flex gap-4 text-sm items-center'>
            <span>{`Welcome ${current?.lastname} ${current?.firstname}`}</span>
            <span
              onClick={() => dispatch(logout())}
              className='hover:rounded-full hover:bg-gray-200 hover:text-main p-2 cursor-pointer'>
              <MdLogout size={18} />
            </span>
          </div>
          : <Link to={`/${path.LOGIN}`}>Sign In or Create Account</Link>}
      </div>
    </div>
  )
}

export default memo(TopHeader)

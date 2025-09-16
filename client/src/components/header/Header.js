import React, { Fragment, memo, useEffect, useState } from 'react'
import logo from 'assets/logo.png'
import icons from 'ultils/icons'
import { Link } from 'react-router-dom'
import path from 'ultils/path'
import { useSelector } from 'react-redux'
import logout from 'store/user/userSlice'
import withBase from 'hocs/withBase'
import { showCart } from 'store/app/appSlice'

const { ImPhone, MdEmail, IoBagCheck, FaUserCircle } = icons

const Header = ({dispatch}) => {
  const { current } = useSelector(state => state.user)
  const [isShowOption, setIsShowOption] = useState(false);
  useEffect(() => {
    const handleClickOutOption = (e) => {
      const profile = document.getElementById('profile')
      if(!profile?.contains(e.target)) setIsShowOption(false)
    }
    document.addEventListener('click',handleClickOutOption)
    return () => {
      document.removeEventListener('click',handleClickOutOption)
    }
  },[])
  return (
    <div className='w-main flex justify-between h-[110px] py-[35px]'>
      <Link to={`/${path.HOME}`}>
        <img src={logo} alt="logo" className='w-[234px] object-contain' />
      </Link>
      <div className='flex text-[13px]' >
        <div className='flex flex-col px-6 border-r items-center'>
          <span className='flex gap-4 items-center'>
            <ImPhone color='red' />
            <span className='font-semibold'>(+1800) 000 8808</span>
          </span>
          <span className=''>Mon-Sat 9:00AM - 8:00PM</span>
        </div>
        <div className='flex flex-col px-6 border-r items-center'>
          <span className='flex gap-4 items-center'>
            <MdEmail color='red' />
            <span className='font-semibold'>SUPPORT@DATATHEMES.COM</span>
          </span>
          <span className=''>Online Support 24/7</span>
        </div>
        {current && <Fragment>
          <div className='flex cursor-pointer items-center justify-center gap-2 px-6 border-r'>
            <IoBagCheck color='red' />
            <span onClick={() => dispatch(showCart())}>{`${current?.cart?.length || 0} item(s)`}</span>
          </div>
          <div
            className='flex cursor-pointer items-center justify-center px-6 gap-2 relative'
            onClick={() => setIsShowOption(prev => !prev)}
            id='profile'
          >
            <FaUserCircle color='red' size={24} />
            <span>Profile</span>
            {isShowOption && <div className='absolute flex flex-col left-[16px] top-full bg-gray-100 border min-w-[150px] py-2'>
              <Link className='p-2 w-full hover:bg-sky-100' to={`/${path.MEMBER}/${path.PERSIONAL}`}>Personal</Link>
              {+current.role === 1102 && 
              <Link className='p-2 w-full hover:bg-sky-100' to={`/${path.ADMIN}/${path.DAHBOARD}`}>
                Admin WorkSpace
                </Link>              }
              <span onClick={() => dispatch(logout())} className='p-2 w-full hover:bg-sky-100'>Logout</span>
            </div>}
          </div>
          {/* <Link 
          to={+current?.role === 1102 ? `${path.ADMIN}/${path.DAHBOARD}` : `${path.MEMBER}/${path.PERSIONAL}`} 
          className='flex cursor-pointer items-center justify-center px-6 gap-2'
          >
            <FaUserCircle color='red' size={24} />
            <span>Profile</span>
          </Link> */}
        </Fragment>}
      </div>
    </div>
  )
}

export default withBase(memo(Header))

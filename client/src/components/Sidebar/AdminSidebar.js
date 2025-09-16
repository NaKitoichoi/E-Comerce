import React, { memo, Fragment, useState } from 'react'
import logo from 'assets/logo.png'
import { adminSidebar } from 'ultils/constants'
import { NavLink, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { FaCaretDown,FaCaretRight  } from "react-icons/fa";
import path from 'ultils/path'


const activedStyle = 'px-4 py-2 flex items-center gap-2 bg-gray-300 hover:text-white'
const notActivedStyle = 'px-4 py-2 flex items-center gap-2 hover:bg-gray-600 hover:text-white'

const AdminSidebar = () => {
    const navigate = useNavigate()
    const [actived, setActived] = useState([]);

    const handleShowTabs = (tabID) => {
      if(actived.some(el => el === tabID)) setActived(prev => prev.filter(el => el !== tabID))
        else setActived(prev => [...prev, tabID])
    }
     

    return (
        <div className='bg-white h-full py-4'>
            <div className='flex flex-col justify-center items-center p-4 py-2 gap-2'>
                <img onClick={() => navigate(`/${path.HOME}`)} src={logo} alt="logo" className='w-[200px] object-contain' />
                <small>Admin Work Space</small>
            </div>
            <div>
                {adminSidebar.map(el => (
                    <Fragment key={el.id}>
                        {el.type === 'SINGLE' &&
                            <NavLink
                                to={el.path}
                                className={({ isActive }) => clsx(isActive && activedStyle, !isActive && notActivedStyle)}
                            >
                                <span>{el.icon}</span>
                                <span>{el.text}</span>
                            </NavLink>}
                        {el.type === 'PARENT' && <div onClick={() => handleShowTabs(+el.id)} className='flex flex-col'>
                            <div className='flex items-center justify-between cursor-pointer gap-2 px-4 py-2 hover:bg-gray-600'>
                                <div className='flex items-center gap-2'>
                                    <span>{el.icon}</span>
                                    <span>{el.text}</span>
                                </div>
                                {actived.some(id => id === el.id) ? <FaCaretRight/> : <FaCaretDown />}
                            </div>
                            {actived.some(id => +id === +el.id) && <div className='flex flex-col'>
                                {el.submenu.map(item => (
                                    <NavLink
                                        key={el.text}
                                        to={item.path}
                                        onClick={e => e.stopPropagation()}
                                        className={({ isActive }) => clsx(isActive && activedStyle, !isActive && notActivedStyle, 'pl-10')}
                                    >
                                        {item.text}
                                    </NavLink>
                                ))}
                            </div>}
                        </div>}
                    </Fragment>
                ))}
            </div>
        </div>
    )
}

export default memo(AdminSidebar)

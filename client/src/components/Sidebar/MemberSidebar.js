import React, { memo, Fragment, useState } from 'react'
import avatar from 'assets/avatar.png'
import { memberSidebar } from 'ultils/constants'
import { NavLink, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { FaCaretDown, FaCaretRight } from "react-icons/fa";
import path from 'ultils/path'
import { useSelector } from 'react-redux'


const activedStyle = 'px-4 py-2 flex items-center gap-2 bg-gray-300 hover:text-white'
const notActivedStyle = 'px-4 py-2 flex items-center gap-2 hover:bg-gray-600 hover:text-white'

const MemberSidebar = () => {
    const navigate = useNavigate()
    const { current } = useSelector(state => state.user)
    const [actived, setActived] = useState([]);

    const handleShowTabs = (tabID) => {
        if (actived.some(el => el === tabID)) setActived(prev => prev.filter(el => el !== tabID))
        else setActived(prev => [...prev, tabID])
    }

    return (
        <div className='bg-white h-full py-4 w-[250px] flex-none'>
            <div className='flex flex-col justify-center items-center p-4 py-2 gap-2'>
                <img src={current?.avatar || avatar} alt="avatar" className='w-16 h-16 object-cover' />
                <small>{`${current.lastname} ${current.firstname}`}</small>
            </div>
            <div className=''>
                {memberSidebar.map(el => (
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
                                {actived.some(id => id === el.id) ? <FaCaretRight /> : <FaCaretDown />}
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
                <NavLink className={clsx(notActivedStyle)} to={'/'}                       >
                    Back to Home
                </NavLink>
            </div>
        </div>
    )
}

export default memo(MemberSidebar)

import React, {memo} from 'react'
import { NavLink } from 'react-router-dom'
import { createSlug } from 'ultils/helpers'
import { useSelector } from 'react-redux'
import * as FaIcons from 'react-icons/fa'


const iconMap = {
  Smartphone: 'FaMobileAlt',
  Tablet: 'FaTabletAlt',
  Laptop: 'FaLaptop',
  Speaker: 'FaVolumeUp',
  Television: 'FaTv',
  Printer: 'FaPrint',
  Camera: 'FaCamera',
  Accessories: 'FaPlug',
}

const Sidebar = () => {
  const {categories} = useSelector(state => state.app)
  console.log(categories);
  
  return (
    <div className='flex flex-col border w-full h-full'>
      {categories?.map(el => {
        const iconName = iconMap[el.title] || 'FaBox' // fallback nếu không có icon tương ứng
        const Icon = FaIcons[iconName]

        return (
          <NavLink
            key={createSlug(el.title)}
            to={createSlug(el.title)}
            className={({ isActive }) =>
              `${isActive
                ? 'bg-main text-white'
                : 'hover:text-main'
              } px-5 pt-[15px] pb-[14px] text-sm flex items-center gap-3`
            }
          >
            <Icon className='text-base' />
            {el.title}
          </NavLink>
        )
      })}
    </div>
  )
}

export default memo(Sidebar)


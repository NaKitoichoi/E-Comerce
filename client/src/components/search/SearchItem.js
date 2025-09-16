import React, { memo, useState, useEffect } from 'react'
import icons from 'ultils/icons'
import { colors } from 'ultils/constants'
import { createSearchParams, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { apiGetProducts } from 'apis'
import useDebounce from 'hooks/useDebounce'


const { FaCaretDown } = icons

const SearchItem = ({ name, activeClick, changeActiveFilter, type = 'checkbox' }) => {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { category } = useParams()
  const [selected, setSelected] = useState([]);
  const [price, setPrice] = useState({
    from: '',
    to: '',
  });
  const [bestPrice, setBestPrice] = useState(null);
  const handleSeclect = (e) => {
    const alreadyEl = selected.find(el => el === e.target.value)
    if (alreadyEl) setSelected(prev => prev.filter(el => el !== e.target.value))
    else setSelected(prev => [...prev, e.target.value])
    // changeActiveFilter(null)
  }

  const fetchBestPriceProduct = async () => {
    const response = await apiGetProducts({ sort: '-price', limit: 1 })
    if (response.success) setBestPrice(response.product[0]?.price)
  }

  const debouncePriceFrom = useDebounce(price.from, 500)
  const debouncePriceTo = useDebounce(price.to, 500)
  useEffect(() => {
    let param = []
    for (let i of params.entries()) param.push(i)
    const queries = {}
    for (let i of param) queries[i[0]] = i[1]
    if (selected.length > 0) {
      if (selected) queries.color = selected.join(',')
      if (Number(price.from) > 0) queries.from = price.from
      if (Number(price.to) > 0) queries.to = price.to
      queries.page = 1
    }else delete queries.color
    navigate({
      pathname: `/${category}`,
      search: createSearchParams(queries).toString()
    })
  }, [selected])
  useEffect(() => {
    if (type === 'input') fetchBestPriceProduct()
  }, [type])

  useEffect(() => {
    if (price.from && price.to && price.from > price.to) alert('From price cannot geater than To price')
  }, [price])
  useEffect(() => {
    let param = []
    for (let i of params.entries()) param.push(i)
    const queries = {}
    for (let i of param) queries[i[0]] = i[1]
      if (Number(price.from) > 0) queries.from = price.from
      else delete queries.from
      if (Number(price.to) > 0) queries.to = price.to
      else delete queries.to
      queries.page = 1
    navigate({
      pathname: `/${category}`,
      search: createSearchParams(queries).toString()
    })
  }, [debouncePriceFrom, debouncePriceTo])

  return (
    <div
      className='relative gap-6 cursor-pointer p-3 text-gray-500 text-xs border border-gray-800 flex justify-between items-center'
      onClick={() => changeActiveFilter(name)}
    >
      <span className='capitalize'>{name}</span>
      <FaCaretDown />
      {activeClick === name && <div className='absolute z-10 top-[calc(100%+1px)] left-0 w-fit p-4 border bg-white min-w-[150px]'>
        {type === 'checkbox' && <div>
          <div className='p-4 items-center flex justify-between gap-8'>
            <span className='whitespace-nowrap'>{`${selected.length} selected`}</span>
            <span onClick={e => {
              e.stopPropagation()
              setSelected([])
              changeActiveFilter(null)
            }}
              className='cursor-pointer hover:text-main'>Reset</span>
          </div>
          <div onClick={e => e.stopPropagation()} className='flex flex-col gap-3 mt-4'>
            {colors.map((el, index) => (
              <div key={index} className='flex items-center gap-4'>
                <input
                  type="checkbox"
                  value={el}
                  id={el}
                  onChange={handleSeclect}
                  checked={selected.some(selectedItem => selectedItem === el)}
                  className='form-checkbox focus-within:hidden'
                />
                <label className='capitalize text-gray-700 font-semibold text-sm'>{el}</label>
              </div>
            ))}
          </div>
        </div>}
        {type === 'input' && <div onClick={e => e.stopPropagation()}>
          <div className='p-4 items-center flex justify-between gap-8'>
            <span className='whitespace-nowrap'>{`The highest price is ${Number(bestPrice).toLocaleString()} VND`}</span>
            <span onClick={e => {
              e.stopPropagation()
              setPrice({ from: '', to: '' })
              changeActiveFilter(null)
            }}
              className='cursor-pointer hover:text-main'>Reset</span>
          </div>
          <div className='flex items-center p-2 gap-2'>
            <div className='flex items-center gap-2'>
              <label htmlFor="from">From</label>
              <input
                value={price.from}
                onChange={e => setPrice(prev => ({ ...prev, from: e.target.value }))}
                className='form-input'
                type="number"
                id='from' />
            </div>
            <div className='flex items-center gap-2'>
              <label htmlFor="to">To</label>
              <input
                value={price.to}
                onChange={e => setPrice(prev => ({ ...prev, to: e.target.value }))}
                className='form-input'
                type="number"
                id='to' />
            </div>
          </div>
        </div>}
      </div>}
    </div>
  )
}

export default memo(SearchItem)

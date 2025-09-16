import { apiGetOrders } from 'apis'
import { CustomSelect, InputForm, Pagination } from 'components';
import withBase from 'hocs/withBase';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { createSearchParams, useSearchParams } from 'react-router-dom';
import { statusOrders } from 'ultils/constants';


const History = ({ navigate, location }) => {
  const [counts, setCounts] = useState(0);
  const [orders, setOrders] = useState(null);
  const { register, formState: { errors }, watch, setValue } = useForm()
  const q = watch('q')
  const status = watch('status')
  const [params] = useSearchParams()

  const fetchProducts = async (params) => {
    const response = await apiGetOrders({ ...params, limit: process.env.REACT_APP_PRODUCT_LIMIT })
    console.log(response);
    
    if (response.success) {
      setOrders(response.product)
      setCounts(response.counts)
    }
  }

  useEffect(() => {
    const param = Object.fromEntries([...params])
    fetchProducts(param)
  }, [params])

  const handleSearchStatus = ({value}) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ status: value }).toString()
    })
  }
  return (
    <div className='w-full relative'>
      <header className='text-3xl font-semibold py-4 border-b border-b-blue-200'>
        HISTORY
      </header>
      <div className='flex w-full justify-end items-center px-4'>
        <form className='w-[45%] grid grid-cols-2 gap-4' >
          <div>
            <InputForm
              id='q'
              register={register}
              errors={errors}
              fullWidth
              placeholder='Search Order...'
            />
          </div>
          <CustomSelect
            options={statusOrders}
            value={status}
            onChange={(val) => handleSearchStatus(val)}
            wrapClassname='w-full'
          />
        </form>
      </div>
      <table className='table-auto w-full py-2'>
        <thead>
          <tr className='border bg-sky-500'>
            <th className='text-center py-2'>#</th>
            <th className='text-center py-2'>Product</th>
            <th className='text-center py-2'>Total</th>
            <th className='text-center py-2'>Status</th>
            <th className='text-center py-2'>Created At</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((el, index) => (
            <tr key={el.id} className='border'>
              <td className='text-center py-2'>
                {((+params.get('page') > 1 ? +params.get('page') - 1 : 0) * process.env.REACT_APP_PRODUCT_LIMIT) + index + 1}
              </td>
              <td className='text-center py-2 max-w-[500px]'>
                <span className='grid grid-cols-4 gap-4'>
                  {el?.products?.map(item => 
                  <span key={item._id} className='flex col-span-1 items-center'>
                    <img src={item.thumbnail} alt="thumb" className='w-10 h-10 rounded-md object-cover'/>
                    <span className='flex flex-col'>
                      <span>{item.title}</span>
                      <span className='flex items-center text-xs gap-2'>
                        <span>Quantity : </span>
                        <span>{item.quantity}</span>
                      </span>
                    </span>
                  </span>)}
                </span>
              </td>
              <td className='text-center py-2'>{`${el.total} 💲`}</td>
              <td className='text-center py-2'>{el.status}</td>
              <td className='text-center py-2'>{moment(el.createdAt).format('DD/MM/YYYY')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='w-full flex justify-end my-8'>
        <Pagination totalCount={counts} />
      </div>
    </div>
  )
}

export default withBase(History)

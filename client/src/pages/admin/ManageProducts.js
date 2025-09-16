import React, { useCallback, useEffect, useState } from 'react'
import { InputForm, Pagination, CustomizeVarriants } from 'components'
import { useForm } from 'react-hook-form'
import { apiGetProducts, apiDeleteProduct } from 'apis'
import moment from 'moment'
import { useSearchParams, createSearchParams, useNavigate, useLocation } from 'react-router-dom'
import useDebounce from 'hooks/useDebounce'
import UpdateProduct from './UpdateProduct'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import icons from 'ultils/icons'


const { RiDeleteBin2Line, FiEdit, BiCustomize, } = icons

const ManageProducts = () => {
  const { register, formState: { errors }, handleSubmit, reset, watch } = useForm()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [products, setProducts] = useState(null);
  const [counts, setCounts] = useState(0);
  const [editProduct, setEditProduct] = useState(null);
  const [update, setUpdate] = useState(false);
  const [customizeVarriant, setCustomizeVarriant] = useState(null);


  const render = useCallback(() => {
    setUpdate(!update)
  })
  const fetchProducts = async (params) => {
    const response = await apiGetProducts({ ...params, limit: process.env.REACT_APP_PRODUCT_LIMIT })
    if (response.success) {
      setProducts(response.product)
      setCounts(response.counts)
    }
  }
  const querryDebounce = useDebounce(watch('q'), 800)
  useEffect(() => {
    if (querryDebounce) {
      navigate({
        pathname: location.pathname,
        search: createSearchParams({ q: querryDebounce }).toString()
      })
    } else navigate({
      pathname: location.pathname,
    })
  }, [querryDebounce])

  useEffect(() => {
    const searchParams = Object.fromEntries([...params])
    fetchProducts(searchParams)
  }, [params], update)

  const handleDeleteProduct = (pid) => {
    Swal.fire({
      title: 'Are you sure ?',
      text: 'Are you sure remove this product',
      icon: 'warning',
      showCancelButton: true,
    }).then(async (rs) => {
      if (rs.isConfirmed) {
        const response = await apiDeleteProduct(pid)
        if (response.success) toast.success(response.mes)
        else toast.error(response.mes)
        render()
      }
    })
  }

  return (
    <div className='flex flex-col w-full gap-4 px-4 relative'>
      {editProduct && <div className='absolute inset-0 bg-gray-100 min-h-screen z-50'>
        <UpdateProduct
          editProduct={editProduct}
          render={render}
          setEditProduct={setEditProduct}
        />
      </div>}
      {customizeVarriant && <div className='absolute inset-0 bg-gray-100 min-h-screen z-50'>
        <CustomizeVarriants
          customizeVarriant={customizeVarriant}
          render={render}
          setCustomizeVarriant={setCustomizeVarriant}
        />
      </div>}
      <div className='h-[69px] w-full'></div>
      <h1 className='fixed top-0 bg-gray-100 w-full h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b'>
        <span>Manage user</span>
      </h1>
      <div>
        <div className='flex w-full justify-end items-center px-4'>
          <form className='w-[45%]' >
            <InputForm
              id='q'
              register={register}
              errors={errors}
              fullWidth
              placeholder='Search Product...'
            />
          </form>
        </div>
      </div>
      <table className='table-auto'>
        <thead>
          <tr className='border bg-sky-500'>
            <th className='text-center py-2'>Order</th>
            <th className='text-center py-2'>Thumb</th>
            <th className='text-center py-2'>Title</th>
            <th className='text-center py-2'>Brand</th>
            <th className='text-center py-2'>Category</th>
            <th className='text-center py-2'>Price</th>
            <th className='text-center py-2'>Quantity</th>
            <th className='text-center py-2'>Sold</th>
            <th className='text-center py-2'>Color</th>
            <th className='text-center py-2'>Ratings</th>
            <th className='text-center py-2'>Varriants</th>
            <th className='text-center py-2'>Created At</th>
            <th className='text-center py-2'>Actiton</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((el, index) => (
            <tr key={el.id} className='border'>
              <td className='text-center py-2'>{((+params.get('page') > 1 ? +params.get('page') - 1 : 0) * process.env.REACT_APP_PRODUCT_LIMIT) + index + 1}</td>
              <td className='text-center py-2'>
                <div className='flex justify-center items-center h-full'>
                  <img src={el.thumb} alt="thumb" className='w-12 h-12 object-cover' />
                </div>
              </td>
              <td className='text-center py-2'>{el.title}</td>
              <td className='text-center py-2'>{el.brand}</td>
              <td className='text-center py-2'>{el.category}</td>
              <td className='text-center py-2'>{el.price}</td>
              <td className='text-center py-2'>{el.quantity}</td>
              <td className='text-center py-2'>{el.sold}</td>
              <td className='text-center py-2'>{el.color}</td>
              <td className='text-center py-2'>{el.totalRatings}</td>
              <td className='text-center py-2'>{el?.variants?.length || 0}</td>
              <td className='text-center py-2'>{moment(el.createdAt).format('DD/MM/YYYY')}</td>
              <td className='text-center py-2 flex items-center justify-center'>
                <div className="relative group px-1 cursor-pointer text-blue-500 hover:underline" onClick={() => setEditProduct(el)}>
                  <FiEdit size={25} />
                  <span className="absolute left-1/2 -translate-x-1/2 -top-7 text-sm bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                    Edit
                  </span>
                </div>
                <span onClick={() => handleDeleteProduct(el._id)} title="Delete" className='text-blue-500 hover:underline cursor-pointer px-1'><RiDeleteBin2Line size={25} /></span>
                <span onClick={() => setCustomizeVarriant(el)} title="Customize" className='text-blue-500 hover:underline cursor-pointer px-1'><BiCustomize size={25} /></span>
              </td>
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

export default ManageProducts

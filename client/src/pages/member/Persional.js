import { InputForm, Button } from 'components'
import moment from 'moment'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import avatar from 'assets/avatar.png'
import { apiUpdateCurrent } from 'apis'
import { getCurrent } from 'store/user/asyncActions'
import { toast } from 'react-toastify'
import withBase from 'hocs/withBase'
import { useSearchParams } from 'react-router-dom'

const Persional = ({navigate,dispatch}) => {
  const { register, formState: { errors, isDirty }, handleSubmit, reset } = useForm()
  const { current } = useSelector(state => state.user)
const [searchParams] = useSearchParams()  

  useEffect(() => {
    reset({
      firstname: current?.firstname,
      lastname: current?.lastname,
      mobile: current?.mobile,
      email: current?.email,
      avatar: current?.avatar,
      address: current?.address,
    })
  }, [current])

  const handleUpdateInfo = async (data) => {
    const formData = new FormData()
    if (data.avatar?.length > 0) formData.append('avatar', data.avatar[0])
    delete data.avatar
    for (let i of Object.entries(data)) formData.append(i[0], i[1])
    const response = await apiUpdateCurrent(formData)
    if (response.success) {
      dispatch(getCurrent())
      toast.success(response.mes)
      if(searchParams?.get('redirect')) navigate(searchParams?.get('redirect'))
    } else toast.error(response.mes)

  }
  return (
    <div className='w-full relative'>
      <header className='text-3xl font-semibold py-4 border border-b-gray-200'>
        Persional
      </header>
      <form onSubmit={handleSubmit(handleUpdateInfo)} className='w-3/5 mx-auto py-8 flex flex-col gap-4'>
        <InputForm
          label='Last Name'
          register={register}
          errors={errors}
          id='lastname'
          placeholder='Name of New Product'
          validate={{
            required: 'Need fill this field',
          }}
        />
        <InputForm
          label='First Name'
          register={register}
          errors={errors}
          id='firstname'
          placeholder='Name of New Product'
          validate={{
            required: 'Need fill this field',
          }}
        />
        <InputForm
          label='Phone'
          register={register}
          errors={errors}
          id='mobile'
          placeholder='Name of New Product'
          validate={{
            required: 'Need fill this field',
            pattern: {
              value: /^[+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/im,
              message: 'Phone Invalid'
            }
          }}
        />
        <InputForm
          label='Email'
          register={register}
          errors={errors}
          id='email'
          placeholder='Name of New Product'
          validate={{
            required: 'Need fill this field',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Email Invalid'
            }
          }}
        />
        <InputForm
          label='Address'
          register={register}
          errors={errors}
          id='address'
          placeholder='Address'
          validate={{
            required: 'Need fill this field',           
          }}
        />
        <div className='flex items-center gap-2'>
          <span className='font-medium'>Account status : </span>
          <span>{current?.isBlocked ? 'Blocked' : 'Active'}</span>
        </div>
        <div className='flex items-center gap-2'>
          <span className='font-medium'>Role : </span>
          <span>{+current?.role === 1102 ? 'Admin' : 'User'}</span>
        </div>
        <div className='flex items-center gap-2'>
          <span className='font-medium'>Created At : </span>
          <span>{moment(current?.createdAt).fromNow()}</span>
        </div>
        <div className='flex flex-col gap-2'>
          <span className='font-medium'>Profile Image : </span>
          <label htmlFor="file">
            <img src={current?.avatar || avatar} alt="avatar" className='w-32 h-32 object-cover rounded-full ml-8' />
          </label>
          <input type="file" id='file' {...register('avatar')} hidden />
        </div>
        <div className='w-full flex justify-end'>
          {isDirty && <Button type='submit'>Update Infomation</Button>}
        </div>
      </form>
    </div>
  )
}

export default withBase(Persional)

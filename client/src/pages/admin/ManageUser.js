import React, { useEffect, useState, useCallback } from 'react'
import { apiGetUsers, apiUpdateUser, apiDeleteUser } from 'apis/user'
import { roles, blockstatus } from 'ultils/constants'
import moment from 'moment'
import { InputField, Pagination, InputForm, Select, Button } from 'components'
import useDebounce from 'hooks/useDebounce'
import { useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import clsx from 'clsx'

const ManageUser = () => {
  const { handleSubmit, register, formState: { errors }, reset } = useForm({
    email: '',
    firstname: '',
    lastname: '',
    mobile: '',
    role: '',
    isBlocked: '',
  })
  const [users, setUsers] = useState(null);
  const [queries, setQueries] = useState({
    q: "",
  });
  const [update, setUpdate] = useState(false);
  const [editEl, setEditEl] = useState(null);
  const [params] = useSearchParams()
  const fetchUsers = async (params) => {
    const response = await apiGetUsers({ ...params, limit: process.env.REACT_APP_PRODUCT_LIMIT })
    if (response.success) setUsers(response)
  }
  const render = useCallback(() => {
    setUpdate(!update)
  }, [update])
  const queriesDebouce = useDebounce(queries.q, 800)

  useEffect(() => {
    const queries = Object.fromEntries([...params])
    if (queriesDebouce) queries.q = queriesDebouce
    fetchUsers(queries)
  }, [queriesDebouce, params, update])
  const handleUpdate = async (data) => {
    const response = await apiUpdateUser(data, editEl._id)
    if (response.success) {
      toast.success(response.mes)
      setEditEl(null)
      render()
    } else toast.error(response.mes)
  }
  const handleDeleteUser = (uid) => {
    Swal.fire({
      title: 'Are you sure !!!',
      text: 'Are you ready remove this user',
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await apiDeleteUser(uid)
        if (response.success) {
          toast.success(response.mes)
          render()
        } else toast.error(response.mes)
      }
    })
  }
  useEffect(() => {
    if (editEl) reset({
      email: editEl.email,
      firstname: editEl.firstname,
      lastname: editEl.lastname,
      mobile: editEl.mobile,
      role: editEl.role,
      isBlocked: editEl.isBlocked,
    })
  }, [editEl])

  return (
    <div className={clsx('w-full', editEl && 'pl-12')}>
      <h1 className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b'>
        <span>Manage user</span>
      </h1>
      <div className='w-full p-4'>
        <div className='flex justify-end py-4 w-full '>
          <InputField
            nameKey={'q'}
            value={queries.q}
            setValue={setQueries}
            style={'w500'}
            placeholder='Search Name or Email...'
            isHideLabel
          />
        </div>
        <form onSubmit={handleSubmit(handleUpdate)}>
          {editEl && <Button type='submit'>Update</Button>}
          <table className='table-auto mb-6 text-left w-full'>
            <thead className='text-white font-bold bg-gray-800 text-[13px]'>
              <tr className='border border-gray-500'>
                <th className='px-4 py-2'>#</th>
                <th className='px-4 py-2'>Email Address</th>
                <th className='px-4 py-2'>Firstname</th>
                <th className='px-4 py-2'>Lastname</th>
                <th className='px-4 py-2'>Role</th>
                <th className='px-4 py-2'>Phone</th>
                <th className='px-4 py-2'>Status</th>
                <th className='px-4 py-2'>Created At</th>
                <th className='px-4 py-2'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.users?.map((el, index) => (
                <tr key={el._id} className='border border-gray-500'>
                  <td className='py-2 px-4'>{index + 1}</td>
                  <td className='py-2 px-4'>
                    {editEl?._id === el._id ?
                      <InputForm
                        register={register}
                        fullWidth
                        errors={errors}
                        defaultValue={editEl?.email}
                        id={'email'}
                        validate={{
                          required: 'Require fill',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "invalid email address"
                          }
                        }}
                      />
                      : <span>{el.email}</span>}
                  </td>
                  <td className='py-2 px-4'>
                    {editEl?._id === el._id ?
                      <InputForm
                        register={register}
                        fullWidth
                        errors={errors}
                        defaultValue={editEl?.firstname}
                        id={'firstname'}
                        validate={{ required: 'Require fill' }}
                      />
                      : <span>{el.firstname}</span>}
                  </td>
                  <td className='py-2 px-4'>
                    {editEl?._id === el._id ?
                      <InputForm
                        register={register}
                        fullWidth
                        errors={errors}
                        defaultValue={editEl?.lastname}
                        id={'lastname'}
                        validate={{ required: 'Require fill' }}
                      />
                      : <span>{el.lastname}</span>}
                  </td>
                  <td className='py-2 px-4'>
                    {editEl?._id === el._id ?
                      <Select
                        register={register}
                        fullWidth
                        errors={errors}
                        defaultValue={el.role}
                        id={'role'}
                        option={roles}
                        validate={{ required: 'Require fill' }}
                      />
                      : <span>{roles.find(role => +role.code === +el.role)?.value}
                      </span>}</td>
                  <td className='py-2 px-4'>
                    {editEl?._id === el._id ?
                      <InputForm
                        register={register}
                        fullWidth
                        errors={errors}
                        defaultValue={editEl?.mobile}
                        id={'mobile'}
                        validate={{
                          required: 'Require fill',
                          pattern: {
                            value: /^(0|\+84)\d{9}$/,
                            message: "invalid Phone Number"
                          }
                        }}
                      />
                      : <span>{el.mobile}</span>}
                  </td>
                  <td className='py-2 px-4'>
                    {editEl?._id === el._id ?
                      <Select
                        register={register}
                        fullWidth
                        errors={errors}
                        defaultValue={el.isBlocked}
                        id={'isBlocked'}
                        option={blockstatus}
                        validate={{ required: 'Require fill' }}
                      />
                      : <span>{el.isBlocked ? 'Blocked' : 'Active'}</span>}
                  </td>
                  <td className='py-2 px-4'>{moment(el.createdAt).format('DD/MM/YYYY')}</td>
                  <td className='py-2 px-4'>
                    {editEl?._id === el._id
                      ? <span onClick={() => setEditEl(null)} className='px-2 text-orange-800 cursor-pointer hover:underline'>Back</span>
                      : <span onClick={() => setEditEl(el)} className='px-2 text-orange-800 cursor-pointer hover:underline'>Edit</span>
                    }
                    <span onClick={() => handleDeleteUser(el?._id)} className='px-2 text-orange-800 cursor-pointer hover:underline'>Delete</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </form>
        <div className='w-full text-right justify-end'>
          <Pagination
            totalCount={users?.counts}
          />
        </div>
      </div>
    </div>
  )
}

export default ManageUser

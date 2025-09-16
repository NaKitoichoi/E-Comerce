import React, { useState, useCallback, useEffect } from 'react'
import { InputField, Button, Loading } from 'components'
import { apiRegister, apiLogin, apiForgotPassword, apiFinalRegister } from 'apis/user'
import Swal from 'sweetalert2'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import path from 'ultils/path'
import { login } from 'store/user/userSlice'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { validate } from 'ultils/helpers'
import { showModal } from 'store/app/appSlice'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [payload, setPayload] = useState({
    firstname: '',
    lastname: '',
    mobile: '',
    email: '',
    password: '',
  })
  const [isVerifiedEmail, setIsVerifiedEmail] = useState(false);
  const [invalidFields, setInvalidFields] = useState([]);
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [searchParams] = useSearchParams()
  
  const resetPayload = () => {
    setPayload({
      firstname: '',
      lastname: '',
      mobile: '',
      email: '',
      password: '',
    })
  }
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('')
  const handleForgotPassword = async () => {
    const response = await apiForgotPassword({ email })
    if (response.success) {
      toast.success(response.mes, { theme: 'colored' })
    } else toast.info(response.mes, { theme: 'colored' })
  }

  useEffect(() => {
    resetPayload()
  }, [isRegister])

  const handleSubmit = useCallback(async () => {
    const { firstname, lastname, mobile, ...data } = payload
    const invalids = isRegister ? validate(payload, setInvalidFields) : validate(data, setInvalidFields)
    if (invalids === 0) {
      if (isRegister) {
        dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
        const response = await apiRegister(payload)
        dispatch(showModal({ isShowModal: false, modalChildren: null }))
        if (response.success) {
          setIsVerifiedEmail(true)
        } else Swal.fire('Oops!', response.mes, 'error')
      } else {
        const result = await apiLogin(data)
        if (result.success) {
          dispatch(login({ isLoggedIn: true, token: result.accessToken, userData: result.userData }))
          searchParams?.get('redirect') ? navigate(searchParams.get('redirect')) : navigate(`/${path.HOME}`)
        } else Swal.fire('Oops!', result.mes, 'error')
      }
    }
  }, [payload, isRegister])
  const finalRegister = async () => {
    const response = await apiFinalRegister(token)
    if (response.success) {
      Swal.fire('Congratulation', response.mes, 'success').then(() => {
        setIsRegister(false)
        setIsVerifiedEmail(false)
        resetPayload()
      })
    } else {
      Swal.fire('Oops!', response.mes, 'error')
      setIsVerifiedEmail(true)
    }
    setToken('')
  }
  return (
    <div className='w-screen h-screen relative'>
      {isVerifiedEmail && <div className='absolute top-0 bottom-0 left-0 right-0 bg-overlay z-50 flex flex-col justify-center items-center'>
        <div className='bg-white w-[500px] rounded-md p-8'>
          <h1 className='text-xl font-semibold text-center'>We sent the code to your email</h1>
          <h6 className='text-sm text-center mb-4'>Please check and give me your code to success</h6>
          <input
            type="text"
            value={token}
            onChange={e => setToken(e.target.value)}
            className='p-2 border rounded-md outline-none w-3/4'
          />
          <button
            type='button'
            className=''
            onClick={finalRegister}
          >
            Submit</button>
        </div>
      </div>}
      {isForgotPassword && <div className='absolute animate-slide-right top-0 bottom-0 left-0 right-0 bg-white flex flex-col items-center py-8 z-50'>
        <div className='flex flex-col gap-4'>
          <label htmlFor='email'>Enter your email</label>
          <input
            type='text'
            id='email'
            className='w-[800px] pb-2 border-b outline-none placeholder:text-sm'
            placeholder='youremail@gmail.com'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <div className='flex items-center justify-end w-full'>
            <Button
              name='Submit'
              handleOnClick={handleForgotPassword}
              style='px-4 py-2 rounded-md text-white bg-blue-500 text-semibold my-2 mr-4'
            />
            <Button
              name='Back'
              handleOnClick={() => setIsForgotPassword(false)}
            />
          </div>
        </div>
      </div>}
      <img
        src='https://i.pinimg.com/736x/20/b0/b7/20b0b78a504d859dcb9ab4b4f582bc95.jpg'
        alt=''
        className='w-full h-full object-cover'
      />
      <div className='absolute top-0 bottom-0 left-0 right-1/3 items-center justify-center flex'>
        <div className='p-8 bg-white rounded-md min-w-[500px]'>
          <h1 className='text-[20px] font-semibold text-main text-center'>{isRegister ? 'REGISTER' : 'LOGIN'}</h1>
          {isRegister && <div className='flex flex-col'>
            <InputField
              value={payload.firstname}
              setValue={setPayload}
              nameKey='firstname'
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
            />
            <InputField
              value={payload.lastname}
              setValue={setPayload}
              nameKey='lastname'
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
            />
            <InputField
              value={payload.mobile}
              setValue={setPayload}
              nameKey='mobile'
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
            />
          </div>}
          <InputField
            value={payload.email}
            setValue={setPayload}
            nameKey='email'
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
          />
          <InputField
            value={payload.password}
            setValue={setPayload}
            nameKey='password'
            type='password'
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
          />
          <Button
            handleOnClick={handleSubmit}
            fw
          >
            {isRegister ? 'REGISTER' : 'LOGIN'}
          </Button>
          <div className='flex items-center justify-between my-2 w-full text-sm'>
            {!isRegister && <span onClick={() => setIsForgotPassword(true)} className='text-black hover:text-red-500 hover:underline cursor-pointer'>Forgot Your Account?</span>}
            {!isRegister && <span
              onClick={() => setIsRegister(true)}
              className='text-black hover:text-red-500 hover:underline cursor-pointer'
            >Create Account</span>}
            {isRegister && <span
              onClick={() => setIsRegister(false)}
              className='text-black hover:text-red-500 text-center w-full hover:underline cursor-pointer '
            >Go Login</span>}
          </div>
          <div className='flex justify-center mt-6'>
            <Link
              to={`/`}
              className='border rounded-md bg-main text-sm text-white px-4 py-2 w-fit hover:text-black cursor-pointer'
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

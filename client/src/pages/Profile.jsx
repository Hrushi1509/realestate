import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase'
import {updateUserStart, updateUserSuccess, updateUserFail, deleteUserStart, deleteUserSuccess, deleteUserFail, signoutStart, signoutSuccess, signoutFail} from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'
import {Link} from 'react-router-dom'

const Profile = () => {

  const fileRef = useRef(null);
  const {currentUser} = useSelector(state => state.user)
  const [file,setFile] = useState(undefined)
  const [filePerc , setFilePerc] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false)
  console.log(formData)
  // console.log(filePerc)
  // console.log(fileUploadError)
  const dispatch = useDispatch()

  useEffect(()=>{
    if(file){
      handleFileUpload(file)
    }
  },[file])

  const handleFileUpload = (file) =>{
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage,fileName)
    const uploadTask = uploadBytesResumable(storageRef,file)

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log("upload is " + progress + "% done")
        setFilePerc(Math.round(progress))
      },
      (error) => {
        setFileUploadError(true)
      },
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then(
          (downloadURL)=>{
            setFormData({...formData , avatar:downloadURL})
          }
        )
      }   
    )

  }

  const handleChange = (e) =>{
    setFormData({...formData,[e.target.id]: e.target.value})
  }

  const handleSubmit = async() =>{
    e.preventDefault()
    try{
      dispatch(updateUserStart())
      const res = await fetch(`$/api/user/update/${currentUser._id}`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body : JSON.stringify(formData)
      })
      const data = await res.json();
      if(data.success === false){
        dispatch(updateUserFail(data.message))
        return;
      }
      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)
    }catch(error){
      dispatch(updateUserFail(error.message))
    }
  }

  const handleDeleteUser = async() =>{
    try{
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser.id}`,{
        method : 'DELETE',      
      })

      const data = await res.json();
      if(data.success === false){
        dispatch(deleteUserFail(data.message))
        return
      }
      dispatch(deleteUserSuccess(data));
      

    }catch(error){
      dispatch(deleteUserFail(error.message))
    }
  }

  const handleSignout = async() =>{
    try{
      dispatch(signoutStart())
      const res = await fetch('/api/auth/signout')
      const data = await res.json()
      if(data.success === false){
        dispatch(signoutFail(data.message))
        return
      }
      dispatch(signoutSuccess(data))
    }catch(error){
        dispatch(signoutFail(error.message))
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center
       my-7 '>Profile</h1>

       <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={((e)=>setFile(e.target.files[0]))} type="file" ref={fileRef} hidden accept='image/*'/>
          <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="profile" 
          className='rounded-full h-24 w-24 object-cover cursor-pointer
          self-center mt-2' />

          <p className='text-small self-center'>
            {
              fileUploadError ? (
                <span className='text-red-700'>Error Image Upload (Image must be less that 2MB)</span>
              ) : filePerc > 0 && filePerc < 100 ? (
                <span className='text-slate-700'>{`Uploading ${filePerc}`}</span>
              ) : filePerc === 100 ? (
                <span className='text-green-700'>Image Uploaded Successfully</span>
              ) : ""
            }
          </p>

          <input type='text' id='username' placeholder='username' 
           defaultValue={currentUser.username}
           onChange={handleChange} className='border p-3 rounded-lg'/>
          <input type='email' id='email' placeholder='email' 
          defaultValue={currentUser.email}
          onChange={handleChange}  className='border p-3 rounded-lg'/>
          <input type='password' placeholder='password' 
           onChange={handleChange}   className='border p-3 rounded-lg'/>

          <button disabled={loading} className='bg-slate-700 text-white rounded-lg
          p-3 uppercase hover:opacity-95 disabled:opacity-80'>
            {loading ? 'Loading...' : 'Update'}  
          </button>

          <Link className='bg-green-700 text-white p-3 rounded-lg text-center hover:opacity-95' to={"/create-listing"}>
            Create Listing
          </Link>

       </form>

       <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete Account</span>
        <span onClick={handleSignout} className='text-red-700 cursor-pointer'>Sign out</span>
       </div>

       <div className='text-red-700'>{error ? {error} : ''}</div>
       <p className='text-green-700'>
            {
              updateSuccess ? 'User is updated successfully!' : ''
            }
       </p>
    </div>
  )
}

export default Profile
import React from 'react'
import UserMenu from '../components/UserMenu'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Dashboard = () => {
  const user = useSelector(state => state.user)
  return (
    <section className='bg-slate-50'>
        <div className='w-full max-w-none px-4 lg:px-6 py-4 grid lg:grid-cols-[260px_1fr] gap-6'>
            {/*left for menu*/}
            <div className='py-4 sticky top-24 max-h-[calc(100vh-96px)] overflow-auto hidden lg:block border-r border-slate-200'>
                <UserMenu/>
            </div>

            {/*right for content*/}
            <div className='bg-white min-h-[75vh] w-full rounded-2xl shadow-sm ring-1 ring-black/5'>
                <Outlet/>
            </div>
        </div>
    </section>
  )
}

export default Dashboard
import RightJoin from '@/components/pages/joins/rightJoin'
import React from 'react'
import { getAuthorizedPage } from '../../layout'

export default function page() {
  return (
    <div className='p-4 text-base md:text-lg lg:text-xl'>
      <RightJoin getAuthorizedPage={getAuthorizedPage}/>
    </div>
  )
}
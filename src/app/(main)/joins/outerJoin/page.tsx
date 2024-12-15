import OuterJoin from '@/components/pages/joins/outerJoin'
import React from 'react'
import { getAuthorizedPage } from '../../layout'

export default function page() {
  return (
    <div className='p-4 text-base md:text-lg lg:text-xl'>
      <OuterJoin getAuthorizedPage={getAuthorizedPage}/>

    </div>
  )
}
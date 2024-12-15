import GroupBy from '@/components/pages/select/gropBy'
import React from 'react'
import { getAuthorizedPage } from '../../layout'

export default function page() {
  return (
    <div className='p-4 text-base md:text-lg lg:text-xl'>
      <GroupBy getAuthorizedPage={getAuthorizedPage}/>
    </div>
  )
}

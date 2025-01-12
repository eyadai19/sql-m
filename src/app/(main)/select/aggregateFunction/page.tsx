import AggregateFunction from '@/components/pages/select/aggregateFunction'
import React from 'react'
import { getAuthorizedPage } from '../../layout'
import { Metadata } from "next";
export const metadata: Metadata = {
	title: "SQLMentor - Aggregate Function",
	icons: {
		icon: "/logo.ico",
		apple: "/logo.png",
	},
};
export default function page() {
  return (
    <div className='p-4 text-base md:text-lg lg:text-xl'>
      <AggregateFunction getAuthorizedPage={getAuthorizedPage}/>
    </div>
  )
}

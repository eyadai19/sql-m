import Like from '@/components/pages/select/like'
import React from 'react'
import { getAuthorizedPage } from '../../layout'
import { Metadata } from "next";
export const metadata: Metadata = {
	title: "SQLMentor - Like Operator",
	icons: {
		icon: "/logo.ico",
		apple: "/logo.png",
	},
};

export default function page() {
  return (
    <div className='p-4 text-base md:text-lg lg:text-xl'>
      <Like getAuthorizedPage={getAuthorizedPage}/>
    </div>
  )
}

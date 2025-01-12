import Where from '@/components/pages/select/where'
import React from 'react'
import { getAuthorizedPage } from '../../layout'
import { Metadata } from "next";
export const metadata: Metadata = {
	title: "SQLMentor - Where Clause",
	icons: {
		icon: "/logo.ico",
		apple: "/logo.png",
	},
};

export default function page() {
  return (
    <div className='p-4 text-base md:text-lg lg:text-xl'>
      <Where getAuthorizedPage={getAuthorizedPage}/>
    </div>
  )
}

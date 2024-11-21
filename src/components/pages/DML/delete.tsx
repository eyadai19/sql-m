'use client'

import React from 'react'
import Exercise from '@/components/Exercise/Exercise';
import Explanation from '@/components/Explanation/Explanation';
import PAGE_DATA from '@/utils/pagesData';
export default function Delete() {
  const { explanationParams, exerciseParams } = PAGE_DATA.delete;

  return (
    <div>


	<Explanation {...explanationParams} />

    <Exercise {...exerciseParams}/>



    </div>
  )
    };
  
  


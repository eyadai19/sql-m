'use client'

import React from 'react'
import Exercise from './Exercise'
import Explanation from './Explanation';
import { userExcerciseAnswerError } from '@/lib/types/userSchema';
import PAGE_DATA from '@/utils/pagesData';
export default function SelectPage() {
  const { exerciseParams, explanationParams } = PAGE_DATA.select;

  return (
    <div>


		<Explanation {...explanationParams} />

   <Exercise {...exerciseParams} />



    </div>
  )
}

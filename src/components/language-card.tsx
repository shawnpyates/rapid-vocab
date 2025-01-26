import React from 'react'
import Link from 'next/link'
import { Globe2 } from 'lucide-react'
import { Language } from '@/types'

const LanguageCard = ({ language }: { language: Language }) => (
  <Link
    href={`/languages/${language.id}`}
    className="bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col items-center gap-4"
  >
    <Globe2 className="w-12 h-12 text-indigo-600" />
    <h3 className="text-xl font-semibold text-gray-800">{language.name}</h3>
  </Link>
)

export default LanguageCard

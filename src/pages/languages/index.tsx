import Link from 'next/link'
import prisma from '../../../prisma/prisma-client'

import type { Language } from '@/types'

import LanguageCard from '@/components/language-card'

export default function List(props: { languages: Language[] }) {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Choose a Language
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {props.languages.map(language => (
          <LanguageCard key={language.id} language={language} />
        ))}
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const languages = await prisma.language.findMany({ orderBy: { name: 'asc' } })
  return {
    props: { languages: languages.map(({ name, id }) => ({ name, id })) }
  }
}

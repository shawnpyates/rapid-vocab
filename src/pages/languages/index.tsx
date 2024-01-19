import Link from 'next/link'
import prisma from '../../../prisma/prisma-client'

import type { Language } from '@/types'

export default function List(props: { languages: Language[] }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex-col z-10 max-w-5xl items-center justify-between text-lg">
        {props.languages.map(language => (
          <div key={language.id}>
            <Link href={`/languages/${language.id}`}>{language.name}</Link>
          </div>
        ))}
      </div>
    </main>
  )
}

export async function getServerSideProps() {
  const languages = await prisma.language.findMany()
  return {
    props: { languages: languages.map(({ name, id }) => ({ name, id })) }
  }
}

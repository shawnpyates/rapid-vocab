import Link from 'next/link'
import { NextPageContext } from 'next'
import prisma from '../../../prisma/prisma-client'
import { Game, Language as LanguageType } from '@/types'
import { useState } from 'react'

export default function Language(props: any) {
  const [newGameName, setNewGameName] = useState('')

  const addNewGame = async () => {
    const response = await fetch('/api/create-game', {
      method: 'POST',
      body: JSON.stringify({
        name: newGameName,
        languageId: props.language.id,
        ownerId: 'ck81na7bv0000j9dm5gdne999'
      })
    })
    if (response.ok) {
      console.log('Game added successfully')
    } else {
      console.error('Adding game failed:', response.statusText)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="flex items-center justify-center flex-col gap-1">
        <div>
          <h4>Add New Game</h4>
        </div>
        <div className="flex gap-2">
          <input
            className="p-1"
            value={newGameName}
            onChange={e => {
              setNewGameName(e.target.value)
            }}
          />
          <button
            onClick={addNewGame}
            disabled={!newGameName}
            className="bg-blue-600 p-2 rounded-sm text-white disabled:slate-300"
          >
            Add
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-10 z-10 max-w-5xl w-full items-center justify-center text-lg">
        <h3 className="font-bold">Games</h3>
        {props.language.games.map((game: Game) => (
          <Link key={game.id} href={`/games/${game.id}`}>
            {game.name}
          </Link>
        ))}
      </div>
    </main>
  )
}

export async function getServerSideProps(context: NextPageContext) {
  const { id } = context.query

  const fetchedLanguage = await prisma.language.findUnique({
    where: { id: id as string },
    include: {
      games: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  const language = fetchedLanguage as LanguageType

  return {
    props: {
      language: {
        id: language.id,
        name: language.name,
        games: language.games
      }
    }
  }
}

import { NextPageContext } from 'next'
import prisma from '../../../prisma/prisma-client'
import GameBoard from '@/components/game/play'
import GameView from '@/components/game/view'
import { useState } from 'react'
import { Game, GamePlay, Pair } from '@prisma/client'

export default function Game(props: any) {
  const [activeGame, setActiveGame] = useState<boolean>()

  const addPairsToGame = async ({ data }: { data: Pair[] }) => {
    const response = await fetch('/api/create-pairs', {
      method: 'POST',
      body: JSON.stringify(
        data.map(({ englishTerm, l2Term }: Partial<Pair>) => ({
          englishTerm,
          l2Term,
          gameId: props.game.id
        }))
      )
    })
    if (response.ok) {
      console.log('CSV import successful')
    } else {
      console.error('CSV import failed:', response.statusText)
    }
  }
  console.log('PROPS: ', props.game.gamePlays)

  const createGamePlay = async ({ name, score }: Partial<GamePlay>) => {
    const response = await fetch('/api/create-game-play', {
      method: 'POST',
      body: JSON.stringify({ name, score, gameId: props.game.id })
    })
    if (response.ok) {
      console.log('CSV import successful')
    } else {
      console.error('CSV import failed:', response.statusText)
    }
  }

  return (
    <div>
      {activeGame ? (
        <GameBoard
          game={props.game}
          pairs={props.game.pairs}
          setActiveGame={setActiveGame}
          createGamePlay={createGamePlay}
        />
      ) : (
        <GameView
          game={props.game}
          addPairsToGame={addPairsToGame}
          setActiveGame={setActiveGame}
        />
      )}
    </div>
  )
}

export async function getServerSideProps(context: NextPageContext) {
  const { id } = context.query

  const game = await prisma.game.findUnique({
    where: { id: id as string },
    include: {
      pairs: {
        select: {
          id: true,
          englishTerm: true,
          l2Term: true
        }
      },
      gamePlays: {
        select: {
          id: true,
          score: true,
          name: true
        },
        orderBy: [{ score: 'desc' }],
        take: 5
      }
    }
  })

  return {
    props: {
      game: {
        id: game?.id,
        name: game?.name,
        pairs: game?.pairs,
        gamePlays: game?.gamePlays
      }
    }
  }
}

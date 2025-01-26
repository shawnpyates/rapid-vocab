import { NextPageContext } from 'next'
import prisma from '../../../prisma/prisma-client'
import GameBoard from '@/components/game/play'
import GameView from '@/components/game/view'
import { useState } from 'react'
import { Game, GamePlay, Pair } from '@prisma/client'

import useUpdate from '../../hooks/use-update'

export default function Game(props: any) {
  const [activeGame, setActiveGame] = useState<boolean>()

  const { isLoading: isCreatingPairs, update: createPairs } = useUpdate({
    route: '/api/create-pairs'
  })

  const { isLoading: isCreatingGamePlay, update: createNewGamePlay } =
    useUpdate({
      route: '/api/create-game-play'
    })

  const addPairsToGame = async ({ data }: { data: Pair[] }) => {
    await createPairs(
      data.map(({ englishTerm, l2Term }: Partial<Pair>) => ({
        englishTerm,
        l2Term,
        gameId: props.game.id
      }))
    )
  }

  const createGamePlay = async ({ name, score }: Partial<GamePlay>) => {
    await createNewGamePlay({ name, score, gameId: props.game.id })
  }

  return (
    <div>
      {activeGame ? (
        <GameBoard
          game={props.game}
          pairs={props.game.pairs}
          setActiveGame={setActiveGame}
          createGamePlay={createGamePlay}
          isLoading={isCreatingGamePlay}
        />
      ) : (
        <GameView
          game={props.game}
          addPairsToGame={addPairsToGame}
          setActiveGame={setActiveGame}
          isLoading={isCreatingPairs}
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

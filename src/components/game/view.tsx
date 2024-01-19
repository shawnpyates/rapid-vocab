import { parse } from 'papaparse'
import type { Pair } from '@prisma/client'
import { useState } from 'react'
import type { Game } from '@/types'

type GameViewProps = {
  game: Game
  addPairsToGame: ({ data }: { data: Pair[] }) => void
  setActiveGame: (isActive: boolean) => void
}

const GameView = ({ game, addPairsToGame, setActiveGame }: GameViewProps) => {
  const [stagedFile, setStagedFile] = useState<File>()

  const importCsv = () => {
    if (stagedFile) {
      parse(stagedFile, {
        complete: addPairsToGame,
        skipEmptyLines: true,
        header: true
      })
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-12">
      <div>
        <h3 className="text-2xl mb-3">{game.name}</h3>
      </div>
      <div className="w-[900px] flex justify-center items-center">
        <div className="flex flex-col">
          <h5>Upload a CSV</h5>
          <input
            accept="text/csv"
            id="csv-upload"
            type="file"
            onChange={ev => {
              setStagedFile((ev.target.files as FileList)[0])
            }}
          />
          {stagedFile && (
            <button
              onClick={importCsv}
              disabled={!stagedFile}
              className="bg-blue-700 text-white rounded-sm py-1 px-3 mt-2 w-32"
            >
              Start Upload
            </button>
          )}
        </div>
        <div>
          <button
            onClick={() => {
              setActiveGame(true)
            }}
            className="bg-blue-700 text-white rounded-sm py-1 px-3 mt-2"
          >
            Start Game
          </button>
        </div>
      </div>
      <div className="flex flex-col w-[300px] gap-5 mt-7">
        <div className="flex justify-center text-xl">
          <h4>Pairs</h4>
        </div>
        {game.pairs.map((pair: Pair) => (
          <div key={pair.id} className="flex flex-row w-full justify-between">
            <div>{pair.englishTerm}</div>
            <div>{pair.l2Term}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GameView

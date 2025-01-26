import React from 'react'
import { nanoid } from 'nanoid'
import { useEffect, useMemo, useState } from 'react'
import Modal from 'react-modal'

import type { GamePlay, Pair } from '@prisma/client'
import type { Game } from '@/types'

const MAX_POINTS_PER_PAIR = 100
const MAX_TIME_PER_PAIR = 5
const DEDUCTION_PER_WRONG_GUESS = 50

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '500px'
  }
}

const HIGH_SCORE_SPOTS = 5

const calculatePoints = (
  numberOfPairs: number,
  secondsTaken: number,
  wrongGuesses: number
) => {
  const maxPointLevel = numberOfPairs * MAX_POINTS_PER_PAIR
  const maxTimeAllowance = numberOfPairs * MAX_TIME_PER_PAIR
  const timeScore = maxTimeAllowance - secondsTaken
  const totalDeductedPoints = wrongGuesses * DEDUCTION_PER_WRONG_GUESS

  const finalScore =
    (timeScore * maxPointLevel) / maxTimeAllowance - totalDeductedPoints

  return finalScore >= 0 ? finalScore : 0
}

const formatTime = (seconds: number) =>
  `${String(Math.floor(seconds / 60))}:${String(seconds % 60).padStart(2, '0')}`

const getRandomPairs = (arr: Pair[]) => {
  const remainingPairs = [...arr]
  const currentPairs = Array.from({
    length: remainingPairs.length < 5 ? remainingPairs.length : 5
  }).map(() => {
    const selectedIndex = Math.floor(Math.random() * remainingPairs.length)
    const selectedPair = remainingPairs[selectedIndex]
    remainingPairs.splice(selectedIndex, 1)
    return selectedPair
  })
  return [currentPairs, remainingPairs]
}

const shuffle = (list: string[]) => {
  const cloned = [...list]
  for (let i = cloned.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[cloned[i], cloned[j]] = [cloned[j], cloned[i]]
  }
  return cloned
}

const GameBoard = ({
  game,
  pairs,
  setActiveGame,
  createGamePlay,
  isLoading
}: {
  game: Game
  pairs: Pair[]
  setActiveGame: (active: boolean) => void
  createGamePlay: (gamePlay: Partial<GamePlay>) => void
  isLoading?: boolean
}) => {
  const [elapsedTime, setElapsedTime] = useState(0)
  const [currentPairSet, setCurrentPairSet] = useState<{
    id: string
    pairs: Pair[]
  }>()
  const [remainingPairs, setRemainingPairs] = useState<Pair[]>(pairs)
  const [correctGuesses, setCorrectGuesses] = useState<Pair[]>()
  const [currentLeft, setCurrentLeft] = useState<string | null>()
  const [wrongGuessCount, setWrongGuessCount] = useState(0)
  const [currentWrongGuess, setCurrentWrongGuess] = useState<{
    left: string
    right: string
  } | null>()
  const [isGameEnd, setIsGameEnd] = useState(false)
  const [finalElapsedTime, setFinalElapsedTime] = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)
  const [hasHighScore, setHasHighScore] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [newHighScoreList, setNewHighScoreList] = useState<GamePlay[]>()

  const setInfixedHighScoreList = () => {
    const newList = [
      ...game.gamePlays,
      { id: 'new', name: playerName, score: totalPoints }
    ]
    newList.sort((a, b) => b.score - a.score)
    newList.pop() // remove score that got bumped off list by new high score
    setNewHighScoreList(newList as GamePlay[])
  }

  const submitHighScore = async () => {
    await createGamePlay({
      score: totalPoints,
      name: playerName
    })
    setInfixedHighScoreList()
  }

  useEffect(() => {
    if (
      !currentPairSet ||
      correctGuesses?.length === currentPairSet.pairs.length
    ) {
      if (remainingPairs.length) {
        const [current, remaining] = getRandomPairs(remainingPairs)
        setCurrentPairSet({ id: nanoid(), pairs: current })
        setCorrectGuesses([])
        setRemainingPairs(remaining)
      } else {
        if (!isGameEnd) {
          setFinalElapsedTime(elapsedTime)
          const calculatedPoints = calculatePoints(
            game.pairs.length,
            elapsedTime,
            wrongGuessCount
          )
          setTotalPoints(calculatedPoints)
          setIsGameEnd(true)
        } else if (
          game.gamePlays.length < HIGH_SCORE_SPOTS ||
          totalPoints > game.gamePlays[HIGH_SCORE_SPOTS - 1].score
        ) {
          setHasHighScore(true)
        }
      }
    }
  }, [
    currentPairSet,
    correctGuesses,
    remainingPairs,
    game.pairs.length,
    elapsedTime,
    wrongGuessCount,
    isGameEnd,
    game.gamePlays,
    totalPoints
  ])

  useEffect(() => {
    setInterval(() => {
      setElapsedTime(prev => prev + 1)
    }, 1000)
  }, [])

  const shuffledLeft = useMemo(
    () =>
      currentPairSet?.pairs &&
      shuffle(currentPairSet.pairs.map(pair => pair.englishTerm)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentPairSet?.id]
  )

  const shuffledRight = useMemo(
    () =>
      currentPairSet?.pairs &&
      shuffle(currentPairSet.pairs.map(pair => pair.l2Term)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentPairSet?.id]
  )

  const leaderboardItems = newHighScoreList ?? game.gamePlays

  console.log('leaderboardItems: ', leaderboardItems)

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-12">
      <Modal
        isOpen={isGameEnd}
        style={customStyles}
        contentLabel="Game End"
        className=""
      >
        <div className="flex flex-col items-center text-black">
          <h6 className="text-md">
            Time Elapsed: {formatTime(finalElapsedTime)}
          </h6>
          <h6 className="text-md">Wrong Guesses: {wrongGuessCount}</h6>
          <h3 className="text-lg">Total Points: {totalPoints}</h3>
          {hasHighScore && !newHighScoreList ? (
            <div>
              <h6 className="text-md">
                Congratulations, you have one of the High Scores!
              </h6>
              <h6 className="text-md">Please write your name for the board.</h6>
              <input
                className="border mr-3 p-2"
                onChange={e => {
                  setPlayerName(e.target.value)
                }}
              />
              <button
                className="bg-blue-700 text-white rounded-sm py-1 px-3 mt-2"
                disabled={!playerName || isLoading}
                onClick={submitHighScore}
              >
                Submit
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-[200px]">
                <h3>High Scores</h3>
                {leaderboardItems.map(
                  (gamePlay: GamePlay | Partial<GamePlay>) => (
                    <div className="flex justify-between" key={gamePlay.id}>
                      <div>{gamePlay.name}</div>
                      <div>{gamePlay.score}</div>
                    </div>
                  )
                )}
              </div>
              <button
                className="bg-blue-700 text-white rounded-sm py-1 px-3 mt-2 w-[100px]"
                onClick={() => {
                  setActiveGame(false)
                }}
              >
                Go Back
              </button>
            </div>
          )}
        </div>
      </Modal>
      <div>
        <h3 className="text-lg py-3">{game?.name}</h3>
      </div>
      <div className="h-[500px] w-[300px] flex justify-around gap-10">
        <div className="h-full w-60 flex flex-col justify-around">
          {shuffledLeft &&
            shuffledLeft.map(item => (
              <div
                key={item}
                className={`w-full h-20 border border-gray-500 flex justify-center items-center cursor-pointer ${
                  item === currentLeft ? 'bg-yellow-500' : ''
                } ${
                  correctGuesses?.some(guess => guess.englishTerm === item)
                    ? 'bg-green-500'
                    : ''
                } ${currentWrongGuess?.left === item ? 'bg-red-500' : ''}`}
                onClick={() => {
                  setCurrentLeft(item)
                }}
              >
                {item}
              </div>
            ))}
        </div>
        <div className="h-full w-60 flex flex-col justify-around">
          {shuffledRight &&
            shuffledRight.map(item => (
              <div
                key={item}
                className={`w-full h-20 border border-gray-500 flex justify-center items-center ${
                  correctGuesses?.some(guess => guess.l2Term === item)
                    ? 'bg-green-500'
                    : ''
                } ${currentWrongGuess?.right === item ? 'bg-red-500' : ''} ${
                  currentLeft ? 'cursor-pointer' : 'cursor-not-allowed'
                }`}
                onClick={() => {
                  if (!currentLeft) return
                  const currentLeftPair = currentPairSet?.pairs.find(
                    pair => pair.englishTerm === currentLeft
                  )
                  if (currentLeftPair?.l2Term === item) {
                    setCorrectGuesses((prev: Pair[] = []) => [
                      ...prev,
                      currentLeftPair
                    ])
                    setCurrentLeft(null)
                  } else {
                    setCurrentWrongGuess({
                      left: currentLeft ?? '',
                      right: item
                    })
                    setWrongGuessCount(prev => prev + 1)
                    setCurrentLeft(null)
                    setTimeout(() => {
                      setCurrentWrongGuess(null)
                    }, 1000)
                  }
                }}
              >
                {item}
              </div>
            ))}
        </div>
      </div>
      <div>{`Elapsed Time: ${formatTime(
        finalElapsedTime || elapsedTime
      )}`}</div>
    </div>
  )
}

export default GameBoard

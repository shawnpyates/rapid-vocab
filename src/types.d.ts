import type { Game as PrismaGame, GamePlay, Language as PrismaLanguage, Pair } from '@prisma/client'

export type Game = PrismaGame & { pairs: Pair[]; gamePlays: GamePlay[] }

export type Language = PrismaLanguage & { games: Game[] }

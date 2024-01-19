import Link from 'next/link'
import { NextPageContext } from "next";
import prisma from "../../../prisma/prisma-client"

export default function Language(props: any) {
  console.log('props? ', props)

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex z-10 max-w-5xl w-full items-center justify-center text-lg">
        {props.language.games.map(game => 
          <Link key={game.id} href={`/games/${game.id}`}>
            {game.name}
          </Link>
        )}
      </div>
    </main>
  )
}

export async function getServerSideProps(context: NextPageContext) {
  const { id } = context.query;

  const language = await prisma.language.findUnique({
    where: { id: id as string },
    include: {
      games: {
        select: {
          id: true,
          name: true,
          // Add other fields as needed
        },
      },
    },
  });

  return {
    props: {
      language: { id: language?.id, name: language.name, games: language.games },
    },
  };
}
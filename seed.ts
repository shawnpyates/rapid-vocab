import prismaClient from './prisma/prisma-client'

// await prismaClient.pair.createMany({
//   data: [
//     {
//       englishTerm: 'elephant',
//       l2Term: '코끼리',
//       gameId: 'clphf2aj100004civ9envh3kh'
//     },
//     {
//       englishTerm: 'lion',
//       l2Term: '사자',
//       gameId: 'clphf2aj100004civ9envh3kh'
//     },
//     {
//       englishTerm: 'deer',
//       l2Term: '사슴',
//       gameId: 'clphf2aj100004civ9envh3kh'
//     },
//     {
//       englishTerm: 'seal',
//       l2Term: '물개',
//       gameId: 'clphf2aj100004civ9envh3kh'
//     },
//     {
//       englishTerm: 'whale',
//       l2Term: '고래',
//       gameId: 'clphf2aj100004civ9envh3kh'
//     },
//     {
//       englishTerm: 'rat',
//       l2Term: '쥐',
//       gameId: 'clphf2aj100004civ9envh3kh'
//     },
//     {
//       englishTerm: 'cat',
//       l2Term: '고양이',
//       gameId: 'clphf2aj100004civ9envh3kh'
//     },
//     {
//       englishTerm: 'duck',
//       l2Term: '오리',
//       gameId: 'clphf2aj100004civ9envh3kh'
//     }
//   ],
// })

// const users = await prismaClient.user.findMany();
// const languages = await prismaClient.language.findMany();

const pairs = await prismaClient.pair.findMany();

console.log({
  pairs: JSON.stringify(pairs),
  // languages: JSON.stringify(languages),
});
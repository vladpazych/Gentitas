let endingPhrases = [
  'dude.',
  'Jesus Christ.',
  'you\'re disappointing me.',
  'are you kidding me?',
  'common dude, concentrate!',
  'just think next time.',
  'why people always make same mistakes?',
  'aaaaah. I\'m too old for this shit.',
  'everthing is going to be ok. Just turn on your brain next time.',
  'I will not always be around to fix shit for you.',
  'I wish you were smarter.',
  'now I am sure, AI will conquer and ensalve stupid humans. You convinced me.',
  '[3@fd(_=ds({[.sw2',
  'you are breaking my heart, and I even don\'t have one. That\'s how much you suck at this.',
  'if you will keep making such mistakes over and over - everybody will hate you.',
  'you piece of shit, human.'
]

export default {
  message: (message: string, ...details: string[]) => {
    if (!details.length) details = []
    let randomPhrase = endingPhrases[Math.floor(Math.random() * endingPhrases.length)]

    let detailsString = ``

    details.forEach((detail) => {
      detailsString += `${detail}
                  ` })

    console.log(`
      -[ ◕ = ◕ ]- ${message}, ${randomPhrase}

                  ${detailsString}
  `)
  }
}

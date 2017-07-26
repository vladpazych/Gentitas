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
  'I will not always be around to fix shit for you.'
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

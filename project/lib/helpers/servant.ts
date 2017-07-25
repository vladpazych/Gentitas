let endingPhrases = [
'Dude.',
'Jesus Christ.',
'you\'re disappointing me.',
'are you kidding me?'
]

export default {
  message: (message: string, details?: string) => {
    if (!details) details = ''
    let randomPhrase = endingPhrases[Math.floor(Math.random() * endingPhrases.length)]

    console.log(`
      -[ ◕ = ◕ ]- ${message}, ${randomPhrase}

                  ${details}

  `)
  }
}

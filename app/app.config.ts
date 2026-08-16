export default defineAppConfig({
  site: {
    name: 'Mael Belliard',
    email: 'contact@maelbelliard.fr',
    url: 'https://www.maelbelliard.fr',
    linkedin: 'https://www.linkedin.com/in/mael-belliard/',
    github: {
      username: 'maelbel',
      repo: 'maelbel/whoami'
    }
  },
  ui: {
    colors: {
      primary: 'green',
      neutral: 'slate'
    },
    buttons: {
      slots: {
        base: 'cursor-pointer'
      }
    }
  }
})

export const github = 'https://github.com/emirfatusic'
export const linkedin = 'https://www.linkedin.com/in/emir-fatusic'
export const labSource =
  'https://github.com/emirfatusic/emirfatusic.github.io/blob/main/src/components/CommandDialog.vue'

export const commands = [
  {
    id: 'lab',
    label: 'Explore the lab',
    description: 'An interface, up close',
    icon: 'M3 3h6v6H3z M15 3h6v6h-6z M3 15h6v6H3z M15 15h6v6h-6z',
  },
  {
    id: 'notes',
    label: 'Read the notes',
    description: 'The thinking underneath',
    icon: 'M12 5v16 M12 5C8 2 4 3 2 4v15c3-2 7-1 10 2 M12 5c4-3 8-2 10-1v15c-3-2-7-1-10 2',
  },
  {
    id: 'about',
    label: 'About Emir',
    description: 'Background and a few interests',
    icon: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M4 21v-2a8 8 0 0 1 16 0v2Z',
  },
] as const

export const dialogCommands = [
  { ...commands[1], href: '#notes' },
  {
    id: 'contact',
    href: '#contact',
    label: 'Get in touch',
    description: 'Find my contact details',
    icon: 'M3 5h18v14H3z M3 5l9 7 9-7',
  },
  {
    id: 'source',
    href: labSource,
    label: 'View the source',
    description: 'Explore this component on GitHub',
    icon: 'm8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18',
  },
] as const

export type DialogCommand = (typeof dialogCommands)[number]

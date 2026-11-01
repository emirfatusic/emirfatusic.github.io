export const github = 'https://github.com/emirfatusic'
export const labSource = '/source/command-menu.vue.txt'

export const commands = [
  {
    id: 'lab',
    label: 'Explore the lab',
    description: 'A small interface, up close',
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

export type Command = (typeof commands)[number]

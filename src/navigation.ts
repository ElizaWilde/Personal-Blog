import { getPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    { text: 'Home', href: getPermalink('/') },

    {
      text: 'Blog',
      href: getPermalink('/Blog-repo'),
      links: [
        { text: 'Agent', href: getPermalink('agent', 'category') },
        { text: 'Full-stack', href: getPermalink('full-stack', 'category') },
      ],
    },

    {
      text: 'Projects',
      href: getPermalink('/Projects-repo'),
      links: [
        { text: 'Life System', href: 'https://lifeSystem.qingtaors.top' },
        { text: 'English Learner', href: 'https://ENleaner.qingtaors.top' },
      ],
    },

    { text: 'About me', href: getPermalink('/about') },
  ],
};

export const footerData = {
  links: [{ links: [{ text: 'Support', href: '#' }] }, { links: [{ text: 'About', href: '#' }] }],
  socialLinks: [
    {
      ariaLabel: 'GitHub',
      icon: 'tabler:brand-github',
      href: 'https://github.com/ElizaWilde/',
      label: 'https://github.com/ElizaWilde/',
    },
    {
      ariaLabel: 'Email',
      icon: 'tabler:mail',
      href: 'mailto:qye9828@gmail.com',
      label: 'qye9828@gmail.com',
      copyText: 'qye9828@gmail.com',
    },
  ],

  // compute year in TS, not inside the string:
  footNote: `© ${new Date().getFullYear()} QingYe. All rights reserved.`,
};

type Navigate = {
    path: string; name: string; bg: string
}


export const navigateConfig: Navigate[] = [
    {path: '/', name: 'Home', bg: 'var(--color-home)'},
    {path: '/staking', name: 'Staking', bg: 'var(--color-about)'},
    {path: '/', name: 'Presale', bg: 'var(--color-presale)'},
    {path: '/', name: 'Tokenomics', bg: 'var(--color-tokenomics)'},
    {path: '/', name: 'Community', bg: 'var(--color-community)'},
    {path: '/', name: 'Contact', bg: 'var(--color-contact)'},
    {path: '/', name: 'FAQ', bg: 'var(--color-faq)'},
];

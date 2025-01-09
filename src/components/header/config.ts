type Navigate = {
    path: string; name: string; bg: string
}
import community from "../../assets/Whitepaper-GMF-v1.0.pdf"

export const navigateConfig: Navigate[] = [
    {path: '/', name: 'Home', bg: 'var(--color-home)'},
    {path: '/staking', name: 'Staking', bg: 'var(--color-about)'},
    {path: '#presale', name: 'Presale', bg: 'var(--color-presale)'},
    {path: '#tokenomics', name: 'Tokenomics', bg: 'var(--color-tokenomics)'},
    {path: community, name: 'Community', bg: 'var(--color-community)'},
    {path: '#contact', name: 'Contact', bg: 'var(--color-contact)'},
    {path: '#faq', name: 'FAQ', bg: 'var(--color-faq)'},
];

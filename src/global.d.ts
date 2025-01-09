interface Window {
    ethereum?: {
        isMetaMask?: boolean;
        request?: (args: { method: string; params?: any[] }) => Promise<any>;
    };
}
declare global {
    interface HTMLElementTagNameMap {
        'dotlottie-player': DotLottiePlayer;
    }
    function dotLottiePlayer(): DotLottiePlayer;
    namespace JSX {
        interface IntrinsicElements {
            'dotlottie-player': JSXLottiePlayer;
        }
    }
}
declare module "*.pdf";

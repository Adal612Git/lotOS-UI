type RuntimeGlobals = typeof globalThis & {
    HTMLElement?: typeof HTMLElement;
    customElements?: CustomElementRegistry;
};

const runtime = globalThis as RuntimeGlobals;

class HTMLElementFallback {}

export const LotosHTMLElementBase: typeof HTMLElement =
    runtime.HTMLElement ?? (HTMLElementFallback as unknown as typeof HTMLElement);

export function getCustomElementsRegistry(): CustomElementRegistry | null {
    return runtime.customElements ?? null;
}

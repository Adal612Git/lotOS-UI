import { registerLotosButton } from './button.js';
import { registerLotosInput } from './input.js';
import { registerLotosBadge } from './badge.js';
import { registerLotosCard } from './card.js';

export { LotosButtonElement, registerLotosButton } from './button.js';
export { LotosInputElement, registerLotosInput } from './input.js';
export { LotosBadgeElement, registerLotosBadge } from './badge.js';
export { LotosCardElement, registerLotosCard } from './card.js';

export function registerLotosWebComponents(): void {
    registerLotosButton();
    registerLotosInput();
    registerLotosBadge();
    registerLotosCard();
}


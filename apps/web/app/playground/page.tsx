import './playground.css';
import { PlaygroundClient } from './playground-client';

export const metadata = {
  title: 'LotOS UI Playground',
  description: 'Component-by-component playground with plain React vs LotOS UI comparisons.',
};

export default function PlaygroundPage() {
  return <PlaygroundClient />;
}

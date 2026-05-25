import React from 'react';
import { Button } from '../src/components/button/button';

export default {
  title: 'LotOS/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Launch',
    variant: 'primary',
    size: 'md',
  },
};

export const Primary = {};

export const Outline = {
  args: {
    variant: 'outline',
    children: 'Secondary Action',
  },
};

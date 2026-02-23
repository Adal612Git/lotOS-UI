import React from 'react';
import { render } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';
import { Button } from '../../src/components/button/button.js';

describe('Button a11y', () => {
    it('has no accessibility violations in default state', async () => {
        const { container } = render(<Button>Run</Button>);
        const results = await axe.run(container, {
            rules: {
                'color-contrast': { enabled: false },
            },
        });
        expect(results.violations).toHaveLength(0);
    });
});

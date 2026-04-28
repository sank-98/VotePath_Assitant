import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DecisionResult } from './DecisionResult';
import React from 'react';

describe('DecisionResult Component', () => {
  it('renders candidate name and party correctly', () => {
    render(<DecisionResult candidateName="Test Candidate" party="Test Party" confidence={85} />);
    
    expect(screen.getByText('Test Candidate')).toBeDefined();
    expect(screen.getByText('Test Party')).toBeDefined();
  });

  it('displays the confidence score with ARIA label', () => {
    render(<DecisionResult candidateName="Test" party="Party" confidence={92} />);
    
    const scoreBadge = screen.getByLabelText(/Match confidence: 92%/i);
    expect(scoreBadge).toBeDefined();
    expect(screen.getByText('92%')).toBeDefined();
  });

  it('applies emerald styling for high confidence scores', () => {
    const { container } = render(<DecisionResult candidateName="Test" party="Party" confidence={95} />);
    const badge = container.querySelector('.text-emerald-600');
    expect(badge).toBeDefined();
  });

  it('highlights top match with specific classes', () => {
    const { container } = render(<DecisionResult candidateName="Top" party="Win" confidence={99} isTopMatch={true} />);
    expect(container.querySelector('.bg-blue-50')).toBeDefined();
    expect(container.querySelector('.scale-\\[1\\.02\\]')).toBeDefined();
  });
});

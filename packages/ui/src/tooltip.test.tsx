import { cleanup, render, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './index'

afterEach(cleanup)

describe('scoped reference tooltip presentation', () => {
  it('renders the source colors and arrow without changing default tooltips', async () => {
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip open>
          <TooltipTrigger asChild>
            <button>Source action</button>
          </TooltipTrigger>
          <TooltipContent presentation='reference'>
            <p>Source detail</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip open>
          <TooltipTrigger asChild>
            <button>Default action</button>
          </TooltipTrigger>
          <TooltipContent>Default detail</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )

    await waitFor(() => {
      const source = document.querySelector('.bg-gray-600')
      expect(source).toBeTruthy()
      expect(source?.className).toContain('dark:bg-gray-200')
      expect(source?.className).toContain('w-fit')
      expect(source?.querySelector('svg.fill-gray-600')).toBeTruthy()
      const standard = document.querySelector('.max-w-64')
      expect(standard?.className).toContain('bg-foreground')
      expect(standard?.querySelector('svg')).toBeNull()
    })
  })
})

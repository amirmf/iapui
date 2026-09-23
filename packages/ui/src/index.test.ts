import { describe, expect, it } from 'vitest'

import {
  Button,
  Collapsible,
  Dialog,
  Input,
  Sheet,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toaster,
} from './index'

describe('@iap/ui public API', () => {
  it('exports the approved primitives', () => {
    expect([
      Button,
      Collapsible,
      Dialog,
      Input,
      Sheet,
      Tabs,
      TabsContent,
      TabsList,
      TabsTrigger,
      Toaster,
    ]).not.toContain(undefined)
  })
})

/* eslint-disable react-refresh/only-export-components */
import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import { CommandMenu } from './command-menu'

interface SearchContextType {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const SearchContext = createContext<SearchContextType | null>(null)

interface SearchProviderProps {
  children: ReactNode
}

export function SearchProvider(props: SearchProviderProps) {
  const { children } = props
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <SearchContext.Provider value={{ open, setOpen }}>
      {children}
      <CommandMenu />
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const searchContext = useContext(SearchContext)

  if (!searchContext) {
    throw new Error('useSearch has to be used within <SearchContext.Provider>')
  }

  return searchContext
}

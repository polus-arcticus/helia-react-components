import { createHelia, type Helia } from 'helia'
import React, { createContext, useEffect, useState, type ReactNode } from 'react'

interface HeliaContextProps {
  helia: Helia | null
}

const HeliaContext = createContext<HeliaContextProps | undefined>(undefined)

const HeliaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [heliaInstance, setHeliaInstance] = useState<Helia | null>(null)
  useEffect(() => {
    void (async () => {
      if (heliaInstance != null) {
        return
      }
      const helia = await createHelia()
      setHeliaInstance(helia)
    })()

    return () => {
      // stop Helia and cleanup when the component unmounts
      if (heliaInstance != null) {
        heliaInstance.stop().catch((err) => {
          // eslint-disable-next-line no-console
          console.error('Failed to stop Helia:', err)
        })
        setHeliaInstance(null)
      }
    }
  }, [])

  const contextValue: HeliaContextProps = {
    helia: heliaInstance
  }

  return (
    <HeliaContext.Provider value={contextValue}>
      {children}
    </HeliaContext.Provider>
  )
}

const useHelia = (): Helia | null => {
  const context = React.useContext(HeliaContext)
  if (context === undefined) {
    throw new Error('useHelia must be used within a HeliaProvider')
  }
  return context.helia
}

export { HeliaProvider, useHelia }

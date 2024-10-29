
import { type PubSub } from '@libp2p/interface'
import { createHelia, type HeliaLibp2p } from 'helia'

import { type Libp2p } from 'libp2p'
import React, { createContext, useEffect, useState, type ReactNode } from 'react'
interface HeliaContextProps {
  helia: HeliaLibp2p<Libp2p<{ pubsub: PubSub }>> | null
}


const HeliaContext = createContext<HeliaContextProps | undefined>(undefined)
const HeliaProvider: React.FC<{ children: ReactNode, libp2p?: Libp2p }> = ({ children, libp2p }) => {
  const [heliaInstance, setHeliaInstance] = useState<HeliaLibp2p<Libp2p<{ pubsub: PubSub }>> | null>(null)
  useEffect(() => {
    void (async () => {
      if (heliaInstance != null) {
        return
      }
      let helia
      if (libp2p == null) {
        helia = await createHelia()
      } else {
        helia = await createHelia({ libp2p })
      }
      setHeliaInstance(helia as HeliaLibp2p<Libp2p<{ pubsub: PubSub }>>)
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

const useHelia = (): HeliaLibp2p<Libp2p<{ pubsub: PubSub }>> | null => {
  const context = React.useContext(HeliaContext)
  if (context === undefined) {
    throw new Error('useHelia must be used within a HeliaProvider')
  }
  return context.helia as HeliaLibp2p<Libp2p<{ pubsub: PubSub }>>
}

export { HeliaProvider, useHelia }

import { createHelia, type Helia } from 'helia'
import { type Libp2p, type ServiceMap } from 'libp2p'
import React, { createContext, useEffect, useState, type ReactNode } from 'react'


interface HeliaContextProps {
  helia: HeliaLibp2p | null
}


export interface HeliaLibp2p extends Helia {
  libp2p: Libp2pPubsub
}

type PubsubServiceMap = ServiceMap & {
  message: string;
}

type Libp2pPubsub = Libp2p<PubsubServiceMap>


const HeliaContext = createContext<HeliaContextProps | undefined>(undefined)
// make libp2p an optional parameter 
const HeliaProvider: React.FC<{ children: ReactNode, libp2p?: Libp2p }> = ({ children, libp2p }) => {
  const [heliaInstance, setHeliaInstance] = useState<HeliaLibp2p | null>(null)
  useEffect(() => {
    void (async () => {
      if (heliaInstance != null) {
        return
      }
      let helia;
      if (libp2p == null) {
        helia = await createHelia()
      } else {
        helia = await createHelia({ libp2p })
      }
      console.log('helia', helia)
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

const useHelia = (): HeliaLibp2p | null => {
  const context = React.useContext(HeliaContext)
  if (context === undefined) {
    throw new Error('useHelia must be used within a HeliaProvider')
  }
  return context.helia
}

export { HeliaProvider, useHelia }

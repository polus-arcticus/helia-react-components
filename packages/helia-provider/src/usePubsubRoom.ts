import { useEffect, useState, useCallback, useContext } from 'react'
import { type Helia } from 'helia'
import { type Libp2p } from 'libp2p'
import { useHelia } from './helia-provider.js'

const DEFAULT_OPTIONS = {
  pollInterval: 1000
}

export const usePubsubRoom = ({topic='default', options=DEFAULT_OPTIONS}= {}) => {
  const helia = useHelia() 
  const [peers, setPeers] = useState<string[]>([])
  const [connections, setConnections] = useState<Object>({})
  const [messages, setMessages] = useState<[]>([])

  const updatePeerList = useCallback(async () => {

  }, [])


  useEffect(() => {
    if (helia) {
      helia.libp2p.addEventListener('connection:open', updatePeerList)
      helia.libp2p.addEventListener('connection:close', updatePeerList)
      helia.libp2p.addEventListener('self:peer:update', () => {})
      helia.libp2p.addEventListener('message', (event) => {
        const topic = event.detail.topic
        const message = event.detail.data
        setMessages(old => [...old, {topic, message}])
      })

      return () => {
        helia.libp2p.removeEventListener('connection:open', updatePeerList)
        helia.libp2p.removeEventListener('connection:close', updatePeerList)
        helia.libp2p.removeEventListener('self:peer:update', () => {})
        helia.libp2p.removeEventListener('message', (event) => {})
      }

    }
  }, [helia])


  setInterval(() => {
    if (helia ) {
      const peerList = helia.libp2p.services.pubsub.getSubscribers(topic)
      setPeers(peerList)
    }
  }, 500)

}

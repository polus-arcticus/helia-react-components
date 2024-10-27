import { useEffect, useState, useCallback, useContext } from 'react'
import { useHelia } from './helia-provider.js'

const DEFAULT_OPTIONS = {
  pollInterval: 1000
}

export const usePubsubRoom = ({
  topic = 'default',
  options = DEFAULT_OPTIONS
} = {}): void => {
  const helia = useHelia()
  const [peers, setPeers] = useState<string[]>([])
  const [connections, setConnections] = useState<Object>({})
  const [messages, setMessages] = useState<Object[]>([])


  useEffect(() => {
    if (helia != null) {
      helia.libp2p.addEventListener('connection:open', () => {})
      helia.libp2p.addEventListener('connection:close', () => {})
      helia.libp2p.addEventListener('self:peer:update', () => {})
      helia.libp2p.services.pubsub.addEventListener('message', (event: any) => {
        const topic = event.detail.topic
        const message = event.detail.data
        setMessages(old => [...old, { topic, message } ])
      })

      return () => {
        helia.libp2p.removeEventListener('connection:open', () => {})
        helia.libp2p.removeEventListener('connection:close', () => {})
        helia.libp2p.removeEventListener('self:peer:update', () => {})
        helia.libp2p.services.pubsub.removeEventListener('message', (event: any) => {})
      }

    }
  }, [helia])


  setInterval(() => {
    if (helia != null) {
      const peerList = helia.libp2p.services.pubsub.getSubscribers(topic)
      setPeers(peerList)
    }
  }, 500)

}

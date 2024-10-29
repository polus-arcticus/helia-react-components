import { render, screen } from '@testing-library/react'
import { expect } from 'aegir/chai'
import pDefer from 'p-defer'
import { useEffect } from 'react'
import { HeliaProvider, useHelia } from '../src/helia-provider.js'
import type { Helia } from 'helia'
import { usePubsubRoom } from '../src/usePubsubRoom.js'
import { exampleLibp2p } from './sampleLibp2pConfig.js'

describe('usePubsubRoom', () => {
  it('should fail in absense a HeliaProvider', async () => {
    const FunctionComponent: React.FC = () => {
      try {
        usePubsubRoom()
      } catch (e: any) {
        expect(e).to.be.an.instanceOf(Error)
        expect(e.message).to.equal('useHelia must be used within a HeliaProvider')
      }
      return <div />
    }
    render(<FunctionComponent />)
  })

  it('should open a pubsub room within a helia provider', async () => {
    const pubsubPromise = pDefer()

    const FunctionComponent: React.FC = () => {
      const pubsub = usePubsubRoom()
      useEffect(() => {
        if (pubsub != null) {
          console.log(pubsub)
          pubsubPromise.resolve(pubsub)
        }
      }, [pubsub])
      return <div />
    }
    render(<HeliaProvider libp2p={exampleLibp2p}><FunctionComponent /></HeliaProvider>)
    await expect(pubsubPromise.promise).to.eventually.exist()
  })
})

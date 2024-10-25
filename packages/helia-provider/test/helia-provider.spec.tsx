// helia-provider.test.tsx

import { render, screen } from '@testing-library/react'
import { expect } from 'aegir/chai'
import pDefer from 'p-defer'
import { useEffect } from 'react'
import { HeliaProvider, useHelia } from '../src/helia-provider.js'
import type { Helia } from 'helia'

describe('HeliaProvider', () => {
  it('should render without crashing', () => {
    render(<HeliaProvider data-testid='helia-provider'><div data-testid='helia-provider-child' /></HeliaProvider>)
    const element = screen.getByTestId('helia-provider-child') // Assuming you have a data-testid="helia-provider" in your component
    expect(element).to.exist()
  })
})

describe('useHelia', () => {
  it('should throw an error when used outside of HeliaProvider', () => {
    const FunctionComponent: React.FC = () => {
      try {
        useHelia()
      } catch (e: any) {
        expect(e).to.be.an.instanceOf(Error)
        expect(e.message).to.equal('useHelia must be used within a HeliaProvider')
      }

      return <div />
    }
    render(<FunctionComponent />)
  })

  it('should return Helia instance when used within HeliaProvider', async () => {
    const heliaPromise = pDefer<Helia>()
    const FunctionComponent: React.FC = () => {
      const helia = useHelia()
      useEffect(() => {
        if (helia != null) {
          heliaPromise.resolve(helia)
        }
      }, [helia])
      return <div />
    }
    render(<HeliaProvider><FunctionComponent /></HeliaProvider>)

    await expect(heliaPromise.promise).to.eventually.exist()
  })
})

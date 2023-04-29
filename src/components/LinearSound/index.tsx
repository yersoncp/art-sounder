import { useEffect, useRef } from "react"
import "../../helpers/p5.helper"
import p5 from "p5"
import "p5/lib/addons/p5.sound"

const RadialSound = () => {
  const myRef = useRef<any>()

  const Sketch = (p: any) => {
    let song: any, amplitude: any, fft: any
    const MAX_CIRCLE = 180
    const CANVAN_WIDTH = 800
    const CANVAN_HEIGHT = 800

    p.preload = () => {
      p.soundFormats('mp3')
      song = p.loadSound('/assets/audio/reflected-light-147979.mp3')
    }

    p.setup = () => {
      const cnv = p.createCanvas(CANVAN_WIDTH, CANVAN_HEIGHT)
      cnv.mouseClicked(p.togglePlay)
      amplitude = new p5.Amplitude()
      amplitude.setInput(song)
      fft = new p5.FFT()
    }

    p.draw = () => {
      // Config
      p.clear()
      p.background(0, 0)
      p.noStroke()
      p.translate(0, CANVAN_HEIGHT / 2)
      p.colorMode("RGB")
      p.angleMode("DEGREES")

      /** spectrum */
      let spectrum = fft.analyze()

      // Colors
      let from = p.color(34, 104, 255, 200)
      let to = p.color(255, 25, 25, 200)

      const mid = Math.floor(spectrum.length / 2)
      const firstHalf = spectrum.slice(0, mid)

      for (let i = 0; i < firstHalf.length; i++) {
        let color = p.lerpColor(from, to, p.map(i, 0, firstHalf.length, 0, 1))
        let height = p.map(firstHalf[i], 0, 255, 0, MAX_CIRCLE)
        p.stroke(color)
        p.line(i, 0, i, -height)
        p.line(i, 0, i, height)
      }

    }

    p.togglePlay = () => {
      if (song.isPlaying()) {
        song.pause()
      } else {
        song.loop()
      }
    }
  }

  useEffect(() => {
    const myP5 = new p5(Sketch, myRef.current)
    return () => {
      myP5.remove()
    }
  }, [myRef])

  return (
    <div ref={myRef} />
  )
}

export default RadialSound
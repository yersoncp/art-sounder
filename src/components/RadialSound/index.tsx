import { useEffect, useRef } from "react"
import "../../helpers/p5.helper"
import p5 from "p5"
import "p5/lib/addons/p5.sound"

const RadialSound = () => {
  const myRef = useRef<any>()

  const Sketch = (p: any) => {
    let song: any, amplitude: any, fft: any
    const MAX_CIRCLE = 180
    const INNER_CIRCLE = 80
    const BORDER_CIRCLE = 2
    const ANGLE_DIVIDE = 2
    const CANVAN_WIDTH = 450
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
      p.background(0)
      p.noStroke()
      p.translate(CANVAN_WIDTH / 2, CANVAN_HEIGHT / 2)
      p.colorMode("RGB")
      p.angleMode("DEGREES")

      /** spectrum */
      let spectrum = fft.analyze()

      // Colors
      let from = p.color(63, 200, 255)
      let to = p.color(168, 63, 255)

      let angle = 360 / (spectrum.length / ANGLE_DIVIDE)
      for (let i = 0; i < spectrum.length; i++) {
        p.rotate(angle)
        let c = p.lerpColor(from, to, p.map(i, 0, spectrum.length, 0, 1))
        let h = p.map(spectrum[i], 0, 255, INNER_CIRCLE + BORDER_CIRCLE, MAX_CIRCLE)
        p.stroke(c)
        p.line(INNER_CIRCLE, INNER_CIRCLE, h, h)
      }

      /**  Get the average (root mean square) amplitude */
      let rms = amplitude.getLevel()
      p.fill(255)
      p.noStroke()
      // Draw an ellipse with size based on volume
      p.ellipse(0, 0, 20 + rms * 200, 20 + rms * 200)
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
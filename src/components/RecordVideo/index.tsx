import { FC, useEffect, useRef, useState } from "react"
import html2canvas from 'html2canvas'
import RecordRTC, { invokeSaveAsDialog } from 'recordrtc'

interface IRecordVideoProps {
  children: any
}

const RecordVideo: FC<IRecordVideoProps> = ({ children }) => {
  const elementToRecordRef = useRef<HTMLDivElement>(null)
  const previewVideoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvas2d, setCanvas2d] = useState<HTMLCanvasElement>()
  const [canvasCtx, setCanvasCtx] = useState<CanvasRenderingContext2D>()
  const [recorder, setRecorder] = useState<RecordRTC>()
  const [isRecordingStarted, setIsRecordingStarted] = useState<boolean>(false)

  let stopRecording = false

  const looper = (): any => {
    if (stopRecording) {
      return
    }

    if (elementToRecordRef.current) {
      html2canvas(elementToRecordRef.current).then(function (canvas) {
        canvasCtx?.clearRect(0, 0, canvas2d?.width as number, canvas2d?.height as number)
        canvasCtx?.drawImage(canvas, 0, 0, canvas2d?.width as number, canvas2d?.height as number)
        requestAnimationFrame(looper)
      })
    }
  }

  const handleStartRecording = () => {
    setIsRecordingStarted(true)
    stopRecording = false
    recorder?.startRecording()
  }

  const handleStopRecording = () => {
    recorder?.stopRecording(function () {
      stopRecording = true
      setIsRecordingStarted(false)

      var blob = recorder.getBlob()

      console.log("blob", blob)

      invokeSaveAsDialog(blob)

      // document.getElementById('preview-video').srcObject = null;
      // document.getElementById('preview-video').src = URL.createObjectURL(blob);
      elementToRecordRef.current?.removeAttribute("src")
      previewVideoRef.current?.setAttribute("src", URL.createObjectURL(blob))

      // window.open(URL.createObjectURL(blob));
    })
  }

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    const recordRTC = new RecordRTC(canvas as HTMLCanvasElement, {
      type: 'canvas',
    })

    canvas.setAttribute('width', `${elementToRecordRef.current?.clientWidth}`)
    canvas.setAttribute('height', `${elementToRecordRef.current?.clientHeight}`)

    setRecorder(recordRTC)
    setCanvasCtx(ctx)
    setCanvas2d(canvas)
  }, [])

  useEffect(() => {
    if (isRecordingStarted) {
      looper()
    }
  }, [isRecordingStarted])

  return (
    <>
      <button
        onClick={handleStartRecording}
        disabled={isRecordingStarted}
      >
        Start Recording
      </button>

      <button
        onClick={handleStopRecording}
        disabled={!isRecordingStarted}
      >
        Stop Recording
      </button>

      {isRecordingStarted && <>Grabando...</>}

      <video
        controls
        autoPlay
        playsInline
        ref={previewVideoRef}
      />

      <div
        ref={elementToRecordRef}
        style={{
          border: "5px solid gray", borderRadius: "5px", padding: "20px", margin: "20px",
          width: "480px", height: "360px",
          background: "#222",
        }}
      >
        {children}
      </div>

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute", top: "-99999999px", left: "-9999999999px",
        }}
      >
      </canvas>
    </>
  )
}

export default RecordVideo
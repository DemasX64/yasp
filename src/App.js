import { useState, useRef } from 'react';
import './App.css';

function App() {
  const canvas = useRef()
  const video = useRef()
  const [answer, setAnswer] = useState('')
  const [request, setRequest] = useState(false)

  const sendScreenshot = async (image) => {
    const data = new FormData()
    data.append('screenshot', image)
    setRequest(true)
    await fetch('http://localhost:3000/screenshot/add', {
      method: 'POST',
      body: data
    }).then((res) => res.json()).then((json) => setAnswer(json.recognizedText));
    setRequest(false)
  }

  const getScreenshot = async () => {
    try {
      const displayMediaOptions = {
        video: {
          cursor: "never"
        },
        audio: false
      }
      video.current.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);   
      video.current.addEventListener('loadeddata', async () => {
        const context = canvas.current.getContext('2d')
        const videoTrack = video.current.srcObject?.getVideoTracks()[0];
        if (videoTrack) {
          const { height, width } = videoTrack.getSettings();
          canvas.current.width = width;
          canvas.current.height = height;
          context.drawImage(video.current, 0, 0, width, height);
          canvas.current.toBlob((result) => sendScreenshot(result))
          videoTrack.stop();
        }
      }, { once: true });
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="App">
      <canvas ref={canvas} style={{position:'absolute', visibility:'hidden'}}/>
      <video ref={video} style={{position:'absolute', visibility:'hidden'}} autoPlay/>
      <p>Теперь это одна кнопка</p>
      <p>(Ну, почти 😢)</p>
      <p>Нажмите отправить </p>
      <button type='button' onClick={getScreenshot} disabled={request}>Отправить</button>
      {request && <p>Загрузка...</p>}
      {answer && 
        <div>
          <p>Результат</p>
          <p>{answer}</p>
        </div>
      }
    </div>
  );
}

export default App;

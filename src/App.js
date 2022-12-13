import { useState } from 'react';
import './App.css';

function App() {

  const [answer, setAnswer] = useState('')
  const [request, setRequest] = useState(false)

  const  paste = async () => {
  try {
    const clipboardItems = await navigator.clipboard.read();
    for (const clipboardItem of clipboardItems) {
      for (const type of clipboardItem.types) {
        if(type === 'image/png') {
          const blob = await clipboardItem.getType(type);
          const file = new File([blob], 'screenshot');
          sendScreenshot(file)
        } 
        else {
          alert('Нет изображения в буфере обмена')
        }
        
        }
    }
  } catch (err) {
    console.error(err.name, err.message);
  }
  }

  const sendScreenshot = async (image) => {
    const data = new FormData()
    data.append('screenshot', image)
    setRequest(true)
    await fetch('http://158.160.45.164:3000/screenshot/add', {
      method: 'POST',
      body: data
    }).then((res) => res.json()).then((json) => setAnswer(json.recognizedText));
    setRequest(false)
  }

  // не сработало из-за безопасности браузера

  // useEffect(() => {
  //   window.addEventListener('keyup', (event) => {
  //     if(event.keyCode === 44){
  //       paste()
  //     }
  //   }
  //   )
  // },[])

  return (
    <div className="App">
      <p>Нажмите Print Screen</p>
      <p>Нажмите отправить </p>
      <p>(Да, это не одна кнопка 😢)</p>
      <button type='button' onClick={paste} disabled={request}>Отправить</button>
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

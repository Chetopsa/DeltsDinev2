import React, {useEffect, useState} from 'react'

function App(children) {

  const [backendData, setBackendData] = useState([{}])
  useEffect(() => {
    fetch("/api").then(
      res => res.json()
    ).then(
      data => {
        setBackendData(data)
      }
    )
  }, [])

  return (
    <div>
      <p>hellow world</p>
        
         <p> {JSON.stringify(backendData)}</p>
      
      </div>
  )
}

export default App

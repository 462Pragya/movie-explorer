import { useState } from 'react'


import './App.css'
import Search from './Components/Search.jsx'

function App() {
  
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <>
   <main>
    <div className='pattern'>
      <div className='Wrapper'>
        <header>
          <img src="./hero.png" alt="hero image" />
          <h1>
            Find Your <span className='text-gradient'>Movie</span> Without Any Hassle
          </h1>
        </header>

        <Search searchTerm={searchTerm} setSearchTerm ={ setSearchTerm}/>
       
      </div>
    </div>
   </main>
    </>
  )
}

export default App

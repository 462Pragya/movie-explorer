import React from 'react'

const Search = ({searchTerm, setSearchTerm}) => {
  return (
    <>
    <div  className='search'>
        <div className='search-wrapper'>
            <img src="search.png" alt="search" />
 
            <input type="text"
            placeholder="Search through thousands of movies"
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            onKeyDown={(e) => 
              e.key === 'Enter' && e.target.value.trim() !== '' && setSearchTerm(e.target.value.trim())}
            />
        </div>
    </div>
    </>
  )
}

export default Search
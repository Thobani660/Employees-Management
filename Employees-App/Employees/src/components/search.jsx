import React from 'react';

function SearchHistory({ input, onInputChange }) {
  const handleSearchClick = () => {
    if (input.trim() === '') {
      alert('No user to search');
    } else {
      console.log('Searching for:', input);
    }
  };

  return (
    <div className='searchdiv'>
      <input
        className='search'
        placeholder="Search by name"
        type="search"
        value={input}
        onChange={onInputChange}
        style={{width:"300px"}}
      />
      <div className='searching' onClick={handleSearchClick}>
        <span className="material-symbols-light--search">search</span>
      </div>
    </div>
  );
}

export default SearchHistory;

import { useState } from 'react';
import { first151Pokemon, getFullPokedexNumber } from '../utils';

const SideNav = (props) => {
  const {
    selectedPokemon,
    setSelectedPokemon,
    handleToggleMenu,
    showSideMenu,
    handleCloseMenu,
  } = props;

  const [searchInputValue, setSearchInputValue] = useState('');

  const filteredPokemon = first151Pokemon.filter((ele, eleIndex) => {
    // if full pokedex numbers includes the current search value, return type
    if (getFullPokedexNumber(eleIndex).includes(searchInputValue)) {
      return true;
    }
    // if the pokemon name includes the current search value, return true
    if (
      ele.toLocaleLowerCase().includes(searchInputValue.toLocaleLowerCase())
    ) {
      return true;
    }

    // otherwise, exclude from the array
    return false;
  });

  return (
    <nav className={' ' + (!showSideMenu ? 'open' : '')}>
      <div className={'header' + (!showSideMenu ? ' open' : '')}>
        <button onClick={handleCloseMenu} className='open-nav-button'>
          <i className='fa-solid fa-arrow-left-long'></i>
        </button>
        <h1 className='text-gradient '>Pokédex</h1>
      </div>
      <input
        placeholder='E.g, 001 or Bulba'
        value={searchInputValue}
        onChange={(e) => setSearchInputValue(e.target.value)}
      />
      {filteredPokemon.map((pokemon, pokemonIndex) => {
        const truePokedexNumber = first151Pokemon.indexOf(pokemon);
        return (
          <button
            onClick={() => {
              setSelectedPokemon(truePokedexNumber);
              handleCloseMenu();
            }}
            key={pokemonIndex}
            className={
              'nav-card ' +
              (pokemonIndex === selectedPokemon ? ' nav-card-selected' : ' ')
            }>
            <p>{getFullPokedexNumber(truePokedexNumber)}</p>
            <p>{pokemon}</p>
          </button>
        );
      })}
    </nav>
  );
};

export default SideNav;

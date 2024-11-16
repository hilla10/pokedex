import React, { useEffect, useState } from 'react';
import { getFullPokedexNumber, getPokedexNumber } from '../utils';
import TypeCard from './TypeCard';
import Modal from './Modal';

const PokeCard = (props) => {
  const { selectedPokemon } = props;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [skill, setSkill] = useState(null);
  const [loadingSkill, setLoadingSkill] = useState(false);

  const { name, height, abilities, stats, types, moves, sprites } = data || {};

  const imgList = Object.keys(sprites || {}).filter((val) => {
    if (!sprites[val]) {
      return false;
    }
    if (['version', 'other'].includes(val)) {
      return false;
    }
    return true;
  });

  async function fetchMoveData(move, moveUrl) {
    if (loadingSkill || !localStorage || !moveUrl) {
      return;
    }

    // check cache for move
    let c = {};
    if (localStorage.getItem('pokemon-moves')) {
      c = JSON.parse(localStorage.getItem('pokemon-moves'));
    }
    if (move in c) {
      setSkill(c[moves]);

      return;
    }

    try {
      setLoadingSkill(true);
      const res = await fetch(moveUrl);
      const moveData = await res.json();

      const description = moveData?.flavor_text_entries.filter((val) => {
        return (val.version_group.name = 'firered-leafgreen');
      })[0]?.flavor_text;

      const skillData = {
        name: move,
        description,
      };

      setSkill(skillData);
      c[move] = skillData;
      localStorage.setItem('pokemon-moves', JSON.stringify(c));
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoadingSkill(false);
    }
  }

  useEffect(() => {
    // if loading, exit logic
    if (loading || !localStorage) {
      return;
    }
    // check if the selected pokemon information is available in the cache

    // 1, define the cache

    let cache = {};

    if (localStorage.getItem('pokedex')) {
      cache = JSON.parse(localStorage.getItem('pokedex'));
    }

    // 2, check if the selected pokemon is in the cache, otherwise from the api

    if (selectedPokemon in cache) {
      // read from cache
      setData(cache[selectedPokemon]);

      return;
    }

    // we passed all the cache stuff to now avail and now need to fetch the data from the api

    async function fetchPokemonData() {
      try {
        const baseUrl = 'https://pokeapi.co/api/v2/';
        const suffix = 'pokemon/' + getPokedexNumber(selectedPokemon);
        const finalUrl = baseUrl + suffix;
        const res = await fetch(finalUrl);
        const pokemonData = await res.json();
        setData(pokemonData);

        cache[selectedPokemon] = pokemonData;
        localStorage.setItem('pokedex', JSON.stringify(cache));
      } catch (error) {
        console.log(error.message);
      } finally {
      }
    }

    fetchPokemonData();

    // 3, if we fetch from the api, make sure to save the information to the cache from next time
  }, [selectedPokemon]);

  if (loading || !data) {
    return (
      <div>
        <h4>Loading...</h4>
      </div>
    );
  }

  return (
    <div className='poke-card'>
      {skill && (
        <Modal
          handleCloseModal={() => {
            setSkill(null);
          }}>
          <div>
            <h6>Name</h6>
            <h2 className='skill-name'>{skill.name.replaceAll('-', ' ')}</h2>
          </div>
          <div>
            <h6>Descriptions</h6>
            <p>{skill.description}</p>
          </div>
        </Modal>
      )}
      <div>
        <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
        <h2>{name}</h2>
      </div>
      <div className='type-container'>
        {types.map((typeObj, typeIndex) => {
          return <TypeCard key={typeIndex} type={typeObj?.type?.name} />;
        })}
      </div>
      <img
        src={'/pokemon/' + getFullPokedexNumber(selectedPokemon) + '.png'}
        alt={`${name}-large-img`}
        className='default-img'
      />
      <div className='img-container'>
        {imgList.map((spriteUrl, spriteIndex) => {
          const imgUrl = sprites[spriteUrl];
          return (
            <img
              src={imgUrl}
              key={spriteIndex}
              alt={`${name}-img-${spriteUrl}`}
            />
          );
        })}
      </div>
      <h3>Stats</h3>
      <div className='stats-card'>
        {stats.map((statObj, statIndex) => {
          const { stat, base_stat } = statObj;
          return (
            <div className='stat-item' key={statIndex}>
              {stat?.name.replaceAll('-', ' ')}
              <p>{base_stat}</p>
            </div>
          );
        })}
      </div>
      <h3>Moves</h3>
      <div className='pokemon-move-grid'>
        {moves.map((moveObj, moveIndex) => {
          return (
            <button
              className='button-card pokemon-move'
              key={moveIndex}
              onClick={() => {
                fetchMoveData(moveObj?.move?.name, moveObj?.move?.url);
              }}>
              <p>{moveObj?.move?.name.replaceAll('-', ' ')}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PokeCard;

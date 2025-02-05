import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../context/global";
import styled, { keyframes } from "styled-components";
import Sidebar from "./Sidebar";

function Upcoming({ rendered }) {
  const { upcomingAnime, isSearch, searchResults } = useGlobalContext();
  const [hoveredAnime, setHoveredAnime] = useState(null);

  const conditionalRender = () => {
    const animeToRender =
      !isSearch && rendered === "upcoming" ? upcomingAnime : searchResults;

    return animeToRender?.map((anime) => {
      const isHovered = hoveredAnime === anime.mal_id;

      return (
        <AnimeCard
          key={anime.mal_id}
          to={`/anime/${anime.mal_id}`}
          onMouseEnter={() => setHoveredAnime(anime.mal_id)}
          onMouseLeave={() => setHoveredAnime(null)}
        >
          <div className={`anime-card-wrapper ${isHovered ? "hovered" : ""}`}>
            <div className="anime-image-container">
              <img src={anime.images.jpg.large_image_url} alt={anime.title} />
              <div className="anime-energy-effect">
                <div className="power-level-indicator">
                  <span>Power Level: {anime.score || "N/A"}</span>
                </div>
              </div>
            </div>
            <div className="anime-details-overlay">
              <div className="anime-title-container">
                <div className="anime-title">{anime.title}</div>
                <div className="anime-alternative-title">
                  {anime.title_japanese || ""}
                </div>
              </div>
              <div className="anime-meta">
                <div className="anime-type-year">
                  <span className="anime-type">{anime.type}</span>
                  <span className="anime-year">{anime.year || "TBA"}</span>
                </div>
                <div className="anime-rating">
                  <span className="rating-icon">⚡</span>
                  <span>{anime.score || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </AnimeCard>
      );
    });
  };

  return (
    <UltraAnimeStyled>
      <div className="anime-universe-container">
        <div className="cosmic-header">
          <h1>
            {!isSearch && rendered === "upcoming"
              ? "ANIME POWER REALM"
              : "SEARCH DIMENSION"}
          </h1>
          <div className="cosmic-subtitle">Where Legends and Sagas Collide</div>
        </div>
        <div className="anime-galaxy-grid">{conditionalRender()}</div>
      </div>
      <Sidebar />
    </UltraAnimeStyled>
  );
}

// Dragon Ball Z Inspired Animations
const dragonEnergyPulse = keyframes`
  0% { 
    transform: scale(1) rotate(0deg); 
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  }
  50% { 
    transform: scale(1.03) rotate(5deg); 
    box-shadow: 0 0 20px rgba(255, 165, 0, 0.8);
  }
  100% { 
    transform: scale(1) rotate(0deg);
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  }
`;

const powerChargeSurge = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const AnimeCard = styled(Link)`
  text-decoration: none;
  perspective: 1200px;
`;

const UltraAnimeStyled = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a2a, #1a1a3a);
  background-image: radial-gradient(rgba(255, 215, 0, 0.1) 8%, transparent 8%),
    radial-gradient(rgba(255, 165, 0, 0.1) 8%, transparent 8%);
  background-position: 0 0, 50px 50px;
  background-size: 100px 100px;
  color: #ffffff;

  /* Cosmic Header Styling */
  .cosmic-header {
    border-radius: 17px;
    text-align: center;
    padding: 1rem 0;
    background: linear-gradient(to right, #1a1a3a, #2a2a4a);
    position: relative;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        45deg,
        rgba(255, 215, 0, 0.1),
        rgba(255, 165, 0, 0.1)
      );
      animation: ${powerChargeSurge} 10s ease infinite;
    }

    h1 {
      position: relative;
      font-size: 4rem;
      font-weight: 900;
      background: linear-gradient(45deg, #ffd700, #ffa500);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-transform: uppercase;
      letter-spacing: 6px;
      text-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
    }

    .cosmic-subtitle {
      color: #ffa500;
      font-size: 1.5rem;
      margin-top: 1rem;
      letter-spacing: 2px;
      // animation: ${dragonEnergyPulse} 4s infinite;
      text-transform: uppercase;
    }
  }

  /* Anime Galaxy Grid */
  .anime-universe-container {
    flex: 1;
    padding: 1rem;
    overflow: hidden;
  }

  .anime-galaxy-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 2.5rem;
    padding: 2rem;
  }

  /* Anime Card Styling */
  .anime-card-wrapper {
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    transform-style: preserve-3d;
    background: linear-gradient(145deg, #1a1a3a, #2a2a4a);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);

    &:hover,
    &.hovered {
      transform: scale(1.05) rotateX(10deg) rotateY(15deg);
      z-index: 10;
      box-shadow: 0 25px 50px rgba(255, 215, 0, 0.2);
    }

    .anime-image-container {
      position: relative;
      height: 500px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.6s ease;
        filter: brightness(0.9);
      }

      .anime-energy-effect {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          45deg,
          rgba(255, 215, 0, 0.2),
          rgba(255, 165, 0, 0.2)
        );
        mix-blend-mode: overlay;
        opacity: 0;
        transition: opacity 0.6s ease;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        padding: 1rem;

        .power-level-indicator {
          background: rgba(0, 0, 0, 0.7);
          color: #ffd700;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: bold;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease;
        }
      }

      &:hover .anime-energy-effect,
      &.hovered .anime-energy-effect {
        opacity: 1;

        .power-level-indicator {
          opacity: 1;
          transform: translateY(0);
        }
      }
    }

    .anime-details-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
      padding: 1.5rem;
      transform: translateY(100%);
      transition: transform 0.6s ease;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    &:hover .anime-details-overlay,
    &.hovered .anime-details-overlay {
      transform: translateY(0);
    }

    .anime-title-container {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      .anime-title {
        font-size: 1.8rem;
        font-weight: bold;
        color: #ffd700;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .anime-alternative-title {
        font-size: 1rem;
        color: #ffa500;
        opacity: 0.7;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .anime-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .anime-type-year {
        display: flex;
        gap: 1rem;
        color: #ffd700;
        font-size: 1rem;
      }

      .anime-rating {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #ffa500;
        font-size: 1.2rem;

        .rating-icon {
          font-size: 1.5rem;
        }
      }
    }
  }

  /* Responsive Breakpoints */
  @media (max-width: 1600px) {
    .anime-galaxy-grid {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    }
  }

  @media (max-width: 1280px) {
    .cosmic-header h1 {
      font-size: 3.5rem;
    }

    .anime-galaxy-grid {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
  }

  @media (max-width: 1024px) {
    .cosmic-header h1 {
      font-size: 3rem;
    }

    .anime-galaxy-grid {
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      grid-gap: 2rem;
    }

    .anime-card-wrapper .anime-image-container {
      height: 400px;
    }
  }

  @media (max-width: 768px) {
    .cosmic-header h1 {
      font-size: 2.5rem;
    }

    .anime-galaxy-grid {
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      grid-gap: 1.5rem;
      padding: 1rem;
    }

    .anime-card-wrapper .anime-image-container {
      height: 300px;
    }
  }

  @media (max-width: 480px) {
    .cosmic-header h1 {
      font-size: 2rem;
      letter-spacing: 3px;
    }

    .anime-galaxy-grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      grid-gap: 1rem;
    }

    .anime-card-wrapper {
      .anime-image-container {
        height: 250px;
      }

      .anime-details-overlay {
        padding: 1rem;
      }

      .anime-title-container .anime-title {
        font-size: 1.4rem;
      }
    }
  }
`;

export default Upcoming;

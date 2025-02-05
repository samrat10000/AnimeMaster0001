import React, { useState, useRef, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../context/global";
import styled, { keyframes, css } from "styled-components";
import {
  Heart,
  Star,
  PlayCircle,
  Info,
  Bookmark,
  Zap,
  Layers,
  Compass,
} from "lucide-react";

function Popular({ rendered }) {
  const { popularAnime, isSearch, searchResults } = useGlobalContext();
  const [hoveredAnime, setHoveredAnime] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const gridRef = useRef(null);

  // Advanced filtering and memoization
  const filteredAnime = useMemo(() => {
    const animeList =
      !isSearch && rendered === "popular" ? popularAnime : searchResults;

    if (!animeList) return [];

    return animeList.filter((anime) => {
      if (activeFilter === "all") return true;
      if (activeFilter === "top-rated") return (anime.score || 0) > 8;
      if (activeFilter === "ongoing") return anime.status === "Ongoing";
      return true;
    });
  }, [isSearch, rendered, popularAnime, searchResults, activeFilter]);

  // Sophisticated hover handler
  const handleMouseEnter = useCallback((animeId) => {
    setHoveredAnime(animeId);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredAnime(null);
  }, []);

  // Rich anime card renderer
  const renderAnimeCard = (anime) => {
    const isHovered = hoveredAnime === anime.mal_id;

    return (
      <Link
        to={`/anime/${anime.mal_id}`}
        key={anime.mal_id}
        className="anime-link"
      >
        <div
          className={`anime-card ${isHovered ? "hovered" : ""}`}
          onMouseEnter={() => handleMouseEnter(anime.mal_id)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="anime-card-inner">
            <div className="anime-image-container">
              <img
                src={anime.images.jpg.large_image_url}
                alt={anime.title || "Anime Poster"}
                loading="lazy"
              />
              <div className="image-gradient-overlay"></div>
              <div className="hover-effect-layer"></div>
            </div>

            <div className="anime-info-layer">
              <div className="anime-quick-stats">
                <div className="stat-item">
                  <Star size={16} strokeWidth={2.5} />
                  <span>{anime.score?.toFixed(1) || "N/A"}</span>
                </div>
                <div className="stat-item">
                  <PlayCircle size={16} strokeWidth={2.5} />
                  <span>{anime.episodes || "?"} eps</span>
                </div>
              </div>

              <div className="anime-title-container">
                <h3>{anime.title}</h3>
                <span className="anime-type">{anime.type}</span>
              </div>

              <div className="anime-action-buttons">
                <button className="action-btn favorite">
                  <Heart size={20} />
                </button>
                <button className="action-btn watchlist">
                  <Bookmark size={20} />
                </button>
                <button className="action-btn details">
                  <Info size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  // Filter bar component
  const FilterBar = () => (
    <div className="anime-filter-bar">
      {[
        {
          key: "all",
          icon: <Compass size={18} />,
          label: "Explore",
        },
        {
          key: "top-rated",
          icon: <Zap size={18} />,
          label: "Top Rated",
        },
        {
          key: "ongoing",
          icon: <Layers size={18} />,
          label: "Ongoing",
        },
      ].map((filter) => (
        <button
          key={filter.key}
          className={`filter-btn ${
            activeFilter === filter.key ? "active" : ""
          }`}
          onClick={() => setActiveFilter(filter.key)}
        >
          {filter.icon}
          {filter.label}
        </button>
      ))}
    </div>
  );

  return (
    <PopularStyled>
      <FilterBar />
      <div className="popular-anime" ref={gridRef}>
        {filteredAnime.map(renderAnimeCard)}
        {filteredAnime.length === 0 && (
          <div className="no-results">
            <p>No anime found matching your filter</p>
          </div>
        )}
      </div>
    </PopularStyled>
  );
}

// Advanced Keyframe Animations
const cardRevealAnimation = keyframes`
    from {
        opacity: 0;
        transform: scale(0.9) translateY(20px);
    }
    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
`;

const hoverEffectAnimation = keyframes`
    0% {
        opacity: 0;
        transform: scale(0.9);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
`;

const PopularStyled = styled.div`
  width: 100%;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.background} 0%,
    ${(props) => props.theme.primaryBg} 100%
  );
  padding: 1rem;

  .anime-filter-bar {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;

    .filter-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.7rem 1.2rem;
      border: none;
      border-radius: 30px;
      background: rgba(255, 255, 255, 0.1);
      color: ${(props) => props.theme.primaryText};
      cursor: pointer;
      transition: all 0.3s ease;
      transform: perspective(500px);

      &.active,
      &:hover {
        background: ${(props) => props.theme.accentColor};
        color: white;
        transform: translateY(-3px) perspective(500px) rotateX(5deg);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      }
    }
  }

  .popular-anime {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    grid-gap: 2rem;

    .no-results {
      grid-column: 1 / -1;
      text-align: center;
      color: ${(props) => props.theme.primaryText};
      opacity: 0.7;
    }

    .anime-link {
      text-decoration: none;
      perspective: 1000px;
    }

    .anime-card {
      position: relative;
      height: 420px;
      border-radius: 15px;
      overflow: hidden;
      background: ${(props) => props.theme.primaryBg};
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      animation: ${cardRevealAnimation} 0.6s ease forwards;
      transform-style: preserve-3d;
      opacity: 0;

      &:hover {
        transform: scale(1.03) rotateX(5deg) rotateY(5deg);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);

        .hover-effect-layer {
          opacity: 1;
          transform: scale(1);
        }

        .anime-image-container img {
          transform: scale(1.1);
        }
      }

      .anime-card-inner {
        position: relative;
        width: 100%;
        height: 100%;
      }

      .anime-image-container {
        position: relative;
        height: 300px;
        overflow: hidden;

        .hover-effect-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.1);
          opacity: 0;
          transform: scale(0.9);
          transition: all 0.4s ease;
          animation: ${hoverEffectAnimation} 0.4s ease;
          pointer-events: none;
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .image-gradient-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 50%;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.8) 0%,
            transparent 100%
          );
        }
      }

      .anime-info-layer {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        padding: 1rem;
        color: white;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
      }

      .anime-quick-stats {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          opacity: 0.8;
        }
      }

      .anime-title-container {
        h3 {
          margin: 0;
          font-size: 1rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .anime-type {
          font-size: 0.7rem;
          opacity: 0.7;
        }
      }

      .anime-action-buttons {
        display: flex;
        justify-content: space-between;
        margin-top: 1rem;

        .action-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          padding: 0.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            background: rgba(255, 255, 255, 0.4);
            transform: scale(1.1);
          }
        }
      }
    }
  }

  @media (max-width: 1200px) {
    .popular-anime {
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    }
  }

  @media (max-width: 768px) {
    .popular-anime {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      grid-gap: 1rem;
    }
  }
`;

export default Popular;

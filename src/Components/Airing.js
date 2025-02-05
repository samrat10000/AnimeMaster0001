import React, { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../context/global";
import styled, { keyframes } from "styled-components";
import { Heart, Bookmark, Info, Star, PlayCircle } from "lucide-react";
import Sidebar from "./Sidebar";

function Airing({ rendered }) {
  const { airingAnime, isSearch, searchResults } = useGlobalContext();
  const [hoveredAnime, setHoveredAnime] = useState(null);

  const handleMouseEnter = useCallback((animeId) => {
    setHoveredAnime(animeId);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredAnime(null);
  }, []);

  const conditionalRender = () => {
    const animeList =
      !isSearch && rendered === "airing" ? airingAnime : searchResults;

    return animeList?.map((anime) => {
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
            <div className="anime-image-container">
              <img
                src={anime.images.jpg.large_image_url}
                alt={anime.title}
                loading="lazy"
              />
              <div className="image-gradient-overlay"></div>
            </div>

            <div className="anime-info-layer">
              <div className="anime-quick-stats">
                <div className="stat-item">
                  <Star size={16} />
                  <span>{anime.score?.toFixed(1) || "N/A"}</span>
                </div>
                <div className="stat-item">
                  <PlayCircle size={16} />
                  <span>{anime.episodes || "?"} eps</span>
                </div>
              </div>

              <h3 className="anime-title">{anime.title}</h3>

              <div className="anime-action-buttons">
                <button className="action-btn favorite">
                  <Heart size={18} />
                </button>
                <button className="action-btn watchlist">
                  <Bookmark size={18} />
                </button>
                <button className="action-btn details">
                  <Info size={18} />
                </button>
              </div>
            </div>
          </div>
        </Link>
      );
    });
  };

  return (
    <AiringStyled>
      <div className="content">
        <div className="airing-anime">{conditionalRender()}</div>
        <Sidebar />
      </div>
    </AiringStyled>
  );
}

const cardRevealAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const petalFallAnimation = keyframes`
  0% {
    transform: translateY(-100px) rotate(45deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(45deg);
    opacity: 0;
  }
`;

const AiringStyled = styled.div`
  padding: 2rem 1rem;
  border-radius: 20px;
  background: linear-gradient(135deg, #f8d8e1, #f7a1c4);
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  position: relative;
  overflow: hidden;

  .content {
    display: flex;
    gap: 3rem;
    width: 100%;
  }

  .airing-anime {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 2rem;
    align-items: center;
    position: relative;
  }

  .anime-link {
    text-decoration: none;
  }

  .anime-card {
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    background: #ffffff;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    animation: ${cardRevealAnimation} 0.7s ease forwards;
    opacity: 0;
    transition: transform 0.4s ease, box-shadow 0.4s ease;
    perspective: 1000px;

    &:hover {
      transform: scale(1.05) rotateX(5deg) rotateY(5deg);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    }

    .anime-image-container {
      height: 350px;
      position: relative;
      transition: transform 0.3s ease;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }

      .image-gradient-overlay {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 50%;
        background: linear-gradient(
          to top,
          rgba(255, 255, 255, 0.5),
          transparent
        );
      }
    }

    .anime-info-layer {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 1.2rem;
      background: rgba(0, 0, 0, 0.6);
      color: white;
      backdrop-filter: blur(5px);
      transition: all 0.4s ease;
      transform: translateY(30px);
      opacity: 0;

      .anime-quick-stats {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
        font-size: 1rem;

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-weight: bold;
        }
      }

      .anime-title {
        font-size: 1.4rem;
        font-family: "Lora", serif;
        font-weight: 700;
        margin-bottom: 0.5rem;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        color: #f8b9c4;
      }

      .anime-action-buttons {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;

        .action-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          padding: 0.8rem;
          border-radius: 50%;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.3s ease;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);

          &:hover {
            background: rgba(255, 255, 255, 0.4);
            transform: scale(1.2);
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
          }
        }
      }
    }

    &:hover .anime-info-layer {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .petals {
    position: absolute;
    top: -50px;
    left: 50%;
    transform: translateX(-50%);
    z-index: -1;

    .petal {
      position: absolute;
      background: #f7c0d4;
      border-radius: 50%;
      width: 15px;
      height: 15px;
      animation: ${petalFallAnimation} 10s linear infinite;
    }

    .petal:nth-child(1) {
      animation-delay: 0s;
      left: 10%;
      animation-duration: 8s;
    }

    .petal:nth-child(2) {
      animation-delay: 1s;
      left: 20%;
      animation-duration: 9s;
    }

    .petal:nth-child(3) {
      animation-delay: 2s;
      left: 30%;
      animation-duration: 7s;
    }

    .petal:nth-child(4) {
      animation-delay: 3s;
      left: 40%;
      animation-duration: 10s;
    }

    .petal:nth-child(5) {
      animation-delay: 4s;
      left: 50%;
      animation-duration: 8s;
    }
  }

  @media (max-width: 1200px) {
    .airing-anime {
      grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    }
  }

  @media (max-width: 768px) {
    .content {
      flex-direction: column;
    }

    .airing-anime {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1rem;
    }
  }
`;

export default Airing;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useGlobalContext } from "../context/global";

function Sidebar() {
  const { popularAnime } = useGlobalContext();
  const [visibleCount, setVisibleCount] = useState(5);

  const sorted = popularAnime?.sort((a, b) => b.score - a.score);

  const handleShowMore = () => {
    setVisibleCount(visibleCount + 5);
  };

  return (
    <SidebarStyled>
      <div className="header">
        <h3>Top Trending Anime</h3>
        <p>Explore the most popular anime of the season!</p>
      </div>

      <div className="anime-list">
        {sorted?.slice(0, visibleCount).map((anime) => (
          <Link
            to={`/anime/${anime.mal_id}`}
            key={anime.mal_id}
            className="anime-item"
          >
            <div className="image-wrapper">
              <img src={anime.images.jpg.large_image_url} alt={anime.title} />
            </div>
            <div className="anime-details">
              <h4>{anime.title}</h4>
              <p>
                <span>Type:</span> {anime.type}
              </p>
              <div className="genre-tags">
                {anime.genres.slice(0, 3).map((genre) => (
                  <span key={genre.name} className="genre-tag">
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {visibleCount < sorted?.length && (
        <div className="sidebar-footer">
          <button className="more-button" onClick={handleShowMore}>
            Show More
          </button>
        </div>
      )}
    </SidebarStyled>
  );
}

const SidebarStyled = styled.div`
  margin: 1.5rem auto;
  background: linear-gradient(135deg, #1f1f3d, #2b2b56);
  color: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
  padding: 1rem;
  max-width: 320px;
  width: 100%; /* Ensure the sidebar takes full width up to max-width */

  .header {
    text-align: center;
    margin-bottom: 1.5rem;

    h3 {
      font-size: 1.7rem;
      color: #ffd700;
      text-shadow: 3px 3px 10px rgba(0, 0, 0, 0.7);
    }

    p {
      font-size: 1rem;
      color: #aaa;
      margin-top: 0.5rem;
      letter-spacing: 0.5px;
    }
  }

  .anime-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    overflow-x: hidden; /* Prevent horizontal overflow */
    width: 100%; /* Ensure it doesn't extend outside the container */
  }

  .anime-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    background: #333350;
    border-radius: 8px;
    padding: 1rem;
    text-decoration: none;
    color: inherit;
    transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
    position: relative;
    overflow: hidden;
    width: 100%; /* Ensure the item doesn't extend outside the container */

    &:hover {
      background: #444466;
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .image-wrapper {
      flex-shrink: 0;
      width: 120px;
      height: 160px;
      overflow: hidden;
      border-radius: 6px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }
    }

    .anime-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 100%; /* Ensures no overflow */

      h4 {
        font-size: 1.1rem;
        font-weight: bold;
        color: #ffd700;
        text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
        margin-bottom: 0.5rem;
        transition: color 0.3s ease;

        &:hover {
          color: #ffcc00;
        }
      }

      p {
        font-size: 0.9rem;
        color: #ddd;

        span {
          color: #ffae42;
        }
      }

      .genre-tags {
        margin-top: 0.5rem;
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap; /* This will wrap the tags when space is tight */
        max-width: 100%; /* Prevent overflow */
        justify-content: flex-start;

        .genre-tag {
          background: #f4c542;
          color: #1e1e2f;
          padding: 0.2rem 0.5rem;
          border-radius: 20px;
          font-size: 0.75rem;
          max-width: 100%; /* Prevent tag overflow */
          white-space: nowrap; /* Prevent tags from breaking text */
        }
      }
    }

    /* Animated shadow on hover */
    &:hover .image-wrapper img {
      transform: scale(1.1);
    }
  }

  .sidebar-footer {
    text-align: center;
    margin-top: 1.5rem;

    .more-button {
      padding: 0.5rem 1.2rem;
      background: #ffd700;
      color: #1e1e2f;
      font-weight: bold;
      border: none;
      border-radius: 30px;
      cursor: pointer;
      transition: background 0.3s ease, transform 0.3s ease;

      &:hover {
        background: #ffb400;
        transform: scale(1.05);
      }
    }
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    max-width: 100%;
    padding: 1rem;

    .anime-item {
      flex-direction: column;
      align-items: center;
      text-align: center;

      .image-wrapper {
        width: 100px;
        height: 130px;
      }

      .anime-details {
        h4 {
          font-size: 0.95rem;
        }

        p {
          font-size: 0.85rem;
        }
      }
    }

    .genre-tags {
      gap: 0.3rem;
      justify-content: center;
    }
  }

  @media (max-width: 480px) {
    padding: 0.8rem;

    .anime-item {
      .image-wrapper {
        width: 80px;
        height: 100px;
      }

      .anime-details {
        h4 {
          font-size: 0.8rem;
        }

        p {
          font-size: 0.75rem;
        }
      }
    }

    .genre-tags {
      gap: 0.2rem;
      justify-content: center;
    }
  }
`;

export default Sidebar;

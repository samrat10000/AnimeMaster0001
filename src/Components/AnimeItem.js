import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";

function AnimeItem() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [activeTab, setActiveTab] = useState("details");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTrailer, setActiveTrailer] = useState(false);
  const [favorited, setFavorited] = useState(false);

  // Advanced data fetching with concurrent requests
  const fetchAnimeData = async (animeId) => {
    try {
      const [animeResponse, charactersResponse, recommendationsResponse] =
        await Promise.all([
          fetch(`${process.env.REACT_APP_API_BASE_URL}/anime/${animeId}`),
          fetch(
            `${process.env.REACT_APP_API_BASE_URL}/anime/${animeId}/characters`
          ),
          fetch(
            `${process.env.REACT_APP_API_BASE_URL}/anime/${animeId}/recommendations`
          ),
        ]);

      const animeData = await animeResponse.json();
      const charactersData = await charactersResponse.json();
      const recommendationsData = await recommendationsResponse.json();

      setAnime(animeData.data);
      setCharacters(charactersData.data.slice(0, 12));
      setRecommendations(recommendationsData.data.slice(0, 8));
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch anime data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimeData(id);
  }, [id]);

  // Memoized statistics calculation
  const calculateStatistics = useMemo(
    () => ({
      scorePercentage: anime?.score ? (anime.score / 10) * 100 : 0,
      popularityRank: anime?.popularity || "N/A",
      formattedAirDate: anime?.aired?.string || "Unknown",
      genreList: anime?.genres?.map((genre) => genre.name).join(", ") || "N/A",
    }),
    [anime]
  );

  // Loading state
  if (isLoading) {
    return (
      <LoadingContainer>
        <div className="spinner"></div>
      </LoadingContainer>
    );
  }

  return (
    <AnimeDetailsContainer>
      <div className="anime-header">
        <h1>{anime?.title}</h1>
        <div className="tab-navigation">
          {["Details", "Characters", "Recommendations"].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab.toLowerCase() ? "active" : ""}
              onClick={() => setActiveTab(tab.toLowerCase())}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="content-wrapper">
        {activeTab === "details" && (
          <div className="details-section">
            <div className="poster-section">
              <div className="poster-container">
                <img
                  src={anime?.images?.jpg?.large_image_url}
                  alt={anime?.title}
                  className="anime-poster"
                />
                <div className="poster-actions">
                  <button
                    className="favorite-btn"
                    onClick={() => setFavorited(!favorited)}
                  >
                    {favorited ? "❤️" : "🤍"}
                  </button>
                  {anime?.trailer?.embed_url && (
                    <button
                      className="trailer-btn"
                      onClick={() => setActiveTrailer(!activeTrailer)}
                    >
                      {activeTrailer ? "Close Trailer" : "Watch Trailer"}
                    </button>
                  )}
                </div>
              </div>

              {activeTrailer && anime?.trailer?.embed_url && (
                <div className="trailer-modal">
                  <div className="trailer-content">
                    <button
                      className="close-trailer"
                      onClick={() => setActiveTrailer(false)}
                    >
                      ✕
                    </button>
                    <iframe
                      src={anime.trailer.embed_url}
                      title={`${anime.title} Trailer`}
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>

            <div className="info-section">
              <div className="score-section">
                <div className="score-label">
                  <span className="score-number">{anime?.score || "N/A"}</span>
                  <span className="score-label-text">User Score</span>
                </div>
                <div className="score-progress">
                  <div
                    className="score-bar"
                    style={{ width: `${calculateStatistics.scorePercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="anime-details-grid">
                {[
                  { label: "Status", value: anime?.status },
                  { label: "Type", value: anime?.type },
                  { label: "Genres", value: calculateStatistics.genreList },
                  {
                    label: "Aired",
                    value: calculateStatistics.formattedAirDate,
                  },
                  { label: "Episodes", value: anime?.episodes || "Unknown" },
                  { label: "Duration", value: anime?.duration },
                ].map((detail) => (
                  <div key={detail.label} className="detail-item">
                    <span className="detail-label">{detail.label}:</span>
                    <span className="detail-value">{detail.value}</span>
                  </div>
                ))}
              </div>

              <div className="synopsis">
                <h3>Synopsis</h3>
                <p>{anime?.synopsis}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "characters" && (
          <div className="characters-section">
            {characters.map((character) => (
              <div key={character.character.mal_id} className="character-card">
                <img
                  src={character.character.images?.jpg?.image_url}
                  alt={character.character.name}
                />
                <div className="character-info">
                  <h4>{character.character.name}</h4>
                  <p>{character.role}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "recommendations" && (
          <div className="recommendations-section">
            {recommendations.map((rec) => (
              <div key={rec.entry.mal_id} className="recommendation-card">
                <img
                  src={rec.entry.images?.jpg?.image_url}
                  alt={rec.entry.title}
                />
                <div className="recommendation-info">
                  <h4>{rec.entry.title}</h4>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AnimeDetailsContainer>
  );
}

// Keyframe animations
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Styled Components
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;

  .spinner {
    width: 50px;
    height: 50px;
    border: 5px solid #e0e0e0;
    border-top: 5px solid #7e57c2;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
  }
`;

const AnimeDetailsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;

  .anime-header {
    text-align: center;
    margin-bottom: 30px;

    h1 {
      color: #333;
      font-size: 2.5rem;
      margin-bottom: 20px;
      background: linear-gradient(to right, #7e57c2, #2196f3);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .tab-navigation {
      display: flex;
      justify-content: center;
      gap: 20px;

      button {
        background-color: #e0e0e0;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s ease;

        &.active,
        &:hover {
          background-color: #7e57c2;
          color: white;
        }
      }
    }
  }

  .content-wrapper {
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 30px;
  }

  .details-section {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 30px;

    .poster-section {
      position: relative;

      .poster-container {
        position: relative;
      }

      .anime-poster {
        width: 100%;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .poster-actions {
        display: flex;
        justify-content: space-between;
        margin-top: 15px;

        .favorite-btn,
        .trailer-btn {
          padding: 10px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .favorite-btn {
          background-color: transparent;
          font-size: 1.5rem;
        }

        .trailer-btn {
          background-color: #7e57c2;
          color: white;
          flex-grow: 1;
          margin-left: 10px;
        }
      }
    }

    .trailer-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;

      .trailer-content {
        position: relative;
        width: 80%;
        max-width: 900px;

        .close-trailer {
          position: absolute;
          top: -30px;
          right: 0;
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
        }

        iframe {
          width: 100%;
          height: 500px;
        }
      }
    }
  }

  .score-section {
    margin-bottom: 20px;

    .score-label {
      display: flex;
      align-items: center;
      gap: 10px;

      .score-number {
        font-size: 2rem;
        font-weight: bold;
        color: #7e57c2;
      }
    }

    .score-progress {
      height: 10px;
      background-color: #e0e0e0;
      border-radius: 5px;
      overflow: hidden;

      .score-bar {
        height: 100%;
        background-color: #7e57c2;
      }
    }
  }

  .anime-details-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    margin-bottom: 20px;

    .detail-item {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      background-color: #f5f5f5;
      border-radius: 5px;

      .detail-label {
        font-weight: bold;
        color: #333;
      }

      .detail-value {
        color: #666;
      }
    }
  }

  .synopsis {
    margin-top: 20px;

    h3 {
      border-bottom: 2px solid #7e57c2;
      padding-bottom: 10px;
      margin-bottom: 15px;
    }
  }

  .characters-section,
  .recommendations-section {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 20px;

    .character-card,
    .recommendation-card {
      text-align: center;
      background-color: #f5f5f5;
      border-radius: 10px;
      overflow: hidden;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.05);
      }

      img {
        width: 100%;
        height: 250px;
        object-fit: cover;
      }

      .character-info,
      .recommendation-info {
        padding: 10px;

        h4 {
          margin: 0;
          font-size: 0.9rem;
        }

        p {
          color: #666;
          font-size: 0.8rem;
        }
      }
    }
  }

  @media (max-width: 768px) {
    .details-section {
      grid-template-columns: 1fr;
    }

    .anime-details-grid {
      grid-template-columns: 1fr;
    }
  }
`;

export default AnimeItem;

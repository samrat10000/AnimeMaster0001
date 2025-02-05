import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../context/global";
import Popular from "./Popular";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import Upcoming from "./Upcoming";
import Airing from "./Airing";
import { motion, AnimatePresence } from "framer-motion";

const lightTheme = {
  background: "#f4f4f4",
  primaryBg: "#ffffff",
  primaryText: "#333333",
  secondaryText: "#666666",
  accentColor: "#667eea",
  gradientStart: "#667eea",
  gradientEnd: "#764ba2",
  shadowColor: "rgba(0,0,0,0.1)",
};

const darkTheme = {
  background: "#121212",
  primaryBg: "#1E1E1E",
  primaryText: "#E0E0E0",
  secondaryText: "#B0B0B0",
  accentColor: "#BB86FC",
  gradientStart: "#292929",
  gradientEnd: "#404040",
  shadowColor: "rgba(255,255,255,0.1)",
};

// Global Style for smooth animations and baseline reset
const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        transition: all 0.3s ease;
    }
    body {
        font-family: 'Inter', sans-serif;
        background-color: ${(props) => props.theme.background};
        color: ${(props) => props.theme.primaryText};
    }
`;

function Homepage() {
  const {
    handleSubmit,
    search,
    handleChange,
    getUpcomingAnime,
    getAiringAnime,
  } = useGlobalContext();

  const [rendered, setRendered] = useState("popular");
  const [theme, setTheme] = useState("light");
  const [searchFocused, setSearchFocused] = useState(false);

  const switchComponent = () => {
    switch (rendered) {
      case "popular":
        return <Popular rendered={rendered} />;
      case "airing":
        return <Airing rendered={rendered} />;
      case "upcoming":
        return <Upcoming rendered={rendered} />;
      default:
        return <Popular rendered={rendered} />;
    }
  };

  const renderTabTitle = () => {
    switch (rendered) {
      case "popular":
        return "Popular Anime";
      case "airing":
        return "Airing Anime";
      case "upcoming":
        return "Upcoming Anime";
      default:
        return "Anime Hub";
    }
  };

  useEffect(() => {
    document.title = renderTabTitle();
  }, [rendered]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const currentTheme = theme === "light" ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyle />
      <HomepageStyled
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <header>
          <div className="theme-toggle">
            <button onClick={toggleTheme}>
              {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </button>
          </div>
          <div className="logo">
            <motion.h1
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {renderTabTitle()}
            </motion.h1>
          </div>
          <div className="search-container">
            <div className="filter-buttons">
              {["popular", "airing", "upcoming"].map((type) => (
                <motion.button
                  key={type}
                  className={`filter-btn ${type}-filter ${
                    rendered === type ? "active" : ""
                  }`}
                  onClick={() => {
                    setRendered(type);
                    type === "airing" && getAiringAnime();
                    type === "upcoming" && getUpcomingAnime();
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                  {type === "popular" && <i className="fas fa-fire"></i>}
                </motion.button>
              ))}
            </div>
            <form
              className={`search-form ${searchFocused ? "focused" : ""}`}
              onSubmit={handleSubmit}
            >
              <div className="input-control">
                <motion.input
                  type="text"
                  placeholder="Search Anime"
                  value={search}
                  onChange={handleChange}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Search
                </motion.button>
              </div>
            </form>
          </div>
        </header>
        <AnimatePresence mode="wait">
          <motion.div
            key={rendered}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {switchComponent()}
          </motion.div>
        </AnimatePresence>
      </HomepageStyled>
    </ThemeProvider>
  );
}

const HomepageStyled = styled.div`
  min-height: 100vh;
  background-color: ${(props) => props.theme.background};
  padding: 1rem;

  .theme-toggle {
    position: absolute;
    top: 1rem;
    right: 1rem;

    button {
      background-color: ${(props) => props.theme.primaryBg};
      color: ${(props) => props.theme.primaryText};
      border: 2px solid ${(props) => props.theme.accentColor};
      padding: 0.5rem 1rem;
      border-radius: 30px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: bold;
      transition: background-color 0.3s, color 0.3s;

      &:hover {
        background-color: ${(props) => props.theme.accentColor};
        color: #fff;
      }
    }
  }

  header {
    background: linear-gradient(
      135deg,
      ${(props) => props.theme.gradientStart} 0%,
      ${(props) => props.theme.gradientEnd} 100%
    );
    color: ${(props) => props.theme.primaryText};
    padding: 3rem 1rem;
    text-align: center;
    box-shadow: 0 8px 16px ${(props) => props.theme.shadowColor};
    border-radius: 20px;

    .logo h1 {
      font-size: 3rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 2px;
      background: linear-gradient(to right, #ffffff, #f0f0f0);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;

      @media screen and (max-width: 600px) {
        font-size: 2.2rem;
      }
    }
  }

  .search-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    max-width: 700px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .filter-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;

    .filter-btn {
      padding: 0.7rem 1.5rem;
      border: none;
      border-radius: 25px;
      background-color: rgba(255, 255, 255, 0.2);
      color: ${(props) => props.theme.primaryText};
      cursor: pointer;
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      transition: background-color 0.3s, transform 0.2s;

      &.active {
        background-color: ${(props) => props.theme.accentColor};
        color: #fff;
      }

      &:hover {
        background-color: ${(props) => props.theme.accentColor};
        color: #fff;
        transform: translateY(-2px);
      }
    }
  }

  .search-form {
    width: 100%;
    position: relative;

    .input-control {
      display: flex;
      align-items: center;
      position: relative;

      input {
        width: 100%;
        padding: 0.8rem 1rem;
        border: none;
        border-radius: 25px;
        background-color: ${(props) => props.theme.primaryBg};
        color: ${(props) => props.theme.primaryText};
        box-shadow: 0 4px 8px ${(props) => props.theme.shadowColor};
        font-size: 1rem;
        transition: box-shadow 0.3s, outline 0.3s;

        &:focus {
          outline: 2px solid ${(props) => props.theme.accentColor};
          box-shadow: 0 4px 12px ${(props) => props.theme.accentColor}80;
        }
      }

      button {
        position: absolute;
        right: 0.5rem;
        padding: 0.6rem 1.2rem;
        background-color: ${(props) => props.theme.accentColor};
        color: #fff;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        font-weight: bold;
        transition: background-color 0.3s, transform 0.2s;

        &:hover {
          background-color: ${(props) => props.theme.gradientEnd};
          transform: translateY(-2px);
        }
      }
    }
  }

  @media screen and (max-width: 768px) {
    .search-container {
      width: 100%;
    }

    .filter-buttons {
      gap: 0.8rem;
    }

    .filter-btn {
      padding: 0.6rem 1rem;
      font-size: 0.9rem;
    }
  }
`;

export default Homepage;

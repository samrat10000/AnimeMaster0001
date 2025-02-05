import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
    
    /* Dynamic Color Palette Keyframes */
    @keyframes colorShift {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }


    /* Color Variables for Easy Customization */
    :root {
        --primary-color: #4a90e2;
        --secondary-color: #50c878;
        --accent-color: #ff6b6b;
        --text-color: #2c3e50;
        --background-color: #f4f6f7;
        --gradient-start: #6a11cb;
        --gradient-end: #2575fc;
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        list-style: none;
        text-decoration: none;
        font-family: 'Inter', sans-serif;
        transition: all 0.3s ease;
    }

    body {
        color: var(--text-color);
        font-size: 1.2rem;
        position: relative;
        overflow-x: hidden;
        background: linear-gradient(
            -45deg, 
            var(--background-color), 
            color-mix(in srgb, var(--background-color) 90%, var(--primary-color)),
            color-mix(in srgb, var(--background-color) 80%, var(--secondary-color))
        );
        background-size: 400% 400%;
        animation: colorShift 15s ease infinite;
    }

    /* Advanced Cherry Blossom Scrollbar */
    body {
        &::-webkit-scrollbar {
            width: 15px;
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
        }

        &::-webkit-scrollbar-track {
            background: linear-gradient(
                to bottom, 
                color-mix(in srgb, var(--primary-color) 20%, transparent),
                color-mix(in srgb, var(--secondary-color) 20%, transparent)
            );
            border-radius: 15px;
            box-shadow: inset 0 0 15px rgba(73,140,226,0.2);
        }

        &::-webkit-scrollbar-thumb {
            background: linear-gradient(
                45deg, 
                var(--primary-color), 
                var(--secondary-color)
            );
            border-radius: 15px;
            border: 3px solid rgba(255,255,255,0.4);
            transition: all 0.3s ease-in-out;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        &::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(
                45deg, 
                var(--accent-color), 
                var(--primary-color)
            );
            box-shadow: 0 0 20px rgba(73,140,226,0.4);
            transform: scale(1.1);
        }
    }

    /* Interactive Hover Effects */
    a, button {
        position: relative;
        color: var(--primary-color);
        
        &:hover {
            color: var(--accent-color);
            transform: translateY(-3px);
            text-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
    }

    /* Enhanced Selection Style */
    ::selection {
        background: color-mix(in srgb, var(--primary-color) 50%, white);
        color: white;
    }
`;

export default GlobalStyle;

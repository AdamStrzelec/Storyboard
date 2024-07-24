import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    *, *:before, *:after {
    -webkit-box-sizing: inherit;
    -moz-box-sizing: inherit;
    box-sizing: border-box;
    }
    body {
        font-family: 'Inter';
        background-color: #F4F7FE;
        font-size: 13px;
    }
`;

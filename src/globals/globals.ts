import { Profile } from '@types';

interface Globals {
    loggedInUser: Profile | undefined;
}

export const globals: Globals = {
    loggedInUser: {
        username: 'HPaulson',
        name: 'Hunter Paulson',
        followers: 999,
        following: 9,
        description: 'Hunter Paulson  ✝\nFounder & CEO, Prism Web3, Inc.\nPresident, SeismicCore, LLC\nHPaulson.crypto 🇺🇸',
        image: 'https://diamondapp.com/api/v0/get-single-profile-picture/BC1YLhxkeyUesN6W9c8gDrXtUkhBookv727L2fWwXdvfkUcd7EWW9uf',
        verified: true
    }
};

import fetch from 'node-fetch';

export interface Joke {
    id: number;
    type: string;
    setup: string;
    punchline: string;
}

export async function getRandomJoke(): Promise<string> {
    try {
        const res = await fetch('https://official-joke-api.appspot.com/random_joke');
        const joke = (await res.json()) as Joke; 
        return `${joke.setup} - ${joke.punchline}`;
    } catch (error) {
        console.error('Failed to fetch joke:', error);
        return 'Oops! Could not fetch a joke right now.';
    }
}

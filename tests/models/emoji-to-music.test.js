import { getMusicalDetailsFromEmoji } from '../../source/models/emoji-to-music.js';
import * as EMOJIS from '../../source/models/emoji.js';

describe('getMusicalDetailsFromEmoji', () => {
    const tonic = 60; // A fixed tonic for testing

    it('should return slightly different musical details for each emoji', () => {
        const results = new Set();

        Object.values(EMOJIS).forEach(emoji => {
            const details = getMusicalDetailsFromEmoji(tonic, emoji)
			const noteNumbers = details.map(note => note.noteNumber)
            // console.log(`Emoji: ${emoji}, Chords: ${JSON.stringify(details)}`);
            console.log(`Emoji: ${emoji}, Chords: ${JSON.stringify(noteNumbers)}`)
            // console.log(`Emoji: ${emoji}, Chords: ${JSON.stringify(details)}`);
            // console.log(`Emoji: ${emoji}, Chords: ${JSON.stringify(details.chords)}`);
            // console.log(`Emoji: ${emoji}, Octave: ${details.octave}`);
            // console.log(`Emoji: ${emoji}, Velocity: ${details.velocity}`);
            results.add(JSON.stringify(details))
        })

        // Expect that there is more than one unique result
        expect(results.size).toBeGreaterThan(1)
    })
})
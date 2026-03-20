import {getNoteName} from '../../source/audio/notes.js'

test('adds 1 + 2 to equal 3', () => {
  expect( getNoteName(0, 0, false) ).toBe(3)
})
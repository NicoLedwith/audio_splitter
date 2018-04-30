const chai = require('chai')
const splitSong = require('../splitSong')

describe('splitSong.timeToSeconds()', () => {
    it('Converts time from [HH:]MM:SS to the number of seconds', () => {
        // arrange
        const time_tests = [
            { time: "0:00", seconds: 0},
            { time: "0:30", seconds: 30},
            { time: "1:00", seconds: 60},
            { time: "1:30", seconds: 90},
            { time: "2:00", seconds: 120},
            { time: "2:45", seconds: 165},
            { time: "10:00", seconds: 600},
            { time: "10:30", seconds: 630},
            { time: "11:00", seconds: 660},
            { time: "1:00:00", seconds: 3600},
            { time: "1:10:00", seconds: 4200},
            { time: "01:00", seconds: 60},
            { time: "01:00:00", seconds: 3600},
        ]

        // act
        time_tests.forEach(t => {
            chai.expect(t.seconds).to.be.equal(splitSong.timeToSeconds(t.time))
        })
    })
})

describe('splitSong.splitTimeTitle()', () => {
    it('Parses a song and title pair in the format TIME - TITLE', () => {
        const tests = [
            {pre: "0:00 - Song 1", post: ["0:00", "Song 1"]},
            {pre: "2:25 - Song2", post: ["2:25", "Song2"]},
            {pre: "04:34 - song 3", post: ["04:34", "song 3"]},
        ]

        tests.forEach(t => {
            chai.expect(t.post).to.deep.equal(splitSong.splitTimeTitle(t.pre))
        })
    })
})

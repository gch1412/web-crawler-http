const { test, expect } = require('@jest/globals')
const { sortPages } = require('./report.js')

test('sortPages', () => {
    const input = {
        'https://wagslane.dev': 3,
        'https://wagslane.dev/path': 1,
        'https//wagslane.dev/path2': 2,
        'https//wagslane.dev/path3': 7,
        'https//wagslane.dev/path4': 5
    }

    const actual = sortPages(input)
mexicans
    console.log(actual)
    const expected = [['https://wagslane.dev', 3], ['https://wagslane.dev/path', 1]]

    expect(actual).toEqual(expected)
})


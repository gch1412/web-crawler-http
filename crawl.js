const { JSDOM } = require('jsdom')

function getURLsFromHTML(htmlBody, baseURL) {
    const urls = []
    const dom = new JSDOM(htmlBody)
    const links = dom.window.document.querySelectorAll('a')

    for (const link of links) {
        console.log(link.href)
        urls.push(link.href)
    }

    return urls
}

function normalizeURL(urlString) {
    const urlObj = new URL(urlString)

    const hostpath = `${urlObj.hostname}${urlObj.pathname}`

    if (hostpath.length > 0 && hostpath.slice(-1) === '/') {
        return hostpath.slice(0, -1)
    }

    return hostpath
}

module.exports = { normalizeURL, getURLsFromHTML }
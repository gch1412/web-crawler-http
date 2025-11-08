const { JSDOM } = require('jsdom')

async function crawlPage(baseURL, currentURL, pages) {

    const currentURLObj = new URL(currentURL)
    const baseURLObj = new URL(baseURL)
    if (currentURLObj.hostname !== baseURLObj.hostname) {
        return pages
    }

    const normalizedURL = normalizeURL(currentURL)

    if (pages[normalizedURL] > 0) {
        pages[normalizedURL]++
        return pages
    }

    pages[normalizedURL] = 1

    //console.log(`actively crawling ${currentURL}`)
    let htmlBody = ''

    try {
        const resp = await fetch(currentURL)

        if (resp.status > 399) {
            console.log(`error in fetch with status code: ${resp.status}`)
            return pages
        }

        const contentType = resp.headers.get('content-type')
        if (!contentType.includes('text/html')) {
            console.log(`non-html response, content type: ${contentType} on page ${currentURL}`)
            return pages
        }

        htmlBody = await resp.text()

    } catch (err) {
        console.log(`error in fetch: ${err.message}, on page ${currentURL}`)
    }

    const nextURLs = getURLsFromHTML(htmlBody, baseURL)

    for (const nextURL of nextURLs) {
        pages = await crawlPage(baseURL, nextURL, pages)
    }

    return pages
}


function getURLsFromHTML(htmlBody, baseURL) {
    const urls = []
    const dom = new JSDOM(htmlBody)
    const links = dom.window.document.querySelectorAll('a')

    for (const link of links) {
        if (link.href.slice(0, 1) === '/') {

            try {
                urls.push(new URL(link.href, baseURL).href)
            } catch (err) {
                console.log(`error with relative url: ${err.message}`)
            }

        } else {

            try {
                urls.push(new URL(link.href).href)
            } catch (err) {
                console.log(`error with absolute url: ${err.message}`)
            }

        }

    }

    return urls
}

function normalizeURL(urlString) {
    const urlObj = new URL(urlString)

    let hostpath = `${urlObj.host}${urlObj.pathname}`

    if (hostpath.length > 0 && hostpath.slice(-1) === '/') {
        hostpath = hostpath.slice(0, -1)
    }

    return hostpath
}

module.exports = { crawlPage, normalizeURL, getURLsFromHTML }
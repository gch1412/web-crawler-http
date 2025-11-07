const { JSDOM } = require('jsdom')

async function crawlPage(currentURL) {
    console.log(`actively crawling ${currentURL}`)

    try {
        const resp = await fetch(currentURL)

        if (resp.status > 399) {
            console.log(`error in fetch with status code: ${resp.status}`)
            return
        }

        const contentType = resp.headers.get("content-type")
        if (!contentType.includes("text/html")) {
            console.log(`non-html response, content type: ${contentType} on page ${currentURL}`, )
            return
        }

        console.log(await resp.text())

    } catch (err) {
        console.log(`error in fetch: ${err.message}, on page ${currentURL}`)
    }


}

function getURLsFromHTML(htmlBody, baseURL) {
    const urls = []
    const dom = new JSDOM(htmlBody)
    const links = dom.window.document.querySelectorAll('a')

    for (const link of links) {
        if (link.href.slice(0, 1) === '/') {

            try {
                const urlObj = new URL(`${baseURL}${link.href}`)
                urls.push(urlObj.href)
            } catch (err) {
                console.log(`error with relative url: ${err.message}`)
            }

        } else {

            try {
                const urlObj = new URL(link.href)
                urls.push(urlObj.href)
            } catch (err) {
                console.log(`error with absolute url: ${err.message}`)
            }

        }

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

module.exports = { crawlPage, normalizeURL, getURLsFromHTML }
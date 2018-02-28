import rp from 'request-promise'

export default {

	get(url, cookie, options={}) {
		options['uri'] = url
		options['jar'] = cookie.jar
		options['method'] = 'GET'
		options['transform'] = (body) => cheerio.load(body)
		return rp(options).then(($) => {cookie.save();return $})
	},

	post(url, cookie, options={}) {
		options['url']  = url
		options['jar']  = cookie.jar
		options['form'] = form
		options['method'] = 'POST'
		options['transform'] = (body) => cheerio.load(body)
		return rp(options).then(($) => {cookie.save();return $})
	}

}
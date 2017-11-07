import request from 'request'
import {Cookie} from 'tough-cookie'

export default class cookieJar {

    constructor (req) {
        var jar = request.jar()
        this.jar = jar
        this.req = req
    	if (req.session.loggedJar) {
            this.extract(req.session.loggedJar)
    	}
    }

    extract (json) {
        if ( json.cookies.length > 0 ) {
            for (var cookie of json.cookies) {
                this.jar.setCookie(new Cookie({
                    key: cookie.key,
                    value: cookie.value,
                    domain: cookie.domain,
                    path: cookie.path,
                    hostOnly: cookie.hostOnly,
                    creation: new Date(cookie.creation)
                }), 'http://' + cookie.domain)
            }
        }
    }

    save (req, jar) {
        this.req.session.loggedJar = this.jar._jar.toJSON()
    }

}

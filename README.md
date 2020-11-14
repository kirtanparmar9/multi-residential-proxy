# multi-residential-proxy

Residential Proxy Api

  - Easily switch residential proxies
  - Residential proxy access with sticky session

### Installation

```sh
$ npm i multi-residential-proxy
```


### Example Usage

```sh
const ProxySwitcher = new ResidentialProxy({ username: "MY_USERNAME", password: "MY_PASSWORD", provider: "geosurf", countries: ["ca"], session_time: 10 })

// ProxySwitcher.getProxyUrl(session_id, country_code, state, city)
var proxyUrl = ProxySwitcher.getProxyUrl("123456789", "US", "NY");
```


### Supported Providers

    - geosurf
    - packetstream
    - oxylab

### Parameters
    - username (required)
    - password (required)
    - provider (required)
    - session_time (optional)
    - countries (optional)  Random will be taken when location not specified in getProxyUrl()

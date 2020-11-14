"use strict";

const providers = ["geosurf", "packetstream", "oxylab"];
const country_regions_list = require("./countries_with_regions.json");

const allowed_session_times = {
  geosurf: [5, 10],
  packetstream: [5, 10],
  oxylab: [5, 10],
}

class Init {
  constructor(obj) {

    if (!obj) {
      throw Error("Invalid proxy credential");
    }
    else if (!obj.username) {
      throw Error("Invalid proxy username");
    }
    else if (!obj.password) {
      throw Error("Invalid proxy password");
    }
    else if (!obj.provider) {
      throw Error("Invalid proxy provider");
    }
    else if (!providers.includes(obj.provider)) {
      throw Error(`${obj.provider} provider is not supported. Kindly use ${providers.join(', ')}`);
    }
    else if (obj.countries && typeof obj.countries === "string") {
      throw Error("Countries must be typeof Array");
    }
    else if (obj.session_time && !allowed_session_times[obj.provider].includes(obj.session_time)) {
      throw Error("Invalid proxy session_time");
    }

    if (obj.countries && obj.countries.length > 0) {
      obj.countries = obj.countries.map(item => {
        var cc = country_regions_list.filter(function (i){ return i.iso == item.toLowerCase() })

        if (cc.length < 1) {
          throw Error("Invalid country code: " + item);
        }
        else {
          return cc[0]
        }
      })
    }


    this.username = obj.username;
    this.password = obj.password;
    this.provider = obj.provider;
    this.countries = obj.countries;
    this.session_time = obj.session_time || allowed_session_times[obj.provider][0];
  }

  getProxyUrl(session_id, country_code, state, city) {

    if (this.provider === "geosurf")
     return this.geosurfProxy(arguments).url;
    else if (this.provider === "packetstream")
      return this.packetstreamProxy(arguments).url
    else if (this.provider === "oxylab") {
      return this.oxylabProxy(arguments).url
    }
  }

  oxylabProxy () {
      const param = arguments[0];

        var proxy = "";
        var host = 'pr.oxylabs.io:7777';
        var username = `customer-${this.username}`;
        var password = this.password;
        var country_code = this.getCountry(param[1]);
        var session_id = param[0];
        var state = param[2];
        var city = param[3];

        proxy += username;
        if(country_code) proxy += `-cc-${country_code.iso}`;
        if(city) proxy += `-city-${city}`;
        if(state) proxy += `-st-${state}`;
        if(session_id) proxy += `-sessid-${session_id}`;
        proxy += `:${password}`

        return {
            url: `http://${proxy}@${host}`,
            country_code: country_code.iso,
            city: city,
            session_id: session_id,
            type: "residential",
        };
  }


  packetstreamProxy () {
      const param = arguments[0];

      var proxy = "";
      var host = 'proxy.packetstream.io:31112';
      var username = this.username;
      var password = this.password;
      var country_code = this.getCountry(param[1]);
      var session_id = param[0];
      var state = param[2];
      var city = param[3];

      password = `${password}_country-${country_code.name.replace(/ /g, "")}`

      if (session_id) {
        password = `${password}_session-${String(session_id).slice(String(session_id).length - 8)	}`;
      }

      proxy += username;
      proxy += `:${password}`

      return {
          url: `http://${proxy}@${host}`,
          country_code: country_code.iso,
          city: city,
          session_id: session_id,
          type: "residential",
      };
  }

  geosurfProxy() {
    const param = arguments[0];

    var proxy = "";
    var host = `-${this.session_time}m.geosurf.io:8000`;
    var username = this.username;
    var password = this.password;
    var country_code = this.getCountry(param[1]);
    var session_id = param[0];
    var state = param[2];
    var city = param[3];

    console.log("country_code: ", country_code)

    host = country_code.iso + host;
    username = `${username}+${country_code.iso.toUpperCase()}`;

    if (state || city) {
      username = `${username}-${state || city}`
    }

    username = `${username}+${this.username}`

    if (session_id) {
      username = `${username}-${session_id}`;
    }

    proxy += username;
    proxy += `:${password}`

    return {
        url: `http://${proxy}@${host}`,
        country_code: country_code.iso,
        city: city,
        session_id: session_id,
        type: "residential",
        provider: "geosurf"
    };
  }

  getCountry (country_code) {

    if (!country_code && !this.countries) {
      return new Error("Invalid proxy country, To allow random country, You must init proxy with `countries` array");
    }

    var cc = country_regions_list.filter(function (i){ return i.iso == country_code.toLowerCase() });

    if (cc.length > 0)  {
      return cc[0];
    } else if (this.countries && this.countries.length > 0) {
      return this.countries[0];
    }
    else {
      throw Error("Invalid proxy country, To allow random country, You must init proxy with `countries` array");
    }
  }

}

module.exports = Init;

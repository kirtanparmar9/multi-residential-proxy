
const ResidentialProxy = require("./index");

const GeoSurfProxy = new ResidentialProxy({ username: "MY_USERNAME", password: "MY_PASSWORD", provider: "oxylab", countries: ["ca"] })


console.log(GeoSurfProxy.getProxyUrl("1223", "uss", "NY"));

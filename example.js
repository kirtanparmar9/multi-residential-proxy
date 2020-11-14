
const ResidentialProxy = require("./index");

const ProxySwitcher = new ResidentialProxy({ username: "MY_USERNAME", password: "MY_PASSWORD", provider: "oxylab", countries: ["ca"] })


console.log(ProxySwitcher.getProxyUrl("1223", "uss", "NY"));

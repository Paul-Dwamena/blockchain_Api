const axios=require("axios");

exports.default = (function () {
    return axios.create({
        baseURL: "http://localhost:3001"
    });
});
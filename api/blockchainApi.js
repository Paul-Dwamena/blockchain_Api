const api=require("./api");

exports.default = {
    fetchBlocks: function () {
        return api().get('blocks');
    },
    mineBlock: function (params) {
        return api().post('mineBlock', params);
    },
    
};


const {EMBED_COLOR} = process.env;

function message(content, ephemeral) {

    if (ephemeral == undefined) {
        ephemeral = false;
    }

    var embed = {description: content, color: EMBED_COLOR};

    var msg = {embeds: [embed], ephemeral: ephemeral};
    return msg;

}

module.exports = {message};
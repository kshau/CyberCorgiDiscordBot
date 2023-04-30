const {EMBED_COLOR} = process.env;

function message(content, ephemeral) {

    ephemeral = (ephemeral == undefined) ? (false) : (true);

    var embed = {description: content, color: EMBED_COLOR};

    var msg = {embeds: [embed], ephemeral: ephemeral};
    return msg;

}

function image(url, title, ephemeral) {

    ephemeral = (ephemeral == undefined) ? (false) : (true);

    var embed = {image: {url}, title: title, color: EMBED_COLOR};

    var msg = {embeds: [embed], ephemeral: ephemeral};
    return msg;

}

module.exports = {message, image};
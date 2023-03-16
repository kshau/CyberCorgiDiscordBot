function message(content, ephemeral) {

    if (ephemeral == undefined) {
        ephemeral = false;
    }

    var embed = {description: content, color: "#3374ff"};

    var msg = {embeds: [embed], ephemeral: ephemeral};
    return msg;

}

module.exports = {message};
async function addFieldsEmbed(client, object, embed) {
    let numberObject = 0;

    let fields = [];

    for (numberObject; numberObject < object.length; numberObject++) {
        let statut;
        if (object[numberObject].statut == false) {
            statut = client.emoji.no;
        } else {
            statut = client.emoji.yes;
        };

        fields.push({ name: `> ${statut} Tâche ID \`${object[numberObject].id}\``, value: `${object[numberObject].content}` });
    };

    //console.log(fields)

    embed.addFields(fields)
};

module.exports = { addFieldsEmbed };
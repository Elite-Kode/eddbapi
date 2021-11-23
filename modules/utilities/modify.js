function objectify(ref) {
    let entities = ref;
    ref = [];
    entities.forEach((entity) => {
        ref.push({
            name: entity,
            name_lower: entity.toLowerCase()
        });
    });
    return ref;
}

function statify(ref) {
    let entities = ref;
    ref = [];
    entities.forEach((entity) => {
        ref.push({
            id: entity.id,
            name: entity.name,
            name_lower: entity.name.toLowerCase()
        });
    });
    return ref;
}

function millisecondify(ts) {
    ts *= 1000;
    return ts;
}

function lowerify(name) {
    name = name.toLowerCase();
    return name;
}

module.exports = { objectify, statify, millisecondify, lowerify }

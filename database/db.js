const Sequelize = require("sequelize");
const { STRING } = Sequelize;

const db = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/acme_people_places_things"
);

const Person = db.define("person", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
});

const Place = db.define("place", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
});

const Thing = db.define("thing", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
});

const Souvenir = db.define("souvenir", {});

Souvenir.belongsTo(Person);
Souvenir.belongsTo(Place);
Souvenir.belongsTo(Thing);

const data = {
  people: ["moe", "larry", "lucy", "ethyl"],
  places: ["paris", "nyc", "chicago", "london"],
  things: ["hat", "bag", "shirt", "cup"],
};

const syncAndSeed = async () => {
  await db.sync({ force: true });

  const { people, places, things } = data;

  const [moe, larry, lucy, ethyl] = await Promise.all(
    people.map((name) => Person.create({ name }))
  );
  const [paris, nyc, chicago, london] = await Promise.all(
    places.map((name) => Place.create({ name }))
  );
  const [hat, bag, shirt, cup] = await Promise.all(
    things.map((name) => Thing.create({ name }))
  );
  await Promise.all([
    Souvenir.create({ personId: moe.id, thingId: hat.id, placeId: london.id }),
    Souvenir.create({ personId: moe.id, thingId: bag.id, placeId: paris.id }),
    Souvenir.create({ personId: ethyl.id, thingId: shirt.id, placeId: nyc.id }),
  ]);
  console.log(Souvenir);
};

module.exports = {
  syncAndSeed,
  models: {
    db,
    Person,
    Place,
    Thing,
    Souvenir,
  },
};

const {
  syncAndSeed,
  Person,
  Place,
  Thing,
  Souvenir,
} = require("./database/db.js");

const express = require("express");
const app = express();

//middleware that allows put/delete requests
app.use(require("method-override")("method"));

//middleware that gets the body of our form values
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res, next) => {
  try {
    const [people, places, things, souvenirs] = await Promise.all([
      Person.findAll(),
      Place.findAll(),
      Thing.findAll(),
      Souvenir.findAll({
        include: [Person, Place, Thing],
      }),
    ]);
    res.send(`
   <html>
     <head>
       <title>Acme People, Places, and Things</title>
     </head>
     <body>
       <h1>Acme People, Places and Things</h1>
       <main>
         <div>
         <h2>People</h2>
           <ul>
             ${people
               .map((person) => {
                 return `
                   <li>
                     ${person.name}
                   </li>
                 `;
               })
               .join("")}
           </ul>
           <h2>Places</h2>
           <ul>
             ${places
               .map((place) => {
                 return `
                   <li>
                     ${place.name}
                   </li>
                 `;
               })
               .join("")}
           </ul>
           <h2>Things</h2>
           <ul>
             ${things
               .map((thing) => {
                 return `
                   <li>
                     ${thing.name}
                   </li>
                 `;
               })
               .join("")}
           </ul>
         </div>
         <div>
         <h2>Souvenir Purchases</h2>
         <p>Create a new Souvenir Purchase by selecting a Person, the Place they purchased the souvenir, and the Thing they bought. </p>
         <form method='POST'>
           <label>Person</label>
           <select name='personId'>
             ${people
               .map((person) => {
                 return `
                   <option value=${person.id}>
                     ${person.name}
                   </option>
                 `;
               })
               .join("")}
           </select>
           <label>Place</label>
           <select name='placeId'>
             ${places
               .map((place) => {
                 return `
                   <option value=${place.id}>
                     ${place.name}
                   </option>
                 `;
               })
               .join("")}
           </select>
           <label>Thing</label>
           <select name='thingId'>
             ${things
               .map((thing) => {
                 return `
                   <option value=${thing.id}>
                     ${thing.name}
                   </option>
                 `;
               })
               .join("")}
           </select>
           <button>Create</button>
         </form>
         <ul>
         ${souvenirs
           .map((souvenir) => {
             return `
           <li>
             ${souvenir.person.name} purchased a ${souvenir.thing.name} in ${souvenir.place.name}
             <form method='POST' action='/${souvenir.id}?_method=DELETE'>
               <button>
               Delete
               </button>
             </form>
           </li>
           `;
           })
           .join("")}
         </ul>
         </div>
       </main>
     </body>
   </html>
   `);
  } catch (ex) {
    next(ex);
  }
});

//---------------------PORT-----------------------//
const init = async () => {
  await syncAndSeed();
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listening on port ${port}`));
};

init();

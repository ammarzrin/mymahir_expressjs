const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static('public'));

// VIEW ENGINE SETUP
app.engine('ejs', require('ejs').__express);
// Set view engine
app.set('view engine', 'ejs');
// Set views directory
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTINGS
// GET requests
app.get('/', (req, res) => {
  res.send('Hello Express!');
});

app.get('/about', (req, res) => {
    res.send('About Us Page');
});

app.get('/products/:id', (req, res) => {
    const { id } = req.params;
    res.send("Product ID: " + id);
});
app.get('/search', (req, res) => {
    const { keyword, page } = req.query;
    res.send(`Search: "${keyword}" - Page: ` + (page || 1));
});

// POST request
app.post( '/user', (req, res) => {
  const name = req.query.name;
  res.status( 201 ).send( `Hello ${ name }` );
});

// PUT request
app.put( '/update', (req, res) => {
  const email = req.query.email;
  res.send( `The email has been updated to ${ email }.` );
});

// DELETE request
app.delete( '/item/:id', (req, res) => {
  const id = req.params.id;
  res.send( `The item with id ${ id } has been successfully deleted.` );
});

const blogRoutes = require('./routes/blog_routes');
app.use('/blogs', blogRoutes);

const contactRoutes = require('./routes/contact_routes');
app.use('/contacts', contactRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

const express = require('express');
const router = express.Router();
const contacts = [
    { id: 1, name: 'Alice', email: 'alice@gmail.com', phone: '019-456-7890' },
    { id: 2, name: 'Bob', email: 'bobby@gmail.com', phone: '013-654-3210' },
    { id: 3, name: 'Charlie', email: 'charlie.k@gmail.com', phone: '017-123-4567' },
]

router.get('/', (req, res) => {
    res.render('contact_pages/contacts', { 
        title: 'My Contacts',
        content: 'Manage and view my contacts.',
        contacts
     } );
});
router.get('/details/:id', (req, res) => {
    const contact = contacts.find(c => c.id === parseInt(req.params.id));
    if (!contact) {
        return res.status(404).send('Contact not found');
    }
    res.render('contact_pages/contact_details', { 
        title: 'Contact Details',
        content: 'View detailed information of the contact.',
        contact
     } );
});

// Creating a function that creates a form to add a new contact.
function renderFormPage(res, error = null) {
    res.render('contact_pages/contact_form', {
        title: 'Add New Contact',
        content: 'Fill the form to add a new contact.',
        error,
        formAction: '/contacts/add'
    });
}

// Creating router to show the form to add a new contact.
router.get('/add', (req, res) => renderFormPage(res));

// Creating router to handle form submission for adding a new contact.
router.post('/add', (req, res) => {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        return renderFormPage(res, 'All fields are required.');
    }
    const newContact = {
        id: contacts.length + 1,
        name,
        email,
        phone
    };
    contacts.push(newContact);
    res.redirect('/contacts');
});

module.exports = router;
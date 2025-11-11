const express = require('express');
const router = express.Router();
const db = require('../database');

// Learning CRUD Operations for Users
// Create, Read, Update, Delete

// READ all users and show list
router.get('/', async (req, res) => { 
    try {
        const [result] = await db.query('SELECT * FROM users');
        const users = result;
        res.render('users_page/users', { 
            title: 'User Management',
            content: 'View list of all registered users.',
            users
         });
    } catch (error) {
        console.log(error);
    }
});

// Creating a function that creates a form to CREATE or UPDATE a user.
// Signature: renderFormPage(res, error = null, user = null)
// - `error` is a string shown to the user (or null)
// - `user` is an object used to pre-fill the form when updating or when validation fails
function renderFormPage(res, error = null, user = null) {
    const isUpdate = !!user;
    // Render the form page with appropriate title and content based on whether it's an update or create operation
    res.render('users_page/user_form', {
        title: isUpdate ? 'Update User' : 'Add New User',
        content: isUpdate ? 'Change user information.' : 'Fill the form below to add a new user.',
        error,
        user,
        formAction: isUpdate ? '/users/update/' + user.id + '?_method=PUT' : '/users/add'
    });
}

// Show form to CREATE a new user
router.get('/add', (req, res) => renderFormPage(res));

// Handle form submission to CREATE a new user
router.post('/add', async (req, res) => {
    const {name, email, phone } = req.body;
    if (!validateFormInput(name, email, phone, res)) return;
    try {
        await db.query('INSERT INTO users (name, email, phone) VALUES (?, ?, ?)', [name, email, phone]);
        res.redirect('/users');
    } catch (error) {
        console.error(error);
        renderFormPage(res, 'Error adding user. Please try again.', { name, email, phone } );
    }
});

// READ user details for updating and show form
router.get('/update/:id', async (req, res) => {
    
        try {
            const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
            if (rows.length < 1) {
                return res.status(404).send('User not found.');
            }
            const user = rows[0];
            renderFormPage(res, null, user);
        } catch (error) {
            console.error(error);
        }
});

// UPDATE user details and handle form submission
router.put('/update/:id', async (req, res) => {
    const { name, email, phone } = req.body;    
    // If validation fails, it will render the form and we should stop further processing.
    // Check validation first, don't proceed if validation fails
    if (!validateFormInput(name, email, phone, res, req.params.id)) {
        return; // Validation failed, response already sent
    }
    try {
        const [result] = await db.query('UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?', [name, email, phone, req.params.id]);
        if (result.affectedRows == 0) return res.status(404).send('User not found.');
        res.redirect('/users');
    } catch (error) {
        console.error(error);
        renderFormPage(res, 'Error updating user. Please contact admin.', { name, email, phone, id: req.params.id } );
    }
});

// Function to validate form input for both CREATE and UPDATE operations
// Signature: validateFormInput(name, email, phone, res, userID = null)
// - `userID` is optional and used when updating to retain the user ID in the form
function validateFormInput(name, email, phone, res, userID = null) {
    if (!name || name.trim() === '') {
        renderFormPage(res, 'Name is required.', { name, email, phone, id: userID });
        return false;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        renderFormPage(res, 'Valid email is required.', { name, email, phone, id: userID });
        return false;
    }
    if (!phone || !/^\d+$/.test(phone)) {
        renderFormPage(res, 'Phone number is required and must contain only digits.', { name, email, phone, id: userID });
        return false;
    }
    return true;
}

// READ a selected user's details and show selected user
router.get('/details/:id', async (req, res) => {
    try {
        const [result] = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
        const user = result[0];
        if (!user) {
            return res.status(404).send('User not found.');
        }
        res.render('users_page/user_details', {
            title: 'User Details',
            content: 'View detailed information of the selected user.',
            user
        })
    } catch (error) {
        console.error(error);
    }
});

// DELETE a user
router.delete('/delete/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).send('User not found.');
        }
        res.redirect('/users');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting user. Please try again.');
    }
});

module.exports = router;
const express = require('express');
const debug = require('debug')('app:storeRoutes');
const saveStoreValdation = require('../src/views/validations/add-store.valitation');
const { body, validationResult } = require('express-validator');

const storeController = require('../src/controller/store.controller.js');

const storeRoute = express.Router();

module.exports = function(appRoutes) {
    let addStoreForm = {
        fields: {
            name: '',
            category: '',
            photo_url: '',
            description: '',
            address: '',
            name: '',
            lat: '',
            long: ''
        },
        errors: null
    };
    const routes = [
        { link: '/add-store', title: 'Add Store' },
        { link: '/list-store', title: 'List Store' }
    ];

    storeRoute.get('/', (req, res) => {
        return res.render(
            'pages/home',
            {
            routes,
            title: 'Store Locator - Home'
            }
        );
    });

    storeRoute.get('/add-store', (req, res) => {
        addStoreForm = {
            fields: {
                name: '',
                category: '',
                photo_url: '',
                description: '',
                address: '',
                name: '',
                lat: '',
                long: ''
            },
            errors: null
        };
        return res.render(
            'pages/add-store',
            {
            routes,
            addStoreForm,
            title: 'Add Store',
            }
        );
    });

    
    storeRoute.post('/save-store', saveStoreValdation, (req, res) => {
        
        const errors = validationResult(req);
        // var errors = req.validationErrors();
    
        debug(`Errors ${JSON.stringify(errors)}  ${JSON.stringify(errors.isEmpty())}`);
        // if(errors) {
        if(!errors.isEmpty()) {
            addStoreForm.fields.name = req.body.name;
            addStoreForm.fields.category = req.body.category;
            addStoreForm.fields.photo_url = req.body.photo_url;
            addStoreForm.fields.description = req.body.description;
            addStoreForm.fields.address = req.body.address;
            addStoreForm.fields.lat = req.body.lat;
            addStoreForm.fields.long = req.body.long;
            
            addStoreForm.errors = errors.errors;

            return res.render('pages/add-store', {
                routes,
                addStoreForm,
                title: 'Add Store'
            });
            // return res.status(400).json({ errors: errors.mapped() });
        }

        return storeController.create(req, res);
    });

    storeRoute.get('/list-store', (req, res) => {
        return storeController.getAll(req, res);
    });

    storeRoute.get('/list-store-ajax', (req, res) => {
        return storeController.getAllAjax(req, res);
    });

    storeRoute.get('/detail/:id', (req, res) => {
        debug(`In the detail route`);
        return storeController.getDetail(req, res);
    });

    storeRoute.get('/update/:id', (req, res) => {
        return storeController.getUpdate(req, res);
    });

    storeRoute.post('/update', (req, res) => {
        return storeController.updateStore(req, res);
    });

    storeRoute.get('/delete/:id', (req, res) => {
        return storeController.deleteStore(req, res);
    });

    return storeRoute;
}

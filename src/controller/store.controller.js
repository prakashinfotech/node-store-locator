const { mysql, connection } = require('../../config/db.js');
const queryString = require('querystring');
const debug = require('debug')('app:storeController');

class StoreController {
    
    create(req, res) {
        
        const values = {
            name: req.body.name,
            category: req.body.category,
            photo_url: req.body.photo_url,
            description: req.body.description,
            address: req.body.address,
            latitude: req.body.lat,
            longitue: req.body.long,
            status: 1,
            created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        };
        debug(`Going to insert...`);

        connection.query('INSERT INTO stores SET ?', values, function (error, results, fields) {
            debug(`Inside function`);
            if (error) throw error;
            
            debug(`After error`);
            var lastInsertedId = results.insertId;
            debug(`results insertedId: ${results.insertId}`);
            debug(`id1: ${lastInsertedId}`);
            
            if (lastInsertedId > 0) {
                res.redirect(`/store/list-store`);
            } else {
                res.redirect(`/store/add-store`);
            }
        });
        debug(`Outside of Query`);
    }

    getAll(req, res) {
        const values = {
            OFFSET: (req.query.start) ? parseInt(req.query.start) : 0,
            LIMIT: (req.query.length) ? parseInt(req.query.length) : 10,
        };

        connection.query('SELECT * FROM stores LIMIT ?, ?', [values.OFFSET, values.LIMIT],  function (error, results, fields) {
            if(error) throw error;

            const storeList = results;
            return res.render(
                'pages/list-store',
                {
                    storeList,
                    title: 'List Store'
                }
            );
        });
    }

    getAllAjax(req, res) {
        const values = {
            OFFSET: (req.query.start) ? parseInt(req.query.start) : 0,
            LIMIT: (req.query.length) ? parseInt(req.query.length) : 10,
        };

        var search = (req.query.search.value) ? req.query.search.value : null;

        let storeList = [];
        
        let query = '';
        if(search) {
            query = `SELECT ID AS DT_RowId, name, category, photo_url, address FROM stores 
                WHERE ( 
                    name LIKE '%${search}%'  OR
                    category LIKE '%${search}%'  OR
                    photo_url LIKE '%${search}%'  OR
                    address LIKE '%${search}%'  OR
                    description LIKE '%${search}%'
                )
            `;
        } else {
            query = 'SELECT ID AS DT_RowId, name, category, photo_url, address FROM `stores` LIMIT ?, ?';
        }

        connection.query(query, [values.OFFSET, values.LIMIT],  function (error, result1, fields) {
            if(error) throw error;

            connection.query('SELECT COUNT(*) AS totalRec FROM `stores`', function (error, result2, fields) {

                var i = 1;
                Object.keys(result1).forEach( key => {
                    result1[key]['recNo'] = i;
                    result1[key]['actions'] = `<a class="btn" href="/store/detail/${result1[key].DT_RowId}"><i class="fas fa-eye"></i></a>
                    <a class="btn" href="/store/update/${result1[key].DT_RowId}"><i class="fas fa-edit"></i></a>
                     <button type="button" class="btn" onclick='deleteAction(${result1[key].DT_RowId})'><i class="fas fa-trash"></i></button>`;

                    i++;
                });
                
                storeList = {
                    "recordsTotal": result2[0].totalRec,
                    "recordsFiltered": (search) ? result1.length : result2[0].totalRec,
                    "data" : result1
                };

                return res.send(storeList);
            });
        });
    }

    fetchAllRecords(res) {
        const query = connection.query('SELECT * FROM stores LIMIT ?, ?', [0, 10]);
        const list = query
            .on('error', function(err) {
                throw err;
            })
            .on('result', function(data) {
                return res.send(data);
            });

        return list;
    }

    getUpdate(req, res) {
        const storeId = req.params.id;
        const currentStore = this.getSingleStore(storeId);

        const qry = connection.query('SELECT * FROM stores WHERE ?', { ID: storeId }, function(error, results, fields) {
            return res.render(
                'pages/store-update',
                {
                    store: results,
                    title: 'Store Detail'
                }
            );
        });
    }

    updateStore(req, res) {
        const values = {
            ID: req.body.id,
            name: req.body.name,
            category: req.body.category,
            photo_url: req.body.photo_url,
            description: req.body.description,
            address: req.body.address,
            lat: req.body.lat,
            long: req.body.long,
            updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        };
        const comp = this;
        connection.query('UPDATE stores SET name = ?, category = ?, photo_url = ?, description = ?, address = ?, latitude = ?, longitue = ?, updated_at = ? WHERE ID = ?', 
            [
                values.name,
                values.category,
                values.photo_url,
                values.description,
                values.address,
                values.lat,
                values.long,
                new Date().toISOString().slice(0, 19).replace('T', ' '),
                values.ID
            ],
            function (error, results, fields) {
                if (error) throw error;
                
                if (results.affectedRows > 0) {
                    res.redirect(`/store/list-store`);
                } else {
                    res.redirect(`/store/update/${values.ID}`);
                }
            }
        );
    }

    deleteStore(req, res) {
        const storeId = req.params.id;

        connection.query('DELETE FROM stores WHERE ?', { ID: storeId }, function(error, results, fields) {
            if (error) throw error;

            res.redirect('/store/list-store');
        });
    }

    getDetail(req, res) {
        const storeId = req.params.id;
        
        const currentStore = this.getSingleStore(storeId);

        const qry = connection.query('SELECT * FROM stores WHERE ?', { ID: storeId }, function(error, results, fields) {
            return res.render(
                'pages/store-detail',
                {
                    currentStore: results,
                    title: 'Store Detail'
                }
            );
        });       
    }

    
    getSingleStore(storeId) {
        const cls = this;
        var res;
        const qry = connection.query('SELECT * FROM stores WHERE ?', { ID: storeId }, function(error, results, fields) {
            if (error) throw error;
            res = results;
            return res;
        });

        return qry;
    }
    
    customStringify(v) {
        const cache = new Set();
        return JSON.stringify(v, function (key, value) {
          if (typeof value === 'object' && value !== null) {
            if (cache.has(value)) {
              // Circular reference found
              try {
                // If this value does not reference a parent it can be deduped
               return JSON.parse(JSON.stringify(value));
              }
              catch (err) {
                // discard key if value cannot be deduped
               return;
              }
            }
            // Store value in our set
            cache.add(value);
          }
          return value;
        });
    }
      
}

module.exports = new StoreController();

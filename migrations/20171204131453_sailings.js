exports.up = function(knex, Promise) {
    return knex.schema.createTableIfNotExists('sailings', function (table) {
        table.increments('id').primary(); // adds incrementing int for id
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
        table.date('sailing_date');
        table.string('departure_terminal').notNullable();
        table.string('arrival_terminal').notNullable();
        table.time('sailing_time').notNullable();
        table.time('actual_departure');
        table.string('eta');
        table.string('status');
        table.string('vessel');
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('sailings') // drop table when reverting
};

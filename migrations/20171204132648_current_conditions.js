exports.up = function(knex, Promise) {
    return knex.schema.createTableIfNotExists('current_conditions', function (table) {
        table.increments('id').primary(); // adds incrementing int for id
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.string('departure_terminal');
        table.string('arrival_terminal');
        table.time('sailing_time')
        table.string('percent_full');
        table.integer('car_waits');
        table.integer('oversize_waits');
        table.time('next_sailing_time');
        table.string('next_percent_full')
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('current_conditions') // drop table when reverting
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable("user", (table) => {
        table.increments('id').primary();
        table.string('username').notNullable();
        table.string('password').notNullable();
        table.string('email').unique().notNullable();
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('clothes', (table) => {
        table.increments('id').primary();
        table.string('title').notNullable();
        table
            .integer('user_id')
            .unsigned()
            .references('id')
            .inTable('user')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
        table.integer('wears').defaultTo(0);
        table.float('cost');
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('clothes').dropTable('user');
};

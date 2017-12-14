exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('sailings').del()
    .then(function () {
      // Inserts seed entries
      return knex('sailings').insert([
        {
          sailing_date: '2017-12-05',
          departure_terminal: 'Tsawwassen',
          arrival_terminal: 'Swartz Bay',
          sailing_time: '7:00 am',
          vessel: 'Coastal Celebration',
        }, {
          sailing_date: '2017-12-05',
          departure_terminal: 'Tsawwassen',
          arrival_terminal: 'Swartz Bay',
          sailing_time: '9:00 am',
          vessel: 'Coastal Inspiration',
        }, {
          sailing_date: '2017-12-05',
          departure_terminal: 'Tsawwassen',
          arrival_terminal: 'Swartz Bay',
          sailing_time: '10:00 am',
          vessel: 'Queen of New Westminster',
        }, {
          sailing_date: '2017-12-05',
          departure_terminal: 'Tsawwassen',
          arrival_terminal: 'Swartz Bay',
          sailing_time: '11:00 am',
          vessel: 'Coastal Celebration',
        }, {
          sailing_date: '2017-12-05',
          departure_terminal: 'Tsawwassen',
          arrival_terminal: 'Swartz Bay',
          sailing_time: '1:00 pm',
          vessel: 'Coastal Inspiration',
        }
      ]);
    });
};
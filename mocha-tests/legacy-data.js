module.exports = {
  ChTr: {
    key: 'ChTr',
    item: 'senior,stage'
  },

  ChTrItem: {
    key: 'ChTr-senior',
    item: '{"id":"senior","name":"Senior","subtree":[{"id":"8a3172be-8a87-2d91-0bdd-c6275bb304c0","name":"sen","subtree":[{"id":"184c0954-26a2-6261-2178-e98ff17e4820","name":"lalalala"}]}]}'
  },

  // ChTr-stage
  // {"id":"stage","name":"Stage","subtree":[{"id":"11455dd8-491c-96f6-fd8d-8c9c349c62f1","name":"hello"},{"id":"1091fc17-ab33-c5ca-331e-c05445281cc1","name":"1","subtree":[{"id":"36b21e0b-f41b-23e4-dec0-191f081922bc","name":"11","subtree":[]},{"id":"c084c983-970c-c01e-024a-749fc4dd928d","name":"12","subtree":[{"id":"05afdde0-a7a3-c99b-9935-411280e50c7d","name":"a"},{"id":"545325e7-fd1a-c1f9-0965-757140d021d3","name":"b"},{"id":"745ac6fe-b80b-3cef-f1e8-ddfbc5cd8375","name":"c"}]},{"id":"31d1fa38-5271-22e4-c39d-e5e62b040053","name":"13"}]}]}

  Procs: {
    key: 'Procs',
    item: '4825a7f7-d04c-1cc8-506f-c265d367c549,30b241d9-3294-1e9d-f193-8385a9e34afb'
  },

  ProcsItem: {
    key: 'Procs-30b241d9-3294-1e9d-f193-8385a9e34afb',
    item: '{"id":"30b241d9-3294-1e9d-f193-8385a9e34afb","type":"Discectomie simple","date":"19-10-2015 19:52","patient":"deep tree","diagnostic":"","supervision":"Aidé","senior":"","stage":"c","comment":""}',
    converted: {
      id: '30b241d9-3294-1e9d-f193-8385a9e34afb',
      createdAt: 1445266320000,
      type: 'Discectomie simple',
      date: '19-10-2015 19:52',
      patient: 'deep tree',
      photos: [],
      "requiredFields": [
        {
          "name": "date",
          "description": "Date Performed",
          "type": "date"
        },
        {
          "name": "type",
          "description": "Type of Procedure",
          "type": "choicetree"
        },
        {
          "name": "patient",
          "description": "Patient's Full Name",
          "type": "text"
        },
        {
          "name": "photos",
          "description": "Photos",
          "type": "photos"
        }
      ],
      diagnostic: '',
      supervision: 'Aidé',
      senior: '',
      stage: 'c',
      comment: '',
      fields: [
        {
          "description": "Diagnostic",
          "name": "diagnostic",
          "type": "text"
        },
        {
          "description": "Supervision",
          "name": "supervision",
          "type": "text"
        },
        {
          "description": "Senior",
          "name": "senior",
          "type": "choicetree"
        },
        {
          "description": "Stage",
          "name": "stage",
          "type": "choicetree"
        },
        {
          "description": "Comment",
          "name": "comment",
          "type": "textarea"
        }
      ]
    }
  }

  // Procs-4825a7f7-d04c-1cc8-506f-c265d367c549
  // {"id":"4825a7f7-d04c-1cc8-506f-c265d367c549","type":"Arthrodèse antérieure","date":"12-10-2015 19:45","patient":"1","diagnostic":"diag","supervision":"Aidé","senior":"lalalala","stage":"hello","comment":"comment"}
};

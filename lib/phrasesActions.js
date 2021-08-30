module.exports = [
  {
    name: "Banknote error",
    phrases: [ // enter in every combination that results in a positive
      'This application does not support the printing of banknote images.',
      'The appicatn does ot support the prtin of baknate ages',
      'rulesforuse.org'
    ],
    actions: ['escape']
  },
  {
    name: "Wrong type of document",
    phrases: [ // enter in every combination that results in a positive
      'the right kind of document'
    ],
    actions: ['enter']
  },
  {
    name: "Damaged document",
    phrases: [ // enter in every combination that results in a positive
      'appears to be damaged'
    ],
    actions: ['enter']
  },
  {
    name: "Could not open",
    phrases: [ // enter in every combination that results in a positive
      'Could not open'
    ],
    actions: ['enter']
  },
  {
    name: "Could not complete the",
    phrases: [ // enter in every combination that results in a positive
      'Could not complete'
    ],
    actions: ['enter']
  }
]
var process = {};

process.steps = m.prop({
  5: { // user makes request.
    pending: "requesting",
    completed: "requested",
    label: "request"
  }, 
  10: { // assign to appropriate validating agency.
    pending: "sorting",
    completed: "sorted",
    label: "sort"
  }, 
  20: { // validating agency checks to see if request is valid. i.e. did shit really happen?
    pending: "confirming",
    completed: "confirmed",
    label: "confirmation"
  }, 
  30: { // go see what should be done (maybe should be merged with validating/confirmation)
    pending: "assessing",
    completed: "assessed",
    label: "assessment"
  },
  40: { // this is what should be done
    pending: "recommending",
    completed: "recommended",
    label: "recommendation"
  },
  50: {  // okay, do it.
    pending: "approving",
    completed: "approved",
    label: "approval"
  },
  60: { // here's the money you're allowed to spend to do it.
    pending: "allocating",
    completed: "allocated",
    label: "allocation"
  }
});

process.permissions = m.prop({
  "LGU": [5],
  "GOCC": [5],
  "NGA": [5], // clarify with stella
  "OCD": [10, 40],
  "DPWH": [20, 30],
  "DBM": [10, 40, 60],
  "OP": [50]
});
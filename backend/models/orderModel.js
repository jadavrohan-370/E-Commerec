import { readDb, writeDb } from "../config/jsonDb.js";

class OrderQuery {
  constructor(orders) {
    this.ordersArray = orders;
  }

  sort(options) {
      const key = Object.keys(options)[0];
      const order = options[key];
      this.ordersArray.sort((a, b) => {
          if (order === -1 || order === 'desc') return a[key] < b[key] ? 1 : -1;
          return a[key] > b[key] ? 1 : -1;
      });
      return this;
  }

  populate(path, fields) {
      // Very basic mock for populate
      const db = readDb();
      this.ordersArray = this.ordersArray.map(ord => {
          if (path === 'user') {
              const user = db.users.find(u => u._id === ord.user);
              if (user) {
                  const selectedUser = {};
                  if (fields) {
                      fields.split(' ').forEach(f => selectedUser[f] = user[f]);
                  } else {
                      Object.assign(selectedUser, user);
                  }
                  return { ...ord, user: selectedUser };
              }
          }
          return ord;
      });
      return this;
  }

  then(onSuccess, onError) {
      return Promise.resolve(this.ordersArray).then(onSuccess, onError);
  }

  async exec() {
      return this.ordersArray;
  }
}

const Order = {
  find: (query = {}) => {
    let orders = readDb().orders || [];
    if (Object.keys(query).length > 0) {
      orders = orders.filter(order => {
        return Object.entries(query).every(([key, value]) => order[key] === value);
      });
    }
    return new OrderQuery(orders);
  },

  findById: (id) => {
    const orders = readDb().orders || [];
    const order = orders.find(ord => ord._id === id);
    return {
        populate: function(path, fields) {
           const q = new OrderQuery([order]);
           q.populate(path, fields);
           return {
               then: function(onSuccess) { return Promise.resolve(q.ordersArray[0]).then(onSuccess); },
               exec: function() { return q.ordersArray[0]; }
           };
        },
        then: function(onSuccess) { return Promise.resolve(order).then(onSuccess); },
        exec: function() { return order; }
    };
  },

  create: async (orderData) => {
    const db = readDb();
    const newOrder = {
      ...orderData,
      _id: `ordr${Date.now()}`.padStart(24, '0'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPaid: false,
      isDelivered: false,
      orderStatus: "Processing"
    };
    if (!db.orders) db.orders = [];
    db.orders.push(newOrder);
    writeDb(db);
    return {
        ...newOrder,
        save: async function() {
            const currentDb = readDb();
            const index = currentDb.orders.findIndex(o => o._id === this._id);
            if (index !== -1) {
                currentDb.orders[index] = { ...this };
                writeDb(currentDb);
            }
            return this;
        }
    };
  },

  deleteMany: async () => {
    const db = readDb();
    db.orders = [];
    writeDb(db);
    return { acknowledged: true, deletedCount: 0 };
  },

  deleteOne: async (query) => {
      const db = readDb();
      const index = db.orders.findIndex(ord => {
          return Object.entries(query).every(([key, value]) => ord[key] === value);
      });
      if (index !== -1) {
          db.orders.splice(index, 1);
          writeDb(db);
          return { deletedCount: 1 };
      }
      return { deletedCount: 0 };
  }
};

export default Order;

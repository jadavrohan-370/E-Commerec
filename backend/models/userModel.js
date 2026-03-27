import bcrypt from "bcryptjs";
import { readDb, writeDb } from "../config/jsonDb.js";

class UserQuery {
  constructor(users) {
    this.usersArray = users;
    // Making it a real Promise-like thenable
    this.then = (onSuccess, onError) => {
        const result = this.usersArray.length === 1 ? this.usersArray[0] : (this.usersArray.length === 0 ? null : this.usersArray);
        return Promise.resolve(result).then(onSuccess, onError);
    };
  }

  select(fields) {
      if (typeof fields === 'string') {
          const fieldList = fields.split(' ');
          this.usersArray = this.usersArray.map(user => {
              if (!user) return user;
              const selected = { ...user };
              fieldList.forEach(f => {
                  if (f.startsWith('-')) delete selected[f.substring(1)];
                  else {
                      // Positive selection logic is more complex, usually we just handle negative for passwords
                  }
              });
              return selected;
          });
      }
      return this;
  }

  async exec() {
      return this.usersArray.length === 1 ? this.usersArray[0] : (this.usersArray.length === 0 ? null : this.usersArray);
  }
}

const decorateUser = (user) => {
    if (!user) return user;
    user.matchPassword = async function (enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password);
    };
    user.save = async function() {
        const db = readDb();
        const index = db.users.findIndex(u => u._id === this._id);
        if (index !== -1) {
            // Re-hash if password was modified
            if (this.password && (!this.password.startsWith('$2a$') && !this.password.startsWith('$2b$'))) {
                 const salt = await bcrypt.genSalt(10);
                 this.password = await bcrypt.hash(this.password, salt);
            }
            db.users[index] = { ...this };
            writeDb(db);
            return this;
        }
        return this;
    };
    user.isModified = (field) => true; 
    return user;
};

const User = {
  find: (query = {}) => {
    let users = readDb().users || [];
    if (Object.keys(query).length > 0) {
      users = users.filter(user => {
        return Object.entries(query).every(([key, value]) => user[key] === value);
      });
    }
    return new UserQuery(users.map(decorateUser));
  },

  findOne: async (query) => {
    const users = readDb().users || [];
    const user = users.find(user => {
      return Object.entries(query).every(([key, value]) => user[key] === value);
    });
    return decorateUser(user);
  },

  findById: (id) => {
      const users = readDb().users || [];
      const user = users.find(u => u._id === id);
      const decUser = decorateUser(user);
      
      const queryObj = {
          user: decUser,
          select: function(fields) {
              const q = new UserQuery([this.user]);
              q.select(fields);
              // Make this also thenable
              const resultObj = {
                  res: q.usersArray[0],
                  then: function(onSuccess, onError) { return Promise.resolve(this.res).then(onSuccess, onError); },
                  exec: function() { return this.res; }
              };
              return resultObj;
          },
          then: function(onSuccess, onError) { return Promise.resolve(this.user).then(onSuccess, onError); },
          exec: function() { return this.user; }
      };
      return queryObj;
  },

  create: async (userData) => {
    const db = readDb();
    const newUser = {
      ...userData,
      _id: `user${Date.now()}`.padStart(24, '0'),
      addresses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: userData.role || "user"
    };

    // Hash password if not hashed
    if (newUser.password && (!newUser.password.startsWith('$2a$') && !newUser.password.startsWith('$2b$'))) {
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(newUser.password, salt);
    }
    
    if (!db.users) db.users = [];
    db.users.push(newUser);
    writeDb(db);
    return decorateUser(newUser);
  },
  
  deleteOne: async (query) => {
      const db = readDb();
      const index = db.users.findIndex(user => {
          return Object.entries(query).every(([key, value]) => user[key] === value);
      });
      if (index !== -1) {
          db.users.splice(index, 1);
          writeDb(db);
          return { deletedCount: 1 };
      }
      return { deletedCount: 0 };
  },

  deleteMany: async() => {
      const db = readDb();
      db.users = [];
      writeDb(db);
      return { deletedCount: 0 };
  },

  insertMany: async(usersData) => {
      const db = readDb();
      const newUsers = usersData.map((u, index) => ({
          ...u,
          _id: `user${Date.now() + index}`.padStart(24, '0'),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
      }));
      db.users.push(...newUsers);
      writeDb(db);
      return newUsers;
  }
};

export default User;

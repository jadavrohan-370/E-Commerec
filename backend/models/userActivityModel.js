import { readDb, writeDb } from "../config/jsonDb.js";

const UserActivity = {
  find: async (query = {}) => {
    let activities = readDb().userActivities || [];
    if (Object.keys(query).length > 0) {
        activities = activities.filter(act => {
        return Object.entries(query).every(([key, value]) => act[key] === value);
      });
    }
    return activities;
  },

  findOne: async (query) => {
    const activities = readDb().userActivities || [];
    return activities.find(act => {
      return Object.entries(query).every(([key, value]) => act[key] === value);
    }) || null;
  },

  findOneAndUpdate: async (query, update, options = {}) => {
      const db = readDb();
      if (!db.userActivities) db.userActivities = [];
      let activity = db.userActivities.find(act => {
          return Object.entries(query).every(([key, value]) => act[key] === value);
      });

      if (!activity && options.upsert) {
          activity = { 
              ...query, 
              viewedProducts: [], 
              searchedCategories: [], 
              _id: `actv${Date.now()}`.padStart(24, '0'),
              createdAt: new Date().toISOString() 
          };
          db.userActivities.push(activity);
      }

      if (activity) {
          if (update.$addToSet) {
              for (let key in update.$addToSet) {
                  const val = update.$addToSet[key];
                  if (!activity[key]) activity[key] = [];
                  if (!activity[key].includes(val)) activity[key].push(val);
              }
          }
          writeDb(db);
      }
      return activity;
  },

  create: async (activityData) => {
    const db = readDb();
    if (!db.userActivities) db.userActivities = [];
    const newActivity = {
      ...activityData,
      _id: `actv${Date.now()}`.padStart(24, '0'),
      createdAt: new Date().toISOString(),
    };
    db.userActivities.push(newActivity);
    writeDb(db);
    return newActivity;
  },

  deleteMany: async () => {
    const db = readDb();
    db.userActivities = [];
    writeDb(db);
    return { acknowledged: true, deletedCount: 0 };
  }
};

export default UserActivity;
